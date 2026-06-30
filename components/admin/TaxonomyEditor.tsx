"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  updateTaxonomyTerm,
  deleteTaxonomyTerm,
} from "@/app/(admin)/admin/actions";
import type { TaxonomyFullRow, TaxonomyTable } from "@/lib/queries/admin";

const input =
  "w-full rounded-md border border-stone-300 px-2 py-1 text-sm outline-none focus:border-stone-500";
const lbl = "block text-[11px] uppercase tracking-wide text-stone-400";

function TermRow({
  table,
  row,
  hasSeo,
  hasBody,
}: {
  table: TaxonomyTable;
  row: TaxonomyFullRow;
  hasSeo: boolean;
  hasBody: boolean;
}) {
  const router = useRouter();
  const [name, setName] = useState(row.name_ru);
  const [slug, setSlug] = useState(row.slug);
  const [sort, setSort] = useState(String(row.sort_order ?? 0));
  const [seoTitle, setSeoTitle] = useState(row.seo_title ?? "");
  const [seoDesc, setSeoDesc] = useState(row.seo_description ?? "");
  const [intro, setIntro] = useState(row.intro_ru ?? "");
  const [body, setBody] = useState(row.body_ru ?? "");
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function save() {
    setErr(null);
    start(async () => {
      const res = await updateTaxonomyTerm(table, row.id, {
        name_ru: name,
        slug,
        sort_order: Number(sort) || 0,
        ...(hasSeo
          ? { seo_title: seoTitle, seo_description: seoDesc, intro_ru: intro }
          : {}),
        ...(hasBody ? { body_ru: body } : {}),
      });
      if (res.error) setErr(res.error);
      else {
        setOpen(false);
        router.refresh();
      }
    });
  }

  function remove() {
    if (!confirm(`Удалить «${row.name_ru}»?`)) return;
    setErr(null);
    start(async () => {
      const res = await deleteTaxonomyTerm(table, row.id);
      if (res.error) setErr(res.error);
      else router.refresh();
    });
  }

  return (
    <li className="rounded-md border border-stone-200 p-2">
      <div className="flex items-center gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={input}
        />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          title="Подробнее"
          className="shrink-0 rounded px-1.5 text-stone-500 hover:text-stone-900"
        >
          {open ? "−" : "⋯"}
        </button>
        <button
          type="button"
          onClick={remove}
          disabled={pending}
          title="Удалить"
          className="shrink-0 rounded px-1.5 text-red-500 hover:text-red-700 disabled:opacity-50"
        >
          ✕
        </button>
      </div>

      {open && (
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <label className="space-y-0.5">
            <span className={lbl}>slug (ЧПУ)</span>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} className={input} />
          </label>
          <label className="space-y-0.5">
            <span className={lbl}>Порядок</span>
            <input
              type="number"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className={input}
            />
          </label>
          {hasSeo && (
            <>
              <label className="space-y-0.5 sm:col-span-2">
                <span className={lbl}>SEO title</span>
                <input
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className={input}
                />
              </label>
              <label className="space-y-0.5 sm:col-span-2">
                <span className={lbl}>SEO description</span>
                <textarea
                  value={seoDesc}
                  rows={2}
                  onChange={(e) => setSeoDesc(e.target.value)}
                  className={input}
                />
              </label>
              <label className="space-y-0.5 sm:col-span-2">
                <span className={lbl}>Вводный текст (на странице)</span>
                <textarea
                  value={intro}
                  rows={3}
                  onChange={(e) => setIntro(e.target.value)}
                  className={input}
                />
              </label>
            </>
          )}
          {hasBody && (
            <label className="space-y-0.5 sm:col-span-2">
              <span className={lbl}>
                Развёрнутый текст («## Заголовок» — секции)
              </span>
              <textarea
                value={body}
                rows={6}
                onChange={(e) => setBody(e.target.value)}
                placeholder={"## Исторический контекст\nАбзац…\n\n## Характерные черты\nАбзац…"}
                className={input}
              />
            </label>
          )}
        </div>
      )}

      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="rounded-md bg-stone-900 px-3 py-1 text-xs text-white hover:bg-stone-700 disabled:opacity-50"
        >
          {pending ? "…" : "Сохранить"}
        </button>
        {err && <span className="text-xs text-red-600">{err}</span>}
      </div>
    </li>
  );
}

export function TaxonomyEditor({
  table,
  rows,
  hasSeo,
  hasBody = false,
}: {
  table: TaxonomyTable;
  rows: TaxonomyFullRow[];
  hasSeo: boolean;
  hasBody?: boolean;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-stone-400">пусто</p>;
  }
  return (
    <ul className="space-y-2">
      {rows.map((r) => (
        <TermRow key={r.id} table={table} row={r} hasSeo={hasSeo} hasBody={hasBody} />
      ))}
    </ul>
  );
}
