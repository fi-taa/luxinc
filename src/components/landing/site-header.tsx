"use client";

import Image from "next/image";
import Link from "next/link";
import type { NavLink } from "@/lib/landing-content";
import { useLandingContent } from "@/components/landing/landing-content-provider";
import { AuthCtaButton } from "@/components/auth/auth-cta-button";
import { GoldButton } from "./gold-button";
import { MobileNav } from "./mobile-nav";

interface SiteHeaderCta {
	label: string;
	href: string;
}

interface SiteHeaderProps {
	variant?: "hero" | "page";
	activeHref?: string;
	cta?: SiteHeaderCta;
}

function resolveNavHref(href: string, useHomePrefix: boolean): string {
	if (useHomePrefix && href.startsWith("#")) {
		return `/${href}`;
	}
	return href;
}

function resolveNavLinks(
	links: NavLink[],
	useHomePrefix: boolean,
	activeHref?: string,
): NavLink[] {
	return links.map((link) => {
		const href = resolveNavHref(link.href, useHomePrefix);
		const isActive = activeHref ? href === activeHref : link.isActive;
		return { ...link, href, isActive };
	});
}

function ctaActionForLabel(label: string, heroCta: string): "sign-in" | "sign-up" {
	return label === heroCta ? "sign-up" : "sign-in";
}

export function SiteHeader({
	variant = "hero",
	activeHref,
	cta,
}: SiteHeaderProps) {
	const { site, navLinks, hero } = useLandingContent();
	const isPage = variant === "page";
	const resolvedLinks = resolveNavLinks(navLinks, isPage, activeHref);
	const headerCta = cta ?? site.navCta;
	const defaultDetailCta = {
		label: hero.cta,
		href: resolveNavHref(hero.ctaHref, isPage),
	};
	const displayCta = isPage && !cta ? defaultDetailCta : headerCta;
	const ctaAction = ctaActionForLabel(displayCta.label, hero.cta);

	return (
		<header
			className={isPage ? "relative z-50" : "absolute inset-x-0 top-0 z-50"}
		>
			<div className="mx-auto grid w-full max-w-[1280px] grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-6 md:px-10 md:py-8 lg:px-16">
				<Link
					href="/"
					className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold focus-visible:ring-offset-2 focus-visible:ring-offset-luxinc-bg"
				>
					<Image
						src="/images/logo.svg"
						alt={site.name}
						width={500}
						height={500}
						className="h-9 w-auto md:h-11"
						priority
					/>
				</Link>
				<nav
					className="hidden items-center justify-center gap-8 md:flex lg:gap-10"
					aria-label="Main navigation"
				>
					{resolvedLinks.map((link) => (
						<Link
							key={link.label}
							href={link.href}
							className={
								link.isActive
									? "font-sans text-sm text-luxinc-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold"
									: "font-sans text-sm text-luxinc-text transition-colors hover:text-luxinc-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold"
							}
						>
							{link.label}
						</Link>
					))}
				</nav>
				<div className="flex items-center justify-end gap-4">
					<AuthCtaButton
						action={ctaAction}
						variant="soft"
						className="hidden shrink-0 md:inline-flex"
					>
						{displayCta.label}
					</AuthCtaButton>
					<MobileNav
						links={resolvedLinks}
						ctaLabel={displayCta.label}
						ctaAction={ctaAction}
					/>
				</div>
			</div>
		</header>
	);
}
