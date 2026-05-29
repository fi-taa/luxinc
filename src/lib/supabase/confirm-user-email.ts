import type { SupabaseClient } from "@supabase/supabase-js";

export async function ensureEmailConfirmed(
	service: SupabaseClient,
	email: string,
): Promise<void> {
	const normalized = email.trim().toLowerCase();
	if (!normalized) return;

	const { data, error } = await service.auth.admin.listUsers({ perPage: 1000 });
	if (error) throw error;

	const authUser = data.users.find(
		(user) => user.email?.toLowerCase() === normalized,
	);
	if (!authUser || authUser.email_confirmed_at) return;

	const { error: updateError } = await service.auth.admin.updateUserById(
		authUser.id,
		{ email_confirm: true },
	);
	if (updateError) throw updateError;
}
