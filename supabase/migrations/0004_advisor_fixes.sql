-- =====================================================================
-- Hardening from Supabase advisors.
-- =====================================================================

-- 1) Pin search_path on trigger functions (function_search_path_mutable).
create or replace function set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end $$;

create or replace function items_search_tsv_refresh()
returns trigger language plpgsql set search_path = public as $$
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

create or replace function reindex_items_for_taxonomy()
returns trigger language plpgsql set search_path = public as $$
begin
  if tg_table_name = 'makers' then
    update items set maker_id = maker_id where maker_id = new.id;
  elsif tg_table_name = 'categories' then
    update items set category_id = category_id where category_id = new.id;
  end if;
  return new;
end $$;

-- 2) A public bucket serves object URLs without any SELECT policy. The broad
--    SELECT policy only enabled listing every file — drop it.
drop policy if exists "item_images_public_read" on storage.objects;

-- 3) Covering indexes for foreign keys used in joins/filters.
create index if not exists categories_parent_idx   on categories (parent_id);
create index if not exists inquiries_item_idx       on inquiries (item_id);
create index if not exists item_materials_mat_idx   on item_materials (material_id);
create index if not exists item_techniques_tech_idx on item_techniques (technique_id);
