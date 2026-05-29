import { NextResponse } from "next/server";
import { createSupabaseAuthServerClient } from "@/lib/supabase/auth-server";
import { createSupabaseServiceClient } from "@/lib/supabase/service-client";

interface CreateUserBody {
	email?: string;
	password?: string;
	fullName?: string;
	phone?: string;
	role?: "member" | "admin";
	status?: "active" | "disabled";
}

export async function POST(request: Request) {
	const authClient = await createSupabaseAuthServerClient();
	const {
		data: { user },
	} = await authClient.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { data: adminProfile } = await authClient
		.from("profiles")
		.select("role,status")
		.eq("id", user.id)
		.maybeSingle();

	if (
		!adminProfile ||
		adminProfile.role !== "admin" ||
		adminProfile.status !== "active"
	) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	const service = createSupabaseServiceClient();
	if (!service) {
		return NextResponse.json(
			{ error: "Server misconfigured: missing SUPABASE_SERVICE_ROLE_KEY" },
			{ status: 500 },
		);
	}

	const body = (await request.json()) as CreateUserBody;
	const email = body.email?.trim() ?? "";
	const password = body.password ?? "";
	const fullName = body.fullName?.trim() ?? "";
	const phone = body.phone?.trim() || null;
	const role = body.role ?? "member";
	const status = body.status ?? "active";

	if (!email || !password || !fullName) {
		return NextResponse.json(
			{ error: "Email, password, and full name are required." },
			{ status: 400 },
		);
	}

	const { data: created, error: createError } =
		await service.auth.admin.createUser({
			email,
			password,
			email_confirm: true,
			user_metadata: { full_name: fullName },
		});

	if (createError || !created.user) {
		return NextResponse.json(
			{ error: createError?.message ?? "Failed to create user" },
			{ status: 400 },
		);
	}

	const { error: profileError } = await service
		.from("profiles")
		.update({
			full_name: fullName,
			phone,
			role,
			status,
			email,
		})
		.eq("id", created.user.id);

	if (profileError) {
		return NextResponse.json({ error: profileError.message }, { status: 400 });
	}

	return NextResponse.json({ id: created.user.id });
}
