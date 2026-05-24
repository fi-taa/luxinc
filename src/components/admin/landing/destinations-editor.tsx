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
import { destinations } from "@/lib/landing-content";
import type { DestinationSlide } from "@/lib/landing-content";

interface DestinationsFormState {
	titleImage: string;
	titleImageAlt: string;
	slides: DestinationSlide[];
}

const initialDestinationsState: DestinationsFormState = {
	titleImage: destinations.titleImage,
	titleImageAlt: destinations.titleImageAlt,
	slides: destinations.slides.map((slide) => ({ ...slide })),
};

export function DestinationsEditor() {
	const { data, setField, isDirty, isSaving, saveMessage, save, discard } =
		useAdminForm(initialDestinationsState);

	return (
		<>
			<AdminPageHeader
				title="Destinations"
				description="Signature destination carousel."
				previewHref="/#destinations"
			/>
			<div className="space-y-6">
				<AdminPanel title="Title image">
					<AdminImageField
						label="Featured image"
						imageSrc={data.titleImage}
						imageAlt={data.titleImageAlt}
						onImageSrcChange={(value) => setField("titleImage", value)}
						onImageAltChange={(value) => setField("titleImageAlt", value)}
					/>
				</AdminPanel>
				<AdminPanel>
					<AdminRepeater<DestinationSlide>
						label="Carousel slides"
						addLabel="Add slide"
						emptyMessage="No destination slides. Add your first carousel slide."
						items={data.slides}
						onChange={(slides) => setField("slides", slides)}
						createItem={() => ({
							image: "/images/sd.png",
							imageAlt: "",
							headline: "",
							subtitle: "",
							description: "",
						})}
						getKey={(item, index) => `${item.headline}-${index}`}
						renderItem={(item, index, update) => (
							<div className="space-y-4">
								<AdminImageField
									label="Slide image"
									imageSrc={item.image}
									imageAlt={item.imageAlt}
									onImageSrcChange={(value) => update({ image: value })}
									onImageAltChange={(value) => update({ imageAlt: value })}
								/>
								<div className="grid gap-4 md:grid-cols-2">
									<AdminField label="Headline" htmlFor={`slide-headline-${index}`}>
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
