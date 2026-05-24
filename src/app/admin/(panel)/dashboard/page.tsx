import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import { adminUsers, getRecentSignUpCount } from "@/lib/admin/admin-users";
import { getDraftLandingSectionCount } from "@/lib/admin/landing-sections";

export default function AdminDashboardPage() {
	const activeMembers = adminUsers.filter(
		(user) => user.role === "member" && user.status === "active",
	).length;
	const draftSections = getDraftLandingSectionCount();

	const stats = [
		{ label: "Total users", value: String(adminUsers.length) },
		{ label: "Active members", value: String(activeMembers) },
		{ label: "Draft landing sections", value: String(draftSections) },
		{ label: "Recent sign-ups (7d)", value: String(getRecentSignUpCount()) },
	];

	const quickActions = [
		{ label: "Add user", href: "/admin/users/new" },
		{ label: "Edit hero", href: "/admin/landing/hero" },
		{ label: "Edit destinations", href: "/admin/landing/destinations" },
	];

	const activity = [
		"Daniel Alemayehu — upcoming itinerary updated",
		"Hero copy saved by Admin Operator",
		"Journal section marked as draft",
		"Meron T. — account disabled",
	];

	return (
		<>
			<AdminPageHeader
				title="Dashboard"
				description="Operational overview for Luxinc members and landing content."
			/>
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{stats.map((stat) => (
					<AdminPanel key={stat.label}>
						<p className="font-sans text-sm text-luxinc-text-muted">{stat.label}</p>
						<p className="mt-1 font-sans text-2xl font-semibold tabular-nums text-luxinc-gold">
							{stat.value}
						</p>
					</AdminPanel>
				))}
			</div>
			<div className="mt-8 grid gap-6 lg:grid-cols-2">
				<AdminPanel title="Quick actions">
					<ul className="space-y-2">
						{quickActions.map((action) => (
							<li key={action.href}>
								<Link
									href={action.href}
									className="font-sans text-sm text-luxinc-gold transition-colors hover:text-luxinc-gold-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold"
								>
									{action.label}
								</Link>
							</li>
						))}
					</ul>
				</AdminPanel>
				<AdminPanel title="Recent activity">
					<ul className="space-y-3">
						{activity.map((item) => (
							<li
								key={item}
								className="border-b border-luxinc-border/40 pb-3 font-sans text-sm text-luxinc-text-muted last:border-0 last:pb-0"
							>
								{item}
							</li>
						))}
					</ul>
				</AdminPanel>
			</div>
		</>
	);
}
