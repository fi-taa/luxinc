import { DestinationsInteractive } from "./destinations-interactive";
import { SectionShell } from "./section-shell";

export function DestinationsSection() {
  return (
    <SectionShell id="destinations" ariaLabelledBy="destinations-heading">
      <DestinationsInteractive />
    </SectionShell>
  );
}
