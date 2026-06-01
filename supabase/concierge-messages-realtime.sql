-- Enable Realtime for member concierge chat (run once in Supabase SQL Editor).

do $$ begin
  alter publication supabase_realtime add table public.concierge_messages;
exception
  when duplicate_object then null;
end $$;
