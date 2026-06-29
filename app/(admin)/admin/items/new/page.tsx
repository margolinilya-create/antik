import { requireAdmin } from "@/lib/supabase/auth";
import { getTaxonomyOptions } from "@/lib/queries/admin";
import { ItemForm } from "@/components/admin/ItemForm";

export const dynamic = "force-dynamic";

export default async function NewItemPage() {
  await requireAdmin();
  const options = await getTaxonomyOptions();

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Новый предмет</h1>
      <p className="text-sm text-stone-500">
        Сохраните предмет как черновик, затем добавьте фотографии и опубликуйте.
      </p>
      <ItemForm options={options} />
    </div>
  );
}
