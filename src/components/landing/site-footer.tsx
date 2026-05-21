import Link from "next/link";
import { footer } from "@/lib/landing-content";

export function SiteFooter() {
  return (
    <footer className="border-t border-zulu-border py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1280px] px-6 text-center md:px-10 lg:px-16">
        <blockquote className="mx-auto max-w-3xl font-script text-2xl italic leading-relaxed text-zulu-gold md:text-3xl lg:text-4xl">
          &ldquo;{footer.quote}&rdquo;
        </blockquote>
        <div className="mt-14 flex flex-wrap items-center justify-center gap-8 md:gap-10">
          {footer.social.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="font-sans text-[10px] font-medium uppercase tracking-[0.25em] text-zulu-text-muted transition-colors hover:text-zulu-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zulu-gold"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
          {footer.links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-sans text-[10px] text-zulu-text-muted transition-colors hover:text-zulu-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zulu-gold"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p className="mt-10 font-sans text-[10px] uppercase tracking-[0.15em] text-zulu-text-muted">
          {footer.copyright}
        </p>
      </div>
    </footer>
  );
}
