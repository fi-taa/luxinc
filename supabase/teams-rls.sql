-- RLS for public.teams (no reference to public.profiles)

alter table public.teams enable row level security;

drop policy if exists "teams_admin_all" on public.teams;
drop policy if exists "teams_public_read" on public.teams;
drop policy if exists "teams_authenticated_write" on public.teams;

create policy "teams_public_read" on public.teams
  for select
  using (status = 'active'::public.user_status);

create policy "teams_authenticated_write" on public.teams
  for all
  to authenticated
  using (true)
  with check (true);
