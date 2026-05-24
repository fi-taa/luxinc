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
import {
	getContentDetailPath,
	type ContentCategory,
	type ContentDetail,
	type ContentParagraph,
	type TableOfContentsItem,
} from "@/lib/content-detail";

interface ContentDetailEditorProps {
	category: ContentCategory;
	detail: ContentDetail;
	isNew?: boolean;
}

function paragraphsToText(paragraphs: ContentParagraph[]): string {
	return paragraphs
		.map((paragraph) =>
			paragraph.segments.map((segment) => segment.text).join(""),
		)
		.join("\n\n");
}

function textToParagraphs(text: string): ContentParagraph[] {
	return text
		.split(/\n\n+/)
		.filter(Boolean)
		.map((block) => ({
			segments: [{ text: block }],
		}));
}

export function ContentDetailEditor({
	category,
	detail,
	isNew = false,
}: ContentDetailEditorProps) {
	const initial: ContentDetail & { bodyText: string } = {
		...detail,
		bodyText: paragraphsToText(detail.paragraphs),
		tableOfContents: detail.tableOfContents ?? [],
	};

	const { data, setField, isDirty, isSaving, saveMessage, save, discard } =
		useAdminForm(initial);

	return (
		<>
			<AdminPageHeader
				title={
					isNew
						? `New ${category === "journal" ? "journal" : "architect"} article`
						: category === "journal"
							? "Journal article"
							: "Architect article"
				}
				description={
					isNew
						? "Set a unique slug and save when persistence is connected."
						: data.title
				}
				previewHref={
					isNew || !data.slug.trim()
						? undefined
						: getContentDetailPath(category, data.slug)
				}
			/>
			{isNew ? (
				<p className="-mt-3 mb-4 font-sans text-sm text-luxinc-gold">
					New article — fill in the slug and content below, then save.
				</p>
			) : null}
			<div className="space-y-6">
				<AdminPanel title="Article">
					<div className="grid gap-5 md:grid-cols-2">
						<AdminField label="Title" htmlFor="detail-title">
							<AdminInput
								id="detail-title"
								value={data.title}
								onChange={(e) => setField("title", e.target.value)}
							/>
						</AdminField>
						<AdminField label="Date" htmlFor="detail-date">
							<AdminInput
								id="detail-date"
								value={data.date}
								onChange={(e) => setField("date", e.target.value)}
							/>
						</AdminField>
						<AdminField label="Slug" htmlFor="detail-slug">
							<AdminInput
								id="detail-slug"
								value={data.slug}
								onChange={(e) => setField("slug", e.target.value)}
							/>
						</AdminField>
					</div>
					<div className="mt-5">
						<AdminImageField
							label="Hero image"
							imageSrc={data.image}
							imageAlt={data.imageAlt}
							onImageSrcChange={(value) => setField("image", value)}
							onImageAltChange={(value) => setField("imageAlt", value)}
						/>
					</div>
				</AdminPanel>
				<AdminPanel title="Body">
					<AdminField
						label="Paragraphs"
						htmlFor="detail-body"
						hint="Separate paragraphs with a blank line."
					>
						<AdminTextarea
							id="detail-body"
							value={data.bodyText}
							onChange={(e) => {
								setField("bodyText", e.target.value);
								setField("paragraphs", textToParagraphs(e.target.value));
							}}
							className="min-h-[240px]"
						/>
					</AdminField>
				</AdminPanel>
				<AdminPanel>
					<AdminRepeater<TableOfContentsItem>
						label="Table of contents"
						addLabel="Add section"
						emptyMessage="No table of contents entries. Add sections for long articles."
						items={data.tableOfContents ?? []}
						onChange={(tableOfContents) =>
							setField("tableOfContents", tableOfContents)
						}
						createItem={() => ({
							id: `section-${Date.now()}`,
							label: "New section",
						})}
						getKey={(item, index) => `${item.id}-${index}`}
						renderItem={(item, index, update) => (
							<div className="grid gap-4 md:grid-cols-2">
								<AdminField label="ID" htmlFor={`toc-id-${index}`}>
									<AdminInput
										id={`toc-id-${index}`}
										value={item.id}
										onChange={(e) => update({ id: e.target.value })}
									/>
								</AdminField>
								<AdminField label="Label" htmlFor={`toc-label-${index}`}>
									<AdminInput
										id={`toc-label-${index}`}
										value={item.label}
										onChange={(e) => update({ label: e.target.value })}
									/>
								</AdminField>
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
