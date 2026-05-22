"use client";

import { GoldButton } from "@/components/landing/gold-button";
import { useAuthModal } from "./auth-modal-provider";

interface AuthCtaButtonProps {
  action: "sign-in" | "sign-up";
  children: React.ReactNode;
  variant?: "outline" | "solid" | "soft" | "ghost" | "ghost-gradient";
  className?: string;
  onActivate?: () => void;
}

export function AuthCtaButton({
  action,
  children,
  variant = "outline",
  className,
  onActivate,
}: AuthCtaButtonProps) {
  const { openSignIn, openSignUp } = useAuthModal();

  function handleClick() {
    if (action === "sign-in") {
      openSignIn();
    } else {
      openSignUp();
    }
    onActivate?.();
  }

  return (
    <GoldButton
      variant={variant}
      className={className}
      onClick={handleClick}
    >
      {children}
    </GoldButton>
  );
}
