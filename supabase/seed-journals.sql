-- Seed homepage journal highlights from static fallback copy.
-- Run after journals table exists. Safe to re-run (clears and re-inserts).

delete from public.journals;

insert into public.journals (
  title,
  sub_title,
  short_description,
  description,
  image_url,
  "order",
  is_published
)
values
  (
    'Mughal Fort Case Study',
    'CASE STUDY',
    'Private dinner inside a closed Mughal fort / "72-hour orchestration: antiques, original frescoes, a 12-course heritage meal."',
    null,
    null,
    0,
    true
  ),
  (
    'Concierge Memo',
    'THE MEMO',
    '3 impossible requests fulfilled last month / Helicopter ski on Kilimanjaro, last-minute gorilla naming, private jet diversion for aurora.',
    null,
    null,
    1,
    true
  );

notify pgrst, 'reload schema';
