<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Антик — антикварный интернет-магазин (рынок РФ)

Курируемая витрина антиквариата: подбор и продажа уникальных предметов в наличии.

## Ключевой принцип модели данных
Каждый предмет **уникален** (qty = 1). **Нет** таблиц склада, SKU, остатков и
вариантов. Доступность = поле `items.status` (`draft | in_stock | reserved |
sold | archived`). Проданные предметы **не удаляем** — они ценны для SEO.

## Правило изображений предметов
**Фотографии предметов НИКОГДА не обрезаем** (`object-cover` запрещён для фото
предметов) — предмет всегда виден целиком: `object-contain` на спокойном фоне
(`bg-surface`)-паспарту. Касается карточек товара, галереи предмета, корзины,
обложек и любых превью в журнале. Исключение — атмосферный фуллскрин-герой
(`hero-gallery.jpg`), это не фото предмета.

## Стек
- Next.js 16 (App Router, TypeScript, Server Components) + React 19
- Supabase (Postgres + Auth + Storage), RLS-first
- Tailwind CSS 4 · Хостинг Vercel

## Структура
- `app/(storefront)/` — публичная витрина (SSG/ISR): главная, каталог, карточка
  `item/[slug]`, лендинги `category/[slug]` и `era/[slug]`, поиск, checkout.
- `app/api/revalidate` — on-demand ISR по Supabase DB-webhook.
- `lib/supabase/` — `server.ts` (RLS), `client.ts` (браузер), `admin.ts`
  (service-role, только сервер), `storage.ts` (URL изображений).
- `lib/queries/` — типизированный доступ (RPC `search_items`, `getItemBySlug`).
- `lib/seo/jsonld.ts` — Product+Offer / BreadcrumbList / Store микроразметка.
- `supabase/migrations/` — `0001_init.sql` (схема, RLS, FTS, индексы),
  `0002_search.sql` (RPC); `supabase/seed.sql` — таксономии и примеры.
- `proxy.ts` — обновление сессии Supabase + гейт `/admin` (Next 16 proxy).

## Поиск
Нативный Postgres: `tsvector` (конфиг `russian`) + `pg_trgm` (опечатки), единая
RPC `search_items(filters jsonb)` → `{ items, total, facets }`. Слой `lib/queries`
изолирует будущий своп на Meilisearch.

## Команды
`pnpm dev` · `pnpm build` (сборка + типы) · `pnpm start` · `pnpm lint`

## Настройка БД
1. Создать проект Supabase, заполнить `.env` по `.env.example`.
2. Применить `0001_init.sql`, затем `0002_search.sql`, затем `seed.sql`.
3. Создать публичный bucket `item-images` в Storage.
4. Админ: зарегистрировать пользователя в Auth → вставить строку в `profiles`
   с `role = 'owner'`.

Без env приложение собирается и работает: запросы деградируют в пустые
результаты (`isSupabaseConfigured`), каталог показывает пустое состояние.

## Дорожная карта
0. ✅ Фундамент · 1. ✅ Каталог+SEO · 2. ✅ Поиск ·
3. ⬜ Админка (Auth, CRUD, фото, статусы) ·
4. 🟡 Заявки→`inquiries`+Telegram; далее корзина-лайт, оплата ЮKassa.
