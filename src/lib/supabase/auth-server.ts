import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function createSupabaseAuthServerClient(): Promise<SupabaseClient> {
	const cookieStore = await cookies();
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (!url) throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
	if (!anonKey)
		throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY");

	return createServerClient(url, anonKey, {
		cookies: {
			getAll() {
				return cookieStore.getAll();
			},
			setAll(cookiesToSet) {
				try {
					for (const { name, value, options } of cookiesToSet) {
						cookieStore.set(name, value, options);
					}
				} catch {
					// Called from a Server Component without mutable cookies — middleware handles refresh.
				}
			},
		},
	});
}
