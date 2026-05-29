-- Run once in Supabase → SQL Editor (required for destination type + topic tags on past journeys).
-- Until this runs, the app still works: periods are derived from travel_date_label.

alter table public.member_itineraries
  add column if not exists reporting_period text,
  add column if not exists destination_category text,
  add column if not exists topic_tags text[] not null default '{}';

update public.member_itineraries
set reporting_period = coalesce(
  reporting_period,
  'for ' || to_char(created_at, 'FMMonth YYYY')
)
where reporting_period is null;

notify pgrst, 'reload schema';
