import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/dal";
import { getGlobalBlock, getSiteConfig } from "@/lib/global-blocks";
import { getPublishedSiteParts } from "@/lib/site-parts";
import config, { type PageData } from "@/puck/config";
import { SiteFrame } from "@/puck/site-frame";

export const metadata: Metadata = { title: "Preview" };

/** Shows a global widget's draft between the site header and footer. */
export default async function GlobalBlockPreview({ params }: PageProps<"/admin/preview/global/[id]">) {
  await requireUser();
  const block = await getGlobalBlock(Number((await params).id));
  if (!block) notFound();

  const [{ header, footer }, siteConfig] = await Promise.all([getPublishedSiteParts(), getSiteConfig()]);
  const page = {
    root: { props: structuredClone(config.root!.defaultProps!) },
    content: [{ type: block.type, props: { ...JSON.parse(block.draftProps), id: `preview-${block.id}` } }],
  } as PageData;

  return (
    <>
      <div className="adm-preview-bar">
        <span>
          Previewing the draft of the global widget <strong>{block.name}</strong>. Pages keep showing the published
          version until you publish.
        </span>
        <Link href={`/admin/global/${block.id}`} className="adm-btn adm-btn--sm">
          Back to editor
        </Link>
      </div>
      <div className="adm-preview-page">
        <SiteFrame config={siteConfig} page={page} header={header} footer={footer} />
      </div>
    </>
  );
}
