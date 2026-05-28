import { ArchitectsSectionEditor } from "@/components/admin/landing/architects-section-editor";
import { fetchArchitectsForm } from "@/lib/cms/fetch-landing";

export default async function AdminArchitectsPage() {
	const initialData = await fetchArchitectsForm();
	return <ArchitectsSectionEditor initialData={initialData} />;
}
