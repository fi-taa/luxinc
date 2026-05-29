import { NextResponse } from "next/server";
import { insertItineraryWithDnaFields } from "@/lib/member/itinerary-dna-fields";
import { deriveReportingPeriod } from "@/lib/member/reporting-period";
import { recomputeMemberTravelDna } from "@/lib/member/recompute-travel-dna";
import { requireActiveMember } from "@/lib/member/require-member-auth";
import {
	normalizeTopicTag,
	travelDnaDestinationCategories,
} from "@/lib/member/travel-dna-taxonomy";

interface ItineraryStopInput {
	stopTime?: string;
	activity?: string;
}

interface CreateItineraryBody {
	kind?: "upcoming" | "past";
	destination?: string;
	travelDateLabel?: string;
	destinationCategory?: string;
	topicTags?: string[];
	imageUrl?: string;
	imageAlt?: string;
	stops?: ItineraryStopInput[];
}

export async function POST(request: Request) {
	const auth = await requireActiveMember();
	if (auth.error) {
		return NextResponse.json({ error: auth.error }, { status: auth.status });
	}

	const body = (await request.json()) as CreateItineraryBody;
	const kind = body.kind;
	const destination = body.destination?.trim() ?? "";
	const travelDateLabel = body.travelDateLabel?.trim() ?? "";
	const stops = (body.stops ?? []).filter(
		(stop) => stop.stopTime?.trim() && stop.activity?.trim(),
	);

	if (kind !== "upcoming" && kind !== "past") {
		return NextResponse.json({ error: "Invalid itinerary type." }, { status: 400 });
	}
	if (!destination || !travelDateLabel) {
		return NextResponse.json(
			{ error: "Destination and travel date are required." },
			{ status: 400 },
		);
	}
	if (stops.length === 0) {
		return NextResponse.json(
			{ error: "Add at least one itinerary stop." },
			{ status: 400 },
		);
	}

	const { count } = await auth.supabase
		.from("member_itineraries")
		.select("id", { count: "exact", head: true })
		.eq("profile_id", auth.userId)
		.eq("kind", kind);

	const sortOrder = count ?? 0;
	const reportingPeriod = deriveReportingPeriod(travelDateLabel);

	const categoryInput = body.destinationCategory?.trim() ?? "";
	const destinationCategory = travelDnaDestinationCategories.includes(
		categoryInput as (typeof travelDnaDestinationCategories)[number],
	)
		? categoryInput
		: null;

	const topicTags = [
		...new Set(
			(body.topicTags ?? [])
				.map((tag) => normalizeTopicTag(tag))
				.filter((tag): tag is string => Boolean(tag)),
		),
	];

	const baseRow = {
		profile_id: auth.userId,
		kind,
		destination,
		travel_date_label: travelDateLabel,
		image_url: body.imageUrl?.trim() || null,
		image_alt: body.imageAlt?.trim() || destination,
		sort_order: sortOrder,
	};

	const { data: itinerary, error: itineraryError } = await insertItineraryWithDnaFields(
		auth.supabase,
		baseRow,
		{
			reporting_period: reportingPeriod,
			destination_category: destinationCategory,
			topic_tags: topicTags,
		},
	);

	if (itineraryError || !itinerary) {
		return NextResponse.json(
			{ error: itineraryError?.message ?? "Failed to create itinerary." },
			{ status: 400 },
		);
	}

	const stopRows = stops.map((stop, index) => ({
		itinerary_id: itinerary.id,
		sort_order: index,
		stop_time: stop.stopTime!.trim(),
		activity: stop.activity!.trim(),
	}));

	const { error: stopsError } = await auth.supabase
		.from("member_itinerary_stops")
		.insert(stopRows);

	if (stopsError) {
		await auth.supabase.from("member_itineraries").delete().eq("id", itinerary.id);
		return NextResponse.json({ error: stopsError.message }, { status: 400 });
	}

	if (kind === "past" && auth.userId) {
		try {
			await recomputeMemberTravelDna(auth.supabase, auth.userId);
		} catch (recomputeError) {
			const message =
				recomputeError instanceof Error
					? recomputeError.message
					: "Itinerary saved but Travel DNA could not be updated.";
			return NextResponse.json({ error: message }, { status: 500 });
		}
	}

	return NextResponse.json({ id: itinerary.id }, { status: 201 });
}
