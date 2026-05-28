-- public.teams — landing "Meet The Team" carousel
-- Run in Supabase SQL Editor if queries fail with "relation public.profiles does not exist".

create extension if not exists "pgcrypto";

do $$ begin
  create type public.user_role as enum ('member', 'admin');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.user_status as enum ('active', 'disabled');
exception when duplicate_object then null;
end $$;

-- If teams was created as a VIEW on profiles, remove it first (keeps a real table).
drop view if exists public.teams cascade;

create table if not exists public.teams (
  id uuid not null default gen_random_uuid(),
  email text null,
  full_name text not null,
  phone text null,
  avatar_url text null,
  role public.user_role not null default 'member'::public.user_role,
  status public.user_status not null default 'active'::public.user_status,
  joined_at timestamptz not null default now(),
  travel_dna_period text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  description text null,
  constraint teams_pkey primary key (id)
);

create index if not exists teams_role_idx on public.teams using btree (role);
create index if not exists teams_status_idx on public.teams using btree (status);
create index if not exists teams_email_idx on public.teams using btree (email);

alter table public.teams enable row level security;

drop policy if exists "teams_public_read" on public.teams;
create policy "teams_public_read" on public.teams
  for select using (status = 'active'::public.user_status);

drop policy if exists "teams_admin_all" on public.teams;

notify pgrst, 'reload schema';
