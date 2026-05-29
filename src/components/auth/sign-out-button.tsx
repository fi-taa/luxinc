"use client";

import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useAppDispatch } from "@/store/hooks";
import { authActions } from "@/store/slices/auth-slice";

interface SignOutButtonProps {
	className?: string;
	redirectTo?: string;
	children?: React.ReactNode;
}

export function SignOutButton({
	className,
	redirectTo = "/",
	children = "Sign out",
}: SignOutButtonProps) {
	const router = useRouter();
	const dispatch = useAppDispatch();

	async function handleSignOut() {
		const supabase = getSupabaseBrowserClient();
		await supabase.auth.signOut();
		dispatch(authActions.clearAuth());
		router.push(redirectTo);
		router.refresh();
	}

	return (
		<button type="button" onClick={handleSignOut} className={className}>
			{children}
		</button>
	);
}
