import "server-only";
import { asc, eq, like, or } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/db";
import { globalBlocks, pages, siteParts, type GlobalBlock } from "@/db/schema";
import config from "@/puck/config";
import { globalType, withGlobalBlocks, type GlobalBlockInfo } from "@/puck/global-blocks";

export const listGlobalBlocks = cache(async () =>
  db.select().from(globalBlocks).orderBy(asc(globalBlocks.name)),
);

export const getGlobalBlock = cache(async (id: number) => {
  if (!Number.isInteger(id)) return null;
  const [row] = await db.select().from(globalBlocks).where(eq(globalBlocks.id, id));
  return row ?? null;
});

/** Published settings, which is what pages (live site, previews and the page editor) render. */
export function toPublishedInfo(row: GlobalBlock): GlobalBlockInfo {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    props: JSON.parse(row.publishedProps ?? row.draftProps) as Record<string, unknown>,
  };
}

export const getPublishedGlobalBlocks = cache(async () => (await listGlobalBlocks()).map(toPublishedInfo));

/** The Puck config for rendering pages, including every global widget. */
export const getSiteConfig = cache(async () =>
  withGlobalBlocks(config as never, await getPublishedGlobalBlocks(), { listInDrawer: false }),
);

/** How many pages (plus the header/footer) use each global widget, in their draft or live version. */
export async function globalBlockUsage(id: number) {
  const needle = `%"type":"${globalType(id)}"%`;
  const [pageRows, partRows] = await Promise.all([
    db
      .select({ id: pages.id, title: pages.title })
      .from(pages)
      .where(or(like(pages.draftData, needle), like(pages.publishedData, needle))),
    db
      .select({ key: siteParts.key })
      .from(siteParts)
      .where(or(like(siteParts.draftData, needle), like(siteParts.publishedData, needle))),
  ]);
  return { pages: pageRows, parts: partRows.map((p) => p.key) };
}
