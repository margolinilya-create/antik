-- =====================================================================
-- Catalog seed: 12 additional realistic antique items (total 15).
-- Idempotent (insert ... where not exists by slug). Statuses spread across
-- in_stock / reserved / sold / price-on-request for a realistic storefront.
-- =====================================================================

-- helper note: taxonomy slugs already exist from seed.sql

-- 1. Самовар «рюмка», Баташёвъ ----------------------------------------
insert into items (slug, title_ru, subtitle_ru, description_ru, category_id, era_id,
                   condition, provenance_ru, year_made_text, year_made_from, year_made_to,
                   height_mm, weight_g, price, currency, status, is_featured, published_at)
select 'samovar-ryumka-batashev', 'Самовар «рюмка», фабрика Баташёвыхъ',
  'Латунь, никелировка, медали',
  'Самовар формы «рюмка» наследников В. С. Баташёва, Тула, конец XIX века. Латунь с никелировкой, оттиски наградных медалей, фигурные ручки. Полный комплект, рабочий кран.',
  (select id from categories where slug='samovary'),
  (select id from eras where slug='rossiyskaya-imperiya'),
  'excellent', 'Тульская частная коллекция.', 'около 1880', 1875, 1885,
  480, 4200, 72000, 'RUB', 'in_stock', true, now()
where not exists (select 1 from items where slug='samovar-ryumka-batashev');

-- 2. Самовар «груша», Тула (резерв) -----------------------------------
insert into items (slug, title_ru, subtitle_ru, description_ru, category_id, era_id,
                   condition, year_made_text, year_made_from, year_made_to, height_mm, price, currency, status, published_at)
select 'samovar-grusha-tula', 'Самовар угольный «груша», Тула',
  'Латунь, форма «груша»',
  'Угольный самовар классической формы «груша», тульская работа начала XX века. Латунь, сохранены конфорка и поддувало. Патина времени, полностью функционален.',
  (select id from categories where slug='samovary'),
  (select id from eras where slug='rossiyskaya-imperiya'),
  'good', 'начало XX века', 1900, 1915, 420, 64000, 'RUB', 'reserved', now()
where not exists (select 1 from items where slug='samovar-grusha-tula');

-- 3. Икона «Казанская» с окладом --------------------------------------
insert into items (slug, title_ru, subtitle_ru, description_ru, category_id, era_id,
                   condition, provenance_ru, year_made_text, height_mm, width_mm, price, currency, status, is_featured, published_at)
select 'ikona-kazanskaya-oklad', 'Икона «Казанская икона Божией Матери»',
  'Дерево, темпера, серебряный оклад',
  'Икона «Казанская» в серебряном окладе 84 пробы, XIX век. Дерево, левкас, темпера; оклад с чеканным растительным орнаментом и пробирными клеймами. Профессиональная реставрация.',
  (select id from categories where slug='ikony'),
  (select id from eras where slug='rossiyskaya-imperiya'),
  'restored', 'Экспертное заключение прилагается.', 'XIX век', 310, 270, 145000, 'RUB', 'in_stock', true, now()
where not exists (select 1 from items where slug='ikona-kazanskaya-oklad');

-- 4. Икона «Спас Вседержитель» (цена по запросу) ----------------------
insert into items (slug, title_ru, subtitle_ru, description_ru, category_id, era_id,
                   condition, year_made_text, height_mm, width_mm, price, currency, price_on_request, status, published_at)
select 'ikona-spas-vsederzhitel', 'Икона «Спас Вседержитель»',
  'Дерево, темпера, золочение',
  'Икона «Спас Вседержитель», XVIII век. Дерево, паволока, левкас, темпера, твореное золото. Музейная сохранность, тонкое письмо. Редкость.',
  (select id from categories where slug='ikony'),
  (select id from eras where slug='xviii-vek'),
  'excellent', 'XVIII век', 350, 290, null, 'RUB', true, 'in_stock', now()
where not exists (select 1 from items where slug='ikona-spas-vsederzhitel');

