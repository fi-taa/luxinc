"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import {
	AdminField,
	AdminInput,
	AdminSelect,
} from "@/components/admin/forms/admin-field";
import { AdminImageField } from "@/components/admin/forms/admin-image-field";
import { AdminStickySaveBar } from "@/components/admin/forms/admin-sticky-save-bar";
import { useAdminForm } from "@/components/admin/forms/use-admin-form";
import type { AdminUserRole, AdminUserStatus } from "@/lib/admin/admin-users";

const initialState = {
	name: "",
	email: "",
	phone: "",
	role: "member" as AdminUserRole,
	status: "active" as AdminUserStatus,
	avatarSrc: "/images/a1.png",
	password: "",
};

export function UserCreateForm() {
	const router = useRouter();
	const { data, setField, isDirty, saveMessage, discard, commit } =
		useAdminForm(initialState);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [creating, setCreating] = useState(false);

	async function handleSave() {
		setSubmitError(null);
		setCreating(true);
		try {
			const response = await fetch("/api/admin/users", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: data.email,
					password: data.password,
					fullName: data.name,
					phone: data.phone,
					role: data.role,
					status: data.status,
				}),
			});
			const body = (await response.json()) as { id?: string; error?: string };
			if (!response.ok) {
				throw new Error(body.error ?? "Failed to create user");
			}
			commit("User created.");
			router.push(body.id ? `/admin/users/${body.id}` : "/admin/users");
			router.refresh();
		} catch (error) {
			setSubmitError(
				error instanceof Error ? error.message : "Failed to create user",
			);
		} finally {
			setCreating(false);
		}
	}

	return (
		<>
			<AdminPageHeader
				title="Add user"
				description="Create a new Luxinc member or admin operator."
			/>
			<div className="space-y-6">
				<AdminPanel title="Profile">
					<div className="grid gap-5 md:grid-cols-2">
						<AdminField label="Full name" htmlFor="new-user-name">
							<AdminInput
								id="new-user-name"
								value={data.name}
								onChange={(e) => setField("name", e.target.value)}
							/>
						</AdminField>
						<AdminField label="Email" htmlFor="new-user-email">
							<AdminInput
								id="new-user-email"
								type="email"
								value={data.email}
								onChange={(e) => setField("email", e.target.value)}
							/>
						</AdminField>
						<AdminField label="Phone (optional)" htmlFor="new-user-phone">
							<AdminInput
								id="new-user-phone"
								value={data.phone}
								onChange={(e) => setField("phone", e.target.value)}
							/>
						</AdminField>
					</div>
					<div className="mt-5">
						<AdminImageField
							label="Avatar"
							imageSrc={data.avatarSrc}
							imageAlt=""
							onImageSrcChange={(value) => setField("avatarSrc", value)}
							onImageAltChange={() => undefined}
						/>
					</div>
				</AdminPanel>
				<AdminPanel title="Access">
					<div className="grid gap-5 md:grid-cols-2">
						<AdminField label="Role" htmlFor="new-user-role">
							<AdminSelect
								id="new-user-role"
								value={data.role}
								onChange={(e) =>
									setField("role", e.target.value as AdminUserRole)
								}
							>
								<option value="member">Member</option>
								<option value="admin">Admin</option>
							</AdminSelect>
						</AdminField>
						<AdminField label="Status" htmlFor="new-user-status">
							<AdminSelect
								id="new-user-status"
								value={data.status}
								onChange={(e) =>
									setField("status", e.target.value as AdminUserStatus)
								}
							>
								<option value="active">Active</option>
								<option value="disabled">Disabled</option>
							</AdminSelect>
						</AdminField>
						<AdminField
							label="Temporary password"
							htmlFor="new-user-password"
							hint="Creates a Supabase Auth user with this password."
							className="md:col-span-2"
						>
							<AdminInput
								id="new-user-password"
								type="password"
								value={data.password}
								onChange={(e) => setField("password", e.target.value)}
							/>
						</AdminField>
					</div>
				</AdminPanel>
				<AdminPanel title="Member data">
					<p className="font-sans text-sm text-luxinc-text-muted">
						After creating this user, open their profile to manage upcoming
						itineraries, Travel DNA, referrals, and concierge history.
					</p>
				</AdminPanel>
			</div>
			{submitError ? (
				<p className="font-sans text-sm text-red-400" role="alert">
					{submitError}
				</p>
			) : null}
			<AdminStickySaveBar
				isDirty={isDirty}
				isSaving={creating}
				saveMessage={saveMessage}
				onSave={handleSave}
				onDiscard={discard}
			/>
			<p className="mt-4">
				<Link
					href="/admin/users"
					className="font-sans text-sm text-luxinc-gold hover:text-luxinc-gold-muted"
				>
					Cancel
				</Link>
			</p>
		</>
	);
}
