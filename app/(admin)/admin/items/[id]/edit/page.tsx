import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/auth";
import { getItemForEdit, getTaxonomyOptions } from "@/lib/queries/admin";
import { ItemForm } from "@/components/admin/ItemForm";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { DeleteItemButton } from "@/components/admin/DeleteItemButton";

export const dynamic = "force-dynamic";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const [item, options] = await Promise.all([
    getItemForEdit(id),
    getTaxonomyOptions(),
  ]);
  if (!item) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{item.title_ru}</h1>
        <Link
          href={`/item/${item.slug}`}
          target="_blank"
          className="text-sm text-stone-500 hover:text-stone-900"
        >
          Открыть на сайте ↗
        </Link>
      </div>

      <section className="space-y-3 rounded-lg border border-stone-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-stone-700">Фотографии</h2>
        <ImageUploader itemId={item.id} images={item.images} />
      </section>

      <ItemForm item={item} options={options} />

      <section className="rounded-lg border border-red-200 bg-red-50 p-5">
        <h2 className="text-sm font-semibold text-red-700">Опасная зона</h2>
        <p className="mb-3 mt-1 text-sm text-red-600">
          Удаление необратимо. Проданные предметы лучше переводить в статус
          «Продано», а не удалять — они полезны для SEO.
        </p>
        <DeleteItemButton id={item.id} slug={item.slug} />
      </section>
    </div>
  );
}
