// Creates the first admin user and a starter home page.
// Usage: npm run db:seed  (reads ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD from .env)
import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { pages, users } from "../src/db/schema";
import { homePageData } from "../src/puck/templates";

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
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? "Admin";

  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first.");
  }

  const [existing] = await db.select().from(users).where(eq(users.email, email));
  if (existing) {
    console.log(`Admin ${email} already exists, skipping.`);
  } else {
    await db.insert(users).values({
      name,
      email,
      passwordHash: await bcrypt.hash(password, 12),
    });
    console.log(`Created admin ${email}.`);
  }

  const [home] = await db.select().from(pages).where(eq(pages.slug, ""));
  if (!home) {
    const data = JSON.stringify(homePageData);
    await db.insert(pages).values({
      title: "Home",
      slug: "",
      draftData: data,
      publishedData: data,
      status: "published",
      publishedAt: new Date(),
    });
    console.log("Created and published the Home page.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
