-- Seed public.teams for the landing carousel
-- Run after teams-schema.sql

insert into public.teams (full_name, description, avatar_url, status, role)
select v.full_name, v.description, v.avatar_url, 'active'::public.user_status, 'member'::public.user_role
from (
  values
    ('James C.', 'Private aviation director – Gulfstream, helicopter permits.', '/images/c1.png'),
    ('Meron T.', 'Ethiopian heritage & exclusive ecclesiastical access.', '/images/c2.png'),
    ('Alexandria V.', 'Southern Africa safari guru & luxury lodge negotiator.', '/images/c3.png')
) as v(full_name, description, avatar_url)
where not exists (select 1 from public.teams limit 1);
