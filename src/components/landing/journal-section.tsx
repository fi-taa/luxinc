"use client";

import Image from "next/image";
import Link from "next/link";
import { useLandingContent } from "@/components/landing/landing-content-provider";
import { JournalGeometricPattern } from "./journal-geometric-pattern";
import { SectionShell } from "./section-shell";
import { SectionTitle } from "./section-title";

export function JournalSection() {
	const { journal } = useLandingContent();
	return (
		<SectionShell
			id="journal"
			ariaLabelledBy="journal-heading"
			fullWidth
			className="overflow-hidden"
		>
			<div className="relative flex flex-col lg:flex-row lg:items-stretch">
				<div className="flex min-w-0 flex-col lg:w-1/2 lg:shrink-0">
					<div className="px-6 md:px-10 lg:pl-16 lg:pr-8">
						<SectionTitle
							id="journal-heading"
							title={journal.title}
							subtitle={journal.subtitle}
							align="left"
						/>
					</div>
					<Link
						href={journal.ctaHref}
						className="relative mt-8 block w-screen max-w-[100vw] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold focus-visible:ring-offset-2 focus-visible:ring-offset-luxinc-bg max-lg:left-1/2 max-lg:-translate-x-1/2 lg:mt-10 lg:ml-[calc(100%-50vw)] lg:w-full lg:max-w-none"
					>
						<Image
							src={journal.collageImage}
							alt={journal.collageAlt}
							width={1050}
							height={472}
							className="mx-auto block h-auto w-full object-contain object-center max-lg:object-center lg:mx-0 lg:object-left"
							sizes="100vw"
						/>
					</Link>
				</div>

				<div className="relative flex min-h-[400px] flex-col justify-center overflow-visible px-6 py-10 md:px-10 lg:w-1/2 lg:shrink-0 lg:py-0 lg:pl-8 lg:pr-10 xl:pl-10 xl:pr-12">
					<JournalGeometricPattern />
					<div className="relative z-10 w-full max-w-2xl space-y-8 lg:max-w-none lg:space-y-10">
						{journal.highlights.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className="block transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold focus-visible:ring-offset-2 focus-visible:ring-offset-luxinc-bg"
							>
								<h3 className="text-center font-diphylleia text-[clamp(1rem,2vw,22px)] font-normal leading-normal tracking-normal text-luxinc-gold">
									{item.label}
								</h3>
								<p className="mt-3 font-encode text-[clamp(0.8125rem,1.5vw,17px)] font-normal leading-normal tracking-normal text-luxinc-text">
									{item.body}
								</p>
							</Link>
						))}
						<Link
							href={journal.ctaHref}
							className="inline-flex h-11 items-center justify-center bg-luxinc-gold px-8 font-sans text-sm font-medium normal-case tracking-normal text-luxinc-bg transition-colors hover:bg-luxinc-gold-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold focus-visible:ring-offset-2 focus-visible:ring-offset-luxinc-bg"
						>
							{journal.cta}
						</Link>
					</div>
				</div>
			</div>
		</SectionShell>
	);
}
