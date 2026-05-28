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
import { saveDestinations } from "@/lib/cms/save-landing";
import type { DestinationSlide } from "@/lib/landing-content";
import type { DestinationsFormState } from "@/lib/cms/types";

export function DestinationsEditor({
	initialData,
}: {
	initialData: DestinationsFormState;
}) {
	const { data, setField, isDirty, isSaving, saveMessage, save, discard } =
		useAdminForm(initialData, { onSave: saveDestinations });

	return (
		<>
			<AdminPageHeader
				title="Destinations"
				description="Signature destination carousel."
				previewHref="/#destinations"
			/>
			<div className="space-y-6">
				<AdminPanel>
					<AdminRepeater<DestinationSlide & { id?: string }>
						label="Destinations"
						addLabel="Add destination"
						emptyMessage="No destinations yet. Add your first destination."
						items={data.slides}
						onChange={(slides) => setField("slides", slides)}
						createItem={() => ({
							image: "/images/sd2.png",
							images: ["/images/sd2.png"],
							imageAlt: "",
							headline: "",
							subtitle: "",
							description: "",
						})}
						getKey={(item, index) => item.id ?? `${item.headline}-${index}`}
						renderItem={(item, index, update) => (
							<div className="space-y-4">
								<AdminImageField
									label="Primary image"
									imageSrc={item.image}
									imageAlt={item.imageAlt}
									onImageSrcChange={(value) => {
										const images = item.images?.length
											? [value, ...item.images.slice(1)]
											: [value];
										update({ image: value, images });
									}}
									onImageAltChange={(value) => update({ imageAlt: value })}
								/>
								<AdminField
									label="Additional image URLs (one per line)"
									htmlFor={`slide-images-${index}`}
									className="md:col-span-2"
								>
									<AdminTextarea
										id={`slide-images-${index}`}
										value={(item.images ?? [item.image]).filter(Boolean).join("\n")}
										onChange={(e) => {
											const urls = e.target.value
												.split("\n")
												.map((line) => line.trim())
												.filter(Boolean);
											update({
												images: urls,
												image: urls[0] ?? "",
											});
										}}
										rows={3}
									/>
								</AdminField>
								<div className="grid gap-4 md:grid-cols-2">
									<AdminField label="Title" htmlFor={`slide-headline-${index}`}>
										<AdminInput
											id={`slide-headline-${index}`}
											value={item.headline}
											onChange={(e) => update({ headline: e.target.value })}
										/>
									</AdminField>
									<AdminField label="Subtitle" htmlFor={`slide-subtitle-${index}`}>
										<AdminInput
											id={`slide-subtitle-${index}`}
											value={item.subtitle}
											onChange={(e) => update({ subtitle: e.target.value })}
										/>
									</AdminField>
									<AdminField
										label="Description"
										htmlFor={`slide-desc-${index}`}
										className="md:col-span-2"
									>
										<AdminTextarea
											id={`slide-desc-${index}`}
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
