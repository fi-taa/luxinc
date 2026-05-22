import Image from "next/image";
import type { ContentCategory, ContentDetail } from "@/lib/content-detail";
import { DotsPattern } from "./dots-pattern";
import { DetailBackLink } from "./detail-back-link";
import { DetailParagraph } from "./detail-paragraph";
import { DetailFooter } from "./detail-footer";
import { RelatedContentCard } from "./related-content-card";
import { TableOfContents } from "./table-of-contents";

interface ContentDetailPageProps {
  detail: ContentDetail;
  category: ContentCategory;
}

function backHrefFor(category: ContentCategory): string {
  return category === "journal" ? "/#journal" : "/#architects";
}

export function ContentDetailPage({
  detail,
  category,
}: ContentDetailPageProps) {
  return (
    <div className="relative min-h-screen bg-zulu-bg text-zulu-text">
      <DotsPattern className="pointer-events-none absolute inset-0 overflow-hidden" />

      <div className="relative mx-auto max-w-4xl px-6 pb-8 pt-8 md:px-10 md:pt-12 lg:px-16">
        <DetailBackLink href={backHrefFor(category)} />

        <article className="mt-10 md:mt-14">
          <figure className="overflow-hidden rounded-2xl md:rounded-3xl">
            <Image
              src={detail.image}
              alt={detail.imageAlt}
              width={1200}
              height={675}
              className="aspect-video w-full object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
          </figure>

          <p className="mt-8 text-center font-sans text-sm text-zulu-text/70">
            {detail.date}
          </p>

          <h1 className="mt-6 text-center font-diphylleia text-[clamp(1.75rem,5vw,2.75rem)] font-normal leading-tight text-zulu-gold">
            {detail.title}
          </h1>

          <div className="mx-auto mt-10 max-w-2xl space-y-6 text-center md:mt-12">
            {detail.paragraphs.map((paragraph, index) => {
              const tocId = detail.tableOfContents?.[index]?.id;
              return (
                <div
                  key={index}
                  id={tocId}
                  className={tocId ? "scroll-mt-24" : undefined}
                >
                  <DetailParagraph paragraph={paragraph} />
                </div>
              );
            })}
          </div>

          {detail.tableOfContents ? (
            <TableOfContents items={detail.tableOfContents} />
          ) : null}
        </article>

        {detail.related.length > 0 ? (
          <section className="mt-20 md:mt-28" aria-labelledby="related-heading">
            <h2
              id="related-heading"
              className="text-center font-diphylleia text-[clamp(2rem,6vw,2.5rem)] font-normal text-zulu-gold"
            >
              Related Contents
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {detail.related.map((item) => (
                <RelatedContentCard key={`${item.category}-${item.slug}`} item={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <DetailFooter />
    </div>
  );
}
