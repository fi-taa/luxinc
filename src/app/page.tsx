import { AddressSection } from "@/components/landing/address-section";
import { ArchitectsSection } from "@/components/landing/architects-section";
import { BlackBookSection } from "@/components/landing/black-book-section";
import { CommitmentSection } from "@/components/landing/commitment-section";
import { CrownCollectionSection } from "@/components/landing/crown-collection-section";
import { DestinationsSection } from "@/components/landing/destinations-section";
import { HeroSection } from "@/components/landing/hero-section";
import { JournalSection } from "@/components/landing/journal-section";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { TeamSection } from "@/components/landing/team-section";

export default function Home() {
	return (
		<main className="bg-luxinc-bg text-luxinc-text">
			<SiteHeader />
			<HeroSection />
			<CommitmentSection />
			<DestinationsSection />
			<CrownCollectionSection />
			<ArchitectsSection />
			<BlackBookSection />
			<JournalSection />
			<TeamSection />
			<AddressSection />
			<SiteFooter />
		</main>
	);
}
