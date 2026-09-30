import type { Metadata } from "next";
import { requireUser } from "@/lib/dal";
import { globalBlockUsage, listGlobalBlocks } from "@/lib/global-blocks";
import { SITE_PARTS } from "@/lib/site-parts";
import config from "@/puck/config";
import { GlobalWidgets, type WidgetRow } from "./global-widgets";

export const metadata: Metadata = { title: "Global widgets" };

const dateFormat = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" });

export default async function GlobalWidgetsPage() {
  await requireUser();
  const blocks = await listGlobalBlocks();

  const rows: WidgetRow[] = await Promise.all(
    blocks.map(async (block) => {
      const usage = await globalBlockUsage(block.id);
      const components = config.components as Record<string, { label?: string }>;
      return {
        id: block.id,
        name: block.name,
        typeLabel: components[block.type]?.label ?? block.type,
        usedIn: [...usage.pages.map((p) => p.title), ...usage.parts.map((k) => `Site ${SITE_PARTS[k].label.toLowerCase()}`)],
        updated: dateFormat.format(block.updatedAt),
        hasChanges: block.publishedProps !== block.draftProps,
      };
    }),
  );

  return <GlobalWidgets widgets={rows} />;
}
