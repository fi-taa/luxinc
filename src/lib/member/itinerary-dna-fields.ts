import type { SupabaseClient } from "@supabase/supabase-js";
import { deriveReportingPeriod } from "./reporting-period";

export interface PastItineraryDnaSource {
	id: string;
	destination: string;
	travelDateLabel: string;
	reportingPeriod: string;
	destinationCategory: string | null;
	topicTags: string[];
}

function mapPastJourneyRow(row: {
	id: string;
	destination: string;
	travel_date_label: string;
	reporting_period?: string | null;
	destination_category?: string | null;
	topic_tags?: string[] | null;
}): PastItineraryDnaSource {
	return {
		id: row.id,
		destination: row.destination,
		travelDateLabel: row.travel_date_label,
		reportingPeriod:
			row.reporting_period?.trim() ||
			deriveReportingPeriod(row.travel_date_label),
		destinationCategory: row.destination_category?.trim() || null,
		topicTags: row.topic_tags ?? [],
	};
}

export async function countMemberJourneysByStatus(
	supabase: SupabaseClient,
	profileId: string,
	status: "booked" | "completed",
): Promise<number> {
	const { count, error } = await supabase
		.from("member_journeys")
		.select("id", { count: "exact", head: true })
		.eq("profile_id", profileId)
		.eq("journey_status", status);

	if (error) {
		throw new Error(error.message);
	}

	return count ?? 0;
}

export async function fetchPastItinerariesForDna(
	supabase: SupabaseClient,
	profileId: string,
): Promise<PastItineraryDnaSource[]> {
	const { data, error } = await supabase
		.from("member_journeys")
		.select(
			"id,destination,travel_date_label,reporting_period,destination_category,topic_tags",
		)
		.eq("profile_id", profileId)
		.eq("journey_status", "completed")
		.order("sort_order", { ascending: true });

	if (error) {
		throw new Error(error.message);
	}

	return (data ?? []).map(mapPastJourneyRow);
}

export interface MemberJourneyInsert {
	profile_id: string;
	destination: string;
	travel_date_label: string;
	reporting_period: string;
	destination_category: string | null;
	topic_tags: string[];
	image_url: string | null;
	image_alt: string;
	stops: { time: string; activity: string }[];
	sort_order: number;
}

export async function insertMemberJourney(
	supabase: SupabaseClient,
	row: MemberJourneyInsert,
) {
	return supabase.from("member_journeys").insert(row).select("id").single();
}
