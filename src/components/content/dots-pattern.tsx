import Image from "next/image";

interface DotsPatternProps {
  className?: string;
}

export function DotsPattern({ className }: DotsPatternProps) {
  return (
    <div
      className={className}
      aria-hidden
    >
      <Image
        src="/images/dots.png"
        alt=""
        width={420}
        height={720}
        className="pointer-events-none absolute -left-24 top-0 h-auto w-[min(55vw,420px)] max-w-none opacity-90 md:-left-16 md:top-4"
        priority={false}
      />
      <Image
        src="/images/dots.png"
        alt=""
        width={420}
        height={720}
        className="pointer-events-none absolute -right-24 bottom-0 h-auto w-[min(55vw,420px)] max-w-none rotate-180 opacity-90 md:-right-16 md:bottom-4"
        priority={false}
      />
    </div>
  );
}
