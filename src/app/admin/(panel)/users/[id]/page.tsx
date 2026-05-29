import { notFound } from "next/navigation";
import { UserDetailView } from "@/components/admin/users/user-detail-view";
import { fetchProfileById } from "@/lib/admin/profiles.server";
import { createSupabaseAuthServerClient } from "@/lib/supabase/auth-server";

interface AdminUserDetailPageProps {
	params: Promise<{ id: string }>;
}

export default async function AdminUserDetailPage({
	params,
}: AdminUserDetailPageProps) {
	const { id } = await params;
	let user = null;

	try {
		const supabase = await createSupabaseAuthServerClient();
		user = await fetchProfileById(id, supabase);
	} catch {
		user = null;
	}

	if (!user) {
		notFound();
	}

	return <UserDetailView user={user} />;
}
