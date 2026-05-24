"use client";

import { Plus, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import {
	AdminField,
	AdminInput,
	AdminSelect,
} from "@/components/admin/forms/admin-field";
import { AdminImageField } from "@/components/admin/forms/admin-image-field";
import { AdminRepeater } from "@/components/admin/forms/admin-repeater";
import { AdminStickySaveBar } from "@/components/admin/forms/admin-sticky-save-bar";
import { useAdminForm } from "@/components/admin/forms/use-admin-form";
import { offices } from "@/lib/landing-content";
import type {
	ConfidentialContactLine,
	OfficeLocationCard,
} from "@/lib/landing-content";

interface ContactFormState {
	title: string;
	subtitle: string;
	officeLocations: OfficeLocationCard[];
	confidentialTitle: string;
	confidentialLines: ConfidentialContactLine[];
}

function OfficeAddressLines({
	lines,
	officeIndex,
	onChange,
}: {
	lines: string[];
	officeIndex: number;
	onChange: (lines: string[]) => void;
}) {
	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between gap-4">
				<p className="font-sans text-sm font-semibold text-luxinc-text">
					Address lines
				</p>
				<button
					type="button"
					onClick={() => onChange([...lines, ""])}
					className="inline-flex h-8 items-center gap-1.5 rounded-sm border border-luxinc-gold/40 bg-luxinc-gold/10 px-3 font-sans text-xs font-medium text-luxinc-gold transition-colors hover:border-luxinc-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold"
				>
					<Plus className="size-3.5" aria-hidden />
					Add line
				</button>
			</div>
			{lines.length === 0 ? (
				<p className="font-sans text-sm text-luxinc-text-muted">
					No address lines. Add at least one.
				</p>
			) : (
				<div className="space-y-3">
					{lines.map((line, lineIndex) => (
						<div
							key={`office-${officeIndex}-line-${lineIndex}`}
							className="flex gap-2"
						>
							<AdminField
								label={`Line ${lineIndex + 1}`}
								htmlFor={`office-${officeIndex}-line-${lineIndex}`}
								className="min-w-0 flex-1"
							>
								<AdminInput
									id={`office-${officeIndex}-line-${lineIndex}`}
									value={line}
									onChange={(e) => {
										const next = [...lines];
										next[lineIndex] = e.target.value;
										onChange(next);
									}}
								/>
							</AdminField>
							<button
								type="button"
								onClick={() =>
									onChange(lines.filter((_, i) => i !== lineIndex))
								}
								className="mt-7 inline-flex size-8 shrink-0 items-center justify-center text-[#FF7F50] hover:text-[#FF7F50]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold"
								aria-label={`Remove line ${lineIndex + 1}`}
							>
								<Trash2 className="size-4" aria-hidden />
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

const initialContactState: ContactFormState = {
	title: offices.title,
	subtitle: offices.subtitle,
	officeLocations: [
		{ ...offices.addis, lines: [...offices.addis.lines] },
		{ ...offices.dubai, lines: [...offices.dubai.lines] },
	],
	confidentialTitle: offices.confidential.title,
	confidentialLines: offices.confidential.lines.map((line) => ({ ...line })),
};

export function ContactEditor() {
	const { data, setField, isDirty, isSaving, saveMessage, save, discard } =
		useAdminForm(initialContactState);

	return (
		<>
			<AdminPageHeader
				title="Contact"
				description="Office addresses and confidential contact lines."
				previewHref="/#contact"
			/>
			<div className="space-y-6">
				<AdminPanel title="Section">
					<div className="grid gap-5 md:grid-cols-2">
						<AdminField label="Title" htmlFor="offices-title">
							<AdminInput
								id="offices-title"
								value={data.title}
								onChange={(e) => setField("title", e.target.value)}
							/>
						</AdminField>
						<AdminField label="Subtitle" htmlFor="offices-subtitle">
							<AdminInput
								id="offices-subtitle"
								value={data.subtitle}
								onChange={(e) => setField("subtitle", e.target.value)}
							/>
						</AdminField>
					</div>
				</AdminPanel>
				<AdminPanel>
					<AdminRepeater<OfficeLocationCard>
						label="Office locations"
						addLabel="Add office"
						emptyMessage="No office locations. Add Addis, Dubai, or other offices."
						items={data.officeLocations}
						onChange={(officeLocations) =>
							setField("officeLocations", officeLocations)
						}
						createItem={() => ({
							heading: "NEW OFFICE",
							lines: [""],
							image: "/images/addis.png",
							imageAlt: "",
						})}
						getKey={(item, index) => `${item.heading}-${index}`}
						renderItem={(office, index, update) => (
							<div className="space-y-4">
								<AdminField label="Heading" htmlFor={`office-heading-${index}`}>
									<AdminInput
										id={`office-heading-${index}`}
										value={office.heading}
										onChange={(e) => update({ heading: e.target.value })}
									/>
								</AdminField>
								<OfficeAddressLines
									lines={office.lines}
									officeIndex={index}
									onChange={(lines) => update({ lines })}
								/>
								<AdminImageField
									label="Office image"
									imageSrc={office.image}
									imageAlt={office.imageAlt}
									onImageSrcChange={(value) => update({ image: value })}
									onImageAltChange={(value) => update({ imageAlt: value })}
								/>
							</div>
						)}
					/>
				</AdminPanel>
				<AdminPanel title="Confidential contact">
					<AdminField label="Section title" htmlFor="conf-title">
						<AdminInput
							id="conf-title"
							value={data.confidentialTitle}
							onChange={(e) => setField("confidentialTitle", e.target.value)}
						/>
					</AdminField>
					<div className="mt-5">
						<AdminRepeater<ConfidentialContactLine>
							label="Contact lines"
							addLabel="Add contact line"
							emptyMessage="No confidential contact lines."
							items={data.confidentialLines}
							onChange={(lines) => setField("confidentialLines", lines)}
							createItem={() => ({ icon: "mail", text: "" })}
							getKey={(item, index) => `conf-${index}-${item.icon}`}
							renderItem={(item, index, update) => (
								<div className="grid gap-4 md:grid-cols-2">
									<AdminField label="Icon" htmlFor={`conf-icon-${index}`}>
										<AdminSelect
											id={`conf-icon-${index}`}
											value={item.icon}
											onChange={(e) =>
												update({
													icon: e.target.value as ConfidentialContactLine["icon"],
												})
											}
										>
											<option value="mail">Mail</option>
											<option value="whatsapp">WhatsApp</option>
											<option value="lock">Lock</option>
										</AdminSelect>
									</AdminField>
									<AdminField label="Text" htmlFor={`conf-text-${index}`}>
										<AdminInput
											id={`conf-text-${index}`}
											value={item.text}
											onChange={(e) => update({ text: e.target.value })}
										/>
									</AdminField>
									<AdminField label="Href (optional)" htmlFor={`conf-href-${index}`}>
										<AdminInput
											id={`conf-href-${index}`}
											value={item.href ?? ""}
											onChange={(e) =>
												update({ href: e.target.value || undefined })
											}
										/>
									</AdminField>
								</div>
							)}
						/>
					</div>
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
