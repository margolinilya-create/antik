-- =====================================================================
-- Long-form editorial body for category / era landing pages. Rendered
-- below `intro_ru` (the short lead) as structured sections — lines that
-- start with "## " become headings (see components/content/RichText.tsx).
-- Adds SEO depth without bloating the items schema.
-- =====================================================================
alter table categories add column if not exists body_ru text;
alter table eras       add column if not exists body_ru text;
