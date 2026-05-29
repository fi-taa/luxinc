import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import { fetchProfilesList } from "@/lib/admin/profiles";
import { getDraftLandingSectionCount } from "@/lib/admin/landing-sections";
import { createSupabaseAuthServerClient } from "@/lib/supabase/auth-server";

export default async function AdminDashboardPage() {
	let totalUsers = 0;
	let activeMembers = 0;
	let recentSignUps = 0;

	try {
		const supabase = await createSupabaseAuthServerClient();
		const users = await fetchProfilesList(supabase);
		totalUsers = users.length;
		activeMembers = users.filter(
			(user) => user.role === "member" && user.status === "active",
		).length;

		const since = new Date();
		since.setDate(since.getDate() - 7);
		const { count } = await supabase
			.from("profiles")
			.select("id", { count: "exact", head: true })
			.eq("role", "member")
			.gte("joined_at", since.toISOString());
		recentSignUps = count ?? 0;
	} catch {
		totalUsers = 0;
		activeMembers = 0;
		recentSignUps = 0;
	}

	const draftSections = getDraftLandingSectionCount();

	const stats = [
		{ label: "Total users", value: String(totalUsers) },
		{ label: "Active members", value: String(activeMembers) },
		{ label: "Draft landing sections", value: String(draftSections) },
		{ label: "Recent sign-ups (7d)", value: String(recentSignUps) },
	];

	const quickActions = [
		{ label: "Add user", href: "/admin/users/new" },
		{ label: "Edit hero", href: "/admin/landing/hero" },
		{ label: "Edit destinations", href: "/admin/landing/destinations" },
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
				<AdminPanel title="Getting started">
					<ul className="space-y-3 font-sans text-sm text-luxinc-text-muted">
						<li>
							Run{" "}
							<code className="text-luxinc-gold">supabase/profiles-schema.sql</code>{" "}
							if the users table is empty.
						</li>
						<li>
							Promote your operator:{" "}
							<code className="text-luxinc-gold">
								update profiles set role = &apos;admin&apos; where email =
								&apos;you@luxinc.com&apos;;
							</code>
						</li>
						<li>Members sign in from the homepage Login modal.</li>
					</ul>
				</AdminPanel>
			</div>
		</>
	);
}
