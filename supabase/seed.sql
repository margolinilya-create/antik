-- =====================================================================
-- Seed data: taxonomies + a few sample items so the catalog renders.
-- Safe to run on a fresh DB. Uses fixed slugs; re-runnable via on conflict.
-- =====================================================================

insert into categories (slug, name_ru, name_en, sort_order) values
  ('samovary',  'Самовары',  'Samovars', 1),
  ('ikony',     'Иконы',     'Icons', 2),
  ('farfor',    'Фарфор',    'Porcelain', 3),
  ('mebel',     'Мебель',    'Furniture', 4),
  ('monety',    'Монеты',    'Coins', 5),
  ('zhivopis',  'Живопись',  'Paintings', 6)
on conflict (slug) do nothing;

insert into eras (slug, name_ru, name_en, year_from, year_to, sort_order) values
  ('xviii-vek',          'XVIII век',          '18th century', 1700, 1800, 1),
  ('rossiyskaya-imperiya','Российская империя', 'Russian Empire', 1721, 1917, 2),
  ('modern',             'Модерн',             'Art Nouveau', 1890, 1914, 3),
  ('sssr',               'СССР',               'USSR', 1922, 1991, 4)
on conflict (slug) do nothing;

insert into materials (slug, name_ru, name_en, sort_order) values
  ('bronza',  'Бронза',  'Bronze', 1),
  ('farfor',  'Фарфор',  'Porcelain', 2),
  ('serebro', 'Серебро', 'Silver', 3),
  ('derevo',  'Дерево',  'Wood', 4),
  ('latun',   'Латунь',  'Brass', 5)
on conflict (slug) do nothing;

insert into techniques (slug, name_ru, name_en, sort_order) values
  ('ruchnaya-rospis', 'Ручная роспись', 'Hand painting', 1),
  ('chekanka',        'Чеканка',        'Chasing', 2),
  ('emal',            'Эмаль',          'Enamel', 3)
on conflict (slug) do nothing;

insert into makers (slug, name_ru, name_en, country, sort_order) values
  ('kuznetsov', 'Товарищество Кузнецова', 'Kuznetsov', 'Россия', 1),
  ('faberge',   'Фаберже',                'Fabergé', 'Россия', 2),
  ('lfz',       'ЛФЗ',                    'LFZ', 'СССР', 3)
on conflict (slug) do nothing;

-- Sample items (published / in_stock so they appear publicly) -----------
insert into items (slug, title_ru, subtitle_ru, description_ru, category_id, era_id, maker_id,
                   condition, provenance_ru, year_made_text, year_made_from, year_made_to,
                   height_mm, price, currency, status, is_featured, published_at)
select
  'samovar-zharovoy-tula-1890', 'Самовар-«банкет» жаровой, Тула',
  'Латунь, никелировка, клейма',
  'Жаровой самовар формы «банка», Тульская фабрика, конец XIX века. Никелированная латунь, оригинальные клейма, рабочий кран. Прекрасное коллекционное состояние.',
  (select id from categories where slug = 'samovary'),
  (select id from eras where slug = 'rossiyskaya-imperiya'),
  null, 'excellent',
  'Из частной московской коллекции.', 'около 1890', 1885, 1895,
  450, 85000, 'RUB', 'in_stock', true, now()
where not exists (select 1 from items where slug = 'samovar-zharovoy-tula-1890');

insert into items (slug, title_ru, subtitle_ru, description_ru, category_id, era_id, maker_id,
                   condition, year_made_text, year_made_from, year_made_to, price, currency, status, is_featured, published_at)
select
  'chashka-kuznetsov-modern', 'Чайная пара «Модерн», Кузнецовъ',
  'Фарфор, надглазурная роспись',
  'Чайная пара товарищества М. С. Кузнецова, период модерна. Тонкий фарфор, золочение, цветочная роспись. Без сколов и реставрации.',
  (select id from categories where slug = 'farfor'),
  (select id from eras where slug = 'modern'),
  (select id from makers where slug = 'kuznetsov'),
  'mint', 'около 1900', 1895, 1910, 24000, 'RUB', 'in_stock', false, now()
where not exists (select 1 from items where slug = 'chashka-kuznetsov-modern');

