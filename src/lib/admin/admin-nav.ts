export interface AdminNavLink {
	label: string;
	href: string;
}

export interface AdminNavGroup {
	id: string;
	label: string;
	items: AdminNavLink[];
}

export const adminNavGroups: AdminNavGroup[] = [
	{
		id: "overview",
		label: "Overview",
		items: [{ label: "Dashboard", href: "/admin/dashboard" }],
	},
	{
		id: "users",
		label: "Users",
		items: [
			{ label: "All users", href: "/admin/users" },
			{ label: "Add user", href: "/admin/users/new" },
		],
	},
	{
		id: "landing",
		label: "Landing",
		items: [
			{ label: "All sections", href: "/admin/landing" },
			{ label: "Site & navigation", href: "/admin/landing/site" },
			{ label: "Hero", href: "/admin/landing/hero" },
			{ label: "Commitment", href: "/admin/landing/commitment" },
			{ label: "Destinations", href: "/admin/landing/destinations" },
			{ label: "Crown Collection", href: "/admin/landing/crown-collection" },
			{ label: "Architects", href: "/admin/landing/architects" },
			{ label: "Journal", href: "/admin/landing/journal" },
			{ label: "Team", href: "/admin/landing/team" },
			{ label: "Black Book", href: "/admin/landing/black-book" },
			{ label: "Contact", href: "/admin/landing/contact" },
			{ label: "Footer", href: "/admin/landing/footer" },
		],
	},
];

export const adminOperator = {
	name: "Admin Operator",
	email: "admin@luxinc.com",
};
