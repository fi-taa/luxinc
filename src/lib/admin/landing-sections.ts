export type LandingSectionStatus = "published" | "draft";

export interface LandingSectionMeta {
	id: string;
	name: string;
	description: string;
	href: string;
	previewHref: string;
	status: LandingSectionStatus;
	lastUpdated: string;
}

export const landingSections: LandingSectionMeta[] = [
	{
		id: "site",
		name: "Site & navigation",
		description: "Site name, header links, and login CTA.",
		href: "/admin/landing/site",
		previewHref: "/",
		status: "published",
		lastUpdated: "May 20, 2026",
	},
	{
		id: "hero",
		name: "Hero",
		description: "Homepage hero copy, CTAs, and background image.",
		href: "/admin/landing/hero",
		previewHref: "/",
		status: "published",
		lastUpdated: "May 18, 2026",
	},
	{
		id: "commitment",
		name: "Commitment",
		description: "The 4-hour Luxinc promise strip.",
		href: "/admin/landing/commitment",
		previewHref: "/#destinations",
		status: "published",
		lastUpdated: "May 15, 2026",
	},
	{
		id: "destinations",
		name: "Destinations",
		description: "Signature destination carousel slides.",
		href: "/admin/landing/destinations",
		previewHref: "/#destinations",
		status: "published",
		lastUpdated: "May 22, 2026",
	},
	{
		id: "crown-collection",
		name: "Crown Collection",
		description: "Featured experience cards.",
		href: "/admin/landing/crown-collection",
		previewHref: "/#crown-collection",
		status: "published",
		lastUpdated: "May 10, 2026",
	},
	{
		id: "architects",
		name: "Architects",
		description: "Architect profiles and detail articles.",
		href: "/admin/landing/architects",
		previewHref: "/#architects",
		status: "published",
		lastUpdated: "May 12, 2026",
	},
	{
		id: "journal",
		name: "Journal",
		description: "Journal highlights and long-form articles.",
		href: "/admin/landing/journal",
		previewHref: "/#journal",
		status: "draft",
		lastUpdated: "May 8, 2026",
	},
	{
		id: "team",
		name: "Team",
		description: "Meet the team carousel.",
		href: "/admin/landing/team",
		previewHref: "/#architects",
		status: "published",
		lastUpdated: "May 5, 2026",
	},
	{
		id: "black-book",
		name: "Black Book",
		description: "Lead capture section copy.",
		href: "/admin/landing/black-book",
		previewHref: "/#crown-collection",
		status: "published",
		lastUpdated: "Apr 28, 2026",
	},
	{
		id: "contact",
		name: "Contact",
		description: "Office addresses and confidential contact lines.",
		href: "/admin/landing/contact",
		previewHref: "/#contact",
		status: "published",
		lastUpdated: "May 1, 2026",
	},
	{
		id: "footer",
		name: "Footer",
		description: "Tagline, locations, and legal copy.",
		href: "/admin/landing/footer",
		previewHref: "/",
		status: "published",
		lastUpdated: "May 24, 2026",
	},
];

export function getDraftLandingSectionCount(): number {
	return landingSections.filter((section) => section.status === "draft").length;
}
