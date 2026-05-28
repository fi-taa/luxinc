import { DestinationsEditor } from "@/components/admin/landing/destinations-editor";
import { fetchDestinationsForm } from "@/lib/cms/fetch-landing";

export default async function AdminDestinationsPage() {
	const initialData = await fetchDestinationsForm();
	return <DestinationsEditor initialData={initialData} />;
}
