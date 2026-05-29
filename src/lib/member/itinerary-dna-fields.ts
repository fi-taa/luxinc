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

function isMissingDnaColumnError(message: string): boolean {
	return (
		message.includes("reporting_period") ||
		message.includes("destination_category") ||
		message.includes("topic_tags")
	);
}

function mapPastItineraryRow(row: {
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

export async function fetchPastItinerariesForDna(
	supabase: SupabaseClient,
	profileId: string,
): Promise<PastItineraryDnaSource[]> {
	const extended = await supabase
		.from("member_itineraries")
		.select(
			"id,destination,travel_date_label,reporting_period,destination_category,topic_tags",
		)
		.eq("profile_id", profileId)
		.eq("kind", "past")
		.order("sort_order", { ascending: true });

	if (!extended.error) {
		return (extended.data ?? []).map(mapPastItineraryRow);
	}

	if (!isMissingDnaColumnError(extended.error.message)) {
		throw new Error(extended.error.message);
	}

	const legacy = await supabase
		.from("member_itineraries")
		.select("id,destination,travel_date_label")
		.eq("profile_id", profileId)
		.eq("kind", "past")
		.order("sort_order", { ascending: true });

	if (legacy.error) {
		throw new Error(legacy.error.message);
	}

	return (legacy.data ?? []).map(mapPastItineraryRow);
}

export interface ItineraryDnaInsert {
	reporting_period: string;
	destination_category: string | null;
	topic_tags: string[];
}

export async function insertItineraryWithDnaFields(
	supabase: SupabaseClient,
	baseRow: Record<string, unknown>,
	dnaFields: ItineraryDnaInsert,
) {
	const fullRow = { ...baseRow, ...dnaFields };
	const full = await supabase.from("member_itineraries").insert(fullRow).select("id").single();

	if (!full.error) {
		return full;
	}

	if (!isMissingDnaColumnError(full.error.message)) {
		return full;
	}

	return supabase.from("member_itineraries").insert(baseRow).select("id").single();
}
