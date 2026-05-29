import { NextResponse } from "next/server";
import { ensureEmailConfirmed } from "@/lib/supabase/confirm-user-email";
import { createSupabaseServiceClient } from "@/lib/supabase/service-client";

interface SignUpBody {
	email?: string;
	password?: string;
	fullName?: string;
}

function isAlreadyRegistered(message: string): boolean {
	const lower = message.toLowerCase();
	return (
		lower.includes("already") ||
		lower.includes("registered") ||
		lower.includes("exists")
	);
}

export async function POST(request: Request) {
	const service = createSupabaseServiceClient();
	if (!service) {
		return NextResponse.json(
			{
				error:
					"Server misconfigured: add SUPABASE_SERVICE_ROLE_KEY to .env.local and restart the dev server.",
			},
			{ status: 500 },
		);
	}

	const body = (await request.json()) as SignUpBody;
	const email = body.email?.trim() ?? "";
	const password = body.password ?? "";
	const fullName = body.fullName?.trim() ?? "";

	if (!email || !password || !fullName) {
		return NextResponse.json(
			{ error: "Full name, email, and password are required." },
			{ status: 400 },
		);
	}

	if (password.length < 6) {
		return NextResponse.json(
			{ error: "Password must be at least 6 characters." },
			{ status: 400 },
		);
	}

	const { data: created, error: createError } = await service.auth.admin.createUser(
		{
			email,
			password,
			email_confirm: true,
			user_metadata: { full_name: fullName },
		},
	);

	if (createError) {
		if (isAlreadyRegistered(createError.message)) {
			await ensureEmailConfirmed(service, email);
			const { data: listData } = await service.auth.admin.listUsers({
				perPage: 1000,
			});
			const existing = listData.users.find(
				(user) => user.email?.toLowerCase() === email.toLowerCase(),
			);
			return NextResponse.json({
				userId: existing?.id ?? null,
				existingAccount: true,
				message:
					"An account with this email already exists. Sign in with your password instead.",
			});
		}
		return NextResponse.json({ error: createError.message }, { status: 400 });
	}

	if (created.user) {
		const { error: profileError } = await service.from("profiles").upsert(
			{
				id: created.user.id,
				email,
				full_name: fullName,
				role: "member",
				status: "active",
			},
			{ onConflict: "id" },
		);

		if (profileError) {
			return NextResponse.json(
				{
					error: `Account created but member profile failed: ${profileError.message}. Run supabase/profiles-schema.sql in Supabase SQL Editor.`,
				},
				{ status: 400 },
			);
		}
	}

	await ensureEmailConfirmed(service, email);

	return NextResponse.json({
		userId: created.user?.id ?? null,
		existingAccount: false,
	});
}
