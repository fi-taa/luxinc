import Image from "next/image";
import Link from "next/link";
import { hero, navLinks, site } from "@/lib/landing-content";
import type { NavLink } from "@/lib/landing-content";
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
  activeHref?: string
): NavLink[] {
  return links.map((link) => {
    const href = resolveNavHref(link.href, useHomePrefix);
    const isActive = activeHref ? href === activeHref : link.isActive;
    return { ...link, href, isActive };
  });
}

export function SiteHeader({
  variant = "hero",
  activeHref,
  cta,
}: SiteHeaderProps) {
  const isPage = variant === "page";
  const resolvedLinks = resolveNavLinks(navLinks, isPage, activeHref);
  const headerCta = cta ?? site.navCta;
  const resolvedCta = {
    label: headerCta.label,
    href: resolveNavHref(headerCta.href, isPage),
  };
  const defaultDetailCta = {
    label: hero.cta,
    href: resolveNavHref(hero.ctaHref, isPage),
  };
  const displayCta = isPage && !cta ? defaultDetailCta : resolvedCta;

  return (
    <header
      className={
        isPage
          ? "relative z-50"
          : "absolute inset-x-0 top-0 z-50"
      }
    >
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-6 md:px-10 md:py-8 lg:px-16">
        <Link
          href="/"
          className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zulu-gold focus-visible:ring-offset-2 focus-visible:ring-offset-zulu-bg"
        >
          <Image
            src="/images/logo.png"
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
                  ? "font-sans text-sm text-zulu-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zulu-gold"
                  : "font-sans text-sm text-zulu-text transition-colors hover:text-zulu-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zulu-gold"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center justify-end gap-4">
          <GoldButton
            href={displayCta.href}
            variant="outline"
            className="hidden shrink-0 md:inline-flex"
          >
            {displayCta.label}
          </GoldButton>
          <MobileNav links={resolvedLinks} cta={displayCta} />
        </div>
      </div>
    </header>
  );
}
