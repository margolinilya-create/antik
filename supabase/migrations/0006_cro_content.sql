-- =====================================================================
-- CRO / content features: make-an-offer, newsletter subscribers,
-- testimonials (social proof), editorial journal (SEO + retention).
-- =====================================================================

-- New inquiry types for the "make an offer" and "sell to us" flows.
-- ADD VALUE is idempotent (IF NOT EXISTS) and the new values are not used
-- in-transaction below, so this is safe to run in one migration.
alter type inquiry_type add value if not exists 'offer';
alter type inquiry_type add value if not exists 'sell';

alter table inquiries add column if not exists offer_amount numeric(12,2);

create table if not exists subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  source     text,
  created_at timestamptz not null default now()
);
create unique index if not exists subscribers_email_key on subscribers (lower(email));
alter table subscribers enable row level security;
create policy subscribers_public_insert on subscribers
  for insert with check (true);
create policy subscribers_admin_read on subscribers
  for select using (is_admin());

create table if not exists testimonials (
  id           uuid primary key default gen_random_uuid(),
  author_name  text not null,
  author_role  text,
  text_ru      text not null,
  rating       int not null default 5,
  is_published boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);
alter table testimonials enable row level security;
create policy testimonials_public_read on testimonials
  for select using (is_published = true);
create policy testimonials_admin_all on testimonials
  for all using (is_admin()) with check (is_admin());

create table if not exists journal_posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  title_ru        text not null,
  excerpt_ru      text,
  body_ru         text,
  cover_path      text,
  seo_title       text,
  seo_description text,
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists journal_published_idx on journal_posts (published_at desc);
alter table journal_posts enable row level security;
create policy journal_public_read on journal_posts
  for select using (published_at is not null);
create policy journal_admin_all on journal_posts
  for all using (is_admin()) with check (is_admin());
create trigger journal_updated_at before update on journal_posts
  for each row execute function set_updated_at();
