import { desc } from "drizzle-orm";
import type { Metadata } from "next";
import { db } from "@/db";
import { pages } from "@/db/schema";
import { requireUser } from "@/lib/dal";
import { SITE_PART_KEYS, SITE_PARTS, getSitePart } from "@/lib/site-parts";
import { pagePath } from "@/lib/slug";
import { Dashboard, type DashboardPage, type DashboardPart } from "./dashboard";

export const metadata: Metadata = { title: "Pages" };

// Formatted on the server so the client renders exactly the same text (no hydration mismatch).
const dateFormat = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" });

export default async function DashboardPage() {
  await requireUser();
  const rows = await db
    .select({
      id: pages.id,
      title: pages.title,
      slug: pages.slug,
      status: pages.status,
      updatedAt: pages.updatedAt,
      draftData: pages.draftData,
      publishedData: pages.publishedData,
    })
    .from(pages)
    .orderBy(desc(pages.updatedAt));

  const pageList: DashboardPage[] = rows.map((row) => ({
    id: row.id,
    title: row.title,
    path: pagePath(row.slug),
    isHome: row.slug === "",
    status: row.status,
    hasChanges: row.status === "published" && row.publishedData !== row.draftData,
    updated: dateFormat.format(row.updatedAt),
  }));

  const parts: DashboardPart[] = await Promise.all(
    SITE_PART_KEYS.map(async (key) => {
      const row = await getSitePart(key);
      return {
        key,
        label: SITE_PARTS[key].label,
        status: !row?.publishedData ? "unpublished" : row.publishedData !== row.draftData ? "changes" : "published",
        updated: row?.updatedAt ? dateFormat.format(row.updatedAt) : null,
      };
    }),
  );

  return <Dashboard pages={pageList} parts={parts} />;
}
