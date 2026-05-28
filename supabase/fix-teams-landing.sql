-- Fix public.teams API access (table already exists — do NOT drop view).
-- Run in Supabase → SQL Editor, then Settings → API → Reload schema.

-- Remove policies that call is_admin() → reads missing public.profiles
drop policy if exists "teams_admin_all" on public.teams;
drop policy if exists "teams_authenticated_write" on public.teams;
drop policy if exists "teams_public_read" on public.teams;

alter table public.teams enable row level security;

-- Landing page: anon + logged-in users can read active members
create policy "teams_public_read" on public.teams
  for select
  using (status = 'active'::public.user_status);

-- Admin CMS: authenticated users can edit (tighten later with is_admin when profiles exists)
create policy "teams_authenticated_write" on public.teams
  for all
  to authenticated
  using (true)
  with check (true);

notify pgrst, 'reload schema';

-- Verify:
-- select id, full_name, description, avatar_url from public.teams where status = 'active';
