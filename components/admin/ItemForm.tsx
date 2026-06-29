"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { saveItem, type ActionState } from "@/app/(admin)/admin/actions";
import type { AdminItemEdit, TaxonomyOption } from "@/lib/queries/admin";

interface Options {
  categories: TaxonomyOption[];
  eras: TaxonomyOption[];
  makers: TaxonomyOption[];
  materials: TaxonomyOption[];
  techniques: TaxonomyOption[];
}

const CONDITIONS = [
  ["mint", "Идеальное"],
  ["excellent", "Отличное"],
  ["good", "Хорошее"],
  ["fair", "Удовлетворительное"],
  ["restored", "Реставрировано"],
  ["as_is", "Как есть"],
] as const;

const STATUSES = [
  ["draft", "Черновик"],
  ["in_stock", "В наличии"],
  ["reserved", "В резерве"],
  ["sold", "Продано"],
  ["archived", "В архиве"],
] as const;

const input =
  "w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-stone-500";
const label = "mb-1 block text-sm font-medium text-stone-600";

export function ItemForm({
  item,
  options,
}: {
  item?: AdminItemEdit;
  options: Options;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    saveItem,
    {},
  );

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      {item && <input type="hidden" name="id" value={item.id} />}

      <Section title="Основное">
        <Field label="Название *">
          <input name="title_ru" required defaultValue={item?.title_ru} className={input} />
        </Field>
        <Field label="Подзаголовок">
          <input name="subtitle_ru" defaultValue={item?.subtitle_ru ?? ""} className={input} />
        </Field>
        <Field label="Slug (ЧПУ, можно оставить пустым)">
          <input name="slug" defaultValue={item?.slug ?? ""} className={input} placeholder="генерируется из названия" />
        </Field>
        <Field label="Описание">
          <textarea name="description_ru" rows={5} defaultValue={item?.description_ru ?? ""} className={input} />
        </Field>
        <Field label="Провенанс">
          <textarea name="provenance_ru" rows={2} defaultValue={item?.provenance_ru ?? ""} className={input} />
        </Field>
      </Section>

      <Section title="Классификация">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Категория">
            <Select name="category_id" value={item?.category_id} options={options.categories} />
          </Field>
          <Field label="Эпоха">
            <Select name="era_id" value={item?.era_id} options={options.eras} />
          </Field>
          <Field label="Мастер / автор">
            <Select name="maker_id" value={item?.maker_id} options={options.makers} />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Материалы">
            <CheckGroup name="material_ids" options={options.materials} selected={item?.material_ids} />
          </Field>
          <Field label="Техники">
            <CheckGroup name="technique_ids" options={options.techniques} selected={item?.technique_ids} />
          </Field>
        </div>
      </Section>

      <Section title="Датировка и состояние">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Год (текст)">
            <input name="year_made_text" defaultValue={item?.year_made_text ?? ""} className={input} placeholder="около 1890" />
          </Field>
          <Field label="Год от">
            <input name="year_made_from" type="number" defaultValue={item?.year_made_from ?? ""} className={input} />
          </Field>
          <Field label="Год до">
            <input name="year_made_to" type="number" defaultValue={item?.year_made_to ?? ""} className={input} />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Состояние">
            <select name="condition" defaultValue={item?.condition ?? ""} className={input}>
              <option value="">—</option>
              {CONDITIONS.map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </Field>
          <Field label="Заметка о состоянии">
            <input name="condition_note_ru" defaultValue={item?.condition_note_ru ?? ""} className={input} />
          </Field>
        </div>
      </Section>

      <Section title="Размеры (мм)">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {(["height_mm", "width_mm", "depth_mm", "diameter_mm", "weight_g"] as const).map((k) => (
            <Field key={k} label={dimLabel[k]}>
              <input name={k} type="number" defaultValue={item?.[k] ?? ""} className={input} />
            </Field>
          ))}
        </div>
      </Section>

      <Section title="Цена и статус">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Цена">
            <input name="price" type="number" step="0.01" defaultValue={item?.price ?? ""} className={input} />
          </Field>
          <Field label="Валюта">
            <select name="currency" defaultValue={item?.currency ?? "RUB"} className={input}>
              <option value="RUB">RUB</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </Field>
          <Field label="Статус">
            <select name="status" defaultValue={item?.status ?? "draft"} className={input}>
              {STATUSES.map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </Field>
        </div>
        <div className="flex gap-6 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="price_on_request" defaultChecked={item?.price_on_request} />
            Цена по запросу
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="is_featured" defaultChecked={item?.is_featured} />
            В избранном на главной
          </label>
        </div>
      </Section>

      <Section title="SEO">
        <Field label="SEO Title">
          <input name="seo_title" defaultValue={item?.seo_title ?? ""} className={input} />
        </Field>
        <Field label="SEO Description">
          <textarea name="seo_description" rows={2} defaultValue={item?.seo_description ?? ""} className={input} />
        </Field>
      </Section>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.ok && <p className="text-sm text-green-600">Сохранено.</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-60"
        >
          {pending ? "Сохранение…" : item ? "Сохранить" : "Создать"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/items")}
          className="rounded-md border border-stone-300 px-5 py-2.5 text-sm hover:bg-stone-50"
        >
          К списку
        </button>
      </div>
    </form>
  );
}

const dimLabel: Record<string, string> = {
  height_mm: "Высота",
  width_mm: "Ширина",
  depth_mm: "Глубина",
  diameter_mm: "Диаметр",
  weight_g: "Вес (г)",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4 rounded-lg border border-stone-200 bg-white p-5">
      <legend className="px-1 text-sm font-semibold text-stone-700">{title}</legend>
      {children}
    </fieldset>
  );
}

function Field({ label: l, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className={label}>{l}</span>
      {children}
    </div>
  );
}

function Select({
  name,
  value,
  options,
}: {
  name: string;
  value?: string | null;
  options: TaxonomyOption[];
}) {
  return (
    <select name={name} defaultValue={value ?? ""} className={input}>
      <option value="">—</option>
      {options.map((o) => (
        <option key={o.id} value={o.id}>{o.name_ru}</option>
      ))}
    </select>
  );
}

function CheckGroup({
  name,
  options,
  selected,
}: {
  name: string;
  options: TaxonomyOption[];
  selected?: string[];
}) {
  const set = new Set(selected ?? []);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <label
          key={o.id}
          className="flex items-center gap-1.5 rounded-md border border-stone-300 px-2.5 py-1 text-sm"
        >
          <input type="checkbox" name={name} value={o.id} defaultChecked={set.has(o.id)} />
          {o.name_ru}
        </label>
      ))}
      {options.length === 0 && <span className="text-sm text-stone-400">нет значений</span>}
    </div>
  );
}
