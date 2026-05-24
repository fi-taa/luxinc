"use client";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import {
	AdminField,
	AdminInput,
	AdminTextarea,
} from "@/components/admin/forms/admin-field";
import { AdminImageField } from "@/components/admin/forms/admin-image-field";
import { AdminStickySaveBar } from "@/components/admin/forms/admin-sticky-save-bar";
import { useAdminForm } from "@/components/admin/forms/use-admin-form";
import { hero } from "@/lib/landing-content";

export function HeroEditor() {
	const { data, setField, isDirty, isSaving, saveMessage, save, discard } =
		useAdminForm({ ...hero });

	return (
		<>
			<AdminPageHeader
				title="Hero"
				description="Edit the homepage hero section."
				previewHref="/"
			/>
			<div className="space-y-6">
				<AdminPanel title="Copy">
					<div className="grid gap-5 md:grid-cols-2">
						<AdminField label="Location line" htmlFor="hero-location">
							<AdminInput
								id="hero-location"
								value={data.location}
								onChange={(e) => setField("location", e.target.value)}
							/>
						</AdminField>
						<AdminField label="Subheadline" htmlFor="hero-subheadline" className="md:col-span-2">
							<AdminTextarea
								id="hero-subheadline"
								value={data.subheadline}
								onChange={(e) => setField("subheadline", e.target.value)}
							/>
						</AdminField>
					</div>
				</AdminPanel>
				<AdminPanel title="Calls to action">
					<div className="grid gap-5 md:grid-cols-2">
						<AdminField label="Primary CTA label" htmlFor="hero-cta">
							<AdminInput
								id="hero-cta"
								value={data.cta}
								onChange={(e) => setField("cta", e.target.value)}
							/>
						</AdminField>
						<AdminField label="Primary CTA href" htmlFor="hero-cta-href">
							<AdminInput
								id="hero-cta-href"
								value={data.ctaHref}
								onChange={(e) => setField("ctaHref", e.target.value)}
							/>
						</AdminField>
						<AdminField label="Login CTA label" htmlFor="hero-login-cta">
							<AdminInput
								id="hero-login-cta"
								value={data.loginCta}
								onChange={(e) => setField("loginCta", e.target.value)}
							/>
						</AdminField>
						<AdminField label="Login CTA href" htmlFor="hero-login-href">
							<AdminInput
								id="hero-login-href"
								value={data.loginHref}
								onChange={(e) => setField("loginHref", e.target.value)}
							/>
						</AdminField>
					</div>
				</AdminPanel>
				<AdminPanel title="Media">
					<AdminImageField
						label="Background image"
						imageSrc={data.image}
						imageAlt={data.imageAlt}
						onImageSrcChange={(value) => setField("image", value)}
						onImageAltChange={(value) => setField("imageAlt", value)}
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
