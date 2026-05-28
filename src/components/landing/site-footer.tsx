"use client";

import Image from "next/image";
import { useLandingContent } from "@/components/landing/landing-content-provider";

interface SiteFooterProps {
	showQuote?: boolean;
}

export function SiteFooter({ showQuote = true }: SiteFooterProps) {
	const { footer } = useLandingContent();
	return (
		<footer>
			{showQuote ? (
				<div className="px-6 py-20 text-center md:px-10 md:py-28 lg:px-16">
					<Image
						src="/images/feather.png"
						alt=""
						width={120}
						height={120}
						className="mx-auto h-16 w-auto md:h-20"
						aria-hidden
					/>
					<blockquote className="mx-auto mt-10 max-w-3xl font-homemade-apple text-2xl font-normal leading-normal text-luxinc-text md:mt-12 md:text-3xl lg:text-4xl">
						&ldquo;{footer.quote}&rdquo;
					</blockquote>
					<p className="mt-8 font-diphylleia text-base font-normal text-luxinc-gold md:text-lg">
						{footer.attribution}
					</p>
				</div>
			) : null}

			<div
				className={
					showQuote
						? "bg-luxinc-panel px-6 py-10 text-center md:px-10 md:py-12 lg:px-16"
						: "bg-luxinc-bg px-6 py-10 text-center md:px-10 md:py-12 lg:px-16"
				}
			>
				<p className="font-diphylleia text-sm font-normal leading-relaxed text-luxinc-text md:text-base">
					<span className="tracking-wide text-luxinc-gold">LUXINC</span>
					{" — "}
					{footer.tagline}
				</p>
				<p className="mt-3 font-diphylleia text-sm font-normal leading-relaxed text-luxinc-text md:text-base">
					{footer.locations}
				</p>
				<p className="mt-3 font-diphylleia text-sm font-normal leading-relaxed md:text-base">
					<span className="text-luxinc-gold">{footer.copyrightLead}</span>{" "}
					<span className="text-luxinc-text">{footer.copyrightTail}</span>
				</p>
			</div>
		</footer>
	);
}
