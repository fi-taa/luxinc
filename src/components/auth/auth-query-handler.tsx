"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { messageForAuthQueryError } from "@/lib/auth/member-auth-errors";
import { useAuthModal } from "./auth-modal-provider";

export function AuthQueryHandler() {
	const searchParams = useSearchParams();
	const { openSignIn, openSignUp, setInitialError } = useAuthModal();

	useEffect(() => {
		const auth = searchParams.get("auth");
		const queryError = messageForAuthQueryError(searchParams.get("error"));

		if (queryError) {
			setInitialError(queryError);
		}

		if (auth === "sign-up") {
			openSignUp();
		} else if (auth === "sign-in" || queryError) {
			openSignIn();
		}
	}, [searchParams, openSignIn, openSignUp, setInitialError]);

	return null;
}
