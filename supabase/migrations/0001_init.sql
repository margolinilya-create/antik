-- =====================================================================
-- Antik portal — initial schema
-- Single-storefront antique store. Every item is unique (qty = 1):
-- no SKU, no stock counts. Availability is the `status` enum on items.
-- Sold items are retained (valuable for SEO / "sold archive").
-- =====================================================================

-- Extensions ----------------------------------------------------------
create extension if not exists pg_trgm;

-- Enums ---------------------------------------------------------------
create type item_status     as enum ('draft', 'in_stock', 'reserved', 'sold', 'archived');
create type currency        as enum ('RUB', 'USD', 'EUR');
create type inquiry_type     as enum ('reserve', 'buy', 'question');
create type inquiry_status   as enum ('new', 'in_progress', 'won', 'lost');
create type condition_grade  as enum ('mint', 'excellent', 'good', 'fair', 'restored', 'as_is');

-- Helper: updated_at trigger ------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- Taxonomy tables -----------------------------------------------------
create table categories (
  id          uuid primary key default gen_random_uuid(),
  parent_id   uuid references categories(id) on delete set null,
  slug        text unique not null,
  name_ru     text not null,
  name_en     text,
  description_ru text,
  seo_title   text,
  seo_description text,
  sort_order  int default 0,
  created_at  timestamptz not null default now()
);

create table eras (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name_ru     text not null,
  name_en     text,
  year_from   int,
  year_to     int,
  description_ru text,
  seo_title   text,
  seo_description text,
  sort_order  int default 0,
  created_at  timestamptz not null default now()
);

create table materials (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name_ru     text not null,
  name_en     text,
  sort_order  int default 0,
  created_at  timestamptz not null default now()
);

create table techniques (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name_ru     text not null,
  name_en     text,
  sort_order  int default 0,
  created_at  timestamptz not null default now()
);

create table makers (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name_ru     text not null,
  name_en     text,
  country     text,
  bio_ru      text,
  seo_title   text,
  seo_description text,
  sort_order  int default 0,
  created_at  timestamptz not null default now()
);

