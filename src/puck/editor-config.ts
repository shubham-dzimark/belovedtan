import type { Config, Permissions } from "@puckeditor/core";
import config from "./config";
import { withGlobalBlocks, type GlobalBlockInfo } from "./global-blocks";

export type EditorMode = "page" | "header" | "footer" | "block";

/**
 * The Puck config for each editor:
 * - page: every section except the header/footer, plus the saved global widgets
 * - header / footer: their one site-wide block plus the basic widgets
 * - block: a single global widget; nothing can be added and page settings are hidden
 */
export function editorConfig(mode: EditorMode, globalBlocks: GlobalBlockInfo[] = []): Config {
  if (mode === "page") return withGlobalBlocks(config as Config, globalBlocks);

  if (mode === "block") {
    return {
      ...config,
      root: { ...config.root, fields: {} },
      categories: { other: { visible: false } },
    } as Config;
  }

  // The show/hide switches only make sense on pages.
  const rootFields: Record<string, unknown> = { ...config.root!.fields! };
  delete rootFields.showHeader;
  delete rootFields.showFooter;
  return {
    ...config,
    root: { ...config.root, fields: rootFields },
    categories: {
      [mode]: {
        title: mode === "header" ? "Header" : "Footer",
        components: [mode === "header" ? "SiteHeader" : "SiteFooter"],
      },
      layout: config.categories!.layout,
      basic: config.categories!.basic,
      other: { visible: false },
    },
  } as Config;
}

/** The global-widget editor edits one section in place: no adding, removing or reordering. */
export function editorPermissions(mode: EditorMode): Partial<Permissions> | undefined {
  return mode === "block" ? { insert: false, delete: false, duplicate: false, drag: false } : undefined;
}
