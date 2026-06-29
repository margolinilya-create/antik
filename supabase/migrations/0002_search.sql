-- =====================================================================
-- search_items: single RPC contract for the catalog / faceted search.
-- Returns { items, total, facets } as jsonb. The Next.js data layer
-- (lib/queries/items.ts) calls this with parsed searchParams.
--
-- filters jsonb shape (all optional):
--   { q, category, era, maker, material, condition,
--     price_min, price_max, sort, limit, offset }
-- Slugs are used for category/era/maker/material so URLs stay clean.
--
-- The filtered set is a single MATERIALIZED CTE (computed once, reused by the
-- count / page / facet branches) rather than a per-call temp table — no
-- system-catalog churn, one plan, one statement.
-- =====================================================================
create or replace function search_items(filters jsonb default '{}')
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_q          text   := nullif(trim(filters->>'q'), '');
  v_category   text   := filters->>'category';
  v_era        text   := filters->>'era';
  v_maker      text   := filters->>'maker';
  v_material   text   := filters->>'material';
  v_condition  text   := filters->>'condition';
  v_price_min  numeric := nullif(filters->>'price_min', '')::numeric;
  v_price_max  numeric := nullif(filters->>'price_max', '')::numeric;
  v_sort       text   := coalesce(filters->>'sort', 'newest');
  v_limit      int    := least(coalesce(nullif(filters->>'limit', '')::int, 24), 100);
  v_offset     int    := greatest(coalesce(nullif(filters->>'offset', '')::int, 0), 0);
  v_tsquery    tsquery := case when v_q is not null
                         then websearch_to_tsquery('russian', v_q) else null end;
begin
  return (
    with _matched as materialized (
      select i.id, i.price, i.category_id, i.era_id, i.maker_id, i.created_at,
             case when v_tsquery is not null then ts_rank_cd(i.search_tsv, v_tsquery) else 0 end as rank
      from items i
      where i.status in ('in_stock', 'reserved', 'sold')
        and (v_category is null or i.category_id = (select id from categories where slug = v_category))
        and (v_era      is null or i.era_id      = (select id from eras       where slug = v_era))
        and (v_maker    is null or i.maker_id    = (select id from makers     where slug = v_maker))
        and (v_condition is null or i.condition::text = v_condition)
        and (v_price_min is null or i.price >= v_price_min)
        and (v_price_max is null or i.price <= v_price_max)
        and (v_material is null or exists (
              select 1 from item_materials im
              join materials m on m.id = im.material_id
              where im.item_id = i.id and m.slug = v_material))
        and (v_tsquery is null
             or i.search_tsv @@ v_tsquery
             or i.title_ru % v_q)   -- pg_trgm fuzzy fallback for typos
    )
    select jsonb_build_object(
      'items', coalesce((
        select jsonb_agg(row) from (
          select jsonb_build_object(
            'id', i.id,
            'slug', i.slug,
            'title_ru', i.title_ru,
            'subtitle_ru', i.subtitle_ru,
            'price', i.price,
            'currency', i.currency,
            'price_on_request', i.price_on_request,
            'status', i.status,
            'category', c.name_ru,
            'era', e.name_ru,
            'maker', mk.name_ru,
            'image', (
              select jsonb_build_object('storage_path', ii.storage_path,
                                        'alt_ru', ii.alt_ru,
                                        'width', ii.width, 'height', ii.height,
                                        'blurhash', ii.blurhash)
              from item_images ii where ii.item_id = i.id
              order by ii.is_primary desc, ii.sort_order asc limit 1)
          ) as row
          from _matched m
          join items i on i.id = m.id
          left join categories c on c.id = i.category_id
          left join eras e       on e.id = i.era_id
          left join makers mk     on mk.id = i.maker_id
          order by
            case when v_sort = 'price_asc'  then i.price end asc nulls last,
            case when v_sort = 'price_desc' then i.price end desc nulls last,
            case when v_sort = 'relevance'  then m.rank end desc,
            i.created_at desc
          limit v_limit offset v_offset
        ) sub
      ), '[]'::jsonb),
      'total', (select count(*) from _matched),
      'facets', jsonb_build_object(
        'categories', (
          select coalesce(jsonb_agg(jsonb_build_object('slug', c.slug, 'name', c.name_ru, 'count', cnt) order by cnt desc), '[]')
          from (select category_id, count(*) cnt from _matched where category_id is not null group by category_id) g
          join categories c on c.id = g.category_id),
        'eras', (
          select coalesce(jsonb_agg(jsonb_build_object('slug', e.slug, 'name', e.name_ru, 'count', cnt) order by cnt desc), '[]')
          from (select era_id, count(*) cnt from _matched where era_id is not null group by era_id) g
          join eras e on e.id = g.era_id),
        'makers', (
          select coalesce(jsonb_agg(jsonb_build_object('slug', mk.slug, 'name', mk.name_ru, 'count', cnt) order by cnt desc), '[]')
          from (select maker_id, count(*) cnt from _matched where maker_id is not null group by maker_id) g
          join makers mk on mk.id = g.maker_id),
        'materials', (
          select coalesce(jsonb_agg(jsonb_build_object('slug', mt.slug, 'name', mt.name_ru, 'count', cnt) order by cnt desc), '[]')
          from (select im.material_id, count(*) cnt
                from item_materials im join _matched m on m.id = im.item_id
                group by im.material_id) g
          join materials mt on mt.id = g.material_id),
        'price', (
          select jsonb_build_object('min', min(price), 'max', max(price)) from _matched where price is not null)
      )
    )
  );
end $$;

-- Allow anonymous + authenticated to call it (RLS still applies inside).
grant execute on function search_items(jsonb) to anon, authenticated;
