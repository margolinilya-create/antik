import { getTaxonomyOptions } from "@/lib/queries/admin";
import { AddTermForm } from "@/components/admin/AddTermForm";

export const dynamic = "force-dynamic";

const GROUPS = [
  { table: "categories", title: "Категории" },
  { table: "eras", title: "Эпохи" },
  { table: "makers", title: "Мастера / авторы" },
  { table: "materials", title: "Материалы" },
  { table: "techniques", title: "Техники" },
] as const;

export default async function TaxonomyPage() {
  const options = await getTaxonomyOptions();

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Справочники</h1>
      <p className="text-sm text-stone-500">
        Категории, эпохи, мастера, материалы и техники — используются в фильтрах
        каталога и SEO-лендингах.
      </p>

      <div className="grid gap-5 md:grid-cols-2">
        {GROUPS.map((g) => (
          <section key={g.table} className="rounded-lg border border-stone-200 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-stone-700">{g.title}</h2>
            <ul className="mb-4 flex flex-wrap gap-2">
              {options[g.table].map((o) => (
                <li
                  key={o.id}
                  className="rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-700"
                >
                  {o.name_ru}
                </li>
              ))}
              {options[g.table].length === 0 && (
                <li className="text-sm text-stone-400">пусто</li>
              )}
            </ul>
            <AddTermForm table={g.table} />
          </section>
        ))}
      </div>
    </div>
  );
}
