import type { Metadata } from "next";

const FALLBACK_SITE_URL = "https://luxinc.vercel.app";

export const siteConfig = {
	name: "LUXINC.",
	title: "LUXINC. | Luxury Travel Architects",
	description:
		"Time is the ultimate luxury. Luxinc architects bespoke travel memories across East Africa and beyond.",
	defaultOgImage: "/images/hero.png",
	locale: "en_US",
} as const;

export function getSiteUrl(): string {
	const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
	if (fromEnv && !fromEnv.includes("localhost")) {
		return fromEnv;
	}

	const vercelHost = process.env.VERCEL_URL?.trim().replace(/\/$/, "");
	if (vercelHost) {
		return `https://${vercelHost}`;
	}

	return FALLBACK_SITE_URL;
}

export function absoluteUrl(path: string): string {
	if (path.startsWith("http://") || path.startsWith("https://")) {
		return path;
	}
	const normalized = path.startsWith("/") ? path : `/${path}`;
	return `${getSiteUrl()}${normalized}`;
}

export function createPageMetadata(options: {
	title: string;
	description?: string;
	path?: string;
	image?: string | null;
	noIndex?: boolean;
}): Metadata {
	const description = options.description?.trim() || siteConfig.description;
	const canonical = options.path ? absoluteUrl(options.path) : undefined;
	const imagePath = options.image?.trim() || siteConfig.defaultOgImage;
	const imageUrl = absoluteUrl(imagePath);

	const metadata: Metadata = {
		title: options.title,
		description,
		alternates: canonical ? { canonical } : undefined,
		openGraph: {
			type: "website",
			locale: siteConfig.locale,
			siteName: siteConfig.name,
			title: options.title,
			description,
			url: canonical ?? getSiteUrl(),
			images: [{ url: imageUrl, alt: siteConfig.name }],
		},
		twitter: {
			card: "summary_large_image",
			title: options.title,
			description,
			images: [imageUrl],
		},
	};

	if (options.noIndex) {
		metadata.robots = { index: false, follow: false };
	}

	return metadata;
}

export function getRootMetadata(): Metadata {
	return {
		metadataBase: new URL(getSiteUrl()),
		...createPageMetadata({
			title: siteConfig.title,
			description: siteConfig.description,
		}),
	};
}

export function getOrganizationJsonLd() {
	return {
		"@context": "https://schema.org",
		"@type": "TravelAgency",
		name: siteConfig.name,
		description: siteConfig.description,
		url: getSiteUrl(),
	};
}
