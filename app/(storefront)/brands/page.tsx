import type { Metadata } from "next";
import Link from "next/link";
import { listBrands } from "@/lib/queries/makers";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Бренды и мануфактуры антиквариата",
  description:
    "Знаковые мастера и мануфактуры: Фаберже, Кузнецовъ, Императорский фарфоровый завод, Гарднеръ, Овчинниковъ, Сазиковъ, Баташёвъ, Мейсен, Севр и другие. История, клейма, коллекционная ценность.",
  alternates: { canonical: "/brands" },
};

export default async function BrandsPage() {
  const brands = await listBrands();

  return (
    <div className="space-y-10">
      <Breadcrumbs
        crumbs={[
          { name: "Главная", url: "/" },
          { name: "Бренды", url: "/brands" },
        ]}
      />

      <header className="max-w-2xl">
        <p className="eyebrow text-accent">Мастера и мануфактуры</p>
        <h1 className="mt-4 font-display text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
          Бренды антиквариата
        </h1>
        <p className="mt-5 leading-relaxed text-muted">
          Имена, определившие историю декоративно-прикладного искусства. Изучите
          мануфактуры и мастеров, их клейма и коллекционную ценность — и выберите
          предметы конкретного бренда из нашего собрания.
        </p>
      </header>

      {brands.length > 0 ? (
        <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((b) => (
            <Link
              key={b.slug}
              href={`/maker/${b.slug}`}
              className="group flex flex-col bg-bg p-7 transition-colors hover:bg-surface"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-xl font-light tracking-tight text-ink transition-colors group-hover:text-accent">
                  {b.name_ru}
                </h2>
                {b.item_count > 0 && (
                  <span className="shrink-0 text-[0.7rem] uppercase tracking-[0.12em] text-faint">
                    {b.item_count} предм.
                  </span>
                )}
              </div>
              <p className="mt-1 text-[0.72rem] uppercase tracking-[0.14em] text-faint">
                {[b.country, b.founded && `осн. ${b.founded}`]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              {b.tagline_ru && (
                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted">
                  {b.tagline_ru}
                </p>
              )}
              <span className="mt-auto pt-6 text-[0.72rem] uppercase tracking-[0.16em] text-accent opacity-0 transition-opacity group-hover:opacity-100">
                Смотреть →
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="border border-dashed border-line px-4 py-16 text-center text-sm text-muted">
          Бренды скоро появятся.
        </p>
      )}
    </div>
  );
}
