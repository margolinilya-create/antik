-- =====================================================================
-- Curated collections — a third merchandising axis beside
-- category / era / maker. A collection is a hand-picked, ORDERED set of
-- items with its own landing page (SSG) and an optional homepage slot.
-- Visibility = published_at IS NOT NULL (mirrors journal_posts).
-- =====================================================================

create table if not exists collections (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  title_ru        text not null,
  subtitle_ru     text,
  intro_ru        text,
  cover_path      text,
  seo_title       text,
  seo_description text,
  is_featured     boolean not null default false,
  sort_order      int not null default 0,
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists collections_published_idx
  on collections (sort_order, published_at desc) where published_at is not null;
create index if not exists collections_featured_idx
  on collections (is_featured, sort_order) where published_at is not null;

alter table collections enable row level security;
create policy collections_public_read on collections
  for select using (published_at is not null);
create policy collections_admin_all on collections
  for all using (is_admin()) with check (is_admin());
create trigger collections_updated_at before update on collections
  for each row execute function set_updated_at();

-- Membership: ordered items in a collection. The curated `sort_order` is what
-- the landing page renders by (search_items can't preserve a manual order).
create table if not exists collection_items (
  collection_id uuid not null references collections(id) on delete cascade,
  item_id       uuid not null references items(id) on delete cascade,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  primary key (collection_id, item_id)
);
create index if not exists collection_items_order_idx
  on collection_items (collection_id, sort_order);

alter table collection_items enable row level security;
-- Public can read membership rows only for published collections; the joined
-- `items` rows are independently gated by the items RLS policy.
create policy collection_items_public_read on collection_items
  for select using (
    exists (
      select 1 from collections c
      where c.id = collection_id and c.published_at is not null
    )
  );
create policy collection_items_admin_all on collection_items
  for all using (is_admin()) with check (is_admin());
