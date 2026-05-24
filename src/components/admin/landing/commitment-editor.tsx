"use client";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminField, AdminInput } from "@/components/admin/forms/admin-field";
import { AdminStickySaveBar } from "@/components/admin/forms/admin-sticky-save-bar";
import { useAdminForm } from "@/components/admin/forms/use-admin-form";
import { commitment } from "@/lib/landing-content";

export function CommitmentEditor() {
	const { data, setField, isDirty, isSaving, saveMessage, save, discard } =
		useAdminForm({ ...commitment });

	return (
		<>
			<AdminPageHeader
				title="Commitment"
				description="The Luxinc 4-hour promise strip."
				previewHref="/#destinations"
			/>
			<AdminPanel>
				<div className="grid gap-5 md:grid-cols-2">
					<AdminField label="Symbol" htmlFor="commitment-symbol">
						<AdminInput
							id="commitment-symbol"
							value={data.symbol}
							onChange={(e) => setField("symbol", e.target.value)}
						/>
					</AdminField>
					<AdminField label="Highlight phrase" htmlFor="commitment-highlight">
						<AdminInput
							id="commitment-highlight"
							value={data.highlight}
							onChange={(e) => setField("highlight", e.target.value)}
						/>
					</AdminField>
					<AdminField label="Line 1" htmlFor="commitment-line1" className="md:col-span-2">
						<AdminInput
							id="commitment-line1"
							value={data.line1}
							onChange={(e) => setField("line1", e.target.value)}
						/>
					</AdminField>
					<AdminField label="Line 2" htmlFor="commitment-line2" className="md:col-span-2">
						<AdminInput
							id="commitment-line2"
							value={data.line2}
							onChange={(e) => setField("line2", e.target.value)}
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
