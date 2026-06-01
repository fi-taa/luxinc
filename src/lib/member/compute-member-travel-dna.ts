import type { TravelDnaBundle } from "./mappers";
import type { PastItineraryDnaSource } from "./itinerary-dna-fields";
import {
	TRAVEL_DNA_ALL_PERIODS,
	slugifyTravelDnaKey,
	travelDnaLocationColors,
	travelDnaTopicDefinitions,
} from "./travel-dna-taxonomy";

function countByKey<T extends string>(items: T[]): Map<T, number> {
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

export function computeMemberTravelDna(
	pastItineraries: PastItineraryDnaSource[],
	activePeriodFromProfile: string | null,
	bookedJourneyCount = 0,
): TravelDnaBundle {
	const completedJourneyCount = pastItineraries.length;
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

	const requestedPeriod = activePeriodFromProfile?.trim();
	const activePeriod =
		requestedPeriod && periodOptions.includes(requestedPeriod)
			? requestedPeriod
			: periodOptions[0];

	const scopedPast =
		activePeriod === TRAVEL_DNA_ALL_PERIODS
			? pastItineraries
			: pastItineraries.filter((row) => row.reportingPeriod === activePeriod);

	if (scopedPast.length === 0) {
		return {
			activePeriod,
			periodOptions,
			locationBars: [],
			locationLegend: [],
			preferredDestinations: [],
			weakestTopics: [],
			strongestTopics: [],
			bookedJourneyCount,
			completedJourneyCount,
		};
	}

	const destinationCounts = countByKey(
		scopedPast.map((row) => row.destination.trim()).filter(Boolean),
	);
	const totalTrips = scopedPast.length;

	const locationBars = [...destinationCounts.entries()]
		.sort((a, b) => b[1] - a[1])
		.map(([destination, count], index) => {
			const id = slugifyTravelDnaKey(destination);
			const percent = Math.round((count / totalTrips) * 100);
			const color = travelDnaLocationColors[index % travelDnaLocationColors.length];
			return {
				id,
				label: destination,
				percent,
				color,
			};
		});

	const previousPeriod = periodLabels.find((period) => period !== activePeriod);
	const previousScoped =
		previousPeriod && activePeriod !== TRAVEL_DNA_ALL_PERIODS
			? pastItineraries.filter((row) => row.reportingPeriod === previousPeriod)
			: [];

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

	const preferredDestinations = [...categoryCounts.entries()]
		.sort((a, b) => b[1] - a[1])
		.map(([name, count], index) => {
			const previousCount = previousCategoryCounts.get(name) ?? 0;
			const trend = count >= previousCount ? ("up" as const) : ("down" as const);
			const share = Math.round((count / totalTrips) * 100);

			return {
				id: slugifyTravelDnaKey(name),
				rank: index + 1,
				name,
				pointsLabel: `${count} ${count === 1 ? "trip" : "trips"}`,
				correctPercent: share,
				trend,
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
				image: definition?.image ?? "/images/sd2.png",
				imageAlt: definition?.imageAlt ?? name,
			};
		})
		.sort((a, b) => a.percent - b.percent);

	const weakestTopics = topicScores.slice(0, 3).map((topic) => ({
		id: topic.slug,
		name: topic.name,
		percent: topic.percent,
		image: topic.image,
		imageAlt: topic.imageAlt,
	}));

	const strongestTopics = [...topicScores]
		.reverse()
		.slice(0, 3)
		.map((topic) => ({
			id: topic.slug,
			name: topic.name,
			percent: topic.percent,
			image: topic.image,
			imageAlt: topic.imageAlt,
		}));

	return {
		activePeriod,
		periodOptions,
		locationBars,
		locationLegend: locationBars.map((bar) => ({ ...bar })),
		preferredDestinations,
		weakestTopics,
		strongestTopics,
		bookedJourneyCount,
		completedJourneyCount,
	};
}
