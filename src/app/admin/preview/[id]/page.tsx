import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/dal";
import { getPageById, parseData } from "@/lib/pages";
import { getSiteConfig } from "@/lib/global-blocks";
import { getPublishedSiteParts } from "@/lib/site-parts";
import { SiteFrame } from "@/puck/site-frame";

export const metadata: Metadata = { title: "Preview" };

export default async function PreviewPage({ params }: PageProps<"/admin/preview/[id]">) {
  await requireUser();
  const page = await getPageById(Number((await params).id));
  if (!page) notFound();
  const [{ header, footer }, config] = await Promise.all([getPublishedSiteParts(), getSiteConfig()]);

  return (
    <>
      <div className="adm-preview-bar">
        <span>
          Previewing the draft of <strong>{page.title}</strong>. Visitors won&rsquo;t see changes
          until you publish.
        </span>
        <Link href={`/admin/editor/${page.id}`} className="adm-btn adm-btn--sm">
          Back to editor
        </Link>
      </div>
      <div className="adm-preview-page">
        <SiteFrame config={config} page={parseData(page.draftData)} header={header} footer={footer} />
      </div>
    </>
  );
}
