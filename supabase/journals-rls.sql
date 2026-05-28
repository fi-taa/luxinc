-- RLS for public.journals (landing highlights + detail pages).
-- Run in Supabase → SQL Editor, then Settings → API → Reload schema.

alter table public.journals enable row level security;

drop policy if exists "journals_public_read" on public.journals;
drop policy if exists "journals_authenticated_write" on public.journals;

create policy "journals_public_read" on public.journals
  for select
  using (is_published = true);

create policy "journals_authenticated_write" on public.journals
  for all
  to authenticated
  using (true)
  with check (true);

notify pgrst, 'reload schema';
