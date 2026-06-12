import type { MetadataRoute } from "next";
import { fetchArchitectIds } from "@/lib/cms/fetch-architect-detail";
import { fetchContentSlugs } from "@/lib/cms/fetch-content";
import { fetchJournalIds } from "@/lib/cms/fetch-journal-detail";
import { getContentDetailSlugs } from "@/lib/content-detail";
import { absoluteUrl } from "@/lib/seo/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const now = new Date();
	const entries: MetadataRoute.Sitemap = [
		{
			url: absoluteUrl("/"),
			lastModified: now,
			changeFrequency: "weekly",
			priority: 1,
		},
	];

	const architectSlugs = await fetchArchitectIds().catch(() => []);
	const resolvedArchitects =
		architectSlugs.length > 0 ? architectSlugs : getContentDetailSlugs("architects");

	for (const slug of resolvedArchitects) {
		entries.push({
			url: absoluteUrl(`/architects/${slug}`),
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.7,
		});
	}

	const [journalIds, articleSlugs] = await Promise.all([
		fetchJournalIds().catch(() => [] as string[]),
		fetchContentSlugs("journal").catch(() => [] as string[]),
	]);
	const journalSlugs = [
		...new Set([
			...journalIds,
			...articleSlugs,
			...getContentDetailSlugs("journal"),
		]),
	];

	for (const slug of journalSlugs) {
		entries.push({
			url: absoluteUrl(`/journal/${slug}`),
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.7,
		});
	}

	return entries;
}
