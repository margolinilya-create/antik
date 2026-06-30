-- Editorial "Топ журнала" selection: a curated featured flag on journal posts.
alter table journal_posts add column if not exists is_featured boolean not null default false;

create index if not exists journal_posts_featured_idx
  on journal_posts (is_featured, published_at desc)
  where published_at is not null;

-- Seed: mark cornerstone guides as the editorial top.
update journal_posts set is_featured = true
where slug in (
  'kak-otlichit-podlinnyy-antikvariat',
  'kleyma-na-russkom-serebre',
  'samovary-istoriya-i-vybor'
);
