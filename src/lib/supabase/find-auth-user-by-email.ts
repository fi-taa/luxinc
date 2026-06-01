import type { SupabaseClient, User } from "@supabase/supabase-js";

export async function findAuthUserByEmail(
	service: SupabaseClient,
	email: string,
): Promise<User | null> {
	const normalized = email.trim().toLowerCase();
	if (!normalized) return null;

	const { data, error } = await service.auth.admin.listUsers({ perPage: 1000 });
	if (error) throw error;

	return (
		data.users.find((user) => user.email?.toLowerCase() === normalized) ?? null
	);
}

export function explainSignInFailure(authUser: User | null): string {
	if (!authUser) {
		return "No auth account for this email. The profiles table alone is not enough — create the user under Authentication → Users (with a password), or use Sign Up.";
	}

	const hasEmailPassword =
		!authUser.identities?.length ||
		authUser.identities.some((identity) => identity.provider === "email");

	if (!hasEmailPassword) {
		return "This account does not use email and password. Sign in with the provider you used when the account was created.";
	}

	return "Incorrect password. In Supabase: Authentication → Users → select the user → reset or set a new password.";
}
