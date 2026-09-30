import type { Config } from "@puckeditor/core";
import { Render } from "@puckeditor/core/rsc";
import type { PageData } from "./config";

/**
 * Renders a page between the site-wide header and footer.
 * Each page can hide either one with its "Show site header/footer" settings.
 * `config` must include the global widgets (see getSiteConfig).
 */
export function SiteFrame({
  config,
  page,
  header,
  footer,
}: {
  config: Config;
  page: PageData;
  header: PageData | null;
  footer: PageData | null;
}) {
  // Pages saved before these settings existed show both.
  const root = (page.root?.props ?? {}) as { showHeader?: boolean; showFooter?: boolean };
  return (
    <>
      {header && root.showHeader !== false && <Render config={config} data={header} />}
      <Render config={config} data={page} />
      {footer && root.showFooter !== false && <Render config={config} data={footer} />}
    </>
  );
}
