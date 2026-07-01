-- =====================================================================
-- Concierge / personal-sourcing lead type ("Подбор под запрос").
-- ADD VALUE is idempotent and the new value is not used in-transaction
-- below, so this is safe to run in a single migration (same approach as
-- 0006 adding 'offer' / 'sell' to the original enum from 0001).
-- =====================================================================
alter type inquiry_type add value if not exists 'sourcing';
