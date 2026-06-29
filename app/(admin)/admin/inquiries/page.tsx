import { listInquiries } from "@/lib/queries/admin";
import { InquiryStatusSelect } from "@/components/admin/InquiryStatusSelect";

export const dynamic = "force-dynamic";

const typeLabel: Record<string, string> = {
  reserve: "Бронь",
  buy: "Покупка",
  question: "Вопрос",
};

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
              <div>
                <p className="font-medium">
                  {q.customer_name}{" "}
                  <span className="ml-1 rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-500">
                    {typeLabel[q.type] ?? q.type}
                  </span>
                </p>
                <p className="mt-1 text-sm text-stone-600">
                  {[q.phone, q.email, q.telegram].filter(Boolean).join(" · ") || "—"}
                </p>
                {q.message_ru && (
                  <p className="mt-2 max-w-2xl text-sm text-stone-700">{q.message_ru}</p>
                )}
                <p className="mt-2 text-xs text-stone-400">
                  {new Date(q.created_at).toLocaleString("ru-RU")}
                </p>
              </div>
              <InquiryStatusSelect id={q.id} status={q.status} />
            </div>
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
