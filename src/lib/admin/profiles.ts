import type { SupabaseClient } from "@supabase/supabase-js";
import type { AdminUserRole, AdminUserStatus } from "@/lib/admin/admin-users";
import { getMemberExtensionDefaults } from "@/lib/admin/admin-users";
import type { AdminUserRecord } from "@/lib/admin/admin-users";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { travelDnaPeriods } from "@/lib/travel-dna-content";

export interface ProfileRow {
	id: string;
	email: string;
	full_name: string;
	phone: string | null;
	avatar_url: string | null;
	role: AdminUserRole;
	status: AdminUserStatus;
	travel_dna_period: string | null;
	joined_at: string;
}

export interface ProfileListItem {
	id: string;
	name: string;
	email: string;
	role: AdminUserRole;
	status: AdminUserStatus;
	joinedAt: string;
	avatarSrc: string;
}

function formatJoinedAt(iso: string): string {
	return new Date(iso).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

function avatarFallback(avatarUrl: string | null): string {
	return avatarUrl?.trim() ? avatarUrl : "/images/a1.png";
}

export function mapProfileToListItem(row: ProfileRow): ProfileListItem {
	return {
		id: row.id,
		name: row.full_name,
		email: row.email,
		role: row.role,
		status: row.status,
		joinedAt: formatJoinedAt(row.joined_at),
		avatarSrc: avatarFallback(row.avatar_url),
	};
}

export function mapProfileToAdminUser(
	row: ProfileRow,
	extension = getMemberExtensionDefaults(row.id),
): AdminUserRecord {
	return {
		id: row.id,
		name: row.full_name,
		email: row.email,
		phone: row.phone ?? undefined,
		role: row.role,
		status: row.status,
		joinedAt: formatJoinedAt(row.joined_at),
		avatarSrc: avatarFallback(row.avatar_url),
		...extension,
		travelDnaPeriod:
			(row.travel_dna_period as AdminUserRecord["travelDnaPeriod"] | null) ??
			extension.travelDnaPeriod ??
			travelDnaPeriods[0],
	};
}

const profileSelect =
	"id,email,full_name,phone,avatar_url,role,status,travel_dna_period,joined_at";

export async function fetchProfilesList(
	client?: SupabaseClient,
): Promise<ProfileListItem[]> {
	const supabase = client ?? getSupabaseBrowserClient();
	const { data, error } = await supabase
		.from("profiles")
		.select(profileSelect)
		.order("joined_at", { ascending: false });

	if (error) throw new Error(error.message);
	return ((data ?? []) as ProfileRow[]).map(mapProfileToListItem);
}

export async function updateProfile(
	id: string,
	patch: {
		full_name?: string;
		email?: string;
		phone?: string | null;
		avatar_url?: string | null;
		role?: AdminUserRole;
		status?: AdminUserStatus;
		travel_dna_period?: string | null;
	},
	client?: SupabaseClient,
): Promise<void> {
	const supabase = client ?? getSupabaseBrowserClient();
	const { error } = await supabase.from("profiles").update(patch).eq("id", id);
	if (error) throw new Error(error.message);
}

export async function countRecentMemberSignups(days = 7): Promise<number> {
	const supabase = getSupabaseBrowserClient();
	const since = new Date();
	since.setDate(since.getDate() - days);
	const { count, error } = await supabase
		.from("profiles")
		.select("id", { count: "exact", head: true })
		.eq("role", "member")
		.gte("joined_at", since.toISOString());

	if (error) throw new Error(error.message);
	return count ?? 0;
}
