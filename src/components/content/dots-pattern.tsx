import Image from "next/image";

interface DotsPatternProps {
  className?: string;
}

export function DotsPattern({ className }: DotsPatternProps) {
  return (
    <div className={className} aria-hidden>
      <Image
        src="/images/dots.png"
        alt=""
        width={520}
        height={900}
        className="pointer-events-none absolute -left-32 top-[12%] h-auto w-[min(70vw,520px)] max-w-none opacity-100 md:-left-20"
        priority={false}
      />
      <Image
        src="/images/dots.png"
        alt=""
        width={520}
        height={900}
        className="pointer-events-none absolute -right-32 bottom-[8%] h-auto w-[min(70vw,520px)] max-w-none rotate-180 opacity-100 md:-right-20"
        priority={false}
      />
    </div>
  );
}
