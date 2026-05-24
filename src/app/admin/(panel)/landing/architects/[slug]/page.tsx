import { notFound } from "next/navigation";
import { ContentDetailEditor } from "@/components/admin/landing/content-detail-editor";
import {
	createEmptyContentDetail,
	isNewContentDetailSlug,
} from "@/lib/admin/admin-content-detail";
import { getContentDetail } from "@/lib/content-detail";

interface AdminArchitectDetailPageProps {
	params: Promise<{ slug: string }>;
}

export default async function AdminArchitectDetailPage({
	params,
}: AdminArchitectDetailPageProps) {
	const { slug } = await params;
	const isNew = isNewContentDetailSlug(slug);
	const detail = isNew
		? createEmptyContentDetail("architects")
		: getContentDetail("architects", slug);

	if (!detail) {
		notFound();
	}

	return (
		<ContentDetailEditor category="architects" detail={detail} isNew={isNew} />
	);
}
