import type { ConciergeChatMessage } from "@/lib/concierge-chat-content";
import { formatChatTimestamp } from "@/lib/concierge-chat-content";
import type { UpcomingItinerary } from "@/lib/member-content";
import type { PastJourney } from "@/lib/past-journeys-content";
import type { ReferralProgramme } from "@/lib/referral-content";
import { ensureImageSrc } from "@/lib/supabase/storage-url";
import type {
	DnaLocationBar,
	DnaLocationLegend,
	DnaTopic,
	PreferredDestination,
} from "@/lib/travel-dna-content";
import { TRAVEL_DNA_ALL_PERIODS } from "./travel-dna-taxonomy";
import type {
	ConciergeMessageRow,
	MemberItineraryRow,
	MemberReferralRow,
	MemberTravelDnaDestinationRow,
	MemberTravelDnaLocationRow,
	MemberTravelDnaSettingsRow,
	MemberTravelDnaTopicRow,
} from "./db-types";

export function mapItineraryRow(row: MemberItineraryRow): UpcomingItinerary {
	const stops = (row.member_itinerary_stops ?? [])
		.sort((a, b) => a.sort_order - b.sort_order)
		.map((stop) => ({
			time: stop.stop_time,
			activity: stop.activity,
		}));

	return {
		id: row.id,
		destination: row.destination,
		travelDate: row.travel_date_label,
		image: ensureImageSrc(row.image_url, "/images/sd3.png"),
		imageAlt: row.image_alt,
		stops,
	};
}

export function mapPastJourneyRow(row: MemberItineraryRow): PastJourney {
	return mapItineraryRow(row);
}

export function mapReferralRow(row: MemberReferralRow): ReferralProgramme {
	return {
		id: row.id,
		image: ensureImageSrc(row.image_url, "/images/c3.png"),
		imageAlt: row.image_alt,
		title: row.title,
		description: row.description,
		referralLink: row.referral_link,
	};
}

export function mapLocationBar(row: MemberTravelDnaLocationRow): DnaLocationBar {
	return {
		id: row.external_key,
		label: row.label,
		percent: Number(row.percent),
		color: row.color,
	};
}

export function mapLocationLegend(row: MemberTravelDnaLocationRow): DnaLocationLegend {
	return {
		id: row.external_key,
		label: row.label,
		percent: Number(row.percent),
		color: row.color,
	};
}

export function mapPreferredDestination(
	row: MemberTravelDnaDestinationRow,
): PreferredDestination {
	return {
		id: row.external_key,
		rank: row.rank,
		name: row.name,
		pointsLabel: row.points_label,
		correctPercent: row.correct_percent ?? undefined,
		trend: row.trend,
	};
}

export function mapDnaTopic(row: MemberTravelDnaTopicRow): DnaTopic {
	return {
		id: row.external_key,
		name: row.name,
		percent: row.percent,
		image: ensureImageSrc(row.image_url, "/images/sd2.png"),
		imageAlt: row.image_alt,
	};
}

export interface TravelDnaBundle {
	activePeriod: string;
	periodOptions: string[];
	locationBars: DnaLocationBar[];
	locationLegend: DnaLocationLegend[];
	preferredDestinations: PreferredDestination[];
	weakestTopics: DnaTopic[];
	strongestTopics: DnaTopic[];
}

export function mapTravelDnaBundle(
	settings: MemberTravelDnaSettingsRow | null,
	locations: MemberTravelDnaLocationRow[],
	destinations: MemberTravelDnaDestinationRow[],
	topics: MemberTravelDnaTopicRow[],
): TravelDnaBundle {
	const sortedLocations = [...locations].sort((a, b) => a.sort_order - b.sort_order);

	return {
		activePeriod: settings?.active_period ?? TRAVEL_DNA_ALL_PERIODS,
		periodOptions: settings?.period_options?.length
			? settings.period_options
			: [TRAVEL_DNA_ALL_PERIODS],
		locationBars: sortedLocations.map(mapLocationBar),
		locationLegend: sortedLocations.map(mapLocationLegend),
		preferredDestinations: [...destinations]
			.sort((a, b) => a.sort_order - b.sort_order)
			.map(mapPreferredDestination),
		weakestTopics: topics
			.filter((topic) => topic.kind === "weakest")
			.sort((a, b) => a.sort_order - b.sort_order)
			.map(mapDnaTopic),
		strongestTopics: topics
			.filter((topic) => topic.kind === "strongest")
			.sort((a, b) => a.sort_order - b.sort_order)
			.map(mapDnaTopic),
	};
}

export function mapConciergeRow(row: ConciergeMessageRow): ConciergeChatMessage {
	const created = new Date(row.created_at);

	return {
		id: row.id,
		sender: row.sender,
		type: row.message_type,
		timestamp: formatChatTimestamp(created),
		read: row.is_read,
		text: row.body.text,
		voiceDuration: row.body.voiceDuration,
		voiceTotal: row.body.voiceTotal,
		voiceAudioUrl: row.body.voiceAudioUrl,
		linkTitle: row.body.linkTitle,
		linkDescription: row.body.linkDescription,
		linkUrl: row.body.linkUrl,
		fileName: row.body.fileName,
		fileUrl: row.body.fileUrl,
		fileMimeType: row.body.fileMimeType,
	};
}

export function conciergeMessageToBody(
	message: ConciergeChatMessage,
): Record<string, string | undefined> {
	return {
		text: message.text,
		voiceDuration: message.voiceDuration,
		voiceTotal: message.voiceTotal,
		voiceAudioUrl: message.voiceAudioUrl,
		linkTitle: message.linkTitle,
		linkDescription: message.linkDescription,
		linkUrl: message.linkUrl,
		fileName: message.fileName,
		fileUrl: message.fileUrl,
		fileMimeType: message.fileMimeType,
	};
}
