import { ReferralProgrammePanel } from "@/components/member/referrals/referral-programme-panel";
import { fetchMemberReferrals } from "@/lib/member/member-data.server";
import type { ReferralProgramme as ReferralProgrammeItem } from "@/lib/referral-content";

export default async function ReferralsPage() {
	let programmes: ReferralProgrammeItem[] = [];
	let error: string | null = null;

	try {
		programmes = await fetchMemberReferrals();
	} catch (e) {
		error = e instanceof Error ? e.message : "Failed to load referral programmes.";
	}

	return <ReferralProgrammePanel programmes={programmes} error={error} />;
}
