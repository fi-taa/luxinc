"use client";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import {
	AdminField,
	AdminInput,
} from "@/components/admin/forms/admin-field";
import { AdminStickySaveBar } from "@/components/admin/forms/admin-sticky-save-bar";
import { useAdminForm } from "@/components/admin/forms/use-admin-form";
import { saveFooterLegal, type FooterLegalFormState } from "@/lib/cms/save-landing";

export function FooterEditor({ initialData }: { initialData: FooterLegalFormState }) {
	const { data, setField, isDirty, isSaving, saveMessage, save, discard } =
		useAdminForm(initialData, { onSave: saveFooterLegal });

	return (
		<>
			<AdminPageHeader
				title="Footer"
				description="Legal footer copy. Client quotes are managed under Client feedback."
				previewHref="/"
			/>
			<div className="space-y-6">
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
