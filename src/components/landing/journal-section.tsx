import Image from "next/image";
import Link from "next/link";
import { journal } from "@/lib/landing-content";
import { GoldButton } from "./gold-button";
import { SectionHeading } from "./section-heading";
import { SectionShell } from "./section-shell";

export function JournalSection() {
  return (
    <SectionShell id="journal" ariaLabelledBy="journal-heading">
      <SectionHeading
        id="journal-heading"
        title={journal.title}
        subtitle={journal.subtitle}
      />
      <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 xl:gap-20">
        <div className="flex flex-col">
          {journal.articles.map((article) => (
            <Link
              key={article.title}
              href={article.href}
              className="group flex gap-5 border-b border-zulu-border py-6 transition-colors first:pt-0 hover:border-zulu-gold/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zulu-gold focus-visible:ring-offset-4 focus-visible:ring-offset-zulu-bg"
            >
              <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden md:h-20 md:w-20">
                <Image
                  src={article.image}
                  alt={article.imageAlt}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="flex min-w-0 flex-col justify-center">
                <h3 className="font-serif text-base leading-snug text-zulu-gold transition-colors group-hover:text-zulu-text md:text-lg">
                  {article.title}
                </h3>
                <p className="mt-2 font-sans text-[10px] uppercase tracking-[0.2em] text-zulu-text-muted">
                  {article.date}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <article className="flex flex-col">
          <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-[16/11]">
            <Image
              src={journal.featured.image}
              alt={journal.featured.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </div>
          <div className="flex flex-1 flex-col pt-8 lg:pt-10">
            <p className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-zulu-gold">
              {journal.featured.label}
            </p>
            <h3 className="mt-4 font-serif text-2xl leading-snug text-zulu-gold md:text-3xl lg:text-[2rem]">
              {journal.featured.title}
            </h3>
            <p className="mt-5 flex-1 font-sans text-sm leading-[1.8] text-zulu-text-muted md:text-base">
              {journal.featured.description}
            </p>
            <div className="mt-8">
              <GoldButton href={journal.featured.href}>
                {journal.featured.cta}
              </GoldButton>
            </div>
          </div>
        </article>
      </div>
    </SectionShell>
  );
}
