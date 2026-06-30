import { requireAdmin } from "@/lib/supabase/auth";
import { CollectionForm } from "@/components/admin/CollectionForm";

export const dynamic = "force-dynamic";

export default async function NewCollectionPage() {
  await requireAdmin();
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Новая подборка</h1>
      <p className="text-sm text-stone-500">
        Сохраните подборку, затем добавьте обложку и предметы.
      </p>
      <CollectionForm />
    </div>
  );
}
