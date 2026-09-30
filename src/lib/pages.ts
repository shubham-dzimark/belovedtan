import "server-only";
import { eq } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/db";
import { pages } from "@/db/schema";
import type { PageData } from "@/puck/config";

export const getPageBySlug = cache(async (slug: string) => {
  const [page] = await db.select().from(pages).where(eq(pages.slug, slug));
  return page ?? null;
});

export const getPageById = cache(async (id: number) => {
  if (!Number.isInteger(id)) return null;
  const [page] = await db.select().from(pages).where(eq(pages.id, id));
  return page ?? null;
});

export function parseData(json: string): PageData {
  return JSON.parse(json) as PageData;
}
