import type { SupabaseClient } from "@supabase/supabase-js";
import { parseJourneyStops } from "./journey-stops";
import { deriveReportingPeriod } from "./reporting-period";
import type { UpcomingJourneyRow } from "./db-types";

export async function fulfillBookedJourneyFromCatalog(
	supabase: SupabaseClient,
	profileId: string,
	catalog: UpcomingJourneyRow,
): Promise<void> {
	const { data: existing } = await supabase
		.from("member_journeys")
		.select("id")
		.eq("profile_id", profileId)
		.eq("upcoming_journey_id", catalog.id)
		.maybeSingle();

	if (existing) {
		return;
	}

	const { count } = await supabase
		.from("member_journeys")
		.select("id", { count: "exact", head: true })
		.eq("profile_id", profileId);

	const stops = parseJourneyStops(catalog.stops);
	const reportingPeriod = deriveReportingPeriod(catalog.travel_date_label);

	const { error } = await supabase.from("member_journeys").insert({
		profile_id: profileId,
		upcoming_journey_id: catalog.id,
		journey_status: "booked",
		destination: catalog.destination,
		travel_date_label: catalog.travel_date_label,
		reporting_period: reportingPeriod,
		destination_category: null,
		topic_tags: [],
		image_url: catalog.image_url,
		image_alt: catalog.image_alt,
		stops,
		sort_order: count ?? 0,
	});

	if (error) {
		throw new Error(error.message);
	}
}
