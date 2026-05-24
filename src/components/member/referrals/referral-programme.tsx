import { referralProgrammes } from "@/lib/referral-content";
import { ReferralCard } from "./referral-card";

export function ReferralProgramme() {
	return (
		<section aria-labelledby="referral-programme-heading" className="space-y-10">
			<h1 id="referral-programme-heading" className="sr-only">
				Referral Programme
			</h1>
			{referralProgrammes.map((programme) => (
				<ReferralCard key={programme.id} programme={programme} />
			))}
		</section>
	);
}
