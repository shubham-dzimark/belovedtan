// Copies everything from your local site to the hosted one (Turso database + Vercel Blob storage):
// users, pages, header/footer, global widgets and every uploaded image/video.
//
//   $env:TARGET_DATABASE_URL = "libsql://your-db.turso.io"
//   $env:TARGET_DATABASE_AUTH_TOKEN = "..."
//   $env:BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_..."   # only needed if data/uploads has files
//   npm run deploy:data             # refuses if the target already has content
//   npm run deploy:data -- --replace   # wipes the target's content first, then copies
//
// Your local database and files are only read, never changed.
import { createClient, type InValue } from "@libsql/client";
import { put } from "@vercel/blob";
import { execSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

try {
  process.loadEnvFile(".env");
} catch {
  // .env is optional.
}

// Copy order respects references (nothing here uses foreign keys, but keep users first).
const TABLES = ["users", "pages", "site_parts", "global_blocks"] as const;
const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
  mp4: "video/mp4",
  webm: "video/webm",
};

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Set ${name} first (see the comment at the top of scripts/deploy-data.ts).`);
  return value;
}

async function main() {
  const replace = process.argv.includes("--replace");
  const localUrl = process.env.DATABASE_URL ?? "file:./data/belovedtan.db";
  const targetUrl = required("TARGET_DATABASE_URL");
  const targetToken = required("TARGET_DATABASE_AUTH_TOKEN");
  if (path.resolve(targetUrl.replace(/^file:/, "")) === path.resolve(localUrl.replace(/^file:/, ""))) {
    throw new Error("TARGET_DATABASE_URL must be your hosted (libsql://…) database, not the local one.");
  }

  const local = createClient({ url: localUrl, authToken: process.env.DATABASE_AUTH_TOKEN || undefined });
  const target = createClient({ url: targetUrl, authToken: targetToken });

  // 1. Create/update the tables on the target from src/db/schema.ts.
  console.log("1/4 Creating tables on the hosted database…");
  execSync("npx drizzle-kit push --force", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: targetUrl, DATABASE_AUTH_TOKEN: targetToken },
  });

  // 2. Don't overwrite existing hosted content by accident.
  let existing = 0;
  for (const table of TABLES) {
    existing += Number((await target.execute(`select count(*) as n from ${table}`)).rows[0].n);
  }
  if (existing > 0 && !replace) {
    throw new Error(
      `The hosted database already has ${existing} row(s). Re-run with --replace to overwrite it with your local data.`,
    );
  }

  // 3. Upload local files to Vercel Blob and remember their new URLs.
  const uploadsDir = path.join(process.cwd(), "data", "uploads");
  const files = existsSync(uploadsDir)
    ? readdirSync(uploadsDir).filter((name) => CONTENT_TYPES[name.split(".").pop() ?? ""])
    : [];
  const urlMap = new Map<string, string>();
  console.log(`2/4 Uploading ${files.length} file(s) to Vercel Blob…`);
  if (files.length > 0) {
    const token = required("BLOB_READ_WRITE_TOKEN");
    for (const name of files) {
      const blob = await put(`uploads/${name}`, readFileSync(path.join(uploadsDir, name)), {
        access: "public",
        contentType: CONTENT_TYPES[name.split(".").pop()!],
        addRandomSuffix: false,
        allowOverwrite: true,
        token,
      });
      urlMap.set(`/uploads/${name}`, blob.url);
      console.log(`    ${name} -> ${blob.url}`);
    }
  }

  // Point stored image/video links at their new Blob URLs.
  const rewrite = (value: unknown): InValue => {
    if (typeof value !== "string" || urlMap.size === 0) return value as InValue;
    let out = value;
    for (const [from, to] of urlMap) out = out.split(from).join(to);
    return out;
  };

  // 4. Copy every row, in one transaction so a failure leaves the target unchanged.
  console.log("3/4 Copying content…");
  const statements: { sql: string; args: InValue[] }[] = [];
  if (replace) for (const table of [...TABLES].reverse()) statements.push({ sql: `delete from ${table}`, args: [] });
  const counts: string[] = [];
  for (const table of TABLES) {
    const result = await local.execute(`select * from ${table}`);
    for (const row of result.rows) {
      const columns = result.columns;
      statements.push({
        sql: `insert into ${table} (${columns.map((c) => `"${c}"`).join(", ")}) values (${columns.map(() => "?").join(", ")})`,
        args: columns.map((c) => rewrite(row[c])),
      });
    }
    counts.push(`${table}: ${result.rows.length}`);
  }
  await target.batch(statements, "write");

  console.log("4/4 Done. Copied", counts.join(", "));
  if (urlMap.size > 0) console.log(`    ${urlMap.size} file link(s) now point to Vercel Blob.`);
}

main().catch((error) => {
  console.error("\n" + (error instanceof Error ? error.message : String(error)));
  process.exit(1);
});
