import type { SupabaseClient } from "@supabase/supabase-js";
import { fetchPastItinerariesForDna } from "./itinerary-dna-fields";
import {
	TRAVEL_DNA_ALL_PERIODS,
	slugifyTravelDnaKey,
	travelDnaLocationColors,
	travelDnaTopicDefinitions,
} from "./travel-dna-taxonomy";

function countByKey<T extends string>(
	items: T[],
): Map<T, number> {
	const counts = new Map<T, number>();
	for (const item of items) {
		counts.set(item, (counts.get(item) ?? 0) + 1);
	}
	return counts;
}

function sortPeriodOptions(periods: string[]): string[] {
	return [...periods].sort((a, b) => {
		const dateA = Date.parse(a.replace(/^for\s/i, "1 "));
		const dateB = Date.parse(b.replace(/^for\s/i, "1 "));
		if (!Number.isNaN(dateA) && !Number.isNaN(dateB)) {
			return dateB - dateA;
		}
		return b.localeCompare(a);
	});
}

export async function recomputeMemberTravelDna(
	supabase: SupabaseClient,
	profileId: string,
	activePeriodOverride?: string,
): Promise<void> {
	const pastItineraries = await fetchPastItinerariesForDna(supabase, profileId);
	const periodLabels = sortPeriodOptions(
		[
			...new Set(
				pastItineraries
					.map((row) => row.reportingPeriod)
					.filter((period): period is string => Boolean(period?.trim())),
			),
		],
	);

	const periodOptions =
		periodLabels.length > 0
			? [TRAVEL_DNA_ALL_PERIODS, ...periodLabels]
			: [TRAVEL_DNA_ALL_PERIODS];

	const { data: settingsRow } = await supabase
		.from("member_travel_dna_settings")
		.select("active_period")
		.eq("profile_id", profileId)
		.maybeSingle();

	const requestedPeriod = activePeriodOverride?.trim() || settingsRow?.active_period;
	const activePeriod =
		requestedPeriod && periodOptions.includes(requestedPeriod)
			? requestedPeriod
			: periodOptions[0];

	const scopedPast =
		activePeriod === TRAVEL_DNA_ALL_PERIODS
			? pastItineraries
			: pastItineraries.filter((row) => row.reportingPeriod === activePeriod);

	const previousPeriod = periodLabels.find((period) => period !== activePeriod);
	const previousScoped =
		previousPeriod && activePeriod !== TRAVEL_DNA_ALL_PERIODS
			? pastItineraries.filter((row) => row.reportingPeriod === previousPeriod)
			: [];

	await Promise.all([
		supabase.from("member_travel_dna_locations").delete().eq("profile_id", profileId),
		supabase.from("member_travel_dna_destinations").delete().eq("profile_id", profileId),
		supabase.from("member_travel_dna_topics").delete().eq("profile_id", profileId),
	]);

	if (scopedPast.length === 0) {
		await supabase.from("member_travel_dna_settings").upsert(
			{
				profile_id: profileId,
				active_period: activePeriod,
				period_options: periodOptions,
				updated_at: new Date().toISOString(),
			},
			{ onConflict: "profile_id" },
		);
		return;
	}

	const destinationCounts = countByKey(
		scopedPast.map((row) => row.destination.trim()).filter(Boolean),
	);
	const totalTrips = scopedPast.length;

	const locationEntries = [...destinationCounts.entries()]
		.sort((a, b) => b[1] - a[1])
		.map(([destination, count], index) => ({
			profile_id: profileId,
			external_key: slugifyTravelDnaKey(destination),
			label: destination,
			percent: Math.round((count / totalTrips) * 100),
			color: travelDnaLocationColors[index % travelDnaLocationColors.length],
			sort_order: index,
		}));

	const categoryCounts = countByKey(
		scopedPast
			.map((row) => row.destinationCategory?.trim() ?? "")
			.filter((category): category is string => Boolean(category)),
	);

	const previousCategoryCounts = countByKey(
		previousScoped
			.map((row) => row.destinationCategory?.trim() ?? "")
			.filter((category): category is string => Boolean(category)),
	);

	const destinationEntries = [...categoryCounts.entries()]
		.sort((a, b) => b[1] - a[1])
		.map(([name, count], index) => {
			const previousCount = previousCategoryCounts.get(name) ?? 0;
			const trend = count >= previousCount ? ("up" as const) : ("down" as const);
			const share = Math.round((count / totalTrips) * 100);

			return {
				profile_id: profileId,
				external_key: slugifyTravelDnaKey(name),
				rank: index + 1,
				name,
				points_label: `${count} ${count === 1 ? "trip" : "trips"}`,
				correct_percent: share,
				trend,
				sort_order: index,
			};
		});

	const topicCounts = countByKey(
		scopedPast.flatMap((row) => row.topicTags).filter(Boolean),
	);

	const topicScores = [...topicCounts.entries()]
		.map(([name, count]) => {
			const definition = travelDnaTopicDefinitions.find(
				(topic) => topic.name.toLowerCase() === name.toLowerCase(),
			);
			const slug = definition?.slug ?? slugifyTravelDnaKey(name);
			const percent = Math.round((count / totalTrips) * 100);

			return {
				name: definition?.name ?? name,
				slug,
				percent,
				image_url: definition?.image ?? "/images/sd2.png",
				image_alt: definition?.imageAlt ?? name,
			};
		})
		.sort((a, b) => a.percent - b.percent);

	const weakestTopics = topicScores.slice(0, 3);
	const strongestTopics = [...topicScores].reverse().slice(0, 3);

	const topicEntries = [
		...weakestTopics.map((topic, index) => ({
			profile_id: profileId,
			external_key: topic.slug,
			kind: "weakest" as const,
			name: topic.name,
			percent: topic.percent,
			image_url: topic.image_url,
			image_alt: topic.image_alt,
			sort_order: index,
		})),
		...strongestTopics.map((topic, index) => ({
			profile_id: profileId,
			external_key: topic.slug,
			kind: "strongest" as const,
			name: topic.name,
			percent: topic.percent,
			image_url: topic.image_url,
			image_alt: topic.image_alt,
			sort_order: index,
		})),
	];

	const settingsResult = await supabase.from("member_travel_dna_settings").upsert(
		{
			profile_id: profileId,
			active_period: activePeriod,
			period_options: periodOptions,
			updated_at: new Date().toISOString(),
		},
		{ onConflict: "profile_id" },
	);

	if (settingsResult.error) {
		throw new Error(settingsResult.error.message);
	}

	if (locationEntries.length > 0) {
		const result = await supabase
			.from("member_travel_dna_locations")
			.insert(locationEntries);
		if (result.error) {
			throw new Error(result.error.message);
		}
	}

	if (destinationEntries.length > 0) {
		const result = await supabase
			.from("member_travel_dna_destinations")
			.insert(destinationEntries);
		if (result.error) {
			throw new Error(result.error.message);
		}
	}

	if (topicEntries.length > 0) {
		const result = await supabase.from("member_travel_dna_topics").insert(topicEntries);
		if (result.error) {
			throw new Error(result.error.message);
		}
	}
}
