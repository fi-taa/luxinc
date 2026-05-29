import { UsersList } from "@/components/admin/users/users-list";
import { fetchProfilesList } from "@/lib/admin/profiles";
import { createSupabaseAuthServerClient } from "@/lib/supabase/auth-server";

export default async function AdminUsersPage() {
	let initialUsers: Awaited<ReturnType<typeof fetchProfilesList>> = [];

	try {
		const supabase = await createSupabaseAuthServerClient();
		initialUsers = await fetchProfilesList(supabase);
	} catch {
		initialUsers = [];
	}

	return <UsersList initialUsers={initialUsers} />;
}
