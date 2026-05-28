"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/landing-content";
import { cn } from "@/lib/utils";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useAppDispatch } from "@/store/hooks";
import { loadProfile } from "@/store/slices/auth-slice";
import type { AuthModalView } from "./auth-modal-provider";

interface AuthModalProps {
	view: AuthModalView;
	onClose: () => void;
	onSwitch: (view: AuthModalView) => void;
}

const inputClassName =
	"h-11 w-full bg-[#333333] px-4 font-serif text-sm text-luxinc-text placeholder:text-[#9a9a9a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-luxinc-gold/60";

function AuthImagePanel() {
	return (
		<div className="relative h-full min-h-[240px] md:min-h-[520px]">
			<Image
				src={auth.image}
				alt={auth.imageAlt}
				fill
				className="object-cover"
				sizes="(max-width: 768px) 100vw, 460px"
			/>
			<div
				className="pointer-events-none absolute inset-0 bg-luxinc-gold/25"
				aria-hidden
			/>
			<div className="absolute inset-0 z-10 flex items-center justify-center p-8">
				<Image
					src="/images/logo.svg"
					alt="Luxinc"
					width={500}
					height={500}
					className="relative h-32 w-auto brightness-0 md:h-44"
				/>
			</div>
		</div>
	);
}

interface AuthFormPanelProps {
	view: AuthModalView;
	onSwitch: (view: AuthModalView) => void;
	onClose: () => void;
}

function AuthFormPanel({ view, onSwitch, onClose }: AuthFormPanelProps) {
	const isSignIn = view === "sign-in";
	const copy = isSignIn ? auth.signIn : auth.signUp;
	const router = useRouter();
	const dispatch = useAppDispatch();
	const supabase = useMemo(() => getSupabaseBrowserClient(), []);
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

			if (!email || !password) {
				setError("Please provide email and password.");
				return;
			}

			if (isSignIn) {
				const { data, error: signInError } =
					await supabase.auth.signInWithPassword({
						email,
						password,
					});
				if (signInError) throw signInError;

				const userId = data.user?.id ?? null;
				if (userId) {
					const profile = await dispatch(loadProfile({ userId })).unwrap();
					onClose();
					router.push(profile?.role === "admin" ? "/admin" : "/member");
				} else {
					onClose();
				}
			} else {
				const fullName = String(formData.get("fullName") ?? "").trim();
				const confirmPassword = String(formData.get("confirmPassword") ?? "");

				if (!fullName) {
					setError("Please provide your full name.");
					return;
				}
				if (password !== confirmPassword) {
					setError("Passwords do not match.");
					return;
				}

				const { data, error: signUpError } = await supabase.auth.signUp({
					email,
					password,
					options: {
						data: {
							full_name: fullName,
						},
					},
				});
				if (signUpError) throw signUpError;

				// If email confirmations are enabled, session may be null.
				const userId = data.user?.id ?? null;
				if (userId) {
					void dispatch(loadProfile({ userId }));
				}
				onClose();
				router.push("/member");
			}
		} catch (e) {
			const message = e instanceof Error ? e.message : "Authentication failed";
			setError(message);
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div className="relative flex h-full min-h-[400px] flex-col border-t-4 border-luxinc-gold bg-luxinc-bg px-8 py-10 md:min-h-[520px] md:px-10 md:py-12">
			<div key={view} className="auth-form-enter flex flex-1 flex-col">
				<h2
					id="auth-modal-title"
					className="font-serif text-2xl font-normal tracking-wide text-luxinc-gold md:text-3xl"
				>
					{copy.title}
				</h2>
				<p className="mt-3 font-serif text-sm font-normal italic text-luxinc-text/90">
					{auth.subtitle}
				</p>

				<form
					onSubmit={handleSubmit}
					className="mt-8 flex flex-1 flex-col gap-4"
				>
					{!isSignIn ? (
						<input
							type="text"
							name="fullName"
							placeholder={auth.signUp.fullNamePlaceholder}
							required
							autoComplete="name"
							className={inputClassName}
						/>
					) : null}
					<input
						type="email"
						name="email"
						placeholder={copy.emailPlaceholder}
						required
						autoComplete="email"
						className={inputClassName}
					/>
					<input
						type="password"
						name="password"
						placeholder={copy.passwordPlaceholder}
						required
						autoComplete={isSignIn ? "current-password" : "new-password"}
						className={inputClassName}
					/>
					{!isSignIn ? (
						<input
							type="password"
							name="confirmPassword"
							placeholder={auth.signUp.confirmPasswordPlaceholder}
							required
							autoComplete="new-password"
							className={inputClassName}
						/>
					) : null}

					<button
						type="submit"
						disabled={submitting}
						className="mt-4 h-12 w-full bg-luxinc-gold font-serif text-base font-normal text-luxinc-bg transition-colors hover:bg-luxinc-gold-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold focus-visible:ring-offset-2 focus-visible:ring-offset-luxinc-bg"
					>
						{submitting ? "Please wait…" : copy.submitLabel}
					</button>
					{error ? (
						<p className="mt-2 font-serif text-sm text-red-400">{error}</p>
					) : null}
				</form>

				<p className="mt-8 font-serif text-sm text-luxinc-text/80">
					{copy.switchPrompt}{" "}
					<button
						type="button"
						onClick={() => onSwitch(isSignIn ? "sign-up" : "sign-in")}
						className="text-luxinc-gold underline decoration-luxinc-gold/50 underline-offset-4 transition-colors hover:text-luxinc-gold-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold"
					>
						{copy.switchAction}
					</button>
				</p>
			</div>
		</div>
	);
}

export function AuthModal({ view, onClose, onSwitch }: AuthModalProps) {
	const isSignIn = view === "sign-in";

	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") onClose();
		}
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [onClose]);

	return (
		<div
			className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-8"
			role="presentation"
		>
			<button
				type="button"
				aria-label="Close dialog"
				className="absolute inset-0 bg-luxinc-gold/10 backdrop-blur-xs"
				onClick={onClose}
			/>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="auth-modal-title"
				className="relative w-full max-w-[920px] overflow-hidden"
			>
				<div className="relative hidden min-h-[520px] md:block">
					<div
						className={cn(
							"auth-panel-swap absolute inset-y-0 z-10 w-1/2 transition-[left] duration-500 ease-in-out",
							isSignIn ? "left-0" : "left-1/2",
						)}
					>
						<AuthFormPanel view={view} onSwitch={onSwitch} onClose={onClose} />
					</div>
					<div
						className={cn(
							"auth-panel-swap absolute inset-y-0 w-1/2 transition-[left] duration-500 ease-in-out",
							isSignIn ? "left-1/2" : "left-0",
						)}
					>
						<AuthImagePanel />
					</div>
				</div>

				<div className="relative min-h-[880px] md:hidden">
					<div
						className={cn(
							"auth-panel-swap absolute left-0 z-10 w-full transition-[top] duration-500 ease-in-out",
							isSignIn ? "top-0" : "top-1/2",
						)}
					>
						<AuthFormPanel view={view} onSwitch={onSwitch} onClose={onClose} />
					</div>
					<div
						className={cn(
							"auth-panel-swap absolute left-0 w-full transition-[top] duration-500 ease-in-out",
							isSignIn ? "top-1/2" : "top-0",
						)}
					>
						<AuthImagePanel />
					</div>
				</div>
			</div>
		</div>
	);
}
