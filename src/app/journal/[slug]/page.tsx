import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetailPage } from "@/components/content/content-detail-page";
import {
  getContentDetail,
  getContentDetailSlugs,
} from "@/lib/content-detail";

interface JournalDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getContentDetailSlugs("journal").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: JournalDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = getContentDetail("journal", slug);

  if (!detail) {
    return { title: "Journal | LUXINC." };
  }

  return {
    title: `${detail.title} | LUXINC. Journal`,
    description: detail.paragraphs[0]?.segments.map((s) => s.text).join("") ?? "",
  };
}

export default async function JournalDetailPage({
  params,
}: JournalDetailPageProps) {
  const { slug } = await params;
  const detail = getContentDetail("journal", slug);

  if (!detail) {
    notFound();
  }

  return <ContentDetailPage detail={detail} category="journal" />;
}
