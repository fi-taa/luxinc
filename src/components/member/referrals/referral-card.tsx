import Image from "next/image";
import type { ReferralProgramme } from "@/lib/referral-content";
import { ReferralActions } from "./referral-actions";

interface ReferralCardProps {
	programme: ReferralProgramme;
}

export function ReferralCard({ programme }: ReferralCardProps) {
	return (
		<article className="overflow-hidden rounded-xl border border-luxinc-gold/35 bg-[#141414] sm:flex">
			<figure className="flex min-h-[260px] w-full items-center justify-center bg-black px-5 py-8 sm:w-[44%] sm:min-h-[300px] sm:px-8">
				<Image
					src={programme.image}
					alt={programme.imageAlt}
					width={360}
					height={460}
					className="h-auto w-full max-w-[300px] object-contain"
					sizes="(max-width: 640px) 90vw, 360px"
				/>
			</figure>
			<div className="flex flex-1 flex-col justify-center gap-7 p-6 sm:p-8 md:gap-8 md:py-10 md:pr-10 md:pl-8">
				<div className="space-y-4">
					<h2 className="font-diphylleia text-[1.35rem] font-normal leading-snug text-luxinc-gold md:text-[1.65rem] lg:text-[1.75rem]">
						{programme.title}
					</h2>
					<p className="max-w-md font-diphylleia text-sm leading-relaxed text-luxinc-text/80 md:text-base">
						{programme.description}
					</p>
				</div>
				<ReferralActions referralLink={programme.referralLink} />
			</div>
		</article>
	);
}
