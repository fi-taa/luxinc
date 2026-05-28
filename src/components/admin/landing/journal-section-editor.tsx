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
import { saveJournalSection } from "@/lib/cms/save-landing";
import type { JournalAdminFormState, JournalHighlightForm } from "@/lib/cms/types";
import { ContentArticlesPanel } from "./content-articles-panel";

export function JournalSectionEditor({
	initialData,
}: {
	initialData: JournalAdminFormState;
}) {
	const { data, setField, isDirty, isSaving, saveMessage, save, discard } =
		useAdminForm(initialData, { onSave: saveJournalSection });

	return (
		<>
			<AdminPageHeader
				title="Journal"
				description="Journal entries for the homepage highlights and detail pages. Homepage collage image is fixed in code; entry images are used on detail pages only."
				previewHref="/#journal"
			/>
			<div className="space-y-6">
				<AdminPanel>
					<AdminRepeater<JournalHighlightForm>
						label="Journal entries"
						addLabel="Add entry"
						emptyMessage="No journal entries yet. Add case studies or memos."
						items={data.highlights}
						onChange={(highlights) => setField("highlights", highlights)}
						createItem={() => ({
							id: `journal-${Date.now()}`,
							title: "New journal entry",
							subTitle: "CASE STUDY",
							body: "",
							description: "",
							image: "/images/j.png",
							imageAlt: "",
						})}
						getKey={(item) => item.id}
						renderItem={(item, index, update) => (
							<div className="grid gap-4">
								<AdminImageField
									label="Image"
									imageSrc={item.image}
									imageAlt={item.imageAlt || item.title}
									onImageSrcChange={(value) => update({ image: value })}
									onImageAltChange={(value) => update({ imageAlt: value })}
								/>
								<div className="grid gap-4 md:grid-cols-2">
									<AdminField label="Title" htmlFor={`jn-title-${index}`}>
										<AdminInput
											id={`jn-title-${index}`}
											value={item.title}
											onChange={(e) => update({ title: e.target.value })}
										/>
									</AdminField>
									<AdminField label="Subtitle (card label)" htmlFor={`jn-sub-${index}`}>
										<AdminInput
											id={`jn-sub-${index}`}
											value={item.subTitle}
											onChange={(e) => update({ subTitle: e.target.value })}
										/>
									</AdminField>
									<AdminField
										label="Short description (homepage card)"
										htmlFor={`jn-body-${index}`}
										className="md:col-span-2"
									>
										<AdminTextarea
											id={`jn-body-${index}`}
											value={item.body}
											onChange={(e) => update({ body: e.target.value })}
										/>
									</AdminField>
									<AdminField
										label="Full description (detail page)"
										htmlFor={`jn-desc-${index}`}
										className="md:col-span-2"
									>
										<AdminTextarea
											id={`jn-desc-${index}`}
											value={item.description}
											onChange={(e) => update({ description: e.target.value })}
											rows={6}
										/>
									</AdminField>
								</div>
							</div>
						)}
					/>
				</AdminPanel>
				<ContentArticlesPanel category="journal" />
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
