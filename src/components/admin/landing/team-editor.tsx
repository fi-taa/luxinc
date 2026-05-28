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
import { saveTeamSection } from "@/lib/cms/save-landing";
import type { PersonCardRecord, TeamFormState } from "@/lib/cms/types";

export function TeamEditor({ initialData }: { initialData: TeamFormState }) {
	const { data, setField, isDirty, isSaving, saveMessage, save, discard } =
		useAdminForm(initialData, { onSave: saveTeamSection });

	return (
		<>
			<AdminPageHeader
				title="Team"
				description="Team carousel from public.teams (avatar_url, full_name, description)."
				previewHref="/#team"
			/>
			<div className="space-y-6">
				<AdminPanel>
					<AdminRepeater<PersonCardRecord>
						label="Team members"
						addLabel="Add team member"
						emptyMessage="No team members yet."
						items={data.members}
						onChange={(members) => setField("members", members)}
						createItem={() => ({
							name: "",
							role: "",
							image: "/images/c1.png",
							imageAlt: "",
							slug: "",
						})}
						getKey={(item, index) => item.id ?? `${item.name}-${index}`}
						renderItem={(item, index, update) => (
							<div className="space-y-4">
								<AdminImageField
									label="Avatar"
									imageSrc={item.image}
									imageAlt={item.imageAlt || item.name}
									onImageSrcChange={(value) => update({ image: value })}
									onImageAltChange={(value) => update({ imageAlt: value })}
								/>
								<div className="grid gap-4 md:grid-cols-2">
									<AdminField label="Name" htmlFor={`team-name-${index}`}>
										<AdminInput
											id={`team-name-${index}`}
											value={item.name}
											onChange={(e) => update({ name: e.target.value })}
										/>
									</AdminField>
									<AdminField
										label="Description"
										htmlFor={`team-desc-${index}`}
										className="md:col-span-2"
									>
										<AdminTextarea
											id={`team-desc-${index}`}
											value={item.role}
											onChange={(e) => update({ role: e.target.value })}
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
