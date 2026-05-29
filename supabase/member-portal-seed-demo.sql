-- Optional: demo data for one member profile (not run automatically).
-- Replace the UUID with your auth user / profiles.id, then run in SQL Editor.
--
-- select public.seed_member_portal_data('YOUR-PROFILE-UUID-HERE');

create or replace function public.seed_member_portal_data(p_profile_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
  v_slug text;
begin
  if auth.uid() is distinct from p_profile_id and not public.is_admin() then
    raise exception 'not allowed to seed this profile';
  end if;

  if exists (
    select 1 from public.member_itineraries where profile_id = p_profile_id limit 1
  ) then
    return;
  end if;

  select email into v_email from public.profiles where id = p_profile_id;
  v_slug := lower(regexp_replace(split_part(coalesce(v_email, 'member'), '@', 1), '[^a-z0-9]+', '-', 'g'));

  insert into public.member_itineraries (
    profile_id, kind, destination, travel_date_label, image_url, image_alt, sort_order
  ) values
    (p_profile_id, 'upcoming', 'Tanzania', 'June 10, 2026', '/images/sd3.png', 'Tropical coastline in Tanzania', 0),
    (p_profile_id, 'upcoming', 'Kenya', 'June 10, 2026', '/images/sd5.png', 'Wildlife safari in Kenya', 1);

  insert into public.member_itinerary_stops (itinerary_id, sort_order, stop_time, activity)
  select i.id, s.sort_order, s.stop_time, s.activity
  from public.member_itineraries i
  cross join (
    values
      (0, '8:00 AM', 'Flight departure'),
      (1, '11:30 AM', 'Arrive in Paris'),
      (2, '2:00 PM', 'Private transfer to hotel'),
      (3, '7:00 PM', 'Welcome dinner')
  ) as s(sort_order, stop_time, activity)
  where i.profile_id = p_profile_id and i.kind = 'upcoming';

  insert into public.member_itineraries (
    profile_id, kind, destination, travel_date_label, reporting_period,
    destination_category, topic_tags, image_url, image_alt, sort_order
  ) values (
    p_profile_id, 'past', 'Tanzania', 'June 10, 2026', 'for June 2026',
    'Islands', array['Adventure', 'Culture']::text[],
    '/images/sd3.png', 'Tropical beach in Tanzania with palm trees and turquoise water', 0
  );

  insert into public.member_itinerary_stops (itinerary_id, sort_order, stop_time, activity)
  select i.id, s.sort_order, s.stop_time, s.activity
  from public.member_itineraries i
  cross join (
    values
      (0, '8:00 AM', 'Flight departure'),
      (1, '11:30 AM', 'Arrive in Paris'),
      (2, '1:00 PM', 'Check in to hotel'),
      (3, '3:00 PM', 'Visit Eiffel Tower'),
      (4, '7:00 PM', 'Dinner cruise on the Seine River')
  ) as s(sort_order, stop_time, activity)
  where i.profile_id = p_profile_id and i.kind = 'past';

  insert into public.member_travel_dna_settings (profile_id)
  values (p_profile_id)
  on conflict (profile_id) do nothing;

  insert into public.member_travel_dna_locations (profile_id, external_key, label, percent, color, sort_order)
  values
    (p_profile_id, 'addis', 'Addis Ababa, Ethiopia', 63, '#FF7F6B', 0),
    (p_profile_id, 'tanzania', 'Tanzania', 47, '#B56CFF', 1),
    (p_profile_id, 'dubai', 'Dubai', 52, '#FFD24A', 2),
    (p_profile_id, 'kenya', 'Kenya Mombasa', 81, '#FF3DB8', 3)
  on conflict (profile_id, external_key) do nothing;

  insert into public.member_travel_dna_destinations (
    profile_id, external_key, rank, name, points_label, correct_percent, trend, sort_order
  ) values
    (p_profile_id, 'beaches', 1, 'Beaches', '52 Points / User', 97, 'up', 0),
    (p_profile_id, 'mountains', 2, 'Mountains', '52 Points / User', 95, 'down', 1),
    (p_profile_id, 'historical', 3, 'Historical Cities', '52 Points / User', 87, 'up', 2),
    (p_profile_id, 'desert', 4, 'Desert Escapes', '52 Points / User', null, 'up', 3),
    (p_profile_id, 'islands', 5, 'Islands', '52 Points / User', null, 'down', 4),
    (p_profile_id, 'spiritual', 6, 'Spiritual Trips', '52 Points / User', null, 'up', 5)
  on conflict (profile_id, external_key) do nothing;

  insert into public.member_travel_dna_topics (
    profile_id, external_key, kind, name, percent, image_url, image_alt, sort_order
  ) values
    (p_profile_id, 'adventure', 'weakest', 'Adventure', 74, '/images/sd2.png', 'Adventure travel', 0),
    (p_profile_id, 'luxury', 'weakest', 'Luxury', 52, '/images/c2.png', 'Luxury travel', 1),
    (p_profile_id, 'night-life', 'weakest', 'Night Life', 36, '/images/dubai.png', 'Night life', 2),
    (p_profile_id, 'nightlife', 'strongest', 'Nightlife', 95, '/images/dubai.png', 'Nightlife', 0),
    (p_profile_id, 'culture', 'strongest', 'Culture', 92, '/images/addis.png', 'Culture', 1),
    (p_profile_id, 'foodie', 'strongest', 'Foodie', 89, '/images/c1.png', 'Foodie experiences', 2)
  on conflict (profile_id, external_key, kind) do nothing;

  insert into public.member_referrals (
    profile_id, external_key, image_url, image_alt, title, description, referral_link, sort_order
  ) values
    (
      p_profile_id, 'east-africa-voyage', '/images/c3.png',
      'Luxury East African voyage referral ticket for Ethiopia and Tanzania',
      'Invite Friends & Earn Travel Rewards',
      'Give your friends €20 off and earn points for every successful booking',
      'https://luxinc.com/ref/' || v_slug, 0
    ),
    (
      p_profile_id, 'east-africa-kenya', '/images/j.png',
      'Luxury East African voyage referral ticket for Ethiopia, Tanzania, and Kenya',
      'Invite Friends & Earn Travel Rewards',
      'Give your friends €20 off and earn points for every successful booking',
      'https://luxinc.com/ref/' || v_slug || '-kenya', 1
    );

  if not exists (
    select 1 from public.concierge_messages where profile_id = p_profile_id limit 1
  ) then
    insert into public.concierge_messages (profile_id, sender, message_type, body, is_read, created_at)
    values
      (
        p_profile_id, 'concierge', 'text',
        jsonb_build_object('text', 'Hello! I''m your personal AI Assistant slothpilot.'),
        true, now() - interval '10 minutes'
      ),
      (
        p_profile_id, 'user', 'voice',
        jsonb_build_object('voiceDuration', '02:12', 'voiceTotal', '11:25'),
        true, now() - interval '7 minutes'
      ),
      (
        p_profile_id, 'concierge', 'text',
        jsonb_build_object(
          'text',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        ),
        true, now() - interval '4 minutes'
      ),
      (
        p_profile_id, 'user', 'link',
        jsonb_build_object(
          'linkTitle', 'External Link Title',
          'linkDescription', 'Brief description of the linked resource for your architect.',
          'linkUrl', 'https://www.externallink.com'
        ),
        true, now() - interval '1 minutes'
      ),
      (
        p_profile_id, 'concierge', 'text',
        jsonb_build_object(
          'text',
          'Thank you. I''ve noted this for your Travel Architect and will follow up within the hour.'
        ),
        true, now()
      );
  end if;
end;
$$;

grant execute on function public.seed_member_portal_data(uuid) to authenticated;
