import type { ItineraryStop } from "@/lib/member-content";

export interface JourneyStopJson {
	time: string;
	activity: string;
}

export function parseJourneyStops(value: unknown): ItineraryStop[] {
	if (!Array.isArray(value)) {
		return [];
	}

	return value
		.map((item) => {
			if (!item || typeof item !== "object") {
				return null;
			}
			const row = item as Record<string, unknown>;
			const time = typeof row.time === "string" ? row.time.trim() : "";
			const activity = typeof row.activity === "string" ? row.activity.trim() : "";
			if (!time || !activity) {
				return null;
			}
			return { time, activity };
		})
		.filter((stop): stop is ItineraryStop => stop !== null);
}

export function buildJourneyStopsJson(
	stops: { stopTime: string; activity: string }[],
): JourneyStopJson[] {
	return stops.map((stop) => ({
		time: stop.stopTime.trim(),
		activity: stop.activity.trim(),
	}));
}