-- 5. Складень дорожный, бронза, эмаль ---------------------------------
insert into items (slug, title_ru, subtitle_ru, description_ru, category_id, era_id,
                   condition, year_made_text, height_mm, width_mm, price, currency, status, published_at)
select 'skladen-bronza-emal', 'Складень дорожный трёхстворчатый',
  'Бронза, выемчатая эмаль',
  'Старообрядческий складень-«троеручица», бронзовое литьё с многоцветной выемчатой эмалью, XIX век. Хорошая сохранность эмалей, чёткий рельеф.',
  (select id from categories where slug='ikony'),
  (select id from eras where slug='rossiyskaya-imperiya'),
  'good', 'XIX век', 180, 160, 38000, 'RUB', 'in_stock', now()
where not exists (select 1 from items where slug='skladen-bronza-emal');

-- 6. ЛФЗ «Кобальтовая сетка» ------------------------------------------
insert into items (slug, title_ru, subtitle_ru, description_ru, category_id, era_id, maker_id,
                   condition, year_made_text, year_made_from, year_made_to, price, currency, status, published_at)
select 'lfz-kobaltovaya-setka', 'Чайная пара ЛФЗ «Кобальтовая сетка»',
  'Фарфор, кобальт, золочение',
  'Чайная пара Ленинградского фарфорового завода, рисунок «Кобальтовая сетка» по эскизу А. Яцкевич. Клеймо ЛФЗ, золочение в идеальном состоянии.',
  (select id from categories where slug='farfor'),
  (select id from eras where slug='sssr'),
  (select id from makers where slug='lfz'),
  'mint', '1960-е', 1958, 1969, 18000, 'RUB', 'in_stock', now()
where not exists (select 1 from items where slug='lfz-kobaltovaya-setka');

-- 7. ЛФЗ статуэтка «Балерина» -----------------------------------------
insert into items (slug, title_ru, subtitle_ru, description_ru, category_id, era_id, maker_id,
                   condition, year_made_text, height_mm, price, currency, status, is_featured, published_at)
select 'lfz-statuetka-balerina', 'Статуэтка «Юная балерина», ЛФЗ',
  'Фарфор, надглазурная роспись',
  'Фарфоровая статуэтка «Юная балерина», ЛФЗ, середина XX века. Тонкая ручная роспись, клеймо завода. Без сколов и реставрации.',
  (select id from categories where slug='farfor'),
  (select id from eras where slug='sssr'),
  (select id from makers where slug='lfz'),
  'excellent', '1950-е', 165, 27000, 'RUB', 'in_stock', true, now()
where not exists (select 1 from items where slug='lfz-statuetka-balerina');

-- 8. Ваза Императорского завода (резерв) ------------------------------
insert into items (slug, title_ru, subtitle_ru, description_ru, category_id, era_id,
                   condition, provenance_ru, year_made_text, height_mm, price, currency, status, published_at)
select 'vaza-imperatorskiy-zavod', 'Ваза «Императорский фарфоровый заводъ»',
  'Фарфор, кобальт, золочение',
  'Декоративная ваза Императорского фарфорового завода, период историзма. Кобальтовый крытьё, золочёный орнамент, живописная вставка. Марка под глазурью.',
  (select id from categories where slug='farfor'),
  (select id from eras where slug='rossiyskaya-imperiya'),
  'excellent', 'С экспертизой.', 'конец XIX века', 340, 210000, 'RUB', 'reserved', now()
where not exists (select 1 from items where slug='vaza-imperatorskiy-zavod');

-- 9. Кресло модерн, орех ----------------------------------------------
insert into items (slug, title_ru, subtitle_ru, description_ru, category_id, era_id,
                   condition, year_made_text, height_mm, width_mm, depth_mm, price, currency, status, published_at)
