import { FooterEditor } from "@/components/admin/landing/footer-editor";
import { fetchFooter } from "@/lib/cms/fetch-landing";

export default async function AdminFooterPage() {
	const initialData = await fetchFooter();
	return <FooterEditor initialData={initialData} />;
}
