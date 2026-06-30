import Link from "next/link";
import { listInquiries } from "@/lib/queries/admin";
import { InquiryStatusSelect } from "@/components/admin/InquiryStatusSelect";
import { InquiryNote } from "@/components/admin/InquiryNote";

export const dynamic = "force-dynamic";

const typeLabel: Record<string, string> = {
  reserve: "Бронь",
  buy: "Покупка",
  question: "Вопрос",
  offer: "Предложение",
  sell: "Продажа нам",
};

const rub = (n: number | null | undefined) =>
  n != null ? `${n.toLocaleString("ru-RU")} ₽` : "—";

export default async function AdminInquiriesPage() {
  const inquiries = await listInquiries();

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Заявки</h1>

      <div className="space-y-3">
        {inquiries.map((q) => (
          <div
            key={q.id}
            className="rounded-lg border border-stone-200 bg-white p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium">
                  {q.customer_name}{" "}
                  <span className="ml-1 rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-500">
                    {typeLabel[q.type] ?? q.type}
                  </span>
                  {q.source && (
                    <span className="ml-1 text-xs text-stone-400">· {q.source}</span>
                  )}
                </p>
                <p className="mt-1 text-sm text-stone-600">
                  {[q.phone, q.email, q.telegram].filter(Boolean).join(" · ") || "—"}
                </p>

                {/* Offer amount for price offers */}
                {q.type === "offer" && (
                  <p className="mt-2 text-sm font-medium text-stone-800">
                    Предложение: {rub(q.offer_amount)}
                  </p>
                )}

                {/* Single item this lead is about */}
                {q.item && (
                  <p className="mt-2 text-sm">
                    Предмет:{" "}
                    <Link
                      href={`/item/${q.item.slug}`}
                      target="_blank"
                      className="text-stone-900 underline underline-offset-2 hover:text-stone-600"
                    >
                      {q.item.title_ru}
                    </Link>
                  </p>
                )}

                {/* Cart snapshot for multi-item ("подборка") leads */}
                {q.items_snapshot && q.items_snapshot.length > 0 && (
                  <div className="mt-2 text-sm text-stone-700">
                    <p className="text-xs uppercase tracking-wide text-stone-400">
                      Подборка ({q.items_snapshot.length}) · ориентир {rub(q.total_estimate)}
                    </p>
                    <ul className="mt-1 list-disc space-y-0.5 pl-5">
                      {q.items_snapshot.map((it, i) => (
                        <li key={i}>
                          <Link
                            href={`/item/${it.slug}`}
                            target="_blank"
                            className="hover:underline"
                          >
                            {it.title}
                          </Link>{" "}
                          — {rub(it.price)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {q.message_ru && (
                  <p className="mt-2 max-w-2xl whitespace-pre-line text-sm text-stone-700">
                    {q.message_ru}
                  </p>
                )}
                <p className="mt-2 text-xs text-stone-400">
                  {new Date(q.created_at).toLocaleString("ru-RU")}
                </p>
              </div>
              <InquiryStatusSelect id={q.id} status={q.status} />
            </div>

            <InquiryNote id={q.id} note={q.admin_note} />
          </div>
        ))}
        {inquiries.length === 0 && (
          <p className="rounded-lg border border-dashed border-stone-300 bg-white px-4 py-10 text-center text-sm text-stone-500">
            Заявок пока нет.
          </p>
        )}
      </div>
    </div>
  );
}
