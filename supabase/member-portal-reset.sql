-- Wipe member portal v2 data (keeps profiles, auth users, concierge_messages, tourist_bookings).

truncate table public.member_payments cascade;
truncate table public.member_referrals cascade;
truncate table public.member_journeys cascade;
truncate table public.upcoming_journeys cascade;

notify pgrst, 'reload schema';
