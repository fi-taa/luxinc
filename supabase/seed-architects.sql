-- Seed public.architects (landing cards)
-- Run after architects-rls.sql

insert into public.architects (title, sub_title, short_description, description, image_url)
values
  (
    'Team Bios',
    null,
    'Ethiopian heritage & exclusive ecclesiastical access.',
    '',
    '/images/a1.png'
  ),
  (
    'Philosophical',
    null,
    'Private aviation director – Gulfstream, helicopter permits.',
    '',
    '/images/a2.png'
  ),
  (
    'Elroi Backing',
    null,
    'Eastern Africa safari guru & luxury lodge negotiator.',
    '',
    '/images/a3.png'
  );

-- If rows already use broken Supabase URLs, normalize to local assets:
-- update public.architects
-- set image_url = '/images/' || split_part(image_url, '/', array_length(string_to_array(image_url, '/'), 1))
-- where image_url like '%supabase.co/storage/%';
