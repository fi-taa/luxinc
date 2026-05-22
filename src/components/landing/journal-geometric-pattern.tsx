import Image from "next/image";

export function JournalGeometricPattern() {
  return (
    <div
      className="pointer-events-none absolute inset-y-0 right-0 z-0 flex h-full items-center justify-end overflow-visible"
      aria-hidden
    >
      <Image
        src="/images/pattern2.png"
        alt=""
        width={480}
        height={960}
        className="h-full w-auto max-w-none origin-right scale-[1] object-contain object-right md:scale-[1.4] lg:scale-[1.5]"
        sizes="(max-width: 1024px) 50vw, 480px"
      />
    </div>
  );
}
