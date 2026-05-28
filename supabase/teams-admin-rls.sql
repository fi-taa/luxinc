-- Admin CMS access for teams (requires public.profiles + is_admin from destinations sql)

drop policy if exists "teams_admin_all" on public.teams;
create policy "teams_admin_all" on public.teams
  for all using (public.is_admin()) with check (public.is_admin());
