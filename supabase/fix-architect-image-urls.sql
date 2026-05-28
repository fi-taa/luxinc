-- Point architect cards at local public assets (Supabase bucket "architects" does not exist yet).
-- Run once, then refresh the site.

update public.architects
set image_url = case
  when image_url ilike '%a1.png%' then '/images/a1.png'
  when image_url ilike '%a2.png%' then '/images/a2.png'
  when image_url ilike '%a3.png%' then '/images/a3.png'
  else image_url
end
where image_url ilike '%supabase.co/storage/%';
