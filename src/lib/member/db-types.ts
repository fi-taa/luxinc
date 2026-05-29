export interface MemberItineraryRow {
	id: string;
	profile_id: string;
	kind: "upcoming" | "past";
	destination: string;
	travel_date_label: string;
	reporting_period: string | null;
	destination_category: string | null;
	topic_tags: string[] | null;
	image_url: string | null;
	image_alt: string;
	sort_order: number;
	member_itinerary_stops?: MemberItineraryStopRow[];
}

export interface MemberItineraryStopRow {
	id: string;
	itinerary_id: string;
	sort_order: number;
	stop_time: string;
	activity: string;
}

export interface MemberTravelDnaSettingsRow {
	profile_id: string;
	active_period: string;
	period_options: string[];
}

export interface MemberTravelDnaLocationRow {
	id: string;
	profile_id: string;
	external_key: string;
	label: string;
	percent: number;
	color: string;
	sort_order: number;
}

export interface MemberTravelDnaDestinationRow {
	id: string;
	profile_id: string;
	external_key: string;
	rank: number;
	name: string;
	points_label: string;
	correct_percent: number | null;
	trend: "up" | "down";
	sort_order: number;
}

export interface MemberTravelDnaTopicRow {
	id: string;
	profile_id: string;
	external_key: string;
	kind: "weakest" | "strongest";
	name: string;
	percent: number;
	image_url: string | null;
	image_alt: string;
	sort_order: number;
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
