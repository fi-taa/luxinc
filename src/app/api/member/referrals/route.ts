import { NextResponse } from "next/server";
import { requireActiveMember } from "@/lib/member/require-member-auth";

interface CreateReferralBody {
	title?: string;
	description?: string;
	referralLink?: string;
	imageUrl?: string;
	imageAlt?: string;
}

export async function POST(request: Request) {
	const auth = await requireActiveMember();
	if (auth.error) {
		return NextResponse.json({ error: auth.error }, { status: auth.status });
	}

	const body = (await request.json()) as CreateReferralBody;
	const title = body.title?.trim() ?? "";
	const description = body.description?.trim() ?? "";
	const referralLink = body.referralLink?.trim() ?? "";

	if (!title || !description || !referralLink) {
		return NextResponse.json(
			{ error: "Title, description, and referral link are required." },
			{ status: 400 },
		);
	}

	const { count } = await auth.supabase
		.from("member_referrals")
		.select("id", { count: "exact", head: true })
		.eq("profile_id", auth.userId);

	const externalKey = `ref-${Date.now()}`;

	const { data, error } = await auth.supabase
		.from("member_referrals")
		.insert({
			profile_id: auth.userId,
			external_key: externalKey,
			title,
			description,
			referral_link: referralLink,
			image_url: body.imageUrl?.trim() || null,
			image_alt: body.imageAlt?.trim() || title,
			sort_order: count ?? 0,
		})
		.select("id")
		.single();

	if (error || !data) {
		return NextResponse.json(
			{ error: error?.message ?? "Failed to create referral." },
			{ status: 400 },
		);
	}

	return NextResponse.json({ id: data.id }, { status: 201 });
}
