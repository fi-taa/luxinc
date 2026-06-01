import type { SupabaseClient } from "@supabase/supabase-js";
import { computeMemberTravelDna } from "./compute-member-travel-dna";
import type { TravelDnaBundle } from "./mappers";
import {
	countMemberJourneysByStatus,
	fetchPastItinerariesForDna,
} from "./itinerary-dna-fields";

export async function loadMemberTravelDna(
	supabase: SupabaseClient,
	profileId: string,
	activePeriodOverride?: string,
): Promise<TravelDnaBundle> {
	const { data: profile, error: profileError } = await supabase
		.from("profiles")
		.select("travel_dna_period")
		.eq("id", profileId)
		.maybeSingle();

	if (profileError) {
		throw new Error(profileError.message);
	}

	const [pastItineraries, bookedJourneyCount] = await Promise.all([
		fetchPastItinerariesForDna(supabase, profileId),
		countMemberJourneysByStatus(supabase, profileId, "booked"),
	]);
	const activePeriod =
		activePeriodOverride?.trim() || profile?.travel_dna_period?.trim() || null;

	return computeMemberTravelDna(pastItineraries, activePeriod, bookedJourneyCount);
}

export async function recomputeMemberTravelDna(
	supabase: SupabaseClient,
	profileId: string,
	activePeriodOverride?: string,
): Promise<TravelDnaBundle> {
	const bundle = await loadMemberTravelDna(supabase, profileId, activePeriodOverride);

	const { error } = await supabase
		.from("profiles")
		.update({ travel_dna_period: bundle.activePeriod })
		.eq("id", profileId);

	if (error) {
		throw new Error(error.message);
	}

	return bundle;
}
