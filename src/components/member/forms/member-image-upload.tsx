"use client";

import Image from "next/image";
import { Upload } from "lucide-react";
import { useEffect, useId, useState } from "react";
import type { MemberImageScope } from "@/lib/member/member-image-upload";
import { ensureImageSrc } from "@/lib/supabase/storage-url";
import { cn } from "@/lib/utils";
import { MemberField, memberInputClassName, memberLabelClassName } from "./member-form-ui";

interface MemberImageUploadProps {
	scope: MemberImageScope;
	imageUrl: string | null;
	onImageUrlChange: (value: string | null) => void;
	imageAlt: string;
	onImageAltChange: (value: string) => void;
	sectionLabel?: string;
	altLabel?: string;
	className?: string;
}

export function MemberImageUpload({
	scope,
	imageUrl,
	onImageUrlChange,
	imageAlt,
	onImageAltChange,
	sectionLabel = "Trip image",
	altLabel = "Image description (optional)",
	className,
}: MemberImageUploadProps) {
	const fileId = useId();
	const altId = useId();
	const [previewSrc, setPreviewSrc] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);

	const displaySrc = previewSrc ?? (imageUrl ? ensureImageSrc(imageUrl) : null);

	useEffect(() => {
		return () => {
			if (previewSrc?.startsWith("blob:")) {
				URL.revokeObjectURL(previewSrc);
			}
		};
	}, [previewSrc]);

	async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		event.target.value = "";
		if (!file) {
			return;
		}

		setUploadError(null);
		const blobUrl = URL.createObjectURL(file);
		setPreviewSrc(blobUrl);
		setIsUploading(true);

		const formData = new FormData();
		formData.append("file", file);
		formData.append("scope", scope);

		try {
			const response = await fetch("/api/member/upload-image", {
				method: "POST",
				body: formData,
			});
			const body = (await response.json()) as { imageUrl?: string; error?: string };
			if (!response.ok || !body.imageUrl) {
				throw new Error(body.error ?? "Failed to upload image");
			}
			onImageUrlChange(body.imageUrl);
		} catch (e) {
			setUploadError(e instanceof Error ? e.message : "Failed to upload image");
			onImageUrlChange(null);
			setPreviewSrc(null);
		} finally {
			setIsUploading(false);
		}
	}

	function handleRemove() {
		if (previewSrc?.startsWith("blob:")) {
			URL.revokeObjectURL(previewSrc);
		}
		setPreviewSrc(null);
		setUploadError(null);
		onImageUrlChange(null);
	}

	return (
		<div className={cn("flex flex-col gap-3", className)}>
			<p className={memberLabelClassName}>{sectionLabel}</p>
			<div className="flex flex-col gap-4 sm:flex-row">
				<div className="relative h-32 w-full shrink-0 overflow-hidden rounded-md border border-luxinc-border/60 bg-[#2a2a2a] sm:w-40">
					{displaySrc ? (
						<Image
							src={displaySrc}
							alt={imageAlt || "Uploaded trip image"}
							fill
							unoptimized={displaySrc.startsWith("blob:")}
							className="object-cover"
							sizes="160px"
						/>
					) : (
						<div className="flex h-full items-center justify-center px-3 text-center font-sans text-xs text-luxinc-text-muted">
							No image yet
						</div>
					)}
				</div>
				<div className="flex min-w-0 flex-1 flex-col gap-3">
					<div className="flex flex-wrap gap-2">
						<label
							htmlFor={fileId}
							className={cn(
								"inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-luxinc-gold px-4 font-sans text-sm text-luxinc-gold transition-colors hover:bg-luxinc-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold",
								isUploading && "pointer-events-none opacity-60",
							)}
						>
							<Upload className="size-4" aria-hidden />
							{isUploading ? "Uploading…" : "Upload image"}
						</label>
						{displaySrc ? (
							<button
								type="button"
								onClick={handleRemove}
								disabled={isUploading}
								className="inline-flex h-10 items-center rounded-md border border-luxinc-border px-4 font-sans text-sm text-luxinc-text transition-colors hover:border-luxinc-gold/60 hover:text-luxinc-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold disabled:opacity-60"
							>
								Remove
							</button>
						) : null}
					</div>
					<p className="font-sans text-xs text-luxinc-text-muted">
						JPEG, PNG, WebP, or GIF · max 5 MB
					</p>
					{uploadError ? (
						<p className="font-sans text-xs text-red-400">{uploadError}</p>
					) : null}
					<input
						id={fileId}
						type="file"
						accept="image/jpeg,image/png,image/webp,image/gif"
						className="sr-only"
						disabled={isUploading}
						onChange={(event) => void handleFileChange(event)}
					/>
					<MemberField label={altLabel}>
						<input
							id={altId}
							value={imageAlt}
							onChange={(event) => onImageAltChange(event.target.value)}
							className={memberInputClassName}
							placeholder="Describe the photo for accessibility"
						/>
					</MemberField>
				</div>
			</div>
		</div>
	);
}
