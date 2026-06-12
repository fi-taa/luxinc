import type { Metadata } from "next";
import { MemberDashboardShell } from "@/components/member/member-dashboard-shell";
import { createPageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = createPageMetadata({
	title: "Member | LUXINC.",
	description: "Your private Luxinc member dashboard.",
	noIndex: true,
});

export default function MemberLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <MemberDashboardShell>{children}</MemberDashboardShell>;
}
