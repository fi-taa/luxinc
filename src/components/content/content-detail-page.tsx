import Image from "next/image";
import type { ContentCategory, ContentDetail } from "@/lib/content-detail";
import { SiteHeader } from "@/components/landing/site-header";
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

function activeNavHrefFor(category: ContentCategory): string {
	return category === "journal" ? "/#journal" : "/#architects";
}

export function ContentDetailPage({
	detail,
	category,
}: ContentDetailPageProps) {
	return (
		<main className="relative min-h-screen bg-luxinc-bg text-luxinc-text">
			<DotsPattern className="pointer-events-none fixed inset-0 overflow-hidden" />

			<div className="relative z-10">
				<SiteHeader variant="page" activeHref={activeNavHrefFor(category)} />

				<div className="mx-auto w-full max-w-[1280px] px-6 pb-16 pt-4 md:px-10 md:pb-20 md:pt-6 lg:px-16">
					<article className="mx-auto max-w-5xl">
						<div className="flex items-start gap-3 md:gap-5">
							<DetailBackLink
								href={backHrefFor(category)}
								className="shrink-0 pt-1 md:pt-2"
							/>
							<figure className="min-w-0 flex-1 overflow-hidden rounded-2xl md:rounded-3xl">
								<Image
									src={detail.image}
									alt={detail.imageAlt}
									width={1200}
									height={640}
									className="aspect-video w-full object-cover md:aspect-2/1"
									sizes="(max-width: 1280px) 100vw, 1024px"
									priority
								/>
							</figure>
						</div>

						<p className="mt-8 text-center font-sans text-sm text-luxinc-text/70 md:mt-10">
							{detail.date}
						</p>

						<h1 className="mx-auto mt-5 max-w-4xl text-center font-diphylleia text-[clamp(1.75rem,4.5vw,2.75rem)] font-normal leading-tight text-luxinc-gold md:mt-6">
							{detail.title}
						</h1>

						<div className="mx-auto mt-10 max-w-3xl space-y-6 text-center md:mt-12 md:space-y-8">
							{detail.paragraphs.map((paragraph, index) => {
								const tocId = detail.tableOfContents?.[index]?.id;
								return (
									<div
										key={index}
										id={tocId}
										className={tocId ? "scroll-mt-28" : undefined}
									>
										<DetailParagraph paragraph={paragraph} />
									</div>
								);
							})}
						</div>

						{detail.tableOfContents ? (
							<TableOfContents items={detail.tableOfContents} />
						) : null}

						{detail.related.length > 0 ? (
							<section
								className="mt-20 md:mt-28"
								aria-labelledby="related-heading"
							>
								<h2
									id="related-heading"
									className="text-center font-diphylleia text-[clamp(2rem,5vw,2.5rem)] font-normal text-luxinc-gold"
								>
									Related Contents
								</h2>
								<div className="mt-10 grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4 lg:gap-6">
									{detail.related.map((item) => (
										<RelatedContentCard
											key={`${item.category}-${item.slug}`}
											item={item}
										/>
									))}
								</div>
							</section>
						) : null}
					</article>
				</div>

				<DetailFooter />
			</div>
		</main>
	);
}
