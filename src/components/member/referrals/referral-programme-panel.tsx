"use client";

import { useState } from "react";
import type { ReferralProgramme } from "@/lib/referral-content";
import { AddReferralDialog } from "../forms/add-referral-dialog";
import { MemberSectionHeader } from "../forms/member-form-ui";
import { ReferralCard } from "./referral-card";

interface ReferralProgrammePanelProps {
	programmes: ReferralProgramme[];
	error?: string | null;
}

export function ReferralProgrammePanel({
	programmes,
	error,
}: ReferralProgrammePanelProps) {
	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<section aria-labelledby="referral-programme-heading" className="space-y-10">
			<h1 id="referral-programme-heading" className="sr-only">
				Referral Programme
			</h1>
			<MemberSectionHeader
				title="Referral programmes"
				addLabel="Add programme"
				onAdd={() => setDialogOpen(true)}
			/>
			{error ? (
				<p className="font-sans text-sm text-red-400">{error}</p>
			) : null}
			{!error && programmes.length === 0 ? (
				<p className="font-sans text-sm text-luxinc-text-muted">
					No referral programmes yet. Use Add programme to create one.
				</p>
			) : null}
			{programmes.map((programme) => (
				<ReferralCard key={programme.id} programme={programme} />
			))}
			<AddReferralDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
		</section>
	);
}