insert into items (slug, title_ru, subtitle_ru, description_ru, category_id, era_id, maker_id,
                   condition, year_made_text, price, currency, price_on_request, status, published_at)
select
  'ikona-nikolay-chudotvorets', 'Икона «Николай Чудотворец»',
  'Дерево, темпера, золочение',
  'Икона «Святитель Николай», XIX век. Дерево, левкас, темпера, твореное золото. Профессиональная музейная реставрация.',
  (select id from categories where slug = 'ikony'),
  (select id from eras where slug = 'rossiyskaya-imperiya'),
  null, 'restored', 'XIX век', null, 'RUB', true, 'in_stock', now()
where not exists (select 1 from items where slug = 'ikona-nikolay-chudotvorets');

-- Link sample items to materials (M2M) ---------------------------------
insert into item_materials (item_id, material_id)
select i.id, m.id from items i, materials m
where i.slug = 'samovar-zharovoy-tula-1890' and m.slug in ('latun')
on conflict do nothing;

insert into item_materials (item_id, material_id)
select i.id, m.id from items i, materials m
where i.slug = 'chashka-kuznetsov-modern' and m.slug in ('farfor')
on conflict do nothing;

insert into item_materials (item_id, material_id)
select i.id, m.id from items i, materials m
where i.slug = 'ikona-nikolay-chudotvorets' and m.slug in ('derevo')
on conflict do nothing;

-- =====================================================================
-- Curated collections (подборки) + membership. Re-runnable via slug guards.
-- =====================================================================
insert into collections (slug, title_ru, subtitle_ru, intro_ru, is_featured, sort_order, published_at) values
  ('russkiy-modern', 'Русский модерн',
   'Фарфор, бронза и предметы рубежа XIX–XX веков',
   'Кураторская подборка предметов эпохи модерна: плавные линии, природные мотивы и безупречное мастерство мастеров Российской империи.',
   true, 1, now()),
  ('predmety-s-istoriey', 'Предметы с провенансом',
   'Вещи с задокументированной историей бытования',
   'Избранные предметы, чья история подтверждена: клейма, архивные сведения и честно описанное состояние.',
   true, 2, now())
on conflict (slug) do nothing;

-- Attach a few sample items to «Русский модерн» (ordered).
insert into collection_items (collection_id, item_id, sort_order)
select c.id, i.id,
       case i.slug when 'chashka-kuznetsov-modern' then 0
                   when 'samovar-zharovoy-tula-1890' then 1 else 2 end
from collections c, items i
where c.slug = 'russkiy-modern'
  and i.slug in ('chashka-kuznetsov-modern', 'samovar-zharovoy-tula-1890')
on conflict do nothing;

insert into collection_items (collection_id, item_id, sort_order)
select c.id, i.id, 0
from collections c, items i
where c.slug = 'predmety-s-istoriey'
  and i.slug = 'ikona-nikolay-chudotvorets'
on conflict do nothing;

-- =====================================================================
-- Long-form landing bodies (## headings → <h2> in RichText).
-- =====================================================================
update eras set
  intro_ru = coalesce(intro_ru, 'Модерн (ар-нуво) — стиль рубежа XIX–XX веков с плавными линиями и природными мотивами.'),
  body_ru = coalesce(body_ru,
'## Исторический контекст
Модерн (в России — «русский модерн», на Западе — ар-нуво) сложился на рубеже XIX и XX веков как реакция на эклектику и подражание историческим стилям. Художники искали новый язык, вдохновлённый природой.

## Характерные черты
Текучие, асимметричные линии, растительные и цветочные орнаменты, изгиб «удар бича», приглушённая природная палитра. В декоративно-прикладном искусстве — внимание к материалу и ручной работе.

## Знаковые предметы
Фарфор Товарищества Кузнецова, бронзовое и латунное литьё, осветительные приборы, мебель с гнутыми формами и предметы с эмалью.')
where slug = 'modern';

update categories set
  body_ru = coalesce(body_ru,
'## О категории
Фарфор — один из самых собираемых разделов антиквариата: от парадных сервизов до камерной чайной пары. Ценятся клейма мануфактур, сохранность росписи и золочения.

## На что смотреть
Подлинность клейма, отсутствие сколов и реставрационных дописок, качество живописи и позолоты. Каждый предмет в нашей подборке описан честно — с указанием состояния.')
where slug = 'farfor';
