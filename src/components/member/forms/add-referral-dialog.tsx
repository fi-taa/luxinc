"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { MemberImageUpload } from "./member-image-upload";
import { MemberDialog, MemberField, memberInputClassName } from "./member-form-ui";

interface AddReferralDialogProps {
	open: boolean;
	onClose: () => void;
}

export function AddReferralDialog({ open, onClose }: AddReferralDialogProps) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [imageAlt, setImageAlt] = useState("");

	function handleClose() {
		setError(null);
		setImageUrl(null);
		setImageAlt("");
		onClose();
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		setIsSubmitting(true);

		const formData = new FormData(event.currentTarget);
		const payload = {
			title: String(formData.get("title") ?? ""),
			description: String(formData.get("description") ?? ""),
			referralLink: String(formData.get("referralLink") ?? ""),
			imageUrl: imageUrl ?? "",
			imageAlt: imageAlt.trim(),
		};

		try {
			const response = await fetch("/api/member/referrals", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const body = (await response.json()) as { error?: string };
			if (!response.ok) {
				throw new Error(body.error ?? "Failed to save referral");
			}
			handleClose();
			router.refresh();
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to save");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<MemberDialog
			open={open}
			title="Add referral programme"
			onClose={handleClose}
			onSubmit={handleSubmit}
			submitLabel="Save programme"
			isSubmitting={isSubmitting}
			error={error}
		>
			<MemberField label="Title">
				<input
					name="title"
					required
					className={memberInputClassName}
					placeholder="Invite Friends & Earn Travel Rewards"
				/>
			</MemberField>
			<MemberField label="Description">
				<textarea
					name="description"
					required
					rows={3}
					className={memberInputClassName + " min-h-[88px] py-3"}
					placeholder="Give your friends a reward when they book."
				/>
			</MemberField>
			<MemberField label="Referral link">
				<input
					name="referralLink"
					type="url"
					required
					className={memberInputClassName}
					placeholder="https://luxinc.com/ref/your-name"
				/>
			</MemberField>
			<MemberImageUpload
				scope="referrals"
				imageUrl={imageUrl}
				onImageUrlChange={setImageUrl}
				imageAlt={imageAlt}
				onImageAltChange={setImageAlt}
				sectionLabel="Programme image"
			/>
		</MemberDialog>
	);
}
