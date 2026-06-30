import type { Metadata } from "next";
import Link from "next/link";
import { listSoldItems } from "@/lib/queries/items";
import { ItemCard } from "@/components/catalog/ItemCard";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Архив проданного",
  description:
    "Предметы, которые нашли новых владельцев. Архив проданного антиквариата — примеры предметов и достигнутых результатов галереи.",
  alternates: { canonical: "/prodano" },
};

export default async function SoldPage() {
  const items = await listSoldItems(48);

  return (
    <div className="space-y-10">
      <Breadcrumbs
        crumbs={[
          { name: "Главная", url: "/" },
          { name: "Архив проданного", url: "/prodano" },
        ]}
      />
      <header className="max-w-2xl">
        <p className="eyebrow text-accent">Реализовано</p>
        <h1 className="mt-4 font-display text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
          Архив проданного
        </h1>
        <p className="mt-5 leading-relaxed text-muted">
          Предметы, которые уже нашли новых владельцев. Ищете похожее?{" "}
          <Link href="/catalog" className="text-accent link-underline pb-0.5">
            Смотрите каталог
          </Link>{" "}
          или напишите нам.
        </p>
      </header>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="border border-dashed border-line px-4 py-16 text-center text-sm text-muted">
          Здесь появятся проданные предметы.
        </p>
      )}
    </div>
  );
}
