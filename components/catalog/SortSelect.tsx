"use client";

import { useRouter } from "next/navigation";

const OPTIONS = [
  { value: "newest", label: "Сначала новые" },
  { value: "price_asc", label: "Сначала дешевле" },
  { value: "price_desc", label: "Сначала дороже" },
] as const;

/**
 * Catalog sort control. Rewrites the `sort` query param while preserving the
 * active filters (passed in as `params` so we avoid a client useSearchParams
 * bailout). Resets pagination on change.
 */
export function SortSelect({
  current,
  params,
}: {
  current: string;
  params: Record<string, string | undefined>;
}) {
  const router = useRouter();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v && k !== "sort" && k !== "page") next.set(k, v);
    }
    if (e.target.value !== "newest") next.set("sort", e.target.value);
    const qs = next.toString();
    router.push(qs ? `/catalog?${qs}` : "/catalog");
  }

  return (
    <label className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.14em] text-muted">
      <span className="hidden sm:inline">Сортировка</span>
      <select
        value={current}
        onChange={onChange}
        aria-label="Сортировка каталога"
        className="border border-line bg-bg px-2.5 py-1.5 text-xs text-ink outline-none transition-colors focus:border-accent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
