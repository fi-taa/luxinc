import { notFound } from "next/navigation";
import { ContentDetailEditor } from "@/components/admin/landing/content-detail-editor";
import {
	createEmptyContentDetail,
	isNewContentDetailSlug,
} from "@/lib/admin/admin-content-detail";
import { getContentDetail } from "@/lib/content-detail";

interface AdminJournalDetailPageProps {
	params: Promise<{ slug: string }>;
}

export default async function AdminJournalDetailPage({
	params,
}: AdminJournalDetailPageProps) {
	const { slug } = await params;
	const isNew = isNewContentDetailSlug(slug);
	const detail = isNew
		? createEmptyContentDetail("journal")
		: getContentDetail("journal", slug);

	if (!detail) {
		notFound();
	}

	return <ContentDetailEditor category="journal" detail={detail} isNew={isNew} />;
}
