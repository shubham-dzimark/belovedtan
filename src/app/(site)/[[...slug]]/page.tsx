import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageBySlug, parseData } from "@/lib/pages";
import { getSiteConfig } from "@/lib/global-blocks";
import { getPublishedSiteParts } from "@/lib/site-parts";
import { SiteFrame } from "@/puck/site-frame";

// Pages change whenever an admin publishes, so always read the latest from the database.
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug?: string[] }> };

async function getPublishedPage(params: Props["params"]) {
  const { slug = [] } = await params;
  const page = await getPageBySlug(slug.join("/"));
  return page?.publishedData ? page : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPublishedPage(params);
  if (!page) return {};
  return page.slug === "" ? { title: { absolute: page.title } } : { title: page.title };
}

export default async function SitePage({ params }: Props) {
  const page = await getPublishedPage(params);

  if (!page) {
    const { slug = [] } = await params;
    if (slug.length === 0) {
      return (
        <main className="bt-empty">
          <h1>No home page yet</h1>
          <p>
            Sign in to the <Link href="/admin">admin panel</Link> and publish a page with the URL
            &ldquo;/&rdquo;.
          </p>
        </main>
      );
    }
    notFound();
  }

  const [{ header, footer }, config] = await Promise.all([getPublishedSiteParts(), getSiteConfig()]);
  return <SiteFrame config={config} page={parseData(page.publishedData!)} header={header} footer={footer} />;
}
