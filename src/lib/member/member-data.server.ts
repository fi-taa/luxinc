import type { SupabaseClient } from "@supabase/supabase-js";
import type { ConciergeChatMessage } from "@/lib/concierge-chat-content";
import type { UpcomingItinerary } from "@/lib/member-content";
import type { PastJourney } from "@/lib/past-journeys-content";
import type { ReferralProgramme } from "@/lib/referral-content";
import { createSupabaseAuthServerClient } from "@/lib/supabase/auth-server";
import type {
	ConciergeMessageRow,
	MemberItineraryRow,
	MemberReferralRow,
	MemberTravelDnaDestinationRow,
	MemberTravelDnaLocationRow,
	MemberTravelDnaSettingsRow,
	MemberTravelDnaTopicRow,
} from "./db-types";
import {
	mapConciergeRow,
	mapItineraryRow,
	mapPastJourneyRow,
	mapReferralRow,
	mapTravelDnaBundle,
	type TravelDnaBundle,
} from "./mappers";
import { recomputeMemberTravelDna } from "./recompute-travel-dna";

const itinerarySelect =
	"id,profile_id,kind,destination,travel_date_label,image_url,image_alt,sort_order,member_itinerary_stops(id,itinerary_id,sort_order,stop_time,activity)";

async function getAuthenticatedProfileId(
	supabase: SupabaseClient,
	profileId?: string,
): Promise<string> {
	if (profileId) {
		return profileId;
	}

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();
	if (error || !user) {
		throw new Error("Not authenticated");
	}
	return user.id;
}

export async function fetchMemberItineraries(
	kind: "upcoming" | "past",
	profileId?: string,
	client?: SupabaseClient,
): Promise<UpcomingItinerary[] | PastJourney[]> {
	const supabase = client ?? (await createSupabaseAuthServerClient());
	const resolvedProfileId = await getAuthenticatedProfileId(supabase, profileId);

	const { data, error } = await supabase
		.from("member_itineraries")
		.select(itinerarySelect)
		.eq("profile_id", resolvedProfileId)
		.eq("kind", kind)
		.order("sort_order", { ascending: true });

	if (error) {
		throw new Error(error.message);
	}

	const rows = (data ?? []) as MemberItineraryRow[];

	if (kind === "past") {
		return rows.map(mapPastJourneyRow);
	}
	return rows.map(mapItineraryRow);
}

export async function fetchMemberReferrals(
	profileId?: string,
	client?: SupabaseClient,
): Promise<ReferralProgramme[]> {
	const supabase = client ?? (await createSupabaseAuthServerClient());
	const resolvedProfileId = await getAuthenticatedProfileId(supabase, profileId);

	const { data, error } = await supabase
		.from("member_referrals")
		.select("*")
		.eq("profile_id", resolvedProfileId)
		.order("sort_order", { ascending: true });

	if (error) {
		throw new Error(error.message);
	}

	return ((data ?? []) as MemberReferralRow[]).map(mapReferralRow);
}

export async function fetchMemberTravelDna(
	profileId?: string,
	client?: SupabaseClient,
): Promise<TravelDnaBundle> {
	const supabase = client ?? (await createSupabaseAuthServerClient());
	const resolvedProfileId = await getAuthenticatedProfileId(supabase, profileId);

	await recomputeMemberTravelDna(supabase, resolvedProfileId);

	const [settingsResult, locationsResult, destinationsResult, topicsResult] =
		await Promise.all([
			supabase
				.from("member_travel_dna_settings")
				.select("profile_id,active_period,period_options")
				.eq("profile_id", resolvedProfileId)
				.maybeSingle(),
			supabase
				.from("member_travel_dna_locations")
				.select("*")
				.eq("profile_id", resolvedProfileId)
				.order("sort_order", { ascending: true }),
			supabase
				.from("member_travel_dna_destinations")
				.select("*")
				.eq("profile_id", resolvedProfileId)
				.order("sort_order", { ascending: true }),
			supabase
				.from("member_travel_dna_topics")
				.select("*")
				.eq("profile_id", resolvedProfileId)
				.order("sort_order", { ascending: true }),
		]);

	const firstError =
		settingsResult.error ??
		locationsResult.error ??
		destinationsResult.error ??
		topicsResult.error;
	if (firstError) {
		throw new Error(firstError.message);
	}

	const settings = settingsResult.data as MemberTravelDnaSettingsRow | null;
	const periodOptions = Array.isArray(settings?.period_options)
		? settings.period_options.filter((item): item is string => typeof item === "string")
		: [];

	return mapTravelDnaBundle(
		settings
			? { ...settings, period_options: periodOptions }
			: null,
		(locationsResult.data ?? []) as MemberTravelDnaLocationRow[],
		(destinationsResult.data ?? []) as MemberTravelDnaDestinationRow[],
		(topicsResult.data ?? []) as MemberTravelDnaTopicRow[],
	);
}

export async function fetchConciergeMessages(
	profileId?: string,
	client?: SupabaseClient,
): Promise<ConciergeChatMessage[]> {
	const supabase = client ?? (await createSupabaseAuthServerClient());
	const resolvedProfileId = await getAuthenticatedProfileId(supabase, profileId);

	const { data, error } = await supabase
		.from("concierge_messages")
		.select("*")
		.eq("profile_id", resolvedProfileId)
		.order("created_at", { ascending: true });

	if (error) {
		throw new Error(error.message);
	}

	return ((data ?? []) as ConciergeMessageRow[]).map(mapConciergeRow);
}

export interface MemberPortalSnapshot {
	upcoming: UpcomingItinerary[];
	pastJourneys: PastJourney[];
	referralProgrammes: ReferralProgramme[];
	travelDna: TravelDnaBundle;
	conciergeMessages: ConciergeChatMessage[];
}

export async function fetchMemberPortalSnapshot(
	profileId: string,
	client: SupabaseClient,
): Promise<MemberPortalSnapshot> {
	const [upcoming, pastJourneys, referralProgrammes, travelDna, conciergeMessages] =
		await Promise.all([
			fetchMemberItineraries("upcoming", profileId, client) as Promise<
				UpcomingItinerary[]
			>,
			fetchMemberItineraries("past", profileId, client) as Promise<PastJourney[]>,
			fetchMemberReferrals(profileId, client),
			fetchMemberTravelDna(profileId, client),
			fetchConciergeMessages(profileId, client),
		]);

	return {
		upcoming,
		pastJourneys,
		referralProgrammes,
		travelDna,
		conciergeMessages,
	};
}
