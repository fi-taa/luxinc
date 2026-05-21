interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  id?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  title,
  subtitle,
  id,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      {subtitle ? (
        <p className="font-sans text-[10px] font-medium uppercase tracking-[0.35em] text-zulu-text-muted md:text-xs">
          {subtitle}
        </p>
      ) : null}
      <h2
        id={id}
        className="mt-3 font-serif text-3xl font-medium tracking-wide text-zulu-gold md:text-4xl lg:text-[2.75rem] lg:leading-tight"
      >
        {title}
      </h2>
    </div>
  );
}
