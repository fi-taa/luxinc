"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import {
	AdminInput,
	AdminSelect,
} from "@/components/admin/forms/admin-field";
import type { AdminUserRecord, AdminUserRole, AdminUserStatus } from "@/lib/admin/admin-users";
import { adminUsers } from "@/lib/admin/admin-users";
import { cn } from "@/lib/utils";
import { GoldButton } from "@/components/landing/gold-button";

export function UsersList() {
	const [query, setQuery] = useState("");
	const [roleFilter, setRoleFilter] = useState<AdminUserRole | "all">("all");
	const [statusFilter, setStatusFilter] = useState<AdminUserStatus | "all">(
		"all",
	);

	const filtered = useMemo(() => {
		return adminUsers.filter((user) => {
			const matchesQuery =
				query.trim() === "" ||
				user.name.toLowerCase().includes(query.toLowerCase()) ||
				user.email.toLowerCase().includes(query.toLowerCase());
			const matchesRole = roleFilter === "all" || user.role === roleFilter;
			const matchesStatus =
				statusFilter === "all" || user.status === statusFilter;
			return matchesQuery && matchesRole && matchesStatus;
		});
	}, [query, roleFilter, statusFilter]);

	return (
		<>
			<AdminPageHeader
				title="Users"
				description="Manage Luxinc members and admin operators."
				action={
					<GoldButton
						href="/admin/users/new"
						className="h-8 bg-luxinc-gold px-4 font-sans text-xs font-semibold text-luxinc-bg transition-colors hover:bg-luxinc-gold-muted"
					>
						Add user
					</GoldButton>
				}
			/>
			<AdminPanel>
				<div className="mb-6 grid gap-4 md:grid-cols-3">
					<div>
						<label
							htmlFor="user-search"
							className="mb-2 block font-sans text-sm font-medium text-luxinc-text"
						>
							Search
						</label>
						<AdminInput
							id="user-search"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Name or email"
						/>
					</div>
					<div>
						<label
							htmlFor="user-role-filter"
							className="mb-2 block font-sans text-sm font-medium text-luxinc-text"
						>
							Role
						</label>
						<AdminSelect
							id="user-role-filter"
							value={roleFilter}
							onChange={(e) =>
								setRoleFilter(e.target.value as AdminUserRole | "all")
							}
						>
							<option value="all">All roles</option>
							<option value="member">Member</option>
							<option value="admin">Admin</option>
						</AdminSelect>
					</div>
					<div>
						<label
							htmlFor="user-status-filter"
							className="mb-2 block font-sans text-sm font-medium text-luxinc-text"
						>
							Status
						</label>
						<AdminSelect
							id="user-status-filter"
							value={statusFilter}
							onChange={(e) =>
								setStatusFilter(e.target.value as AdminUserStatus | "all")
							}
						>
							<option value="all">All statuses</option>
							<option value="active">Active</option>
							<option value="disabled">Disabled</option>
						</AdminSelect>
					</div>
				</div>
				{filtered.length === 0 ? (
					<p className="font-sans text-sm text-luxinc-text-muted">
						No users match your filters.{" "}
						<Link href="/admin/users/new" className="text-luxinc-gold">
							Create the first user
						</Link>
						.
					</p>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full min-w-[640px] text-left font-sans text-sm">
							<thead>
								<tr className="border-b border-luxinc-border/60 text-luxinc-text-muted">
									<th className="pb-3 pr-4 font-medium">Name</th>
									<th className="pb-3 pr-4 font-medium">Email</th>
									<th className="pb-3 pr-4 font-medium">Role</th>
									<th className="pb-3 pr-4 font-medium">Status</th>
									<th className="pb-3 pr-4 font-medium">Joined</th>
									<th className="pb-3 font-medium">Actions</th>
								</tr>
							</thead>
							<tbody>
								{filtered.map((user) => (
									<UserRow key={user.id} user={user} />
								))}
							</tbody>
						</table>
					</div>
				)}
			</AdminPanel>
		</>
	);
}

function UserRow({ user }: { user: AdminUserRecord }) {
	return (
		<tr className="border-b border-luxinc-border/40 last:border-0">
			<td className="py-4 pr-4 text-luxinc-text">{user.name}</td>
			<td className="py-4 pr-4 text-luxinc-text-muted">{user.email}</td>
			<td className="py-4 pr-4">
				<span
					className={cn(
						"rounded-full px-2.5 py-0.5 text-xs capitalize",
						user.role === "admin"
							? "bg-luxinc-gold/20 text-luxinc-gold"
							: "bg-white/10 text-luxinc-text",
					)}
				>
					{user.role}
				</span>
			</td>
			<td className="py-4 pr-4 capitalize text-luxinc-text-muted">
				{user.status}
			</td>
			<td className="py-4 pr-4 text-luxinc-text-muted">{user.joinedAt}</td>
			<td className="py-4">
				<div className="flex flex-wrap gap-3">
					<Link
						href={`/admin/users/${user.id}`}
						className="text-luxinc-gold hover:text-luxinc-gold-muted"
					>
						Edit
					</Link>
					<Link
						href="/member/upcoming"
						className="text-luxinc-text-muted hover:text-luxinc-text"
					>
						View member
					</Link>
				</div>
			</td>
		</tr>
	);
}
