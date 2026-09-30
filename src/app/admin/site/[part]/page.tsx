import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/dal";
import { parseData } from "@/lib/pages";
import { defaultSitePartData, getSitePart, SITE_PARTS } from "@/lib/site-parts";
import { publishSitePart, saveSitePartDraft } from "../../actions";
import { VisualEditor } from "../../_components/visual-editor";

type Props = PageProps<"/admin/site/[part]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { part } = await params;
  return { title: part === "header" || part === "footer" ? `Editing ${SITE_PARTS[part].label}` : "Editor" };
}

/** Visual editor for the site-wide header or footer. */
export default async function SitePartEditorPage({ params }: Props) {
  await requireUser();
  const { part } = await params;
  if (part !== "header" && part !== "footer") notFound();

  const row = await getSitePart(part);
  return (
    <VisualEditor
      mode={part}
      title={`Site ${SITE_PARTS[part].label.toLowerCase()}`}
      path="shown on every page"
      initialData={row ? parseData(row.draftData) : defaultSitePartData(part)}
      isPublished={Boolean(row?.publishedData)}
      liveUrl="/"
      previewUrl={`/admin/preview/site/${part}`}
      saveAction={saveSitePartDraft.bind(null, part)}
      publishAction={publishSitePart.bind(null, part)}
    />
  );
}
