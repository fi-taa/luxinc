import Image from "next/image";
import { AuthCtaButton } from "@/components/auth/auth-cta-button";
import { hero } from "@/lib/landing-content";

export function HeroSection() {
	return (
		<section
			id="hero"
			className="relative flex min-h-screen items-center justify-center"
			style={{ position: "relative" }}
			aria-label="Hero"
		>
			<Image
				src={hero.image}
				alt={hero.imageAlt}
				fill
				priority
				className="object-cover"
				sizes="100vw"
			/>
			<div className="absolute inset-0 bg-black/50" />
			<div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/30 to-black/55" />
			<div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-col items-center px-6 pb-20 pt-32 text-center md:px-10 md:pt-36 lg:px-16">
				<p className="font-verietta text-[clamp(1.25rem,4vw,32px)] font-normal leading-none text-luxinc-gold">
					{hero.location}
				</p>
				<h1 className="mt-8 w-full max-w-5xl font-verietta font-normal tracking-normal text-luxinc-text">
					<span className="mx-auto block w-max max-w-full whitespace-nowrap text-[clamp(1rem,5.5vw,72px)] leading-[1.23] lg:leading-[88px]">
						Time is the ultimate{" "}
						<span className="text-luxinc-gold">LUXURY.</span>
					</span>
					<span className="mx-auto mt-2 block w-max max-w-full whitespace-nowrap text-[clamp(1rem,5.5vw,72px)] leading-[1.23] lg:leading-[88px]">
						We architect its <span className="text-luxinc-gold">MEMORY.</span>
					</span>
				</h1>
				<p className="mt-8 max-w-3xl font-diphylleia text-[clamp(1.125rem,2.5vw,24px)] font-normal leading-none text-luxinc-text">
					{hero.subheadline}
				</p>
				<div className="mt-10 flex flex-wrap items-center justify-center gap-4">
					<AuthCtaButton
						action="sign-up"
						variant="solid"
						className="h-12 min-w-[200px] px-10 text-sm"
					>
						{hero.cta}
					</AuthCtaButton>
				</div>
			</div>
		</section>
	);
}
