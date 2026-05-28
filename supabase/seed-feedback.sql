-- Seed footer testimonials from static fallback copy.
-- Safe to re-run (clears and re-inserts).

delete from public.feedback;

insert into public.feedback (
  full_name,
  description,
  is_featured,
  "order",
  is_published
)
values
  (
    'Mrs. Salmani A.',
    'Flawless from takeoff to landing – they turned an impossible dream into a seamless narrative.',
    true,
    0,
    true
  );

notify pgrst, 'reload schema';
