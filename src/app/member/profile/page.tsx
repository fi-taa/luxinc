import { MemberProfilePanel } from "@/components/member/profile/member-profile-panel";
import { fetchMemberProfile } from "@/lib/member/member-profile.server";

export default async function MemberProfilePage() {
	let profile: Awaited<ReturnType<typeof fetchMemberProfile>> | null = null;
	let error: string | null = null;

	try {
		profile = await fetchMemberProfile();
	} catch (e) {
		error = e instanceof Error ? e.message : "Failed to load profile.";
	}

	return <MemberProfilePanel profile={profile} error={error} />;
}
