import { CrownCollectionEditor } from "@/components/admin/landing/crown-collection-editor";
import { fetchCrownCollectionForm } from "@/lib/cms/fetch-landing";

export default async function AdminCrownCollectionPage() {
	const initialData = await fetchCrownCollectionForm();
	return <CrownCollectionEditor initialData={initialData} />;
}
