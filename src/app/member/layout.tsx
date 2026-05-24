import type { Metadata } from "next";
import { MemberDashboardShell } from "@/components/member/member-dashboard-shell";

export const metadata: Metadata = {
	title: "Member | LUXINC.",
	description: "Your private Luxinc member dashboard.",
};

export default function MemberLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <MemberDashboardShell>{children}</MemberDashboardShell>;
}
