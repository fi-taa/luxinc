"use client";

import Link from "next/link";
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
import { saveArchitectsSection } from "@/lib/cms/save-landing";
import { getArchitectDetailPath } from "@/lib/content-detail";
import type { PersonCardRecord } from "@/lib/cms/types";
import type { ArchitectsFormState } from "@/lib/cms/types";
import { ContentArticlesPanel } from "./content-articles-panel";

export function ArchitectsSectionEditor({
	initialData,
}: {
	initialData: ArchitectsFormState;
}) {
	const { data, setField, isDirty, isSaving, saveMessage, save, discard } =
		useAdminForm(initialData, { onSave: saveArchitectsSection });

	return (
		<>
			<AdminPageHeader
				title="Architects"
				description="Landing cards from the architects table (title, subtitle, short description)."
				previewHref="/#architects"
			/>
			<div className="space-y-6">
				<AdminPanel>
					<AdminRepeater<PersonCardRecord>
						label="Architect cards"
						addLabel="Add architect"
						emptyMessage="No architect cards yet."
						items={data.members}
						onChange={(members) => setField("members", members)}
						createItem={() => ({
							name: "",
							role: "",
							subTitle: "",
							description: "",
							image: "/images/a1.png",
							imageAlt: "",
							slug: "new-architect",
						})}
						getKey={(item, index) => item.id ?? `${item.name}-${index}`}
						renderItem={(item, index, update) => (
							<div className="space-y-4">
								<AdminImageField
									label="Portrait"
									imageSrc={item.image}
									imageAlt={item.imageAlt || item.name}
									onImageSrcChange={(value) => update({ image: value })}
									onImageAltChange={(value) => update({ imageAlt: value })}
								/>
								<div className="grid gap-4 md:grid-cols-2">
									<AdminField label="Title" htmlFor={`arch-title-${index}`}>
										<AdminInput
											id={`arch-title-${index}`}
											value={item.name}
											onChange={(e) => update({ name: e.target.value })}
										/>
									</AdminField>
									<AdminField label="Subtitle" htmlFor={`arch-sub-${index}`}>
										<AdminInput
											id={`arch-sub-${index}`}
											value={item.subTitle ?? ""}
											onChange={(e) => update({ subTitle: e.target.value })}
										/>
									</AdminField>
									<AdminField
										label="Short description"
										htmlFor={`arch-short-${index}`}
										className="md:col-span-2"
									>
										<AdminTextarea
											id={`arch-short-${index}`}
											value={item.role}
											onChange={(e) => update({ role: e.target.value })}
										/>
									</AdminField>
									<AdminField
										label="Description"
										htmlFor={`arch-desc-${index}`}
										className="md:col-span-2"
									>
										<AdminTextarea
											id={`arch-desc-${index}`}
											value={item.description ?? ""}
											onChange={(e) => update({ description: e.target.value })}
										/>
									</AdminField>
								</div>
								{item.id ? (
									<Link
										href={getArchitectDetailPath(item.id)}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex font-sans text-sm text-luxinc-gold hover:text-luxinc-gold-muted"
									>
										View detail page →
									</Link>
								) : null}
								<Link
									href={`/admin/landing/architects/${item.slug}`}
									className="inline-flex font-sans text-sm text-luxinc-text-muted hover:text-luxinc-gold"
								>
									Edit legacy article →
								</Link>
							</div>
						)}
					/>
				</AdminPanel>
				<ContentArticlesPanel category="architects" />
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
