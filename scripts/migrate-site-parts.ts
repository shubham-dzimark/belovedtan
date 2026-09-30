// One-time migration: move SiteHeader / SiteFooter blocks out of pages into the site-wide
// header and footer (site_parts). Safe to re-run: existing site parts are left unchanged.
import { createClient } from "@libsql/client";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { pages, siteParts } from "../src/db/schema";

try {
  process.loadEnvFile(".env");
} catch {
  // .env is optional; fall back to real environment variables.
}

const db = drizzle(
  createClient({
    url: process.env.DATABASE_URL ?? "file:./data/belovedtan.db",
    authToken: process.env.DATABASE_AUTH_TOKEN || undefined,
  }),
);

type Item = { type: string; props: Record<string, unknown> };
type PuckData = { root: { props?: Record<string, unknown> }; content: Item[] };

const PARTS = { header: "SiteHeader", footer: "SiteFooter" } as const;

async function main() {
  const rows = await db.select().from(pages);
  // Prefer the Home page's header/footer, then any other page.
  rows.sort((a, b) => (a.slug === "" ? -1 : b.slug === "" ? 1 : a.id - b.id));

  for (const [key, type] of Object.entries(PARTS) as [keyof typeof PARTS, string][]) {
    const [existing] = await db.select({ key: siteParts.key }).from(siteParts).where(eq(siteParts.key, key));
    if (existing) {
      console.log(`Site ${key} already exists; not replacing it.`);
      continue;
    }
    for (const row of rows) {
      const data = JSON.parse(row.publishedData ?? row.draftData) as PuckData;
      const block = data.content.find((item) => item.type === type);
      if (!block) continue;
      const json = JSON.stringify({ root: data.root, content: [block] });
      const now = new Date();
      await db.insert(siteParts).values({ key, draftData: json, publishedData: json, updatedAt: now, publishedAt: now });
      console.log(`Site ${key}: taken from "${row.title}" and published.`);
      break;
    }
  }

  const strip = (json: string) => {
    const data = JSON.parse(json) as PuckData;
    const before = data.content.length;
    data.content = data.content.filter((item) => item.type !== PARTS.header && item.type !== PARTS.footer);
    return { json: JSON.stringify(data), removed: before - data.content.length };
  };

  for (const row of rows) {
    const draft = strip(row.draftData);
    const published = row.publishedData ? strip(row.publishedData) : null;
    if (draft.removed === 0 && (!published || published.removed === 0)) continue;
    await db
      .update(pages)
      .set({ draftData: draft.json, publishedData: published?.json ?? null })
      .where(eq(pages.id, row.id));
    console.log(`"${row.title}": removed ${draft.removed} block(s) from draft, ${published?.removed ?? 0} from published.`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
