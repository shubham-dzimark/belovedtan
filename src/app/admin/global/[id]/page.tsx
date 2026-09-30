import type { Data } from "@puckeditor/core";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/dal";
import { getGlobalBlock, globalBlockUsage } from "@/lib/global-blocks";
import config from "@/puck/config";
import { publishGlobalBlock, saveGlobalBlockDraft } from "../../actions";
import { VisualEditor } from "../../_components/visual-editor";

type Props = PageProps<"/admin/global/[id]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const block = await getGlobalBlock(Number((await params).id));
  return { title: block ? `Editing ${block.name}` : "Editor" };
}

/** Visual editor for one global widget: a single section, edited in place. */
export default async function GlobalBlockEditorPage({ params }: Props) {
  await requireUser();
  const block = await getGlobalBlock(Number((await params).id));
  if (!block) notFound();

  const usage = await globalBlockUsage(block.id);
  const usedOn = usage.pages.length + usage.parts.length;
  const data = {
    root: { props: structuredClone(config.root!.defaultProps!) },
    content: [{ type: block.type, props: { ...JSON.parse(block.draftProps), id: `${block.type}-global-${block.id}` } }],
  } as Data;

  return (
    <VisualEditor
      mode="block"
      title={`★ ${block.name}`}
      path={`global widget · used in ${usedOn} ${usedOn === 1 ? "place" : "places"}`}
      initialData={data}
      isPublished={Boolean(block.publishedProps)}
      liveUrl={null}
      previewUrl={`/admin/preview/global/${block.id}`}
      saveAction={saveGlobalBlockDraft.bind(null, block.id)}
      publishAction={publishGlobalBlock.bind(null, block.id)}
    />
  );
}
