"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useAppDispatch } from "@/store/hooks";
import { loadProfile } from "@/store/slices/auth-slice";

export function AdminLoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const dispatch = useAppDispatch();
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		setSubmitting(true);

		try {
			const formData = new FormData(event.currentTarget);
			const email = String(formData.get("email") ?? "").trim();
			const password = String(formData.get("password") ?? "");

			const signInResponse = await fetch("/api/auth/sign-in", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
			const signInBody = (await signInResponse.json()) as {
				userId?: string;
				error?: string;
			};
			if (!signInResponse.ok) {
				throw new Error(signInBody.error ?? "Sign in failed");
			}

			const userId = signInBody.userId;
			if (!userId) throw new Error("Sign in failed.");

			const supabase = getSupabaseBrowserClient();
			const profile = await dispatch(loadProfile({ userId })).unwrap();
			if (!profile || profile.role !== "admin") {
				await supabase.auth.signOut();
				throw new Error("This account does not have admin access.");
			}
			if (profile.status === "disabled") {
				await supabase.auth.signOut();
				throw new Error("This account has been disabled.");
			}

			const next = searchParams.get("next") ?? "/admin/dashboard";
			router.push(next);
			router.refresh();
		} catch (e) {
			setError(e instanceof Error ? e.message : "Sign in failed");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<form className="mt-8 space-y-4" onSubmit={handleSubmit}>
			<div>
				<label
					htmlFor="admin-email"
					className="block font-sans text-sm font-medium text-luxinc-text"
				>
					Email
				</label>
				<input
					id="admin-email"
					name="email"
					type="email"
					required
					autoComplete="email"
					className="mt-2 w-full border border-luxinc-border bg-luxinc-bg px-3 py-2.5 font-sans text-sm text-luxinc-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold"
				/>
			</div>
			<div>
				<label
					htmlFor="admin-password"
					className="block font-sans text-sm font-medium text-luxinc-text"
				>
					Password
				</label>
				<input
					id="admin-password"
					name="password"
					type="password"
					required
					autoComplete="current-password"
					className="mt-2 w-full border border-luxinc-border bg-luxinc-bg px-3 py-2.5 font-sans text-sm text-luxinc-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold"
				/>
			</div>
			{error ? (
				<p className="font-sans text-sm text-red-400" role="alert">
					{error}
				</p>
			) : null}
			<button
				type="submit"
				disabled={submitting}
				className="inline-flex h-9 w-full items-center justify-center rounded-sm bg-luxinc-gold font-sans text-sm font-semibold text-luxinc-bg transition-colors hover:bg-luxinc-gold-muted disabled:opacity-50"
			>
				{submitting ? "Signing in…" : "Sign in"}
			</button>
		</form>
	);
}
