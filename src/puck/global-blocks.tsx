import type { ComponentConfig, Config } from "@puckeditor/core";

/**
 * Global widgets: a saved section (type + settings) that pages reference by id.
 * Each one becomes its own Puck component named `Global-<id>` whose render draws the
 * underlying section with the saved settings, so editing the widget updates every page.
 */
export type GlobalBlockInfo = {
  id: number;
  name: string;
  type: string;
  props: Record<string, unknown>;
};

const PREFIX = "Global-";

export function globalType(id: number) {
  return `${PREFIX}${id}`;
}

export function globalIdFromType(type: string): number | null {
  if (!type.startsWith(PREFIX)) return null;
  const id = Number(type.slice(PREFIX.length));
  return Number.isInteger(id) ? id : null;
}

/** Sections that hold other blocks (slots) can't be saved as global widgets. */
export function canBeGlobal(config: Config, type: string) {
  const component = config.components[type] as ComponentConfig | undefined;
  if (!component || globalIdFromType(type) !== null) return false;
  if (type === "SiteHeader" || type === "SiteFooter") return false;
  return !Object.values(component.fields ?? {}).some((field) => (field as { type?: string }).type === "slot");
}

function GlobalInfo({ block }: { block: GlobalBlockInfo }) {
  return (
    <div style={{ display: "grid", gap: 10, padding: "4px 0", fontSize: 14, lineHeight: 1.5 }}>
      <strong>★ Global widget: {block.name}</strong>
      <span style={{ color: "#6b7280" }}>
        This section is shared. Changes made in its editor update every page that uses it.
      </span>
      <a
        href={`/admin/global/${block.id}`}
        target="_blank"
        rel="noreferrer"
        style={{
          justifySelf: "start",
          padding: "7px 12px",
          borderRadius: 6,
          background: "#6d28d9",
          color: "#fff",
          textDecoration: "none",
          fontWeight: 500,
        }}
      >
        Edit global widget ↗
      </a>
      <span style={{ color: "#6b7280", fontSize: 13 }}>
        To change it on this page only, use <b>Detach</b> in the section toolbar.
      </span>
    </div>
  );
}

/** Adds one Puck component per global widget, plus a "Global widgets" group in the block list. */
export function withGlobalBlocks(base: Config, blocks: GlobalBlockInfo[], { listInDrawer = true } = {}): Config {
  const components: Record<string, ComponentConfig> = { ...(base.components as Record<string, ComponentConfig>) };

  for (const block of blocks) {
    const inner = components[block.type];
    if (!inner?.render) continue;
    components[globalType(block.id)] = {
      label: `★ ${block.name}`,
      fields: {
        info: { type: "custom", label: "Global widget", render: () => <GlobalInfo block={block} /> },
      },
      render: ({ id, puck }) =>
        inner.render({
          ...(inner.defaultProps ?? {}),
          ...block.props,
          id,
          puck,
        } as Parameters<typeof inner.render>[0]),
    };
  }

  const categories = { ...(base.categories ?? {}) } as NonNullable<Config["categories"]>;
  if (listInDrawer && blocks.length > 0) {
    // Put global widgets first so they're easy to find on every new page.
    const { other, ...rest } = categories as Record<string, NonNullable<Config["categories"]>[string]>;
    return {
      ...base,
      components,
      categories: {
        global: { title: "★ Global widgets", components: blocks.map((b) => globalType(b.id)) },
        ...rest,
        ...(other ? { other } : {}),
      },
    } as Config;
  }
  return { ...base, components, categories } as Config;
}

/**
 * Replaces every placed copy of a global widget with a normal section (used when detaching
 * on delete). Walks nested data so widgets inside slots are handled too.
 */
export function detachGlobal<T>(data: T, id: number, block: { type: string; props: Record<string, unknown> }): T {
  const target = globalType(id);
  const walk = (node: unknown): unknown => {
    if (Array.isArray(node)) return node.map(walk);
    if (node && typeof node === "object") {
      const obj = node as { type?: unknown; props?: Record<string, unknown> };
      if (obj.type === target && obj.props) {
        return { type: block.type, props: { ...structuredClone(block.props), id: obj.props.id } };
      }
      return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, walk(v)]));
    }
    return node;
  };
  return walk(data) as T;
}
