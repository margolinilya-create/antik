-- =====================================================================
-- Defense-in-depth: bound the length of anonymous INSERTs so the public
-- contact forms (inquiries) and newsletter (subscribers) cannot be used to
-- store oversized payloads. The app layer (zod) already validates these;
-- this is the DB-level backstop and also clears the Supabase advisor
-- "RLS policy always true" (0024) on the two public INSERT policies.
-- Bounds are generous (well above any legitimate value) so no real
-- submission is ever rejected.
-- =====================================================================

drop policy if exists subscribers_public_insert on subscribers;
create policy subscribers_public_insert on subscribers
  for insert
  with check (char_length(email) between 3 and 254);

drop policy if exists inquiries_public_insert on inquiries;
create policy inquiries_public_insert on inquiries
  for insert
  with check (
    char_length(coalesce(customer_name, '')) <= 200
    and char_length(coalesce(phone, '')) <= 64
    and char_length(coalesce(email, '')) <= 254
    and char_length(coalesce(telegram, '')) <= 128
    and char_length(coalesce(message_ru, '')) <= 5000
  );
