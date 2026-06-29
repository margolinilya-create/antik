import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { Facets } from "@/types/database";

type Params = Record<string, string | undefined>;

/** Build a catalog URL toggling one filter key, preserving the rest. */
function toggleHref(params: Params, key: string, value: string): string {
  const next = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v && k !== "offset") next.set(k, v);
  }
  if (next.get(key) === value) next.delete(key);
  else next.set(key, value);
  const qs = next.toString();
  return qs ? `/catalog?${qs}` : "/catalog";
}

function FacetGroup({
  title,
  facetKey,
  values,
  params,
}: {
  title: string;
  facetKey: string;
  values: { slug: string; name: string; count: number }[];
  params: Params;
}) {
  if (values.length === 0) return null;
  return (
    <div className="border-b border-line py-4">
      <h3 className="eyebrow mb-3">{title}</h3>
      <ul className="space-y-1.5">
        {values.map((v) => {
          const active = params[facetKey] === v.slug;
          return (
            <li key={v.slug}>
              <Link
                href={toggleHref(params, facetKey, v.slug)}
                className={`flex items-center justify-between text-sm transition-colors hover:text-accent ${
                  active ? "font-medium text-accent" : "text-ink/80"
                }`}
              >
                <span>
                  {active && "✓ "}
                  {v.name}
                </span>
                <span className="text-xs text-muted">{v.count}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function FacetSidebar({
  facets,
  params,
}: {
  facets: Facets;
  params: Params;
}) {
  const hasActive = ["category", "era", "maker", "material", "condition", "q"].some(
    (k) => params[k],
  );
  return (
    <aside className="w-full shrink-0 md:w-56">
      {hasActive && (
        <Link
          href="/catalog"
          className="mb-3 inline-block text-sm text-muted transition-colors hover:text-accent"
        >
          ✕ Сбросить фильтры
        </Link>
      )}
      <FacetGroup title="Категория" facetKey="category" values={facets.categories} params={params} />
      <FacetGroup title="Эпоха" facetKey="era" values={facets.eras} params={params} />
      <FacetGroup title="Мастер / автор" facetKey="maker" values={facets.makers} params={params} />
      <FacetGroup title="Материал" facetKey="material" values={facets.materials} params={params} />
      {facets.price && facets.price.min != null && (
        <div className="py-4 text-sm text-ink/80">
          <h3 className="eyebrow mb-2">Цена</h3>
          от {formatPrice(facets.price.min)} до {formatPrice(facets.price.max)}
        </div>
      )}
    </aside>
  );
}
