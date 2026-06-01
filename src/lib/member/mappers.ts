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
import type {
	ConciergeMessageRow,
	MemberJourneyRow,
	MemberReferralRow,
	UpcomingJourneyRow,
} from "./db-types";
import { parseJourneyStops } from "./journey-stops";

export function mapUpcomingJourneyRow(
	row: UpcomingJourneyRow,
	paymentStatus: UpcomingItinerary["paymentStatus"],
): UpcomingItinerary {
	return {
		id: row.id,
		destination: row.destination,
		travelDate: row.travel_date_label,
		image: ensureImageSrc(row.image_url, "/images/sd3.png"),
		imageAlt: row.image_alt,
		stops: parseJourneyStops(row.stops),
		amountMinor: row.amount_minor,
		currency: row.currency,
		paymentStatus,
	};
}

export function mapMemberJourneyRow(row: MemberJourneyRow): PastJourney {
	return {
		id: row.id,
		destination: row.destination,
		travelDate: row.travel_date_label,
		image: ensureImageSrc(row.image_url, "/images/sd3.png"),
		imageAlt: row.image_alt,
		stops: parseJourneyStops(row.stops),
		journeyStatus: row.journey_status ?? "booked",
	};
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

export interface TravelDnaBundle {
	activePeriod: string;
	periodOptions: string[];
	locationBars: DnaLocationBar[];
	locationLegend: DnaLocationLegend[];
	preferredDestinations: PreferredDestination[];
	weakestTopics: DnaTopic[];
	strongestTopics: DnaTopic[];
	bookedJourneyCount: number;
	completedJourneyCount: number;
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
