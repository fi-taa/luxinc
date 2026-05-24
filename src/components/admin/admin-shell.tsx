import { AdminFooter } from "./admin-footer";
import { AdminHeader } from "./admin-header";
import { AdminSidebar } from "./admin-sidebar";

interface AdminShellProps {
	children: React.ReactNode;
	title?: string;
}

export function AdminShell({ children, title }: AdminShellProps) {
	return (
		<div className="flex min-h-screen flex-col bg-[#080808] text-luxinc-text">
			<AdminHeader title={title} />
			<div className="flex min-h-0 flex-1">
				<AdminSidebar className="hidden w-[220px] shrink-0 border-r border-luxinc-border/50 bg-[#0c0c0c] md:flex md:flex-col" />
				<div className="flex min-w-0 flex-1 flex-col">
					<AdminSidebar className="border-b border-luxinc-border/50 bg-[#0c0c0c] md:hidden" />
					<main className="min-w-0 flex-1 px-4 py-4 lg:px-5 lg:py-5">
						{children}
					</main>
					<AdminFooter />
				</div>
			</div>
		</div>
	);
}
