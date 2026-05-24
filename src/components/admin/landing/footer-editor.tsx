"use client";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import {
	AdminField,
	AdminInput,
	AdminTextarea,
} from "@/components/admin/forms/admin-field";
import { AdminStickySaveBar } from "@/components/admin/forms/admin-sticky-save-bar";
import { AdminToggle } from "@/components/admin/forms/admin-toggle";
import { useAdminForm } from "@/components/admin/forms/use-admin-form";
import { footer } from "@/lib/landing-content";

export function FooterEditor() {
	const { data, setField, isDirty, isSaving, saveMessage, save, discard } =
		useAdminForm({
			...footer,
			showQuote: true,
		});

	return (
		<>
			<AdminPageHeader
				title="Footer"
				description="Site-wide footer copy."
				previewHref="/"
			/>
			<div className="space-y-6">
				<AdminPanel title="Quote block">
					<AdminToggle
						id="footer-show-quote"
						label="Show quote on marketing pages"
						checked={data.showQuote}
						onChange={(showQuote) => setField("showQuote", showQuote)}
					/>
					<div className="mt-5 grid gap-5">
						<AdminField label="Quote" htmlFor="footer-quote">
							<AdminTextarea
								id="footer-quote"
								value={data.quote}
								onChange={(e) => setField("quote", e.target.value)}
							/>
						</AdminField>
						<AdminField label="Attribution" htmlFor="footer-attribution">
							<AdminInput
								id="footer-attribution"
								value={data.attribution}
								onChange={(e) => setField("attribution", e.target.value)}
							/>
						</AdminField>
					</div>
				</AdminPanel>
				<AdminPanel title="Legal">
					<div className="grid gap-5">
						<AdminField label="Tagline" htmlFor="footer-tagline">
							<AdminInput
								id="footer-tagline"
								value={data.tagline}
								onChange={(e) => setField("tagline", e.target.value)}
							/>
						</AdminField>
						<AdminField label="Locations" htmlFor="footer-locations">
							<AdminInput
								id="footer-locations"
								value={data.locations}
								onChange={(e) => setField("locations", e.target.value)}
							/>
						</AdminField>
						<AdminField label="Copyright (gold)" htmlFor="footer-copyright-lead">
							<AdminInput
								id="footer-copyright-lead"
								value={data.copyrightLead}
								onChange={(e) => setField("copyrightLead", e.target.value)}
							/>
						</AdminField>
						<AdminField label="Copyright (white)" htmlFor="footer-copyright-tail">
							<AdminInput
								id="footer-copyright-tail"
								value={data.copyrightTail}
								onChange={(e) => setField("copyrightTail", e.target.value)}
							/>
						</AdminField>
					</div>
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
