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
import { journal } from "@/lib/landing-content";
import { ContentArticlesPanel } from "./content-articles-panel";

interface JournalHighlight {
	id: string;
	label: string;
	body: string;
	href: string;
}

interface JournalFormState {
	title: string;
	subtitle: string;
	collageImage: string;
	collageAlt: string;
	cta: string;
	ctaHref: string;
	highlights: JournalHighlight[];
}

const initialJournalState: JournalFormState = {
	title: journal.title,
	subtitle: journal.subtitle,
	collageImage: journal.collageImage,
	collageAlt: journal.collageAlt,
	cta: journal.cta,
	ctaHref: journal.ctaHref,
	highlights: [
		{
			id: "case-study",
			label: journal.caseStudy.label,
			body: journal.caseStudy.body,
			href: journal.caseStudyHref,
		},
		{
			id: "memo",
			label: journal.memo.label,
			body: journal.memo.body,
			href: journal.memoHref,
		},
	],
};

export function JournalSectionEditor() {
	const { data, setField, isDirty, isSaving, saveMessage, save, discard } =
		useAdminForm(initialJournalState);

	return (
		<>
			<AdminPageHeader
				title="Journal"
				description="Journal section highlights on the homepage."
				previewHref="/#journal"
			/>
			<div className="space-y-6">
				<AdminPanel title="Section">
					<div className="grid gap-5 md:grid-cols-2">
						<AdminField label="Title" htmlFor="journal-title">
							<AdminInput
								id="journal-title"
								value={data.title}
								onChange={(e) => setField("title", e.target.value)}
							/>
						</AdminField>
						<AdminField label="Subtitle" htmlFor="journal-subtitle">
							<AdminInput
								id="journal-subtitle"
								value={data.subtitle}
								onChange={(e) => setField("subtitle", e.target.value)}
							/>
						</AdminField>
						<AdminField label="CTA label" htmlFor="journal-cta">
							<AdminInput
								id="journal-cta"
								value={data.cta}
								onChange={(e) => setField("cta", e.target.value)}
							/>
						</AdminField>
						<AdminField label="CTA href" htmlFor="journal-cta-href">
							<AdminInput
								id="journal-cta-href"
								value={data.ctaHref}
								onChange={(e) => setField("ctaHref", e.target.value)}
							/>
						</AdminField>
					</div>
					<div className="mt-5">
						<AdminImageField
							label="Collage image"
							imageSrc={data.collageImage}
							imageAlt={data.collageAlt}
							onImageSrcChange={(value) => setField("collageImage", value)}
							onImageAltChange={(value) => setField("collageAlt", value)}
						/>
					</div>
				</AdminPanel>
				<AdminPanel>
					<AdminRepeater<JournalHighlight>
						label="Highlight cards"
						addLabel="Add highlight"
						emptyMessage="No highlight cards on the journal section. Add case studies or memos."
						items={data.highlights}
						onChange={(highlights) => setField("highlights", highlights)}
						createItem={() => ({
							id: `highlight-${Date.now()}`,
							label: "NEW HIGHLIGHT",
							body: "",
							href: "/journal/",
						})}
						getKey={(item) => item.id}
						renderItem={(item, index, update) => (
							<div className="grid gap-4">
								<div className="grid gap-4 md:grid-cols-2">
									<AdminField label="Label" htmlFor={`hl-label-${index}`}>
										<AdminInput
											id={`hl-label-${index}`}
											value={item.label}
											onChange={(e) => update({ label: e.target.value })}
										/>
									</AdminField>
									<AdminField label="Link href" htmlFor={`hl-href-${index}`}>
										<AdminInput
											id={`hl-href-${index}`}
											value={item.href}
											onChange={(e) => update({ href: e.target.value })}
										/>
									</AdminField>
									<AdminField
										label="Body"
										htmlFor={`hl-body-${index}`}
										className="md:col-span-2"
									>
										<AdminTextarea
											id={`hl-body-${index}`}
											value={item.body}
											onChange={(e) => update({ body: e.target.value })}
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
