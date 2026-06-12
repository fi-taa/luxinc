import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetailPage } from "@/components/content/content-detail-page";
import { getContentDetailSlugs } from "@/lib/content-detail";
import {
  fetchArchitectDetail,
  fetchArchitectIds,
} from "@/lib/cms/fetch-architect-detail";
import { createPageMetadata } from "@/lib/seo/site";

/** UUIDs from DB are not known at build time; always resolve on request. */
export const dynamic = "force-dynamic";

interface ArchitectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const ids = await fetchArchitectIds();
  const source = ids.length ? ids : getContentDetailSlugs("architects");
  return source.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ArchitectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = await fetchArchitectDetail(slug);

  if (!detail) {
    return createPageMetadata({
      title: "The Architects | LUXINC.",
      path: `/architects/${slug}`,
    });
  }

  const description =
    detail.paragraphs[0]?.segments.map((s) => s.text).join("") ?? detail.date;

  return createPageMetadata({
    title: `${detail.title} | LUXINC.`,
    description,
    path: `/architects/${slug}`,
    image: detail.image,
  });
}

export default async function ArchitectDetailPage({
  params,
}: ArchitectDetailPageProps) {
  const { slug } = await params;
  const detail = await fetchArchitectDetail(slug);

  if (!detail) {
    notFound();
  }

  return <ContentDetailPage detail={detail} category="architects" />;
}
