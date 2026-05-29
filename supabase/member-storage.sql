-- Member portal image uploads (itineraries, referrals).
-- Run once in Supabase SQL Editor.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'member-portal',
  'member-portal',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "member_portal_insert_own" on storage.objects;
create policy "member_portal_insert_own" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'member-portal'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "member_portal_update_own" on storage.objects;
create policy "member_portal_update_own" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'member-portal'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "member_portal_delete_own" on storage.objects;
create policy "member_portal_delete_own" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'member-portal'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "member_portal_public_read" on storage.objects;
create policy "member_portal_public_read" on storage.objects
  for select to public
  using (bucket_id = 'member-portal');

notify pgrst, 'reload schema';
