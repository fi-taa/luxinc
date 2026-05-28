"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { AdminField, AdminInput } from "./admin-field";
import { resolveStorageImageUrl } from "@/lib/supabase/storage-url";

interface AdminImageFieldProps {
	label: string;
	imageSrc: string;
	imageAlt: string;
	onImageSrcChange: (value: string) => void;
	onImageAltChange: (value: string) => void;
}

export function AdminImageField({
	label,
	imageSrc,
	imageAlt,
	onImageSrcChange,
	onImageAltChange,
}: AdminImageFieldProps) {
	const fileId = useId();
	const pathId = useId();
	const altId = useId();
	const [previewSrc, setPreviewSrc] = useState(() =>
		resolveStorageImageUrl(imageSrc),
	);
	const displaySrc = resolveStorageImageUrl(previewSrc || imageSrc);

	function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (!file) {
			return;
		}
		const objectUrl = URL.createObjectURL(file);
		setPreviewSrc(objectUrl);
		onImageSrcChange(objectUrl);
		event.target.value = "";
	}

	return (
		<AdminField label={label} htmlFor={pathId}>
			<div className="flex flex-col gap-4 sm:flex-row">
				<div className="relative h-32 w-full shrink-0 overflow-hidden rounded-md border border-luxinc-border bg-black sm:w-48">
					{displaySrc ? (
						<Image
							src={displaySrc}
							alt={imageAlt || ""}
							fill
							unoptimized={displaySrc.startsWith("blob:")}
							className="object-cover"
							sizes="192px"
						/>
					) : (
						<div className="flex h-full items-center justify-center font-sans text-xs text-luxinc-text-muted">
							No image
						</div>
					)}
				</div>
				<div className="flex min-w-0 flex-1 flex-col gap-3">
					<div>
						<label
							htmlFor={fileId}
							className="inline-flex h-9 cursor-pointer items-center rounded-md border border-luxinc-gold px-4 font-sans text-sm text-luxinc-gold transition-colors hover:bg-luxinc-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold"
						>
							Upload image
						</label>
						<input
							id={fileId}
							type="file"
							accept="image/*"
							className="sr-only"
							onChange={handleFileChange}
						/>
					</div>
					<AdminInput
						id={pathId}
						value={imageSrc.startsWith("blob:") ? "" : imageSrc}
						onChange={(e) => {
							const value = resolveStorageImageUrl(e.target.value);
							setPreviewSrc(value);
							onImageSrcChange(value);
						}}
						placeholder="/images/example.png"
					/>
					<AdminInput
						id={altId}
						value={imageAlt}
						onChange={(e) => onImageAltChange(e.target.value)}
						placeholder="Alt text"
					/>
				</div>
			</div>
		</AdminField>
	);
}
