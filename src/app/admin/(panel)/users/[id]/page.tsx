import { notFound } from "next/navigation";
import { UserDetailView } from "@/components/admin/users/user-detail-view";
import { getAdminUser } from "@/lib/admin/admin-users";

interface AdminUserDetailPageProps {
	params: Promise<{ id: string }>;
}

export default async function AdminUserDetailPage({
	params,
}: AdminUserDetailPageProps) {
	const { id } = await params;
	const user = getAdminUser(id);
	if (!user) {
		notFound();
	}
	return <UserDetailView user={user} />;
}
