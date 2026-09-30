import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/dal";
import { getPageById } from "@/lib/pages";
import { pagePath } from "@/lib/slug";
import { PageSettingsForm } from "./page-settings-form";

export const metadata: Metadata = { title: "Page settings" };

const dateFormat = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" });

export default async function PageSettings({ params }: PageProps<"/admin/pages/[id]">) {
  await requireUser();
  const page = await getPageById(Number((await params).id));
  if (!page) notFound();

  return (
    <PageSettingsForm
      page={{
        id: page.id,
        title: page.title,
        slug: page.slug,
        path: pagePath(page.slug),
        status: page.status,
        hasChanges: page.status === "published" && page.publishedData !== page.draftData,
        updated: dateFormat.format(page.updatedAt),
        published: page.publishedAt ? dateFormat.format(page.publishedAt) : null,
      }}
    />
  );
}
