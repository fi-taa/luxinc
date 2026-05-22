"use client";

import Image from "next/image";
import { FormEvent, useEffect } from "react";
import { auth } from "@/lib/landing-content";
import { cn } from "@/lib/utils";
import type { AuthModalView } from "./auth-modal-provider";

interface AuthModalProps {
  view: AuthModalView;
  onClose: () => void;
  onSwitch: (view: AuthModalView) => void;
}

const inputClassName =
  "h-11 w-full bg-[#333333] px-4 font-serif text-sm text-zulu-text placeholder:text-[#9a9a9a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zulu-gold/60";

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
        className="pointer-events-none absolute inset-0 bg-zulu-gold/25"
        aria-hidden
      />
      <div className="absolute inset-0 z-10 flex items-center justify-center p-8">
        <Image
          src="/images/logo.png"
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onClose();
  }

  return (
    <div className="relative flex h-full min-h-[400px] flex-col border-t-4 border-zulu-gold bg-zulu-bg px-8 py-10 md:min-h-[520px] md:px-10 md:py-12">
      <div key={view} className="auth-form-enter flex flex-1 flex-col">
        <h2
          id="auth-modal-title"
          className="font-serif text-2xl font-normal tracking-wide text-zulu-gold md:text-3xl"
        >
          {copy.title}
        </h2>
        <p className="mt-3 font-serif text-sm font-normal italic text-zulu-text/90">
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
            className="mt-4 h-12 w-full bg-zulu-gold font-serif text-base font-normal text-zulu-bg transition-colors hover:bg-zulu-gold-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zulu-gold focus-visible:ring-offset-2 focus-visible:ring-offset-zulu-bg"
          >
            {copy.submitLabel}
          </button>
        </form>

        <p className="mt-8 font-serif text-sm text-zulu-text/80">
          {copy.switchPrompt}{" "}
          <button
            type="button"
            onClick={() => onSwitch(isSignIn ? "sign-up" : "sign-in")}
            className="text-zulu-gold underline decoration-zulu-gold/50 underline-offset-4 transition-colors hover:text-zulu-gold-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zulu-gold"
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
        className="absolute inset-0 bg-zulu-gold/10 backdrop-blur-xs"
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
              isSignIn ? "left-0" : "left-1/2"
            )}
          >
            <AuthFormPanel view={view} onSwitch={onSwitch} onClose={onClose} />
          </div>
          <div
            className={cn(
              "auth-panel-swap absolute inset-y-0 w-1/2 transition-[left] duration-500 ease-in-out",
              isSignIn ? "left-1/2" : "left-0"
            )}
          >
            <AuthImagePanel />
          </div>
        </div>

        <div className="relative min-h-[880px] md:hidden">
          <div
            className={cn(
              "auth-panel-swap absolute left-0 z-10 w-full transition-[top] duration-500 ease-in-out",
              isSignIn ? "top-0" : "top-1/2"
            )}
          >
            <AuthFormPanel view={view} onSwitch={onSwitch} onClose={onClose} />
          </div>
          <div
            className={cn(
              "auth-panel-swap absolute left-0 w-full transition-[top] duration-500 ease-in-out",
              isSignIn ? "top-1/2" : "top-0"
            )}
          >
            <AuthImagePanel />
          </div>
        </div>
      </div>
    </div>
  );
}
