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
import { AdminToggle } from "@/components/admin/forms/admin-toggle";
import { useAdminForm } from "@/components/admin/forms/use-admin-form";
import { crownCollection } from "@/lib/landing-content";
import type { ExperienceCard } from "@/lib/landing-content";

interface CrownCollectionFormState {
	title: string;
	subtitle: string;
	cards: ExperienceCard[];
}

const initialCrownState: CrownCollectionFormState = {
	title: crownCollection.title,
	subtitle: crownCollection.subtitle,
	cards: crownCollection.cards.map((card) => ({ ...card })),
};

export function CrownCollectionEditor() {
	const { data, setField, isDirty, isSaving, saveMessage, save, discard } =
		useAdminForm(initialCrownState);

	return (
		<>
			<AdminPageHeader
				title="Crown Collection"
				description="Featured experience cards."
				previewHref="/#crown-collection"
			/>
			<div className="space-y-6">
				<AdminPanel title="Section">
					<div className="grid gap-5 md:grid-cols-2">
						<AdminField label="Title" htmlFor="crown-title">
							<AdminInput
								id="crown-title"
								value={data.title}
								onChange={(e) => setField("title", e.target.value)}
							/>
						</AdminField>
						<AdminField label="Subtitle" htmlFor="crown-subtitle">
							<AdminInput
								id="crown-subtitle"
								value={data.subtitle}
								onChange={(e) => setField("subtitle", e.target.value)}
							/>
						</AdminField>
					</div>
				</AdminPanel>
				<AdminPanel>
					<AdminRepeater<ExperienceCard>
						label="Experience cards"
						addLabel="Add card"
						emptyMessage="No crown collection cards yet."
						items={data.cards}
						onChange={(cards) => setField("cards", cards)}
						createItem={() => ({
							title: "",
							description: "",
							image: "/images/c1.png",
							imageAlt: "",
							href: "#",
							featured: false,
						})}
						getKey={(item, index) => `${item.title}-${index}`}
						renderItem={(item, index, update) => (
							<div className="space-y-4">
								<AdminImageField
									label="Card image"
									imageSrc={item.image}
									imageAlt={item.imageAlt}
									onImageSrcChange={(value) => update({ image: value })}
									onImageAltChange={(value) => update({ imageAlt: value })}
								/>
								<div className="grid gap-4 md:grid-cols-2">
									<AdminField label="Title" htmlFor={`crown-card-title-${index}`}>
										<AdminInput
											id={`crown-card-title-${index}`}
											value={item.title}
											onChange={(e) => update({ title: e.target.value })}
										/>
									</AdminField>
									<AdminField label="Href" htmlFor={`crown-card-href-${index}`}>
										<AdminInput
											id={`crown-card-href-${index}`}
											value={item.href}
											onChange={(e) => update({ href: e.target.value })}
										/>
									</AdminField>
									<AdminField
										label="Description"
										htmlFor={`crown-card-desc-${index}`}
										className="md:col-span-2"
									>
										<AdminTextarea
											id={`crown-card-desc-${index}`}
											value={item.description}
											onChange={(e) => update({ description: e.target.value })}
										/>
									</AdminField>
									<AdminToggle
										id={`crown-card-featured-${index}`}
										label="Featured card"
										checked={Boolean(item.featured)}
										onChange={(featured) => update({ featured })}
									/>
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
