import { Crown } from "lucide-react";
import { blackBook } from "@/lib/landing-content";
import { BlackBookForm } from "./black-book-form";
import { SectionShell } from "./section-shell";

export function BlackBookSection() {
  return (
    <SectionShell bordered ariaLabelledBy="black-book-heading">
      <div className="mx-auto max-w-3xl text-center">
        <div className="flex flex-col items-center gap-4">
          <Crown className="size-7 text-zulu-gold md:size-8" aria-hidden />
          <h2
            id="black-book-heading"
            className="font-serif text-3xl font-medium text-zulu-gold md:text-4xl"
          >
            {blackBook.title}
          </h2>
        </div>
        <p className="mx-auto mt-5 max-w-lg font-sans text-sm leading-relaxed text-zulu-text-muted md:text-base">
          {blackBook.subtitle}
        </p>
        <div className="mt-10 md:mt-12">
          <BlackBookForm
            placeholder={blackBook.placeholder}
            buttonLabel={blackBook.buttonLabel}
          />
        </div>
      </div>
    </SectionShell>
  );
}
