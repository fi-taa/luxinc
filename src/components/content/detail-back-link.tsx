import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface DetailBackLinkProps {
  href: string;
}

export function DetailBackLink({ href }: DetailBackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-3 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zulu-gold focus-visible:ring-offset-2 focus-visible:ring-offset-zulu-bg"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-zulu-gold/50 bg-zulu-gold/10">
        <ArrowLeft className="h-4 w-4 text-zulu-gold" strokeWidth={1.5} />
      </span>
      <span className="font-diphylleia text-base text-zulu-gold">Back</span>
    </Link>
  );
}
