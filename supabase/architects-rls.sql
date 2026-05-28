-- RLS for public.architects (landing section cards)

alter table public.architects enable row level security;

drop policy if exists "architects_public_read" on public.architects;
create policy "architects_public_read" on public.architects
  for select using (true);

drop policy if exists "architects_admin_all" on public.architects;
create policy "architects_admin_all" on public.architects
  for all using (public.is_admin()) with check (public.is_admin());
