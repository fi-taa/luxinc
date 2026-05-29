import { createSupabaseAuthServerClient } from "@/lib/supabase/auth-server";

export async function requireActiveMember() {
	const supabase = await createSupabaseAuthServerClient();
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		return { error: "Unauthorized", status: 401 as const, supabase, userId: null };
	}

	const { data: profile, error: profileError } = await supabase
		.from("profiles")
		.select("role,status")
		.eq("id", user.id)
		.maybeSingle();

	if (profileError || !profile || profile.role !== "member" || profile.status !== "active") {
		return { error: "Forbidden", status: 403 as const, supabase, userId: null };
	}

	return { error: null, status: 200 as const, supabase, userId: user.id };
}
