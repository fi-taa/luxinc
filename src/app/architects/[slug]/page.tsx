import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetailPage } from "@/components/content/content-detail-page";
import { getContentDetailSlugs } from "@/lib/content-detail";
import {
  fetchArchitectDetail,
  fetchArchitectIds,
} from "@/lib/cms/fetch-architect-detail";

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
    return { title: "The Architects | LUXINC." };
  }

  return {
    title: `${detail.title} | LUXINC.`,
    description:
      detail.paragraphs[0]?.segments.map((s) => s.text).join("") ??
      detail.date,
  };
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
