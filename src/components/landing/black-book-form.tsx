"use client";

import { FormEvent, useState } from "react";

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
      <p className="text-center font-serif text-sm text-zulu-gold">
        Thank you. Your confidential PDF is on its way.
      </p>
    );
  }

  return (
    <div className="border border-[#3d3d3d] bg-[#1a1a1a] p-1.5">
      <form onSubmit={handleSubmit} className="flex w-full flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          required
          className="h-10 min-w-0 flex-1 bg-[#333333] px-4 font-sans text-xs text-zulu-text placeholder:text-[#9a9a9a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zulu-gold/60 md:text-sm"
        />
        <button
          type="submit"
          className="h-10 shrink-0 bg-zulu-gold px-7 font-sans text-xs font-medium normal-case tracking-normal text-zulu-bg transition-colors hover:bg-zulu-gold-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zulu-gold md:px-9 md:text-sm"
        >
          {buttonLabel}
        </button>
      </form>
    </div>
  );
}
