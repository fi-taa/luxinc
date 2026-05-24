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
import { architects } from "@/lib/landing-content";
import type { PersonCard } from "@/lib/landing-content";
import { ContentArticlesPanel } from "./content-articles-panel";

interface ArchitectsFormState {
	title: string;
	subtitle: string;
	members: PersonCard[];
}

const initialArchitectsState: ArchitectsFormState = {
	title: architects.title,
	subtitle: architects.subtitle,
	members: architects.members.map((member) => ({ ...member })),
};

export function ArchitectsSectionEditor() {
	const { data, setField, isDirty, isSaving, saveMessage, save, discard } =
		useAdminForm(initialArchitectsState);

	return (
		<>
			<AdminPageHeader
				title="Architects"
				description="Architect cards and links to detail articles."
				previewHref="/#architects"
			/>
			<div className="space-y-6">
				<AdminPanel title="Section">
					<div className="grid gap-5 md:grid-cols-2">
						<AdminField label="Title" htmlFor="architects-title">
							<AdminInput
								id="architects-title"
								value={data.title}
								onChange={(e) => setField("title", e.target.value)}
							/>
						</AdminField>
						<AdminField label="Subtitle" htmlFor="architects-subtitle">
							<AdminInput
								id="architects-subtitle"
								value={data.subtitle}
								onChange={(e) => setField("subtitle", e.target.value)}
							/>
						</AdminField>
					</div>
				</AdminPanel>
				<AdminPanel>
					<AdminRepeater<PersonCard>
						label="Architect members"
						addLabel="Add architect"
						emptyMessage="No architect cards yet. Add a member to show on the homepage."
						items={data.members}
						onChange={(members) => setField("members", members)}
						createItem={() => ({
							name: "",
							role: "",
							image: "/images/a1.png",
							imageAlt: "",
							slug: "new-architect",
						})}
						getKey={(item, index) => `${item.slug}-${index}`}
						renderItem={(item, index, update) => (
							<div className="space-y-4">
								<AdminImageField
									label="Portrait"
									imageSrc={item.image}
									imageAlt={item.imageAlt}
									onImageSrcChange={(value) => update({ image: value })}
									onImageAltChange={(value) => update({ imageAlt: value })}
								/>
								<div className="grid gap-4 md:grid-cols-2">
									<AdminField label="Name" htmlFor={`arch-name-${index}`}>
										<AdminInput
											id={`arch-name-${index}`}
											value={item.name}
											onChange={(e) => update({ name: e.target.value })}
										/>
									</AdminField>
									<AdminField label="Slug" htmlFor={`arch-slug-${index}`}>
										<AdminInput
											id={`arch-slug-${index}`}
											value={item.slug}
											onChange={(e) => update({ slug: e.target.value })}
										/>
									</AdminField>
									<AdminField
										label="Role"
										htmlFor={`arch-role-${index}`}
										className="md:col-span-2"
									>
										<AdminTextarea
											id={`arch-role-${index}`}
											value={item.role}
											onChange={(e) => update({ role: e.target.value })}
										/>
									</AdminField>
								</div>
								<Link
									href={`/admin/landing/architects/${item.slug}`}
									className="inline-flex font-sans text-sm text-luxinc-gold hover:text-luxinc-gold-muted"
								>
									Edit detail article →
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
