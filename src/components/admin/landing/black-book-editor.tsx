"use client";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminField, AdminInput } from "@/components/admin/forms/admin-field";
import { AdminStickySaveBar } from "@/components/admin/forms/admin-sticky-save-bar";
import { useAdminForm } from "@/components/admin/forms/use-admin-form";
import { blackBook } from "@/lib/landing-content";

export function BlackBookEditor() {
	const { data, setField, isDirty, isSaving, saveMessage, save, discard } =
		useAdminForm({ ...blackBook });

	return (
		<>
			<AdminPageHeader
				title="Black Book"
				description="Lead capture section copy."
				previewHref="/"
			/>
			<AdminPanel>
				<div className="grid gap-5">
					<AdminField label="Title" htmlFor="bb-title">
						<AdminInput
							id="bb-title"
							value={data.title}
							onChange={(e) => setField("title", e.target.value)}
						/>
					</AdminField>
					<AdminField label="Subtitle" htmlFor="bb-subtitle">
						<AdminInput
							id="bb-subtitle"
							value={data.subtitle}
							onChange={(e) => setField("subtitle", e.target.value)}
						/>
					</AdminField>
					<AdminField label="Email placeholder" htmlFor="bb-placeholder">
						<AdminInput
							id="bb-placeholder"
							value={data.placeholder}
							onChange={(e) => setField("placeholder", e.target.value)}
						/>
					</AdminField>
					<AdminField label="Button label" htmlFor="bb-button">
						<AdminInput
							id="bb-button"
							value={data.buttonLabel}
							onChange={(e) => setField("buttonLabel", e.target.value)}
						/>
					</AdminField>
				</div>
			</AdminPanel>
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
