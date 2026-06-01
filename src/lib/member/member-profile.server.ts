import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseAuthServerClient } from "@/lib/supabase/auth-server";

export interface MemberProfileRecord {
	id: string;
	email: string;
	fullName: string;
	phone: string | null;
	avatarUrl: string | null;
}

export async function fetchMemberProfile(
	client?: SupabaseClient,
): Promise<MemberProfileRecord> {
	const supabase = client ?? (await createSupabaseAuthServerClient());
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		throw new Error("Not authenticated");
	}

	const { data, error } = await supabase
		.from("profiles")
		.select("id,email,full_name,phone,avatar_url")
		.eq("id", user.id)
		.maybeSingle();

	if (error) {
		throw new Error(error.message);
	}
	if (!data) {
		throw new Error("Profile not found.");
	}

	return {
		id: data.id,
		email: data.email,
		fullName: data.full_name,
		phone: data.phone,
		avatarUrl: data.avatar_url,
	};
}
