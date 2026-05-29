import type { SupabaseClient } from "@supabase/supabase-js";
import type { AdminUserRecord } from "@/lib/admin/admin-users";
import { getMemberExtensionDefaults } from "@/lib/admin/admin-users";
import { fetchMemberPortalSnapshot } from "@/lib/member/member-data.server";
import { createSupabaseAuthServerClient } from "@/lib/supabase/auth-server";
import { travelDnaPeriods } from "@/lib/travel-dna-content";
import {
	mapProfileToAdminUser,
	type ProfileRow,
} from "@/lib/admin/profiles";

const profileSelect =
	"id,email,full_name,phone,avatar_url,role,status,travel_dna_period,joined_at";

async function fetchMemberExtension(
	profileId: string,
	client: SupabaseClient,
): Promise<ReturnType<typeof getMemberExtensionDefaults>> {
	try {
		const snapshot = await fetchMemberPortalSnapshot(profileId, client);
		return {
			upcoming: snapshot.upcoming,
			pastJourneys: snapshot.pastJourneys,
			referralProgrammes: snapshot.referralProgrammes,
			travelDnaPeriod:
				snapshot.travelDna.activePeriod as AdminUserRecord["travelDnaPeriod"],
			locationBars: snapshot.travelDna.locationBars,
			locationLegend: snapshot.travelDna.locationLegend,
			preferredDestinations: snapshot.travelDna.preferredDestinations,
			weakestTopics: snapshot.travelDna.weakestTopics,
			strongestTopics: snapshot.travelDna.strongestTopics,
		};
	} catch {
		return getMemberExtensionDefaults(profileId);
	}
}

export async function fetchProfileById(
	id: string,
	client?: SupabaseClient,
): Promise<AdminUserRecord | null> {
	const supabase = client ?? (await createSupabaseAuthServerClient());
	const { data, error } = await supabase
		.from("profiles")
		.select(profileSelect)
		.eq("id", id)
		.maybeSingle();

	if (error) throw new Error(error.message);
	if (!data) return null;

	const row = data as ProfileRow;
	if (row.role !== "member") {
		return mapProfileToAdminUser(row, {
			upcoming: [],
			pastJourneys: [],
			referralProgrammes: [],
			travelDnaPeriod: travelDnaPeriods[0],
			locationBars: [],
			locationLegend: [],
			preferredDestinations: [],
			weakestTopics: [],
			strongestTopics: [],
		});
	}

	const extension = await fetchMemberExtension(row.id, supabase);
	return mapProfileToAdminUser(row, extension);
}
