import type { Metadata } from "next";
import Link from "next/link";
import { getItemBySlug } from "@/lib/queries/items";
import { formatPrice } from "@/lib/format";
import { InquiryForm } from "./InquiryForm";

export const metadata: Metadata = {
  title: "Оставить заявку",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const slug = Array.isArray(sp.item) ? sp.item[0] : sp.item;
  const item = slug ? await getItemBySlug(slug) : null;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="font-display text-3xl font-medium tracking-tight">Оставить заявку</h1>

      {item && (
        <div className="flex items-center justify-between rounded-sm border border-line bg-surface px-4 py-3">
          <div>
            <Link href={`/item/${item.slug}`} className="text-base font-medium hover:text-accent">
              {item.title_ru}
            </Link>
            {item.subtitle_ru && (
              <p className="text-sm text-muted">{item.subtitle_ru}</p>
            )}
          </div>
          <span className="text-lg font-light text-ink">
            {formatPrice(item.price, item.currency, item.price_on_request)}
          </span>
        </div>
      )}

      <p className="text-sm text-ink/70">
        Оставьте контакты — мы свяжемся с вами, ответим на вопросы и согласуем
        условия. Предмет можно забронировать.
      </p>

      <InquiryForm itemSlug={item?.slug} />
    </div>
  );
}
