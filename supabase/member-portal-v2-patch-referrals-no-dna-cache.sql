-- Run only if you already applied member-portal-v2-schema.sql with member_profile_data.
-- Replaces member_profile_data with member_referrals; DNA comes from member_journeys in app.

drop table if exists public.member_profile_data cascade;

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

create index if not exists member_journeys_profile_period_idx
  on public.member_journeys (profile_id, reporting_period);

alter table public.member_referrals enable row level security;

drop policy if exists "member_referrals_own" on public.member_referrals;
create policy "member_referrals_own" on public.member_referrals
  for all using (profile_id = auth.uid() or public.is_admin())
  with check (profile_id = auth.uid() or public.is_admin());

grant select, insert, update, delete on public.member_referrals to authenticated;

notify pgrst, 'reload schema';
