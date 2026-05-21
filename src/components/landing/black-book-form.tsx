"use client";

import { FormEvent, useState } from "react";
import { GoldButton } from "./gold-button";

interface BlackBookFormProps {
  placeholder: string;
  buttonLabel: string;
}

export function BlackBookForm({ placeholder, buttonLabel }: BlackBookFormProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="font-sans text-sm text-zulu-gold">
        Thank you. Your invitation to The Luxury Black Book is on its way.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-0 border border-white/20 sm:flex-row"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        required
        className="h-12 flex-1 border-0 border-b border-white/20 bg-white/5 px-4 font-sans text-sm text-zulu-text placeholder:text-zulu-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zulu-gold sm:border-b-0 sm:border-r"
      />
      <GoldButton
        type="submit"
        className="h-12 shrink-0 border-0 bg-zulu-gold px-10 text-zulu-bg hover:bg-zulu-gold-muted hover:text-zulu-bg sm:px-12"
      >
        {buttonLabel}
      </GoldButton>
    </form>
  );
}
