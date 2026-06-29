import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

export interface Crumb {
  name: string;
  url: string;
}

/** Visual breadcrumb trail + matching BreadcrumbList structured data. */
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Хлебные крошки" className="text-sm text-stone-500">
      <JsonLd data={buildBreadcrumbJsonLd(crumbs)} />
      <ol className="flex flex-wrap items-center gap-1.5">
        {crumbs.map((c, i) => (
          <li key={c.url} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden>/</span>}
            {i < crumbs.length - 1 ? (
              <Link href={c.url} className="hover:text-stone-900">
                {c.name}
              </Link>
            ) : (
              <span className="text-stone-700">{c.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
