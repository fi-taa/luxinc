-- Wipe all member portal data (keeps profiles + auth users).
-- Run in Supabase SQL Editor when you want a fresh start.

truncate table public.concierge_messages cascade;
truncate table public.member_itinerary_stops cascade;
truncate table public.member_itineraries cascade;
truncate table public.member_travel_dna_topics cascade;
truncate table public.member_travel_dna_destinations cascade;
truncate table public.member_travel_dna_locations cascade;
truncate table public.member_travel_dna_settings cascade;
truncate table public.member_referrals cascade;

drop function if exists public.seed_member_portal_data(uuid);

notify pgrst, 'reload schema';
