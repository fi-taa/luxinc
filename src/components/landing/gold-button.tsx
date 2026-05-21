import Link from "next/link";
import { cn } from "@/lib/utils";

interface GoldButtonProps {
  children: React.ReactNode;
  href?: string;
  type?: "button" | "submit";
  variant?: "outline" | "solid" | "ghost" | "ghost-gradient";
  className?: string;
  onClick?: () => void;
}

const outlineStyles =
  "border border-zulu-gold bg-transparent text-zulu-gold hover:bg-zulu-gold hover:text-zulu-bg";

const solidStyles =
  "border border-zulu-gold bg-zulu-gold text-zulu-bg hover:bg-zulu-gold-muted hover:border-zulu-gold-muted hover:text-zulu-bg";

const ghostStyles =
  "border border-zulu-gold/50 bg-zulu-gold/30 text-zulu-bg backdrop-blur-sm hover:bg-zulu-gold/45 hover:border-zulu-gold/70";

const ghostGradientStyles =
  "border-0 bg-linear-to-r from-zulu-gold/45 via-zulu-gold/20 to-transparent text-zulu-bg backdrop-blur-sm hover:from-zulu-gold/55 hover:via-zulu-gold/25";

export function GoldButton({
  children,
  href,
  type = "button",
  variant = "outline",
  className,
  onClick,
}: GoldButtonProps) {
  const baseStyles = cn(
    "inline-flex h-10 items-center justify-center px-8 font-sans text-xs font-semibold normal-case tracking-normal transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zulu-gold focus-visible:ring-offset-2 focus-visible:ring-offset-zulu-bg",
    variant === "solid"
      ? solidStyles
      : variant === "ghost"
        ? ghostStyles
        : variant === "ghost-gradient"
          ? ghostGradientStyles
          : outlineStyles
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={cn(baseStyles, className)}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(baseStyles, className)}
    >
      {children}
    </button>
  );
}
