import Link from "next/link";
import { crownCollection } from "@/lib/landing-content";
import { FillImage } from "./fill-image";
import { SectionShell } from "./section-shell";
import { SectionTitle } from "./section-title";
import { cn } from "@/lib/utils";

export function CrownCollectionSection() {
  return (
    <SectionShell
      id="crown-collection"
      bordered
      ariaLabelledBy="experiences-heading"
      className="relative overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 top-0 z-0 w-[min(45%,320px)] bg-[url('/images/dots.png')] bg-left bg-no-repeat bg-contain md:w-[300px] lg:w-[360px]"
      />
      <div className="relative z-10">
        <SectionTitle
          id="experiences-heading"
          title={crownCollection.title}
          subtitle={crownCollection.subtitle}
        />

        <div className="mt-14 flex flex-col items-center gap-5 md:mt-20 md:flex-row md:items-end md:justify-center md:gap-4 lg:gap-5">
          {crownCollection.cards.map((card) => (
            <article
              key={card.title}
              className={cn(
                "group relative w-full max-w-[400px] overflow-hidden",
                card.featured
                  ? "aspect-3/4 md:aspect-auto md:h-[min(72vh,640px)] md:max-w-[420px]"
                  : "aspect-4/5 md:aspect-auto md:h-[min(55vh,480px)] md:max-w-[340px]"
              )}
            >
              <FillImage
                containerClassName="absolute inset-0"
                src={card.image}
                alt={card.imageAlt}
                className="transition-transform duration-500 group-hover:scale-105"
                sizes={
                  card.featured
                    ? "(max-width: 768px) 100vw, 420px"
                    : "(max-width: 768px) 100vw, 340px"
                }
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col p-5 md:p-6 lg:p-7">
                <Link
                  href={card.href}
                  className="font-sans text-[11px] font-medium uppercase leading-snug tracking-[0.12em] text-zulu-text transition-colors hover:text-zulu-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zulu-gold"
                >
                  {card.title}
                </Link>
                <p className="mt-2 max-w-[28ch] font-sans text-[11px] font-normal leading-relaxed text-zulu-text/90 md:text-xs">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
