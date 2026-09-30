import "server-only";
import { eq } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/db";
import { siteParts, type SitePartKey } from "@/db/schema";
import config, { type PageData } from "@/puck/config";

export const SITE_PARTS = {
  header: { label: "Header", component: "SiteHeader" },
  footer: { label: "Footer", component: "SiteFooter" },
} as const satisfies Record<SitePartKey, { label: string; component: keyof typeof config.components }>;

export const SITE_PART_KEYS = Object.keys(SITE_PARTS) as SitePartKey[];

export const getSitePart = cache(async (key: SitePartKey) => {
  const [row] = await db.select().from(siteParts).where(eq(siteParts.key, key));
  return row ?? null;
});

/** Starting content for a header/footer that has never been saved: its block with default settings. */
export function defaultSitePartData(key: SitePartKey): PageData {
  const type = SITE_PARTS[key].component;
  return {
    root: { props: structuredClone(config.root!.defaultProps!) },
    content: [
      {
        type,
        props: { ...structuredClone(config.components[type].defaultProps), id: `${type}-${crypto.randomUUID()}` },
      },
    ] as PageData["content"],
  };
}

/** Published header/footer for the live site (null when never published). */
export async function getPublishedSiteParts() {
  const [header, footer] = await Promise.all(SITE_PART_KEYS.map(getSitePart));
  const parse = (json: string | null | undefined) => (json ? (JSON.parse(json) as PageData) : null);
  return { header: parse(header?.publishedData), footer: parse(footer?.publishedData) };
}
