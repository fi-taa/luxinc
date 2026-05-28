import { TeamEditor } from "@/components/admin/landing/team-editor";
import { fetchTeamForm } from "@/lib/cms/fetch-landing";

export default async function AdminTeamPage() {
	const initialData = await fetchTeamForm();
	return <TeamEditor initialData={initialData} />;
}
