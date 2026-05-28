-- Luxinc Supabase schema
-- Maps to /admin (CMS + users) and /member (member dashboard)
-- Run in Supabase SQL Editor. Requires auth.users (built-in).

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.user_role as enum ('member', 'admin');
create type public.user_status as enum ('active', 'disabled');
create type public.landing_section_status as enum ('published', 'draft');
create type public.landing_section_id as enum (
  'site',
  'hero',
  'commitment',
  'destinations',
  'crown_collection',
  'architects',
  'journal',
  'team',
  'black_book',
  'contact',
  'footer',
  'auth'
);
create type public.content_category as enum ('journal', 'architects');
create type public.person_card_section as enum ('architects', 'team');
create type public.itinerary_kind as enum ('upcoming', 'past');
create type public.dna_topic_kind as enum ('weakest', 'strongest');
create type public.dna_trend as enum ('up', 'down');
create type public.confidential_contact_icon as enum ('mail', 'whatsapp', 'lock');
create type public.concierge_sender as enum ('user', 'concierge');
create type public.concierge_message_type as enum ('text', 'voice', 'link', 'file');

-- ---------------------------------------------------------------------------
-- Profiles (extends auth.users)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null,
  phone text,
  avatar_url text,
  role public.user_role not null default 'member',
  status public.user_status not null default 'active',
  joined_at timestamptz not null default now(),
  travel_dna_period text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_role_idx on public.profiles (role);
create index profiles_status_idx on public.profiles (status);
create index profiles_email_idx on public.profiles (email);

