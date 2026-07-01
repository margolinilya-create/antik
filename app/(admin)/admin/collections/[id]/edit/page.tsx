import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/auth";
import {
  getCollectionForEdit,
  listSelectableItems,
} from "@/lib/queries/admin";
import { CollectionForm } from "@/components/admin/CollectionForm";
import { CollectionItemsEditor } from "@/components/admin/CollectionItemsEditor";
import { CollectionCoverUploader } from "@/components/admin/CollectionCoverUploader";
import { DeleteCollectionButton } from "@/components/admin/DeleteCollectionButton";

export const dynamic = "force-dynamic";

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const [collection, candidates] = await Promise.all([
    getCollectionForEdit(id),
    listSelectableItems(),
  ]);
  if (!collection) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{collection.title_ru}</h1>
        {collection.published_at && (
          <Link
            href={`/collection/${collection.slug}`}
            target="_blank"
            className="text-sm text-stone-500 hover:text-stone-900"
          >
            Открыть на сайте ↗
          </Link>
        )}
      </div>

      <section className="space-y-3 rounded-lg border border-stone-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-stone-700">Обложка</h2>
        <CollectionCoverUploader
          collectionId={collection.id}
          coverPath={collection.cover_path}
        />
      </section>

      <section className="space-y-3 rounded-lg border border-stone-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-stone-700">Состав подборки</h2>
        <CollectionItemsEditor
          collectionId={collection.id}
          candidates={candidates}
          initial={collection.item_ids}
        />
      </section>

      <CollectionForm collection={collection} />

      <section className="rounded-lg border border-red-200 bg-red-50 p-5">
        <h2 className="text-sm font-semibold text-red-700">Опасная зона</h2>
        <p className="mb-3 mt-1 text-sm text-red-600">
          Удаление подборки необратимо. Предметы при этом не удаляются.
        </p>
        <DeleteCollectionButton id={collection.id} slug={collection.slug} />
      </section>
    </div>
  );
}
