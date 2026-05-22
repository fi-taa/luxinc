import type { ContentParagraph } from "@/lib/content-detail";

interface DetailParagraphProps {
  paragraph: ContentParagraph;
}

export function DetailParagraph({ paragraph }: DetailParagraphProps) {
  return (
    <p className="font-sans text-sm font-normal leading-[1.7] text-zulu-text md:text-base">
      {paragraph.segments.map((segment, index) =>
        segment.href ? (
          <a
            key={`${segment.text}-${index}`}
            href={segment.href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-zulu-gold/60 underline-offset-4 transition-colors hover:text-zulu-gold"
          >
            {segment.text}
          </a>
        ) : (
          <span key={`${segment.text}-${index}`}>{segment.text}</span>
        )
      )}
    </p>
  );
}
