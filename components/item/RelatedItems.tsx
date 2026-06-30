import { ItemCard } from "@/components/catalog/ItemCard";
import type { ItemListRow } from "@/types/database";

export function RelatedItems({ items }: { items: ItemListRow[] }) {
  if (items.length === 0) return null;
  return (
    <section>
      <div className="mb-8 flex items-center gap-6">
        <h2 className="text-lg font-light tracking-tight">Похожие предметы</h2>
        <div className="gold-rule flex-1" />
      </div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
