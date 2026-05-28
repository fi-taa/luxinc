import { JournalSectionEditor } from "@/components/admin/landing/journal-section-editor";
import { fetchJournalAdminForm } from "@/lib/cms/fetch-landing";

export default async function AdminJournalPage() {
	const initialData = await fetchJournalAdminForm();
	return <JournalSectionEditor initialData={initialData} />;
}
