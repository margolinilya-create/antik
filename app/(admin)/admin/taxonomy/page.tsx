import { getTaxonomyFull, SEO_TAXONOMY, LANDING_TAXONOMY } from "@/lib/queries/admin";
import { AddTermForm } from "@/components/admin/AddTermForm";
import { TaxonomyEditor } from "@/components/admin/TaxonomyEditor";

export const dynamic = "force-dynamic";

const GROUPS = [
  { table: "categories", title: "Категории" },
  { table: "eras", title: "Эпохи" },
  { table: "makers", title: "Мастера / авторы" },
  { table: "materials", title: "Материалы" },
  { table: "techniques", title: "Техники" },
] as const;

export default async function TaxonomyPage() {
  const data = await getTaxonomyFull();

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Справочники</h1>
      <p className="text-sm text-stone-500">
        Категории, эпохи, мастера, материалы и техники — используются в фильтрах
        каталога и SEO-лендингах. Редактируйте название, ЧПУ-slug, порядок и
        SEO-поля; удаление возможно только для неиспользуемых записей.
      </p>

      <div className="grid gap-5 md:grid-cols-2">
        {GROUPS.map((g) => (
          <section
            key={g.table}
            className="rounded-lg border border-stone-200 bg-white p-5"
          >
            <h2 className="mb-3 text-sm font-semibold text-stone-700">{g.title}</h2>
            <TaxonomyEditor
              table={g.table}
              rows={data[g.table]}
              hasSeo={SEO_TAXONOMY.includes(g.table)}
              hasBody={LANDING_TAXONOMY.includes(g.table)}
            />
            <div className="mt-4 border-t border-stone-100 pt-4">
              <AddTermForm table={g.table} />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
