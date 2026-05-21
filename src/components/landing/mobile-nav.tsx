"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { NavLink } from "@/lib/landing-content";
import { cn } from "@/lib/utils";
import { GoldButton } from "./gold-button";

interface NavCta {
  label: string;
  href: string;
}

interface MobileNavProps {
  links: NavLink[];
  cta: NavCta;
}

export function MobileNav({ links, cta }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="flex h-10 w-10 items-center justify-center text-zulu-text transition-colors hover:text-zulu-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zulu-gold"
      >
        {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>
      <nav
        className={cn(
          "absolute right-0 top-full mt-2 min-w-[240px] border border-zulu-border bg-zulu-bg/98 backdrop-blur-md transition-all duration-200",
          isOpen
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        )}
        aria-hidden={!isOpen}
      >
        <ul className="flex flex-col py-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={
                  link.isActive
                    ? "block px-6 py-3 font-sans text-sm text-zulu-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zulu-gold"
                    : "block px-6 py-3 font-sans text-sm text-zulu-text transition-colors hover:text-zulu-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zulu-gold"
                }
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="border-t border-zulu-border px-6 py-4">
          <GoldButton
            href={cta.href}
            className="w-full"
            onClick={() => setIsOpen(false)}
          >
            {cta.label}
          </GoldButton>
        </div>
      </nav>
    </div>
  );
}
