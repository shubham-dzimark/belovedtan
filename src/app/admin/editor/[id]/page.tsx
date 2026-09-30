import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/dal";
import { getPublishedGlobalBlocks } from "@/lib/global-blocks";
import { getPageById, parseData } from "@/lib/pages";
import { pagePath } from "@/lib/slug";
import { publishPage, saveDraft } from "../../actions";
import { VisualEditor } from "../../_components/visual-editor";

type Props = PageProps<"/admin/editor/[id]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPageById(Number((await params).id));
  return { title: page ? `Editing ${page.title}` : "Editor" };
}

export default async function EditorPage({ params }: Props) {
  await requireUser();
  const page = await getPageById(Number((await params).id));
  if (!page) notFound();
  const globalBlocks = await getPublishedGlobalBlocks();

  return (
    <VisualEditor
      mode="page"
      title={page.title}
      path={pagePath(page.slug)}
      initialData={parseData(page.draftData)}
      isPublished={page.status === "published"}
      liveUrl={pagePath(page.slug)}
      previewUrl={`/admin/preview/${page.id}`}
      saveAction={saveDraft.bind(null, page.id)}
      publishAction={publishPage.bind(null, page.id)}
      globalBlocks={globalBlocks}
    />
  );
}
