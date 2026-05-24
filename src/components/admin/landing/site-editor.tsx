"use client";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import {
	AdminField,
	AdminInput,
} from "@/components/admin/forms/admin-field";
import { AdminRepeater } from "@/components/admin/forms/admin-repeater";
import { AdminStickySaveBar } from "@/components/admin/forms/admin-sticky-save-bar";
import { AdminToggle } from "@/components/admin/forms/admin-toggle";
import { useAdminForm } from "@/components/admin/forms/use-admin-form";
import { navLinks, site } from "@/lib/landing-content";
import type { NavLink } from "@/lib/landing-content";

interface SiteFormState {
	name: string;
	navCtaLabel: string;
	navCtaHref: string;
	links: NavLink[];
}

const initialSiteState: SiteFormState = {
	name: site.name,
	navCtaLabel: site.navCta.label,
	navCtaHref: site.navCta.href,
	links: navLinks.map((link) => ({ ...link })),
};

export function SiteEditor() {
	const { data, setField, isDirty, isSaving, saveMessage, save, discard } =
		useAdminForm(initialSiteState);

	return (
		<>
			<AdminPageHeader
				title="Site & navigation"
				description="Global site name, header navigation, and login CTA."
				previewHref="/"
			/>
			<div className="space-y-6">
				<AdminPanel title="Site">
					<AdminField label="Site name" htmlFor="site-name">
						<AdminInput
							id="site-name"
							value={data.name}
							onChange={(e) => setField("name", e.target.value)}
						/>
					</AdminField>
				</AdminPanel>
				<AdminPanel title="Header CTA">
					<div className="grid gap-5 md:grid-cols-2">
						<AdminField label="CTA label" htmlFor="nav-cta-label">
							<AdminInput
								id="nav-cta-label"
								value={data.navCtaLabel}
								onChange={(e) => setField("navCtaLabel", e.target.value)}
							/>
						</AdminField>
						<AdminField label="CTA href" htmlFor="nav-cta-href">
							<AdminInput
								id="nav-cta-href"
								value={data.navCtaHref}
								onChange={(e) => setField("navCtaHref", e.target.value)}
							/>
						</AdminField>
					</div>
				</AdminPanel>
				<AdminPanel>
					<AdminRepeater<NavLink>
						label="Navigation links"
						addLabel="Add link"
						emptyMessage="No navigation links. Add links for the header menu."
						items={data.links}
						onChange={(links) => setField("links", links)}
						createItem={() => ({ label: "New link", href: "#", isActive: false })}
						getKey={(item, index) => `${item.label}-${index}`}
						renderItem={(item, _index, update) => (
							<div className="grid gap-4 md:grid-cols-2">
								<AdminField label="Label" htmlFor={`nav-label-${item.href}`}>
									<AdminInput
										id={`nav-label-${item.href}`}
										value={item.label}
										onChange={(e) => update({ label: e.target.value })}
									/>
								</AdminField>
								<AdminField label="Href" htmlFor={`nav-href-${item.href}`}>
									<AdminInput
										id={`nav-href-${item.href}`}
										value={item.href}
										onChange={(e) => update({ href: e.target.value })}
									/>
								</AdminField>
								<AdminToggle
									id={`nav-active-${item.href}`}
									label="Active on homepage"
									checked={Boolean(item.isActive)}
									onChange={(isActive) => update({ isActive })}
								/>
							</div>
						)}
					/>
				</AdminPanel>
			</div>
			<AdminStickySaveBar
				isDirty={isDirty}
				isSaving={isSaving}
				saveMessage={saveMessage}
				onSave={save}
				onDiscard={discard}
			/>
		</>
	);
}
