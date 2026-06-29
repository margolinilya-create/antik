-- =====================================================================
-- Brand pages: enrich `makers` into full "brand" entities.
-- founded (free text, e.g. "1842" / "1740-е"), short tagline, featured flag.
-- =====================================================================
alter table makers add column if not exists founded text;
alter table makers add column if not exists tagline_ru text;
alter table makers add column if not exists is_featured boolean not null default false;
