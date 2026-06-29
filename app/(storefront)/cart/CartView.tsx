"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useCart } from "@/lib/cart/store";
import { useMounted } from "@/lib/hooks/useMounted";
import { formatPrice } from "@/lib/format";
import { submitCartInquiry, type CartInquiryState } from "./actions";

export function CartView() {
  const items = useCart((s) => s.items);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  // Cart lives in localStorage — render nothing until mounted to avoid mismatch.
  const mounted = useMounted();
  const [state, formAction, pending] = useActionState<CartInquiryState, FormData>(
    submitCartInquiry,
    {},
  );

  useEffect(() => {
    if (state.ok) clear();
  }, [state.ok, clear]);

  if (!mounted) return null;

  if (state.ok) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-6 text-center">
        <p className="font-medium text-green-800">Заявка по подборке отправлена!</p>
        <p className="mt-1 text-sm text-green-700">Мы свяжемся с вами в ближайшее время.</p>
        <Link href="/catalog" className="mt-3 inline-block text-sm text-green-800 underline">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-stone-300 bg-white px-4 py-12 text-center text-sm text-stone-500">
        Подборка пуста.{" "}
        <Link href="/catalog" className="underline">
          Перейти в каталог
        </Link>
      </p>
    );
  }

  const total = items.reduce((sum, i) => sum + (i.price ?? 0), 0);
  const input =
    "w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-stone-500";

  return (
    <div className="space-y-6">
      <ul className="divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white">
        {items.map((i) => (
          <li key={i.slug} className="flex items-center gap-3 p-3">
            <div className="relative size-14 shrink-0 overflow-hidden rounded bg-stone-100">
              <Image src={i.image || "/placeholder.svg"} alt={i.title} fill sizes="56px" className="object-cover" />
            </div>
            <div className="flex-1">
              <Link href={`/item/${i.slug}`} className="text-sm font-medium hover:underline">
                {i.title}
              </Link>
              <p className="text-sm text-stone-500">
                {formatPrice(i.price, i.currency, i.price_on_request)}
              </p>
            </div>
            <button
              onClick={() => remove(i.slug)}
              className="text-sm text-stone-400 hover:text-red-600"
            >
              Убрать
            </button>
          </li>
        ))}
      </ul>

      <div className="flex justify-between text-sm">
        <span className="text-stone-500">Ориентировочно</span>
        <span className="font-semibold">{formatPrice(total)}</span>
      </div>

      <form action={formAction} className="space-y-3 rounded-lg border border-stone-200 bg-white p-4">
        <input type="hidden" name="snapshot" value={JSON.stringify(items)} />
        <p className="text-sm font-medium">Оставить заявку по подборке</p>
        <input name="customer_name" required placeholder="Имя *" className={input} />
        <div className="grid gap-3 sm:grid-cols-2">
          <input name="phone" type="tel" placeholder="Телефон" className={input} />
          <input name="telegram" placeholder="Telegram" className={input} />
        </div>
        <input name="email" type="email" placeholder="Email" className={input} />
        <textarea name="message_ru" rows={2} placeholder="Сообщение" className={input} />
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-stone-900 px-5 py-3 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-60"
        >
          {pending ? "Отправка…" : "Отправить заявку"}
        </button>
      </form>
    </div>
  );
}