-- ---------------------------------------------------------------------------
-- Landing: section registry (admin hub metadata)
-- ---------------------------------------------------------------------------
create table public.landing_sections (
  id public.landing_section_id primary key,
  name text not null,
  description text not null default '',
  preview_href text not null default '/',
  status public.landing_section_status not null default 'draft',
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Landing: site & navigation
-- ---------------------------------------------------------------------------
create table public.site_settings (
  id int primary key default 1 check (id = 1),
  site_name text not null default 'LUXINC.',
  nav_cta_label text not null default 'Login',
  nav_cta_href text not null default '#contact',
  updated_at timestamptz not null default now()
);

create table public.nav_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  is_active boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Landing: hero, commitment, black book, footer (singleton rows)
-- ---------------------------------------------------------------------------
create table public.hero_settings (
  id int primary key default 1 check (id = 1),
  location text not null default '',
  subheadline text not null default '',
  cta_label text not null default '',
  cta_href text not null default '',
  login_cta_label text not null default '',
  login_href text not null default '',
  image_url text not null default '',
  image_alt text not null default '',
  updated_at timestamptz not null default now()
);

create table public.commitment_settings (
  id int primary key default 1 check (id = 1),
  symbol text not null default '4h',
  line_1 text not null default '',
  line_2 text not null default '',
  highlight text not null default '',
  updated_at timestamptz not null default now()
);

create table public.black_book_settings (
  id int primary key default 1 check (id = 1),
  title text not null default '',
  subtitle text not null default '',
  email_placeholder text not null default '',
  button_label text not null default 'Send',
  updated_at timestamptz not null default now()
);

create table public.footer_settings (
  id int primary key default 1 check (id = 1),
  quote text not null default '',
  attribution text not null default '',
  tagline text not null default '',
  locations text not null default '',
  copyright_lead text not null default '',
  copyright_tail text not null default '',
  show_quote_on_marketing boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.auth_modal_settings (
  id int primary key default 1 check (id = 1),
  image_url text not null default '',
  image_alt text not null default '',
  subtitle text not null default '',
  sign_in jsonb not null default '{}'::jsonb,
  sign_up jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Landing: destinations carousel
-- ---------------------------------------------------------------------------
create table public.destination_slides (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  image_alt text not null default '',
  headline text not null default '',
  subtitle text not null default '',
  description text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.destinations_settings (
  id int primary key default 1 check (id = 1),
  title_image_url text not null default '',
  title_image_alt text not null default '',
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Landing: crown collection cards
-- ---------------------------------------------------------------------------
create table public.crown_collection_settings (
  id int primary key default 1 check (id = 1),
  title text not null default '',
  subtitle text not null default '',
  updated_at timestamptz not null default now()
);

create table public.experience_cards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  image_url text not null,
  image_alt text not null default '',
  href text not null default '#',
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Landing: architects / team person cards
-- ---------------------------------------------------------------------------
create table public.architects_settings (
  id int primary key default 1 check (id = 1),
  title text not null default '',
  subtitle text not null default '',
  updated_at timestamptz not null default now()
);

create table public.team_settings (
  id int primary key default 1 check (id = 1),
  title text not null default '',
  subtitle text not null default '',
  updated_at timestamptz not null default now()
);

create table public.person_cards (
  id uuid primary key default gen_random_uuid(),
  section public.person_card_section not null,
  name text not null,
  role text not null default '',
  image_url text not null,
  image_alt text not null default '',
  slug text not null,
  is_tall boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (section, slug)
);

-- ---------------------------------------------------------------------------
-- Landing: journal section + highlights
-- ---------------------------------------------------------------------------
create table public.journal_settings (
  id int primary key default 1 check (id = 1),
  title text not null default '',
  subtitle text not null default '',
  collage_image_url text not null default '',
  collage_image_alt text not null default '',
  cta_label text not null default '',
  cta_href text not null default '',
  updated_at timestamptz not null default now()
);

create table public.journal_highlights (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  body text not null default '',
  href text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Landing: contact / offices
-- ---------------------------------------------------------------------------
create table public.contact_settings (
  id int primary key default 1 check (id = 1),
  title text not null default '',
  subtitle text not null default '',
  confidential_title text not null default '',
  updated_at timestamptz not null default now()
);

create table public.office_locations (
  id uuid primary key default gen_random_uuid(),
  heading text not null,
  image_url text not null,
  image_alt text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.office_address_lines (
  id uuid primary key default gen_random_uuid(),
  office_id uuid not null references public.office_locations (id) on delete cascade,
  line text not null,
  sort_order int not null default 0
);

create table public.confidential_contact_lines (
  id uuid primary key default gen_random_uuid(),
  icon public.confidential_contact_icon not null default 'mail',
  text text not null,
  href text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Landing: long-form articles (journal + architects detail pages)
-- paragraphs stored as JSONB: [{ "segments": [{ "text": "...", "href": "..." }] }]
-- ---------------------------------------------------------------------------
create table public.content_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  category public.content_category not null,
  date_label text not null default '',
  title text not null,
  image_url text not null,
  image_alt text not null default '',
  paragraphs jsonb not null default '[]'::jsonb,
  is_published boolean not null default true,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category, slug)
);

create table public.content_toc_items (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.content_articles (id) on delete cascade,
  item_id text not null,
  label text not null,
  sort_order int not null default 0
);

create table public.content_related (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.content_articles (id) on delete cascade,
  related_slug text not null,
  related_category public.content_category not null,
  title text not null,
  subtitle text not null default '',
  image_url text not null,
  image_alt text not null default '',
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------------
-- Black Book submissions (optional inbox)
-- ---------------------------------------------------------------------------
create table public.black_book_submissions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  submitted_at timestamptz not null default now(),
  ip_hash text,
  user_agent text
);

-- ---------------------------------------------------------------------------
-- Member: itineraries (upcoming + past)
-- ---------------------------------------------------------------------------
create table public.member_itineraries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind public.itinerary_kind not null,
  destination text not null,
  travel_date text not null,
  image_url text not null,
  image_alt text not null default '',
  rate_cta_label text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index member_itineraries_user_kind_idx
  on public.member_itineraries (user_id, kind, sort_order);

create table public.member_itinerary_stops (
  id uuid primary key default gen_random_uuid(),
  itinerary_id uuid not null references public.member_itineraries (id) on delete cascade,
  time_label text not null,
  activity text not null,
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------------
-- Member: Travel DNA
-- ---------------------------------------------------------------------------
create table public.member_travel_dna_location_bars (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  external_key text not null,
  label text not null,
  percent numeric(5, 2) not null check (percent >= 0 and percent <= 100),
  color text not null,
  sort_order int not null default 0,
  unique (user_id, external_key)
);

create table public.member_travel_dna_location_legend (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  external_key text not null,
  label text not null,
  percent numeric(6, 2) not null,
  color text not null,
  sort_order int not null default 0,
  unique (user_id, external_key)
);

create table public.member_travel_dna_destinations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  external_key text not null,
  rank int not null,
  name text not null,
  points_label text not null,
  correct_percent numeric(5, 2),
  trend public.dna_trend not null default 'up',
  sort_order int not null default 0,
  unique (user_id, external_key)
);

create table public.member_travel_dna_topics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind public.dna_topic_kind not null,
  external_key text not null,
  name text not null,
  percent numeric(5, 2) not null,
  image_url text not null,
  image_alt text not null default '',
  sort_order int not null default 0,
  unique (user_id, kind, external_key)
);

-- ---------------------------------------------------------------------------
-- Member: referral programmes (per user)
-- ---------------------------------------------------------------------------
create table public.member_referral_programmes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  external_key text not null,
  image_url text not null,
  image_alt text not null default '',
  title text not null,
  description text not null default '',
  referral_link text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, external_key)
);

-- ---------------------------------------------------------------------------
-- Member: concierge chat
-- ---------------------------------------------------------------------------
create table public.concierge_threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade unique,
  assistant_name text not null default 'slothpilot',
  assistant_initials text not null default 'SL',
  cleared_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.concierge_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.concierge_threads (id) on delete cascade,
  sender public.concierge_sender not null,
  message_type public.concierge_message_type not null default 'text',
  body_text text,
  is_read boolean not null default false,
  voice_duration text,
  voice_total text,
  voice_audio_url text,
  link_title text,
  link_description text,
  link_url text,
  file_name text,
  file_url text,
  file_mime_type text,
  sent_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index concierge_messages_thread_sent_idx
  on public.concierge_messages (thread_id, sent_at);

-- ---------------------------------------------------------------------------
-- Admin audit log (dashboard activity feed)
-- ---------------------------------------------------------------------------
create table public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index admin_audit_log_created_idx on public.admin_audit_log (created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger nav_links_updated_at before update on public.nav_links
  for each row execute function public.set_updated_at();
create trigger destination_slides_updated_at before update on public.destination_slides
  for each row execute function public.set_updated_at();
create trigger experience_cards_updated_at before update on public.experience_cards
  for each row execute function public.set_updated_at();
create trigger person_cards_updated_at before update on public.person_cards
  for each row execute function public.set_updated_at();
create trigger journal_highlights_updated_at before update on public.journal_highlights
  for each row execute function public.set_updated_at();
create trigger content_articles_updated_at before update on public.content_articles
  for each row execute function public.set_updated_at();
create trigger member_itineraries_updated_at before update on public.member_itineraries
  for each row execute function public.set_updated_at();
create trigger member_referral_programmes_updated_at before update on public.member_referral_programmes
  for each row execute function public.set_updated_at();
create trigger concierge_threads_updated_at before update on public.concierge_threads
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Auto-create profile on signup
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  insert into public.concierge_threads (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Helper: is admin
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and status = 'active'
  );
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.member_itineraries enable row level security;
alter table public.member_itinerary_stops enable row level security;
alter table public.member_travel_dna_location_bars enable row level security;
alter table public.member_travel_dna_location_legend enable row level security;
alter table public.member_travel_dna_destinations enable row level security;
alter table public.member_travel_dna_topics enable row level security;
alter table public.member_referral_programmes enable row level security;
alter table public.concierge_threads enable row level security;
alter table public.concierge_messages enable row level security;
alter table public.black_book_submissions enable row level security;

-- Profiles: users read/update self; admins manage all
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles_admin_all" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- Member data: owner read; admin full access
create policy "itineraries_owner_select" on public.member_itineraries
  for select using (auth.uid() = user_id or public.is_admin());
create policy "itineraries_admin_write" on public.member_itineraries
  for all using (public.is_admin()) with check (public.is_admin());

create policy "itinerary_stops_via_itinerary" on public.member_itinerary_stops
  for select using (
    exists (
      select 1 from public.member_itineraries i
      where i.id = itinerary_id and (i.user_id = auth.uid() or public.is_admin())
    )
  );
create policy "itinerary_stops_admin_write" on public.member_itinerary_stops
  for all using (public.is_admin()) with check (public.is_admin());

create policy "dna_bars_owner" on public.member_travel_dna_location_bars
  for select using (auth.uid() = user_id or public.is_admin());
create policy "dna_bars_admin" on public.member_travel_dna_location_bars
  for all using (public.is_admin()) with check (public.is_admin());

create policy "dna_legend_owner" on public.member_travel_dna_location_legend
  for select using (auth.uid() = user_id or public.is_admin());
create policy "dna_legend_admin" on public.member_travel_dna_location_legend
  for all using (public.is_admin()) with check (public.is_admin());

create policy "dna_dest_owner" on public.member_travel_dna_destinations
  for select using (auth.uid() = user_id or public.is_admin());
create policy "dna_dest_admin" on public.member_travel_dna_destinations
  for all using (public.is_admin()) with check (public.is_admin());

create policy "dna_topics_owner" on public.member_travel_dna_topics
  for select using (auth.uid() = user_id or public.is_admin());
create policy "dna_topics_admin" on public.member_travel_dna_topics
  for all using (public.is_admin()) with check (public.is_admin());

create policy "referrals_owner" on public.member_referral_programmes
  for select using (auth.uid() = user_id or public.is_admin());
create policy "referrals_admin" on public.member_referral_programmes
  for all using (public.is_admin()) with check (public.is_admin());

create policy "concierge_thread_owner" on public.concierge_threads
  for select using (auth.uid() = user_id or public.is_admin());
create policy "concierge_thread_owner_update" on public.concierge_threads
  for update using (auth.uid() = user_id);
create policy "concierge_thread_admin" on public.concierge_threads
  for all using (public.is_admin()) with check (public.is_admin());

create policy "concierge_messages_owner" on public.concierge_messages
  for select using (
    exists (
      select 1 from public.concierge_threads t
      where t.id = thread_id and (t.user_id = auth.uid() or public.is_admin())
    )
  );
create policy "concierge_messages_insert_owner" on public.concierge_messages
  for insert with check (
    exists (
      select 1 from public.concierge_threads t
      where t.id = thread_id and t.user_id = auth.uid()
    )
  );
create policy "concierge_messages_admin" on public.concierge_messages
  for all using (public.is_admin()) with check (public.is_admin());

-- Black book: public insert, admin read
create policy "black_book_insert_anon" on public.black_book_submissions
  for insert with check (true);
create policy "black_book_admin_read" on public.black_book_submissions
  for select using (public.is_admin());

-- Landing CMS tables: public read published, admin write
-- (Apply similar policies to all landing_* tables — example for content_articles)
alter table public.content_articles enable row level security;
create policy "articles_public_read" on public.content_articles
  for select using (is_published = true);
create policy "articles_admin_all" on public.content_articles
  for all using (public.is_admin()) with check (public.is_admin());

-- Enable RLS + public read / admin write on remaining landing tables as needed.

-- ---------------------------------------------------------------------------
-- Storage buckets (create in Dashboard or via API)
-- ---------------------------------------------------------------------------
-- avatars          — profile photos
-- landing-media    — hero, slides, cards, office images
-- member-media     — itinerary images
-- concierge-files  — chat uploads & voice notes
