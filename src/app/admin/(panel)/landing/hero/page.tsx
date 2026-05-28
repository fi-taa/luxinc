import { HeroEditor } from "@/components/admin/landing/hero-editor";
import { fetchHero } from "@/lib/cms/fetch-landing";

export default async function AdminHeroPage() {
	const initialData = await fetchHero();
	return <HeroEditor initialData={initialData} />;
}
