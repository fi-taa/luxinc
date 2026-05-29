-- Member portal: itineraries, travel DNA, referrals, concierge chat.
-- Run after supabase/profiles-schema.sql
--
-- Tables start empty. The app does not auto-seed demo data.
-- Travel DNA is computed from past journeys (see app recompute), not entered manually.
-- To clear data: supabase/member-portal-reset.sql
-- Optional demo seed: supabase/member-portal-seed-demo.sql
-- Existing DBs: run supabase/member-portal-itinerary-dna-source.sql once for new itinerary columns.
-- Image uploads: run supabase/member-storage.sql once for the member-portal storage bucket.

create extension if not exists "pgcrypto";

do $$ begin
  create type public.member_itinerary_kind as enum ('upcoming', 'past');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.member_dna_topic_kind as enum ('weakest', 'strongest');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.concierge_sender as enum ('concierge', 'user');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.concierge_message_type as enum ('text', 'voice', 'link', 'file');
exception when duplicate_object then null;
end $$;

create table if not exists public.member_itineraries (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  kind public.member_itinerary_kind not null,
  destination text not null,
  travel_date_label text not null,
  reporting_period text,
  destination_category text,
  topic_tags text[] not null default '{}',
  image_url text,
  image_alt text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists member_itineraries_profile_kind_idx
  on public.member_itineraries (profile_id, kind, sort_order);

create table if not exists public.member_itinerary_stops (
  id uuid primary key default gen_random_uuid(),
  itinerary_id uuid not null references public.member_itineraries (id) on delete cascade,
  sort_order int not null default 0,
  stop_time text not null,
  activity text not null
);

create index if not exists member_itinerary_stops_itinerary_idx
  on public.member_itinerary_stops (itinerary_id, sort_order);

create table if not exists public.member_travel_dna_settings (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  active_period text not null default 'for September 2019',
  period_options jsonb not null default '["for September 2019","for August 2019","for July 2019"]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.member_travel_dna_locations (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  external_key text not null,
  label text not null,
  percent numeric(5, 2) not null,
  color text not null,
  sort_order int not null default 0,
  unique (profile_id, external_key)
);

create index if not exists member_travel_dna_locations_profile_idx
  on public.member_travel_dna_locations (profile_id, sort_order);

create table if not exists public.member_travel_dna_destinations (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  external_key text not null,
  rank int not null,
  name text not null,
  points_label text not null,
  correct_percent int,
  trend text not null check (trend in ('up', 'down')),
  sort_order int not null default 0,
  unique (profile_id, external_key)
);

create index if not exists member_travel_dna_destinations_profile_idx
  on public.member_travel_dna_destinations (profile_id, sort_order);

create table if not exists public.member_travel_dna_topics (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  external_key text not null,
  kind public.member_dna_topic_kind not null,
  name text not null,
  percent int not null check (percent >= 0 and percent <= 100),
  image_url text,
  image_alt text not null default '',
  sort_order int not null default 0,
  unique (profile_id, external_key, kind)
);

create index if not exists member_travel_dna_topics_profile_idx
  on public.member_travel_dna_topics (profile_id, kind, sort_order);

create table if not exists public.member_referrals (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  external_key text,
  image_url text,
  image_alt text not null default '',
  title text not null,
  description text not null,
  referral_link text not null,
  sort_order int not null default 0
);

create index if not exists member_referrals_profile_idx
  on public.member_referrals (profile_id, sort_order);

create table if not exists public.concierge_messages (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  sender public.concierge_sender not null,
  message_type public.concierge_message_type not null default 'text',
  body jsonb not null default '{}'::jsonb,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists concierge_messages_profile_idx
  on public.concierge_messages (profile_id, created_at);

alter table public.member_itineraries enable row level security;
alter table public.member_itinerary_stops enable row level security;
alter table public.member_travel_dna_settings enable row level security;
alter table public.member_travel_dna_locations enable row level security;
alter table public.member_travel_dna_destinations enable row level security;
alter table public.member_travel_dna_topics enable row level security;
alter table public.member_referrals enable row level security;
alter table public.concierge_messages enable row level security;

drop policy if exists "member_itineraries_own" on public.member_itineraries;
create policy "member_itineraries_own" on public.member_itineraries
  for all using (profile_id = auth.uid() or public.is_admin())
  with check (profile_id = auth.uid() or public.is_admin());

drop policy if exists "member_itinerary_stops_own" on public.member_itinerary_stops;
create policy "member_itinerary_stops_own" on public.member_itinerary_stops
  for all using (
    exists (
      select 1 from public.member_itineraries i
      where i.id = itinerary_id and (i.profile_id = auth.uid() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.member_itineraries i
      where i.id = itinerary_id and (i.profile_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "member_travel_dna_settings_own" on public.member_travel_dna_settings;
create policy "member_travel_dna_settings_own" on public.member_travel_dna_settings
  for all using (profile_id = auth.uid() or public.is_admin())
  with check (profile_id = auth.uid() or public.is_admin());

drop policy if exists "member_travel_dna_locations_own" on public.member_travel_dna_locations;
create policy "member_travel_dna_locations_own" on public.member_travel_dna_locations
  for all using (profile_id = auth.uid() or public.is_admin())
  with check (profile_id = auth.uid() or public.is_admin());

drop policy if exists "member_travel_dna_destinations_own" on public.member_travel_dna_destinations;
create policy "member_travel_dna_destinations_own" on public.member_travel_dna_destinations
  for all using (profile_id = auth.uid() or public.is_admin())
  with check (profile_id = auth.uid() or public.is_admin());

drop policy if exists "member_travel_dna_topics_own" on public.member_travel_dna_topics;
create policy "member_travel_dna_topics_own" on public.member_travel_dna_topics
  for all using (profile_id = auth.uid() or public.is_admin())
  with check (profile_id = auth.uid() or public.is_admin());

drop policy if exists "member_referrals_own" on public.member_referrals;
create policy "member_referrals_own" on public.member_referrals
  for all using (profile_id = auth.uid() or public.is_admin())
  with check (profile_id = auth.uid() or public.is_admin());

drop policy if exists "concierge_messages_own" on public.concierge_messages;
create policy "concierge_messages_own" on public.concierge_messages
  for all using (profile_id = auth.uid() or public.is_admin())
  with check (profile_id = auth.uid() or public.is_admin());

grant select, insert, update, delete on public.member_itineraries to authenticated;
grant select, insert, update, delete on public.member_itinerary_stops to authenticated;
grant select, insert, update, delete on public.member_travel_dna_settings to authenticated;
grant select, insert, update, delete on public.member_travel_dna_locations to authenticated;
grant select, insert, update, delete on public.member_travel_dna_destinations to authenticated;
grant select, insert, update, delete on public.member_travel_dna_topics to authenticated;
grant select, insert, update, delete on public.member_referrals to authenticated;
grant select, insert, update, delete on public.concierge_messages to authenticated;

notify pgrst, 'reload schema';
