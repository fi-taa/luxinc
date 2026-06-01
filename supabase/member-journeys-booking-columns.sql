-- Link paid catalog journeys to member_journeys (run once in Supabase SQL Editor).

do $$ begin
  create type public.member_journey_status as enum ('booked', 'completed');
exception when duplicate_object then null;
end $$;

alter table public.member_journeys
  add column if not exists upcoming_journey_id uuid references public.upcoming_journeys (id) on delete set null;

alter table public.member_journeys
  add column if not exists journey_status public.member_journey_status not null default 'booked';

create unique index if not exists member_journeys_profile_catalog_idx
  on public.member_journeys (profile_id, upcoming_journey_id)
  where upcoming_journey_id is not null;

notify pgrst, 'reload schema';
