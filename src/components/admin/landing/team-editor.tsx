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
import { team } from "@/lib/landing-content";
import type { PersonCard } from "@/lib/landing-content";

interface TeamFormState {
	title: string;
	subtitle: string;
	members: PersonCard[];
}

const initialTeamState: TeamFormState = {
	title: team.title,
	subtitle: team.subtitle,
	members: team.members.map((member) => ({ ...member })),
};

export function TeamEditor() {
	const { data, setField, isDirty, isSaving, saveMessage, save, discard } =
		useAdminForm(initialTeamState);

	return (
		<>
			<AdminPageHeader
				title="Team"
				description="Meet the team carousel."
				previewHref="/"
			/>
			<div className="space-y-6">
				<AdminPanel title="Section">
					<div className="grid gap-5 md:grid-cols-2">
						<AdminField label="Title" htmlFor="team-title">
							<AdminInput
								id="team-title"
								value={data.title}
								onChange={(e) => setField("title", e.target.value)}
							/>
						</AdminField>
						<AdminField label="Subtitle" htmlFor="team-subtitle">
							<AdminInput
								id="team-subtitle"
								value={data.subtitle}
								onChange={(e) => setField("subtitle", e.target.value)}
							/>
						</AdminField>
					</div>
				</AdminPanel>
				<AdminPanel>
					<AdminRepeater<PersonCard>
						label="Team members"
						addLabel="Add team member"
						emptyMessage="No team members in the carousel."
						items={data.members}
						onChange={(members) => setField("members", members)}
						createItem={() => ({
							name: "",
							role: "",
							image: "/images/c1.png",
							imageAlt: "",
							slug: "",
						})}
						getKey={(item, index) => `${item.name}-${index}`}
						renderItem={(item, index, update) => (
							<div className="space-y-4">
								<AdminImageField
									label="Photo"
									imageSrc={item.image}
									imageAlt={item.imageAlt}
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
									<AdminField label="Role" htmlFor={`team-role-${index}`} className="md:col-span-2">
										<AdminTextarea
											id={`team-role-${index}`}
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
