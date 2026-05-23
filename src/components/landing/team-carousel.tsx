"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PersonCard } from "@/lib/landing-content";
import { FillImage } from "./fill-image";
import { cn } from "@/lib/utils";

interface TeamCarouselProps {
	members: PersonCard[];
}

interface TeamCardProps {
	member: PersonCard;
	variant: "center" | "side";
}

function TeamCard({ member, variant }: TeamCardProps) {
	const isCenter = variant === "center";

	return (
		<article
			className={cn(
				"relative shrink-0 overflow-hidden",
				isCenter
					? "aspect-3/4 w-[min(72vw,340px)] sm:w-[300px] lg:w-[340px]"
					: "hidden aspect-3/4 w-[200px] opacity-80 sm:block md:w-[240px] lg:w-[260px]",
			)}
		>
			<FillImage
				containerClassName="absolute inset-0 bg-luxinc-bg"
				src={member.image}
				alt={member.imageAlt}
				className={cn(
					"object-cover object-center",
					!isCenter && "brightness-75",
				)}
				sizes={isCenter ? "(max-width: 640px) 72vw, 340px" : "260px"}
			/>
			<div
				className={cn(
					"absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-black/10",
					!isCenter && "from-black/95 via-black/70 to-black/40",
				)}
			/>
			<div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
				<h3
					className={cn(
						"font-sans font-semibold text-luxinc-text",
						isCenter ? "text-base md:text-lg" : "text-sm md:text-base",
					)}
				>
					{member.name}
				</h3>
				<p
					className={cn(
						"mt-1.5 font-sans font-normal leading-relaxed text-luxinc-text/90",
						isCenter ? "text-xs md:text-sm" : "text-[11px] md:text-xs",
					)}
				>
					{member.role}
				</p>
			</div>
		</article>
	);
}

function CarouselNavButton({
	direction,
	onClick,
}: {
	direction: "prev" | "next";
	onClick: () => void;
}) {
	const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
	const label =
		direction === "prev" ? "Previous team member" : "Next team member";

	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={label}
			className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-luxinc-text/80 text-luxinc-text transition-colors hover:border-luxinc-text hover:bg-luxinc-text/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold focus-visible:ring-offset-2 focus-visible:ring-offset-luxinc-bg md:h-11 md:w-11"
		>
			<Icon className="h-5 w-5 stroke-[1.5]" aria-hidden />
		</button>
	);
}

export function TeamCarousel({ members }: TeamCarouselProps) {
	const [activeIndex, setActiveIndex] = useState(1);
	const count = members.length;

	function goPrev() {
		setActiveIndex((index) => (index - 1 + count) % count);
	}

	function goNext() {
		setActiveIndex((index) => (index + 1) % count);
	}

	const prevMember = members[(activeIndex - 1 + count) % count];
	const centerMember = members[activeIndex];
	const nextMember = members[(activeIndex + 1) % count];

	return (
		<div className="mt-14 lg:mt-20">
			<div className="flex items-end justify-center gap-3 sm:gap-4 md:gap-6">
				<TeamCard member={prevMember} variant="side" />
				<CarouselNavButton direction="prev" onClick={goPrev} />
				<TeamCard member={centerMember} variant="center" />
				<CarouselNavButton direction="next" onClick={goNext} />
				<TeamCard member={nextMember} variant="side" />
			</div>
		</div>
	);
}
