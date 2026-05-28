import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service-client";
import { mapTeamRow } from "@/lib/cms/mappers";
import type { PersonCardRecord } from "@/lib/cms/types";
import type { SupabaseClient } from "@supabase/supabase-js";

export type TeamRow = {
  id: string;
  full_name: string;
  description: string | null;
  avatar_url: string | null;
};

async function queryTeams(
  supabase: SupabaseClient
): Promise<{ rows: TeamRow[]; error: string | null }> {
  const { data, error } = await supabase
    .from("teams")
    .select("id,full_name,description,avatar_url")
    .eq("status", "active")
    .order("joined_at", { ascending: true });

  if (error) return { rows: [], error: error.message };
  return { rows: (data ?? []) as TeamRow[], error: null };
}

export async function fetchTeamMembers(): Promise<{
  rows: TeamRow[];
  error: string | null;
}> {
  const clients = [
    createSupabaseServiceClient(),
    createSupabaseServerClient(),
  ].filter(Boolean) as SupabaseClient[];

  for (const client of clients) {
    const result = await queryTeams(client);
    if (!result.error) return result;
  }

  const { error } = await queryTeams(createSupabaseServerClient());
  return { rows: [], error };
}

export function mapTeamMembersToCards(
  rows: TeamRow[],
  toLandingImageUrl: (url: string) => string
): PersonCardRecord[] {
  return rows.map((row) => {
    const member = mapTeamRow(row);
    return { ...member, image: toLandingImageUrl(member.image) };
  });
}
