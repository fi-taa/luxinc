import type { ContentCategory, ContentDetail } from "@/lib/content-detail";

export function createEmptyContentDetail(
	category: ContentCategory,
): ContentDetail {
	return {
		slug: "",
		category,
		date: "",
		title: "Untitled article",
		image: category === "journal" ? "/images/j.png" : "/images/a1.png",
		imageAlt: "",
		paragraphs: [{ segments: [{ text: "" }] }],
		tableOfContents: [],
		related: [],
	};
}

export function isNewContentDetailSlug(slug: string): boolean {
	return slug === "new";
}
