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
    <nav aria-label="Хлебные крошки" className="text-sm text-muted">
      <JsonLd data={buildBreadcrumbJsonLd(crumbs)} />
      <ol className="flex flex-wrap items-center gap-1.5">
        {crumbs.map((c, i) => (
          <li key={c.url} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden className="text-brass/60">/</span>}
            {i < crumbs.length - 1 ? (
              <Link href={c.url} className="transition-colors hover:text-accent">
                {c.name}
              </Link>
            ) : (
              <span className="text-ink">{c.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
