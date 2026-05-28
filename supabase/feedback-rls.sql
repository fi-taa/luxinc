-- RLS for public.feedback (footer quote block above legal footer).
-- Run in Supabase → SQL Editor, then Settings → API → Reload schema.

alter table public.feedback enable row level security;

drop policy if exists "feedback_public_read" on public.feedback;
drop policy if exists "feedback_authenticated_write" on public.feedback;

create policy "feedback_public_read" on public.feedback
  for select
  using (is_published = true);

create policy "feedback_authenticated_write" on public.feedback
  for all
  to authenticated
  using (true)
  with check (true);

notify pgrst, 'reload schema';
