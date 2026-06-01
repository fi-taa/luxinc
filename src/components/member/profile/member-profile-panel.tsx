"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { GoldButton } from "@/components/landing/gold-button";
import { toErrorMessage } from "@/lib/errors/to-error-message";
import type { MemberProfileRecord } from "@/lib/member/member-profile.server";
import { resolveStorageImageUrlOrFallback } from "@/lib/supabase/storage-url";
import { useAppDispatch } from "@/store/hooks";
import { loadProfile } from "@/store/slices/auth-slice";
import { MemberField, memberInputClassName } from "../forms/member-form-ui";

interface MemberProfilePanelProps {
	profile: MemberProfileRecord | null;
	error: string | null;
}

export function MemberProfilePanel({ profile, error }: MemberProfilePanelProps) {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [fullName, setFullName] = useState(profile?.fullName ?? "");
	const [phone, setPhone] = useState(profile?.phone ?? "");
	const [isSaving, setIsSaving] = useState(false);
	const [saveError, setSaveError] = useState<string | null>(null);
	const [saveMessage, setSaveMessage] = useState<string | null>(null);

	if (error) {
		return <p className="font-sans text-sm text-red-400">{error}</p>;
	}
	if (!profile) {
		return null;
	}

	const profileId = profile.id;
	const avatarSrc = resolveStorageImageUrlOrFallback(profile.avatarUrl);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setSaveError(null);
		setSaveMessage(null);
		setIsSaving(true);

		try {
			const response = await fetch("/api/member/profile", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ fullName, phone }),
			});
			const payload = (await response.json()) as {
				error?: string | Record<string, unknown>;
				profile?: { id: string };
			};

			if (!response.ok) {
				throw new Error(toErrorMessage(payload.error, "Could not save profile."));
			}

			await dispatch(loadProfile({ userId: profileId })).unwrap();
			setSaveMessage("Profile saved.");
			router.refresh();
		} catch (e) {
			setSaveError(toErrorMessage(e, "Could not save profile."));
		} finally {
			setIsSaving(false);
		}
	}

	return (
		<section aria-labelledby="member-profile-heading" className="max-w-xl">
			<h1
				id="member-profile-heading"
				className="font-diphylleia text-2xl font-normal text-luxinc-gold md:text-3xl"
			>
				My profile
			</h1>
			<p className="mt-2 font-sans text-sm text-luxinc-text-muted">
				Used for your account and Chapa payments. Ethiopian mobile format: 0912345678.
			</p>

			<div className="mt-8 flex items-center gap-5 border border-luxinc-border/60 bg-luxinc-panel/40 p-5">
				<div className="relative size-16 shrink-0 overflow-hidden rounded-full ring-2 ring-luxinc-gold ring-offset-2 ring-offset-luxinc-bg">
					<Image
						src={avatarSrc}
						alt=""
						fill
						className="object-cover"
						sizes="64px"
						unoptimized={avatarSrc.startsWith("blob:")}
					/>
				</div>
				<div className="min-w-0">
					<p className="font-sans text-sm font-medium text-luxinc-text">{profile.email}</p>
					<p className="mt-1 font-sans text-xs text-luxinc-text-muted">
						Email is managed by your sign-in account.
					</p>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="mt-8 space-y-6">
				<MemberField label="Full name">
					<input
						type="text"
						required
						value={fullName}
						onChange={(e) => setFullName(e.target.value)}
						className={memberInputClassName}
						autoComplete="name"
					/>
				</MemberField>

				<MemberField label="Mobile phone">
					<input
						type="tel"
						required
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						className={memberInputClassName}
						placeholder="0912345678"
						autoComplete="tel"
					/>
				</MemberField>

				{saveError ? (
					<p className="font-sans text-sm text-red-400" role="alert">
						{saveError}
					</p>
				) : null}
				{saveMessage ? (
					<p className="font-sans text-sm text-luxinc-gold" role="status">
						{saveMessage}
					</p>
				) : null}

				<GoldButton type="submit" variant="solid" className="px-8">
					{isSaving ? "Saving…" : "Save profile"}
				</GoldButton>
			</form>
		</section>
	);
}
