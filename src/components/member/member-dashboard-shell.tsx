import { DotsPattern } from "@/components/content/dots-pattern";
import { SiteFooter } from "@/components/landing/site-footer";
import { MemberHeader } from "./member-header";
import { MemberSidebar } from "./member-sidebar";

interface MemberDashboardShellProps {
	children: React.ReactNode;
}

export function MemberDashboardShell({ children }: MemberDashboardShellProps) {
	return (
		<div className="relative flex min-h-screen flex-col bg-luxinc-bg text-luxinc-text">
			<DotsPattern className="pointer-events-none fixed inset-0 overflow-hidden" />
			<div className="relative z-10 flex flex-1 flex-col">
				<MemberHeader activeHref="/#destinations" />
				<div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col gap-8 px-6 pb-12 pt-2 md:flex-row md:items-start md:gap-10 md:px-10 md:pb-16 md:pt-4 lg:gap-12 lg:px-16">
					<MemberSidebar className="w-full shrink-0 self-start md:sticky md:top-28 md:w-[260px] lg:w-[280px]" />
					<main className="min-w-0 flex-1 pb-4">{children}</main>
				</div>
				<SiteFooter showQuote={false} />
			</div>
		</div>
	);
}
