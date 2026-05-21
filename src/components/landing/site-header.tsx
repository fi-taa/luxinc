import Link from "next/link";
import { navLinks, site } from "@/lib/landing-content";
import { GoldButton } from "./gold-button";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-8 md:px-10 lg:px-16">
        <Link
          href="/"
          className="shrink-0 font-serif text-xl font-medium tracking-wide text-zulu-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zulu-gold"
        >
          {site.name}
        </Link>
        <nav
          className="hidden items-center justify-center gap-8 lg:gap-10 md:flex"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
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
            href={site.navCta.href}
            variant="outline"
            className="hidden shrink-0 md:inline-flex"
          >
            {site.navCta.label}
          </GoldButton>
          <MobileNav links={navLinks} cta={site.navCta} />
        </div>
      </div>
    </header>
  );
}
