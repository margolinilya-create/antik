"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { saveCollection, type ActionState } from "@/app/(admin)/admin/actions";
import type { AdminCollectionEdit } from "@/lib/queries/admin";

const input =
  "w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-stone-500";
const label = "mb-1 block text-sm font-medium text-stone-600";

export function CollectionForm({ collection }: { collection?: AdminCollectionEdit }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    saveCollection,
    {},
  );

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      {collection && <input type="hidden" name="id" value={collection.id} />}

      <fieldset className="space-y-4 rounded-lg border border-stone-200 bg-white p-5">
        <legend className="px-1 text-sm font-semibold text-stone-700">Основное</legend>
        <div>
          <span className={label}>Название *</span>
          <input name="title_ru" required defaultValue={collection?.title_ru} className={input} />
        </div>
        <div>
          <span className={label}>Подзаголовок</span>
          <input name="subtitle_ru" defaultValue={collection?.subtitle_ru ?? ""} className={input} />
        </div>
        <div>
          <span className={label}>Slug (ЧПУ, можно оставить пустым)</span>
          <input name="slug" defaultValue={collection?.slug ?? ""} className={input} placeholder="генерируется из названия" />
        </div>
        <div>
          <span className={label}>Вводный текст (на странице подборки)</span>
          <textarea name="intro_ru" rows={4} defaultValue={collection?.intro_ru ?? ""} className={input} />
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-lg border border-stone-200 bg-white p-5">
        <legend className="px-1 text-sm font-semibold text-stone-700">Публикация</legend>
        <div className="flex flex-wrap gap-6 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="published" defaultChecked={!!collection?.published_at} />
            Опубликована
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="is_featured" defaultChecked={collection?.is_featured} />
            На главной (в блоке «В подборках»)
          </label>
          <label className="flex items-center gap-2">
            Порядок
            <input
              name="sort_order"
              type="number"
              defaultValue={collection?.sort_order ?? 0}
              className="w-20 rounded-md border border-stone-300 px-2 py-1"
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-lg border border-stone-200 bg-white p-5">
        <legend className="px-1 text-sm font-semibold text-stone-700">SEO</legend>
        <div>
          <span className={label}>SEO Title</span>
          <input name="seo_title" defaultValue={collection?.seo_title ?? ""} className={input} />
        </div>
        <div>
          <span className={label}>SEO Description</span>
          <textarea name="seo_description" rows={2} defaultValue={collection?.seo_description ?? ""} className={input} />
        </div>
      </fieldset>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.ok && <p className="text-sm text-green-600">Сохранено.</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-60"
        >
          {pending ? "Сохранение…" : collection ? "Сохранить" : "Создать"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/collections")}
          className="rounded-md border border-stone-300 px-5 py-2.5 text-sm hover:bg-stone-50"
        >
          К списку
        </button>
      </div>
    </form>
  );
}
