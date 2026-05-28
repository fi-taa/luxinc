"use client";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import {
	AdminField,
	AdminInput,
	AdminTextarea,
} from "@/components/admin/forms/admin-field";
import { AdminRepeater } from "@/components/admin/forms/admin-repeater";
import { AdminStickySaveBar } from "@/components/admin/forms/admin-sticky-save-bar";
import { AdminToggle } from "@/components/admin/forms/admin-toggle";
import { useAdminForm } from "@/components/admin/forms/use-admin-form";
import { saveFeedbackSection } from "@/lib/cms/save-landing";
import type { FeedbackAdminFormState, FeedbackFormItem } from "@/lib/cms/types";

export function FeedbackSectionEditor({
	initialData,
}: {
	initialData: FeedbackAdminFormState;
}) {
	const { data, setField, isDirty, isSaving, saveMessage, save, discard } =
		useAdminForm(initialData, { onSave: saveFeedbackSection });

	return (
		<>
			<AdminPageHeader
				title="Client feedback"
				description="Testimonials shown in the quote block above the footer. The featured entry is displayed on the homepage."
				previewHref="/"
			/>
			<div className="space-y-6">
				<AdminPanel>
					<AdminRepeater<FeedbackFormItem>
						label="Testimonials"
						addLabel="Add testimonial"
						emptyMessage="No feedback entries yet."
						items={data.items}
						onChange={(items) => setField("items", items)}
						createItem={() => ({
							id: `feedback-${Date.now()}`,
							fullName: "",
							description: "",
							featured: false,
						})}
						getKey={(item) => item.id}
						renderItem={(item, index, update) => (
							<div className="grid gap-4">
								<AdminToggle
									id={`fb-featured-${index}`}
									label="Featured (shown above footer)"
									checked={item.featured}
									onChange={(featured) => update({ featured })}
								/>
								<div className="grid gap-4 md:grid-cols-2">
									<AdminField label="Name" htmlFor={`fb-name-${index}`}>
										<AdminInput
											id={`fb-name-${index}`}
											value={item.fullName}
											onChange={(e) => update({ fullName: e.target.value })}
											placeholder="Mrs. Salmani A."
										/>
									</AdminField>
									<AdminField
										label="Quote"
										htmlFor={`fb-desc-${index}`}
										className="md:col-span-2"
									>
										<AdminTextarea
											id={`fb-desc-${index}`}
											value={item.description}
											onChange={(e) => update({ description: e.target.value })}
											rows={4}
										/>
									</AdminField>
								</div>
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
