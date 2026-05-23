import { Lock, Mail, MessageCircle } from "lucide-react";
import type {
	ConfidentialContactLine,
	OfficeLocationCard,
} from "@/lib/landing-content";
import { offices } from "@/lib/landing-content";
import { FillImage } from "./fill-image";
import { SectionShell } from "./section-shell";
import { SectionTitle } from "./section-title";
import { cn } from "@/lib/utils";

const imageBleedTopClasses = {
	subtle: {
		image: "-mt-8 md:-mt-10 lg:-mt-12",
		text: "-mt-8 pt-2 md:-mt-10 md:pt-3",
	},
	full: {
		image: "-mt-12 md:-mt-16 lg:-mt-20",
		text: "-mt-10 pt-2 md:-mt-12 md:pt-3",
	},
} as const;

function OfficeLocationPanel({
	office,
	imageAspect,
	imageBleedTop = false,
	fillHeight = false,
}: {
	office: OfficeLocationCard;
	imageAspect: string;
	imageBleedTop?: false | keyof typeof imageBleedTopClasses;
	fillHeight?: boolean;
}) {
	const bleed = imageBleedTop ? imageBleedTopClasses[imageBleedTop] : null;

	return (
		<article
			className={cn(
				"relative flex flex-col overflow-visible bg-luxinc-panel",
				fillHeight ? "min-h-0 flex-1" : "shrink-0",
			)}
		>
			<div
				className={cn(
					"relative z-10 w-full px-4 md:px-6 lg:px-8",
					fillHeight ? "min-h-0 flex-1" : "shrink-0",
					bleed?.image,
				)}
			>
				<FillImage
					containerClassName={cn(
						"relative w-full overflow-hidden",
						fillHeight ? "h-full min-h-[220px]" : imageAspect,
					)}
					src={office.image}
					alt={office.imageAlt}
					className="object-cover object-center"
					sizes="(max-width: 1024px) 100vw, 50vw"
				/>
			</div>
			<div
				className={cn(
					"relative z-20 flex shrink-0 flex-col justify-center bg-luxinc-panel px-6 py-8 text-center md:px-8 md:py-10",
					bleed?.text,
				)}
			>
				<h3 className="font-diphylleia text-lg font-normal tracking-wide text-luxinc-gold md:text-xl">
					{office.heading}
				</h3>
				<div className="mt-5 space-y-1.5 font-diphylleia text-sm font-normal leading-relaxed text-luxinc-text md:text-base">
					{office.lines.map((line) => (
						<p key={line}>{line}</p>
					))}
				</div>
			</div>
		</article>
	);
}

function ContactIcon({ icon }: { icon: ConfidentialContactLine["icon"] }) {
	const className = "h-4 w-4 shrink-0 text-luxinc-text md:h-5 md:w-5";

	switch (icon) {
		case "mail":
			return <Mail className={className} aria-hidden />;
		case "whatsapp":
			return <MessageCircle className={className} aria-hidden />;
		case "lock":
			return <Lock className={className} aria-hidden />;
	}
}

function ConfidentialPanel() {
	return (
		<article className="flex min-h-0 flex-1 flex-col justify-center bg-[#221f1a] px-6 py-8 md:px-8 md:py-10">
			<ul className="flex flex-col items-center gap-6 md:gap-7">
				{offices.confidential.lines.map((line) => (
					<li
						key={line.text}
						className="flex items-center justify-center gap-3 text-center md:gap-4"
					>
						<ContactIcon icon={line.icon} />
						{line.href ? (
							<a
								href={line.href}
								className="font-diphylleia text-sm font-normal leading-relaxed text-luxinc-text transition-colors hover:text-luxinc-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold md:text-base"
							>
								{line.text}
							</a>
						) : (
							<p className="font-diphylleia text-sm font-normal leading-relaxed text-luxinc-text md:text-base">
								{line.text}
							</p>
						)}
					</li>
				))}
			</ul>
		</article>
	);
}

export function AddressSection() {
	return (
		<SectionShell
			id="contact"
			ariaLabelledBy="contact-heading"
			className="font-diphylleia"
		>
			<div className="grid grid-cols-1 gap-4 overflow-visible lg:grid-cols-2 lg:items-stretch lg:gap-5">
				<div className="flex min-h-0 flex-col gap-10 overflow-visible md:gap-12 lg:gap-14">
					<SectionTitle
						id="contact-heading"
						title={offices.title}
						subtitle={offices.subtitle}
						align="left"
						className="relative z-30 shrink-0"
					/>
					<OfficeLocationPanel
						office={offices.addis}
						imageAspect="aspect-4/5 min-h-[280px]"
						fillHeight
						imageBleedTop="subtle"
					/>
				</div>

				<div className="flex min-h-0 flex-col gap-4 overflow-visible pt-14 lg:gap-5 lg:pt-20">
					<OfficeLocationPanel
						office={offices.dubai}
						imageAspect="aspect-[16/10] min-h-[200px]"
						imageBleedTop="full"
					/>
					<ConfidentialPanel />
				</div>
			</div>
		</SectionShell>
	);
}