-- Core: items ---------------------------------------------------------
create table items (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title_ru      text not null,
  subtitle_ru   text,
  description_ru text,
  category_id   uuid references categories(id) on delete set null,
  era_id        uuid references eras(id) on delete set null,
  maker_id      uuid references makers(id) on delete set null,
  condition     condition_grade,
  condition_note_ru text,
  provenance_ru text,
  year_made_text text,            -- "около 1890" (human-readable, fuzzy)
  year_made_from int,             -- numeric for sorting / range filter
  year_made_to   int,
  -- dimensions in millimetres for consistent filtering + display
  height_mm     int,
  width_mm      int,
  depth_mm      int,
  diameter_mm   int,
  weight_g      int,
  price         numeric(12,2),    -- null => "цена по запросу"
  currency      currency not null default 'RUB',
  price_on_request boolean not null default false,
  status        item_status not null default 'draft',
  is_featured   boolean not null default false,
  seo_title     text,
  seo_description text,
  search_tsv    tsvector,
  published_at  timestamptz,
  sold_at       timestamptz,
  created_by    uuid references auth.users(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger items_updated_at before update on items
  for each row execute function set_updated_at();

-- Many-to-many facets -------------------------------------------------
create table item_materials (
  item_id     uuid references items(id) on delete cascade,
  material_id uuid references materials(id) on delete cascade,
  primary key (item_id, material_id)
);

create table item_techniques (
  item_id      uuid references items(id) on delete cascade,
  technique_id uuid references techniques(id) on delete cascade,
  primary key (item_id, technique_id)
);

-- Images --------------------------------------------------------------
create table item_images (
  id          uuid primary key default gen_random_uuid(),
  item_id     uuid not null references items(id) on delete cascade,
  storage_path text not null,     -- path inside the bucket, not a full URL
  alt_ru      text,
  width       int,
  height      int,
  blurhash    text,
  sort_order  int not null default 0,
  is_primary  boolean not null default false,
  created_at  timestamptz not null default now()
);
create index item_images_item_idx on item_images (item_id, sort_order);

-- Inquiries / leads ---------------------------------------------------
create table inquiries (
  id            uuid primary key default gen_random_uuid(),
  item_id       uuid references items(id) on delete set null,
  type          inquiry_type not null default 'reserve',
  status        inquiry_status not null default 'new',
  customer_name text not null,
  phone         text,
  email         text,
  telegram      text,
  message_ru    text,
  items_snapshot jsonb,           -- cart-lite snapshot: [{item_id,title,price}]
  total_estimate numeric(12,2),
  source        text,             -- utm / referrer
  admin_note    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create trigger inquiries_updated_at before update on inquiries
  for each row execute function set_updated_at();
create index inquiries_status_idx on inquiries (status, created_at desc);

-- Profiles (admin roles) ----------------------------------------------
create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       text not null default 'viewer',  -- owner | manager | viewer
  full_name  text,
  created_at timestamptz not null default now()
);

create or replace function is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role in ('owner', 'manager')
  );
$$;

-- Full-text search vector (Russian) -----------------------------------
-- Denormalises maker/category names into the vector via a trigger.
create or replace function items_search_tsv_refresh()
returns trigger language plpgsql as $$
declare
  maker_name text;
  category_name text;
begin
  select name_ru into maker_name    from makers     where id = new.maker_id;
  select name_ru into category_name from categories where id = new.category_id;
  new.search_tsv :=
    setweight(to_tsvector('russian', coalesce(new.title_ru, '')), 'A') ||
    setweight(to_tsvector('russian', coalesce(new.subtitle_ru, '')), 'B') ||
    setweight(to_tsvector('russian', coalesce(new.description_ru, '')), 'B') ||
    setweight(to_tsvector('russian', coalesce(maker_name, '')), 'C') ||
    setweight(to_tsvector('russian', coalesce(category_name, '')), 'C');
  return new;
end $$;

create trigger items_search_tsv_trg before insert or update on items
  for each row execute function items_search_tsv_refresh();

-- Indexes -------------------------------------------------------------
create index items_in_stock_idx on items (created_at desc) where status = 'in_stock';
create index items_status_idx   on items (status);
create index items_category_idx on items (category_id);
create index items_era_idx      on items (era_id);
create index items_maker_idx    on items (maker_id);
create index items_price_idx    on items (price);
create index items_search_idx   on items using gin (search_tsv);
create index items_title_trgm_idx on items using gin (title_ru gin_trgm_ops);

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table categories      enable row level security;
alter table eras            enable row level security;
alter table materials       enable row level security;
alter table techniques      enable row level security;
alter table makers          enable row level security;
alter table items           enable row level security;
alter table item_materials  enable row level security;
alter table item_techniques enable row level security;
alter table item_images     enable row level security;
alter table inquiries       enable row level security;
alter table profiles        enable row level security;

-- Items: public sees only publicly-visible statuses; admin writes.
create policy items_public_read on items
  for select using (status in ('in_stock', 'reserved', 'sold'));
create policy items_admin_all on items
  for all using (is_admin()) with check (is_admin());

-- Taxonomies: public read, admin write.
do $$
declare t text;
begin
  foreach t in array array['categories','eras','materials','techniques','makers'] loop
    execute format('create policy %1$s_public_read on %1$I for select using (true);', t);
    execute format('create policy %1$s_admin_all on %1$I for all using (is_admin()) with check (is_admin());', t);
  end loop;
end $$;

-- Child tables: public read gated on parent item being visible; admin write.
create policy item_images_public_read on item_images
  for select using (exists (
    select 1 from items i where i.id = item_id
    and i.status in ('in_stock', 'reserved', 'sold')));
create policy item_images_admin_all on item_images
  for all using (is_admin()) with check (is_admin());

create policy item_materials_public_read on item_materials
  for select using (exists (
    select 1 from items i where i.id = item_id
    and i.status in ('in_stock', 'reserved', 'sold')));
create policy item_materials_admin_all on item_materials
  for all using (is_admin()) with check (is_admin());

create policy item_techniques_public_read on item_techniques
  for select using (exists (
    select 1 from items i where i.id = item_id
    and i.status in ('in_stock', 'reserved', 'sold')));
create policy item_techniques_admin_all on item_techniques
  for all using (is_admin()) with check (is_admin());

-- Inquiries: anyone may submit (insert); only admin may read/update.
create policy inquiries_public_insert on inquiries
  for insert with check (true);
create policy inquiries_admin_read on inquiries
  for select using (is_admin());
create policy inquiries_admin_update on inquiries
  for update using (is_admin()) with check (is_admin());

-- Profiles: user reads own; admin reads all; admin manages.
create policy profiles_self_read on profiles
  for select using (id = auth.uid() or is_admin());
create policy profiles_admin_all on profiles
  for all using (is_admin()) with check (is_admin());
