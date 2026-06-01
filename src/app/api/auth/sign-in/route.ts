import { NextResponse } from "next/server";
import { ensureEmailConfirmed } from "@/lib/supabase/confirm-user-email";
import {
	explainSignInFailure,
	findAuthUserByEmail,
} from "@/lib/supabase/find-auth-user-by-email";
import { createSupabaseAuthServerClient } from "@/lib/supabase/auth-server";
import { createSupabaseServiceClient } from "@/lib/supabase/service-client";

interface SignInBody {
	email?: string;
	password?: string;
}

export async function POST(request: Request) {
	const body = (await request.json()) as SignInBody;
	const email = body.email?.trim().toLowerCase() ?? "";
	const password = body.password ?? "";

	if (!email || !password) {
		return NextResponse.json(
			{ error: "Email and password are required." },
			{ status: 400 },
		);
	}

	const service = createSupabaseServiceClient();
	if (service) {
		try {
			await ensureEmailConfirmed(service, email);
		} catch {
			// Continue — sign-in may still work if user is already confirmed.
		}
	}

	const authClient = await createSupabaseAuthServerClient();
	const { data, error } = await authClient.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		let message = error.message;
		if (
			service &&
			error.message.toLowerCase().includes("invalid login credentials")
		) {
			try {
				const authUser = await findAuthUserByEmail(service, email);
				message = explainSignInFailure(authUser);
			} catch {
				// Keep Supabase's generic message if admin lookup fails.
			}
		}
		return NextResponse.json({ error: message }, { status: 400 });
	}

	return NextResponse.json({ userId: data.user?.id ?? null });
}
