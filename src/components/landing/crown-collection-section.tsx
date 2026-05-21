import Image from "next/image";
import Link from "next/link";
import { crownCollection } from "@/lib/landing-content";
import { SectionHeading } from "./section-heading";
import { SectionShell } from "./section-shell";

export function CrownCollectionSection() {
  return (
    <SectionShell
      id="crown-collection"
      bordered
      ariaLabelledBy="experiences-heading"
    >
      <SectionHeading
        id="experiences-heading"
        title={crownCollection.title}
        subtitle={crownCollection.subtitle}
      />
      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3 lg:mt-20 lg:gap-8">
        {crownCollection.cards.map((card) => (
          <article
            key={card.title}
            className="group relative aspect-[3/4] overflow-hidden md:aspect-[4/5]"
            style={{ position: "relative" }}
          >
            <Image
              src={card.image}
              alt={card.imageAlt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col p-6 md:p-8">
              <h3 className="font-serif text-xl text-zulu-gold md:text-2xl">
                {card.title}
              </h3>
              <p className="mt-2 font-sans text-xs leading-relaxed text-zulu-text-muted md:text-sm">
                {card.description}
              </p>
              <Link
                href={card.href}
                className="mt-5 self-start font-sans text-[10px] font-medium uppercase tracking-[0.25em] text-zulu-gold transition-colors hover:text-zulu-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zulu-gold"
              >
                Explore
              </Link>
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
