import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
	title: "Admin | LUXINC.",
	robots: { index: false, follow: false },
};

export default function AdminPanelLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <AdminShell>{children}</AdminShell>;
}
