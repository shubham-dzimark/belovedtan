import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/dal";
import { getSiteConfig } from "@/lib/global-blocks";
import { getPageBySlug, parseData } from "@/lib/pages";
import { defaultSitePartData, getPublishedSiteParts, getSitePart, SITE_PARTS } from "@/lib/site-parts";
import type { PageData } from "@/puck/config";
import { SiteFrame } from "@/puck/site-frame";

export const metadata: Metadata = { title: "Preview" };

/** Shows the draft header or footer around the published Home page. */
export default async function SitePartPreview({ params }: PageProps<"/admin/preview/site/[part]">) {
  await requireUser();
  const { part } = await params;
  if (part !== "header" && part !== "footer") notFound();

  const [row, published, home, config] = await Promise.all([
    getSitePart(part),
    getPublishedSiteParts(),
    getPageBySlug(""),
    getSiteConfig(),
  ]);
  const draft = row ? parseData(row.draftData) : defaultSitePartData(part);
  const page: PageData = home?.publishedData ? parseData(home.publishedData) : { root: { props: {} }, content: [] } as unknown as PageData;

  return (
    <>
      <div className="adm-preview-bar">
        <span>
          Previewing the draft <strong>{SITE_PARTS[part].label.toLowerCase()}</strong> on the Home page. Visitors
          won&rsquo;t see changes until you publish.
        </span>
        <Link href={`/admin/site/${part}`} className="adm-btn adm-btn--sm">
          Back to editor
        </Link>
      </div>
      <div className="adm-preview-page">
        <SiteFrame
          config={config}
          page={page}
          header={part === "header" ? draft : published.header}
          footer={part === "footer" ? draft : published.footer}
        />
      </div>
    </>
  );
}
