"use client";

import Image from "next/image";
import { useLandingContent } from "@/components/landing/landing-content-provider";
import { BlackBookForm } from "./black-book-form";
import { SectionShell } from "./section-shell";

const blackBookGradient =
	"linear-gradient(90deg, rgba(27, 24, 19, 0) 0%, #1B1813 53.85%, rgba(27, 24, 19, 0) 100%)";

export function BlackBookSection() {
	const { blackBook } = useLandingContent();
	return (
		<SectionShell
			bordered
			ariaLabelledBy="black-book-heading"
			className="py-0 md:py-0 lg:py-0 border-t border-none"
		>
			<div
				className="relative left-1/2 w-screen -translate-x-1/2"
				style={{ background: blackBookGradient }}
			>
				<div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-16 text-center md:py-20 lg:py-24">
					<Image
						src="/images/material-symbols_crown.png"
						alt=""
						width={79}
						height={79}
						className="h-9 w-9 md:h-11 md:w-11"
						aria-hidden
					/>

					<h2
						id="black-book-heading"
						className="mx-auto mt-6 w-max max-w-full font-edu-guides text-[50px] font-normal not-italic leading-none tracking-normal text-luxinc-gold max-sm:mt-8 max-sm:text-[clamp(1.5rem,8vw,50px)] md:mt-8"
					>
						{blackBook.title}
					</h2>

					<p className="mt-4 max-w-md font-serif text-sm font-normal italic text-luxinc-text md:mt-5 md:text-base">
						{blackBook.subtitle}
					</p>
					<div className="mt-10 w-full max-w-[480px] md:mt-12">
						<BlackBookForm
							placeholder={blackBook.placeholder}
							buttonLabel={blackBook.buttonLabel}
						/>
					</div>
				</div>
			</div>
		</SectionShell>
	);
}
