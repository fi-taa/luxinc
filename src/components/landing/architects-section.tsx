import { architects } from "@/lib/landing-content";
import type { PersonCard } from "@/lib/landing-content";
import { FillImage } from "./fill-image";
import { SectionShell } from "./section-shell";
import { SectionTitle } from "./section-title";

const columnHeight = "md:h-[min(65vh,560px)] md:flex-1";

function ArchitectCard({ member }: { member: PersonCard }) {
  return (
    <article className="group relative h-full min-h-[280px] w-full overflow-hidden">
      <FillImage
        containerClassName="absolute inset-0 bg-zulu-bg"
        src={member.image}
        alt={member.imageAlt}
        className="object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col p-5 md:p-6">
        <h3 className="font-sans text-sm font-semibold text-zulu-text md:text-base">
          {member.name}
        </h3>
        <p className="mt-1.5 font-sans text-[11px] font-normal leading-relaxed text-zulu-text/90 md:text-xs">
          {member.role}
        </p>
      </div>
    </article>
  );
}

export function ArchitectsSection() {
  const [firstMember, ...otherMembers] = architects.members;

  return (
    <SectionShell id="architects" ariaLabelledBy="architects-heading">
      <div className="flex flex-col gap-5 md:flex-row md:items-stretch md:gap-5 lg:gap-6">
        <div className={`flex w-full flex-col ${columnHeight}`}>
          <div className="shrink-0">
            <SectionTitle
              id="architects-heading"
              title={architects.title}
              subtitle={architects.subtitle}
              align="left"
            />
          </div>
          <div className="mt-5 flex min-h-0 flex-1 flex-col md:mt-6">
            <ArchitectCard member={firstMember} />
          </div>
        </div>

        {otherMembers.map((member) => (
          <div
            key={member.name}
            className={`w-full max-w-[340px] md:max-w-none ${columnHeight}`}
          >
            <ArchitectCard member={member} />
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
