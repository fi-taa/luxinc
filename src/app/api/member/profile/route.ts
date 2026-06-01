import { NextResponse } from "next/server";
import { toErrorMessage } from "@/lib/errors/to-error-message";
import { normalizeChapaPhone } from "@/lib/payments/chapa.server";
import { requireActiveMember } from "@/lib/member/require-member-auth";

interface PatchBody {
	fullName?: string;
	phone?: string;
}

export async function PATCH(request: Request) {
	const auth = await requireActiveMember();
	if (auth.error || !auth.userId) {
		return NextResponse.json(
			{ error: auth.error ?? "Unauthorized" },
			{ status: auth.error ? auth.status : 401 },
		);
	}

	const body = (await request.json()) as PatchBody;
	const fullName = body.fullName?.trim() ?? "";
	const phoneInput = body.phone?.trim() ?? "";

	if (!fullName) {
		return NextResponse.json({ error: "Name is required." }, { status: 400 });
	}
	if (!phoneInput) {
		return NextResponse.json({ error: "Phone is required for journey payments." }, {
			status: 400,
		});
	}

	let phone: string;
	try {
		phone = normalizeChapaPhone(phoneInput);
	} catch (e) {
		return NextResponse.json(
			{ error: toErrorMessage(e, "Invalid phone number.") },
			{ status: 400 },
		);
	}

	const { data, error } = await auth.supabase
		.from("profiles")
		.update({
			full_name: fullName,
			phone,
		})
		.eq("id", auth.userId)
		.select("id,email,full_name,phone,avatar_url,role,status")
		.single();

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 400 });
	}

	return NextResponse.json({
		profile: {
			id: data.id,
			email: data.email,
			full_name: data.full_name,
			phone: data.phone,
			avatar_url: data.avatar_url,
			role: data.role,
			status: data.status,
		},
	});
}
