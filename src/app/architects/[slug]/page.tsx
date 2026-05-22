import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetailPage } from "@/components/content/content-detail-page";
import {
  getContentDetail,
  getContentDetailSlugs,
} from "@/lib/content-detail";

interface ArchitectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getContentDetailSlugs("architects").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ArchitectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = getContentDetail("architects", slug);

  if (!detail) {
    return { title: "The Architects | LUXINC." };
  }

  return {
    title: `${detail.title} | LUXINC.`,
    description: detail.paragraphs[0]?.segments.map((s) => s.text).join("") ?? "",
  };
}

export default async function ArchitectDetailPage({
  params,
}: ArchitectDetailPageProps) {
  const { slug } = await params;
  const detail = getContentDetail("architects", slug);

  if (!detail) {
    notFound();
  }

  return <ContentDetailPage detail={detail} category="architects" />;
}
