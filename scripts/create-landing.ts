// Creates a published page from a template.
//   npm run db:landing                                   -> /landing from the landing template
//   npm run db:landing -- service massage-therapy "Massage Therapy"
// Puck's package imports CSS, so this runs through a loader that stubs .css imports (see package.json).
import { createClient } from "@libsql/client";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { pages } from "../src/db/schema";
import { templatePageData, type TemplateName } from "../src/puck/landing-template";

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

async function main() {
  const [template = "landing", slug = "landing", title = "Landing"] = process.argv.slice(2);
  if (template !== "landing" && template !== "service") {
    throw new Error(`Unknown template "${template}". Use "landing" or "service".`);
  }

  const [existing] = await db.select({ id: pages.id }).from(pages).where(eq(pages.slug, slug));
  if (existing) {
    console.log(`A /${slug} page already exists; leaving it unchanged.`);
    return;
  }

  const data = JSON.stringify(templatePageData(template as TemplateName));
  await db.insert(pages).values({
    title,
    slug,
    draftData: data,
    publishedData: data,
    status: "published",
    publishedAt: new Date(),
  });
  console.log(`Created and published /${slug} from the ${template} template.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