select 'kreslo-modern-oreh', 'Кресло в стиле модерн, орех',
  'Орех, резьба, обивка',
  'Кресло эпохи модерна, массив ореха с характерной плавной резьбой. Перетянуто, реставрация каркаса выполнена бережно. Удобная посадка.',
  (select id from categories where slug='mebel'),
  (select id from eras where slug='modern'),
  'good', 'около 1905', 980, 640, 600, 95000, 'RUB', 'in_stock', now()
where not exists (select 1 from items where slug='kreslo-modern-oreh');

-- 10. Бюро-секретер (продано — для архива/SEO) ------------------------
insert into items (slug, title_ru, subtitle_ru, description_ru, category_id, era_id,
                   condition, year_made_text, height_mm, width_mm, depth_mm, price, currency, status, sold_at, published_at)
select 'byuro-sekreter-krasnoe-derevo', 'Бюро-секретер красного дерева',
  'Красное дерево, латунная фурнитура',
  'Бюро-секретер красного дерева с откидной столешницей и системой ящиков, XIX век. Латунная фурнитура, шпон, восстановленная политура.',
  (select id from categories where slug='mebel'),
  (select id from eras where slug='rossiyskaya-imperiya'),
  'restored', 'середина XIX века', 1320, 900, 480, 185000, 'RUB', 'sold', now(), now()
where not exists (select 1 from items where slug='byuro-sekreter-krasnoe-derevo');

-- 11. Рубль 1899 года, серебро ----------------------------------------
insert into items (slug, title_ru, subtitle_ru, description_ru, category_id, era_id,
                   condition, year_made_text, year_made_from, year_made_to, diameter_mm, weight_g, price, currency, status, published_at)
select 'rubl-1899-serebro', 'Рубль 1899 года, серебро',
  'Серебро 900, Николай II',
  'Серебряный рубль 1899 года (звезда), период правления Николая II. Серебро 900 пробы, гурт с надписью. Хорошая сохранность, приятная патина.',
  (select id from categories where slug='monety'),
  (select id from eras where slug='rossiyskaya-imperiya'),
  'good', '1899', 1899, 1899, 34, 20, 12000, 'RUB', 'in_stock', now()
where not exists (select 1 from items where slug='rubl-1899-serebro');

-- 12. Живопись «Берёзовая роща» --------------------------------------
insert into items (slug, title_ru, subtitle_ru, description_ru, category_id, era_id,
                   condition, provenance_ru, year_made_text, height_mm, width_mm, price, currency, status, is_featured, published_at)
select 'pejzazh-berezovaya-roshcha', 'Пейзаж «Берёзовая роща»',
  'Холст, масло',
  'Лирический пейзаж «Берёзовая роща», холст, масло, конец XIX — начало XX века. Неустановленный художник круга передвижников, дублированный холст, музейный подрамник.',
  (select id from categories where slug='zhivopis'),
  (select id from eras where slug='rossiyskaya-imperiya'),
  'good', 'Экспертиза НИНЭ им. Третьякова.', 'рубеж XIX–XX вв.', 450, 600, 320000, 'RUB', 'in_stock', true, now()
where not exists (select 1 from items where slug='pejzazh-berezovaya-roshcha');

-- Material links (M2M) ------------------------------------------------
insert into item_materials (item_id, material_id)
select i.id, m.id
from (values
  ('samovar-ryumka-batashev','latun'),
  ('samovar-grusha-tula','latun'),
  ('ikona-kazanskaya-oklad','derevo'),
  ('ikona-kazanskaya-oklad','serebro'),
  ('ikona-spas-vsederzhitel','derevo'),
  ('skladen-bronza-emal','bronza'),
  ('lfz-kobaltovaya-setka','farfor'),
  ('lfz-statuetka-balerina','farfor'),
  ('vaza-imperatorskiy-zavod','farfor'),
  ('kreslo-modern-oreh','derevo'),
  ('byuro-sekreter-krasnoe-derevo','derevo'),
  ('rubl-1899-serebro','serebro')
) as v(item_slug, mat)
join items i on i.slug = v.item_slug
join materials m on m.slug = v.mat
on conflict do nothing;
