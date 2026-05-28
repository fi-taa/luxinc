import { FeedbackSectionEditor } from "@/components/admin/landing/feedback-section-editor";
import { fetchFeedbackAdminForm } from "@/lib/cms/fetch-landing";

export default async function AdminFeedbackPage() {
	const initialData = await fetchFeedbackAdminForm();
	return <FeedbackSectionEditor initialData={initialData} />;
}
