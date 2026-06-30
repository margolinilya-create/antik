-- Visible SEO intro paragraph for taxonomy landing pages
-- (categories / eras / makers). Rendered above the item grid.
alter table categories add column if not exists intro_ru text;
alter table eras       add column if not exists intro_ru text;
alter table makers     add column if not exists intro_ru text;
