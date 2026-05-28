"use client";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import {
	AdminField,
	AdminInput,
	AdminTextarea,
} from "@/components/admin/forms/admin-field";
import { AdminImageField } from "@/components/admin/forms/admin-image-field";
import { AdminRepeater } from "@/components/admin/forms/admin-repeater";
import { AdminStickySaveBar } from "@/components/admin/forms/admin-sticky-save-bar";
import { useAdminForm } from "@/components/admin/forms/use-admin-form";
import { saveCrownCollection } from "@/lib/cms/save-landing";
import type {
	CrownCollectionFormState,
	ExperienceCardRecord,
} from "@/lib/cms/types";

export function CrownCollectionEditor({
	initialData,
}: {
	initialData: CrownCollectionFormState;
}) {
	const { data, setField, isDirty, isSaving, saveMessage, save, discard } =
		useAdminForm(initialData, { onSave: saveCrownCollection });

	return (
		<>
			<AdminPageHeader
				title="Crown Collection"
				description="Featured experiences from the crown_collections table."
				previewHref="/#crown-collection"
			/>
			<div className="space-y-6">
				<AdminPanel>
					<AdminRepeater<ExperienceCardRecord>
						label="Crown collection items"
						addLabel="Add item"
						emptyMessage="No crown collection items yet."
						items={data.cards}
						onChange={(cards) => setField("cards", cards)}
						createItem={() => ({
							title: "",
							description: "",
							image: "/images/c1.png",
							imageAlt: "",
							href: "#",
						})}
						getKey={(item, index) => item.id ?? `${item.title}-${index}`}
						renderItem={(item, index, update) => (
							<div className="space-y-4">
								<AdminImageField
									label="Image"
									imageSrc={item.image}
									imageAlt={item.imageAlt || item.title}
									onImageSrcChange={(value) => update({ image: value })}
									onImageAltChange={(value) => update({ imageAlt: value })}
								/>
								<div className="grid gap-4 md:grid-cols-2">
									<AdminField label="Title" htmlFor={`crown-title-${index}`}>
										<AdminInput
											id={`crown-title-${index}`}
											value={item.title}
											onChange={(e) => update({ title: e.target.value })}
										/>
									</AdminField>
									<AdminField
										label="Description"
										htmlFor={`crown-desc-${index}`}
										className="md:col-span-2"
									>
										<AdminTextarea
											id={`crown-desc-${index}`}
											value={item.description}
											onChange={(e) => update({ description: e.target.value })}
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
