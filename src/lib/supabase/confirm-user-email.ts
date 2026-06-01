import type { SupabaseClient } from "@supabase/supabase-js";
import { findAuthUserByEmail } from "@/lib/supabase/find-auth-user-by-email";

export async function ensureEmailConfirmed(
	service: SupabaseClient,
	email: string,
): Promise<void> {
	const authUser = await findAuthUserByEmail(service, email);
	if (!authUser || authUser.email_confirmed_at) return;

	const { error: updateError } = await service.auth.admin.updateUserById(
		authUser.id,
		{ email_confirm: true },
	);
	if (updateError) throw updateError;
}
