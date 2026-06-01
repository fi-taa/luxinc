-- Member portal v2: catalog, payments, past journeys, referrals.
-- Travel DNA: derived from member_journeys in app code (no DNA cache tables).
-- Active period: profiles.travel_dna_period (existing column).
--
-- Prerequisites: public.profiles + public.set_updated_at() + public.is_admin()
-- Keeps existing: concierge_messages, tourist_bookings.

create extension if not exists "pgcrypto";

do $$ begin
  create type public.member_payment_status as enum ('pending', 'success', 'failed');
exception when duplicate_object then null;
end $$;

create table if not exists public.upcoming_journeys (
  id uuid primary key default gen_random_uuid(),
  destination text not null,
  travel_date_label text not null,
  image_url text,
  image_alt text not null default '',
  stops jsonb not null default '[]'::jsonb,
  amount_minor integer not null check (amount_minor > 0),
  currency text not null default 'ETB',
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint upcoming_journeys_stops_is_array check (jsonb_typeof(stops) = 'array')
);

create index if not exists upcoming_journeys_published_sort_idx
  on public.upcoming_journeys (is_published, sort_order);

drop trigger if exists upcoming_journeys_updated_at on public.upcoming_journeys;
create trigger upcoming_journeys_updated_at
  before update on public.upcoming_journeys
  for each row execute function public.set_updated_at();

do $$ begin
  create type public.member_journey_status as enum ('booked', 'completed');
exception when duplicate_object then null;
end $$;

create table if not exists public.member_journeys (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  upcoming_journey_id uuid references public.upcoming_journeys (id) on delete set null,
  journey_status public.member_journey_status not null default 'booked',
  destination text not null,
  travel_date_label text not null,
  reporting_period text,
  destination_category text,
  topic_tags text[] not null default '{}',
  image_url text,
  image_alt text not null default '',
  stops jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint member_journeys_stops_is_array check (jsonb_typeof(stops) = 'array')
);

create index if not exists member_journeys_profile_sort_idx
  on public.member_journeys (profile_id, sort_order);

create index if not exists member_journeys_profile_period_idx
  on public.member_journeys (profile_id, reporting_period);

create unique index if not exists member_journeys_profile_catalog_idx
  on public.member_journeys (profile_id, upcoming_journey_id)
  where upcoming_journey_id is not null;

create table if not exists public.member_referrals (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  external_key text,
  image_url text,
  image_alt text not null default '',
  title text not null,
  description text not null,
  referral_link text not null,
  sort_order integer not null default 0
);

create index if not exists member_referrals_profile_idx
  on public.member_referrals (profile_id, sort_order);

create table if not exists public.member_payments (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  upcoming_journey_id uuid not null references public.upcoming_journeys (id) on delete restrict,
  tx_ref text not null unique,
  chapa_ref_id text,
  amount_minor integer not null check (amount_minor > 0),
  currency text not null,
  status public.member_payment_status not null default 'pending',
  failure_reason text,
  raw_verify jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists member_payments_profile_journey_idx
  on public.member_payments (profile_id, upcoming_journey_id);

create unique index if not exists member_payments_one_success_per_journey_idx
  on public.member_payments (profile_id, upcoming_journey_id)
  where status = 'success';

drop trigger if exists member_payments_updated_at on public.member_payments;
create trigger member_payments_updated_at
  before update on public.member_payments
  for each row execute function public.set_updated_at();

alter table public.upcoming_journeys enable row level security;
alter table public.member_journeys enable row level security;
alter table public.member_referrals enable row level security;
alter table public.member_payments enable row level security;

drop policy if exists "upcoming_journeys_select" on public.upcoming_journeys;
create policy "upcoming_journeys_select" on public.upcoming_journeys
  for select using (is_published or public.is_admin());

drop policy if exists "upcoming_journeys_admin_write" on public.upcoming_journeys;
create policy "upcoming_journeys_admin_write" on public.upcoming_journeys
  for all using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "member_journeys_own" on public.member_journeys;
create policy "member_journeys_own" on public.member_journeys
  for all using (profile_id = auth.uid() or public.is_admin())
  with check (profile_id = auth.uid() or public.is_admin());

drop policy if exists "member_referrals_own" on public.member_referrals;
create policy "member_referrals_own" on public.member_referrals
  for all using (profile_id = auth.uid() or public.is_admin())
  with check (profile_id = auth.uid() or public.is_admin());

drop policy if exists "member_payments_select_own" on public.member_payments;
create policy "member_payments_select_own" on public.member_payments
  for select using (profile_id = auth.uid() or public.is_admin());

grant select on public.upcoming_journeys to authenticated;
grant select, insert, update, delete on public.upcoming_journeys to authenticated;
grant select, insert, update, delete on public.member_journeys to authenticated;
grant select, insert, update, delete on public.member_referrals to authenticated;
grant select on public.member_payments to authenticated;

notify pgrst, 'reload schema';
