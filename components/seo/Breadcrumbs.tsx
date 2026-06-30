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
    <nav aria-label="Хлебные крошки" className="text-[0.72rem] uppercase tracking-[0.14em] text-faint">
      <JsonLd data={buildBreadcrumbJsonLd(crumbs)} />
      <ol className="flex flex-wrap items-center gap-2">
        {crumbs.map((c, i) => (
          <li key={c.url} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden className="text-faint">/</span>}
            {i < crumbs.length - 1 ? (
              <Link href={c.url} className="transition-colors hover:text-accent">
                {c.name}
              </Link>
            ) : (
              <span className="text-muted">{c.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
