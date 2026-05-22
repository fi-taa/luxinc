"use client";

import { useState } from "react";
import type { TableOfContentsItem } from "@/lib/content-detail";

interface TableOfContentsProps {
  items: TableOfContentsItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (items.length === 0) return null;

  return (
    <div className="mt-10 text-center">
      <p className="font-sans text-sm text-zulu-text/80">
        Table of Contents{" "}
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="text-zulu-gold underline decoration-zulu-gold/60 underline-offset-4 transition-colors hover:text-zulu-gold-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zulu-gold focus-visible:ring-offset-2 focus-visible:ring-offset-zulu-bg"
        >
          {isOpen ? "hide" : "show"}
        </button>
      </p>
      {isOpen ? (
        <nav
          aria-label="Table of contents"
          className="mx-auto mt-4 max-w-md space-y-2"
        >
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="block font-sans text-sm text-zulu-text/90 transition-colors hover:text-zulu-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zulu-gold"
            >
              {item.label}
            </a>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
