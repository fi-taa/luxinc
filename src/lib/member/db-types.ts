export interface JourneyStopJson {
	time: string;
	activity: string;
}

export interface UpcomingJourneyRow {
	id: string;
	destination: string;
	travel_date_label: string;
	image_url: string | null;
	image_alt: string;
	stops: JourneyStopJson[] | unknown;
	amount_minor: number;
	currency: string;
	is_published: boolean;
	sort_order: number;
}

export type MemberJourneyStatus = "booked" | "completed";

export interface MemberJourneyRow {
	id: string;
	profile_id: string;
	upcoming_journey_id: string | null;
	journey_status: MemberJourneyStatus;
	destination: string;
	travel_date_label: string;
	reporting_period: string | null;
	destination_category: string | null;
	topic_tags: string[] | null;
	image_url: string | null;
	image_alt: string;
	stops: JourneyStopJson[] | unknown;
	sort_order: number;
}

export interface MemberPaymentRow {
	id: string;
	profile_id: string;
	upcoming_journey_id: string;
	tx_ref: string;
	chapa_ref_id: string | null;
	amount_minor: number;
	currency: string;
	status: "pending" | "success" | "failed";
	failure_reason: string | null;
	raw_verify: Record<string, unknown> | null;
}

export interface MemberReferralRow {
	id: string;
	profile_id: string;
	external_key: string | null;
	image_url: string | null;
	image_alt: string;
	title: string;
	description: string;
	referral_link: string;
	sort_order: number;
}

export interface ConciergeMessageRow {
	id: string;
	profile_id: string;
	sender: "concierge" | "user";
	message_type: "text" | "voice" | "link" | "file";
	body: Record<string, string | undefined>;
	is_read: boolean;
	created_at: string;
}
