import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetailPage } from "@/components/content/content-detail-page";
import { getContentDetailSlugs } from "@/lib/content-detail";
import { fetchContentDetail, fetchContentSlugs } from "@/lib/cms/fetch-content";
import {
	fetchJournalDetail,
	fetchJournalIds,
} from "@/lib/cms/fetch-journal-detail";

export const dynamic = "force-dynamic";

interface JournalDetailPageProps {
	params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
	const [journalIds, articleSlugs] = await Promise.all([
		fetchJournalIds(),
		fetchContentSlugs("journal"),
	]);
	const slugs = [
		...journalIds,
		...(articleSlugs.length ? articleSlugs : getContentDetailSlugs("journal")),
	];
	return [...new Set(slugs)].map((slug) => ({ slug }));
}

export async function generateMetadata({
	params,
}: JournalDetailPageProps): Promise<Metadata> {
	const { slug } = await params;
	const detail =
		(await fetchJournalDetail(slug)) ??
		(await fetchContentDetail("journal", slug));

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
	const detail =
		(await fetchJournalDetail(slug)) ??
		(await fetchContentDetail("journal", slug));

	if (!detail) {
		notFound();
	}

	return <ContentDetailPage detail={detail} category="journal" />;
}
