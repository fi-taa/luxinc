import Image from "next/image";
import Link from "next/link";

interface DetailBackLinkProps {
  href: string;
  className?: string;
}

export function DetailBackLink({ href, className }: DetailBackLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zulu-gold focus-visible:ring-offset-2 focus-visible:ring-offset-zulu-bg ${className ?? ""}`}
    >
      <Image
        src="/images/back.png"
        alt="Back"
        width={99}
        height={40}
        className="h-10 w-auto"
      />
    </Link>
  );
}
