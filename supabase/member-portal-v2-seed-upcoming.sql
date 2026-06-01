-- Sample upcoming journeys for Supabase SQL Editor.
-- Run after member-portal-v2-run-in-supabase.sql

insert into public.upcoming_journeys (
  destination,
  travel_date_label,
  image_url,
  image_alt,
  stops,
  amount_minor,
  currency,
  is_published,
  sort_order
)
values
  (
    'Santorini, Greece',
    '15 – 22 September 2026',
    '/images/sd3.png',
    'White villas overlooking the Aegean at sunset',
    '[
      {"time": "Day 1", "activity": "Private transfer · Sunset welcome dinner"},
      {"time": "Day 3", "activity": "Caldera yacht · Oia village evening"},
      {"time": "Day 6", "activity": "Wine estate tasting · Spa afternoon"},
      {"time": "Day 8", "activity": "Departure transfer"}
    ]'::jsonb,
    850000,
    'ETB',
    true,
    0
  ),
  (
    'Kyoto, Japan',
    '3 – 12 October 2026',
    '/images/sd5.png',
    'Torii gates and autumn maples in Kyoto',
    '[
      {"time": "Day 1", "activity": "Arrival · Geisha district walking dinner"},
      {"time": "Day 4", "activity": "Fushimi Inari · Private tea ceremony"},
      {"time": "Day 7", "activity": "Arashiyama bamboo · Kaiseki lunch"},
      {"time": "Day 10", "activity": "Bullet train to Osaka · Farewell omakase"}
    ]'::jsonb,
    1250000,
    'ETB',
    true,
    1
  ),
  (
    'Marrakech & Atlas Mountains',
    '1 – 8 November 2026',
    '/images/dubai.png',
    'Riad courtyard and Atlas mountain vista',
    '[
      {"time": "Day 1", "activity": "Riad check-in · Medina food tour"},
      {"time": "Day 3", "activity": "Atlas day trip · Berber lunch"},
      {"time": "Day 5", "activity": "Desert camp · Stargazing dinner"},
      {"time": "Day 8", "activity": "Airport transfer"}
    ]'::jsonb,
    620000,
    'ETB',
    true,
    2
  ),
  (
    'Amalfi Coast, Italy',
    'Spring 2027 — dates TBC',
    '/images/sd4.png',
    'Coastal cliff road above the Mediterranean',
    '[
      {"time": "TBC", "activity": "Itinerary being finalized with local architects"}
    ]'::jsonb,
    990000,
    'ETB',
    false,
    3
  );
