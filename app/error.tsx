"use client";

import { useEffect } from "react";
import Link from "next/link";
import { site } from "@/lib/site";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to the console (and Sentry, if configured via instrumentation).
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-1 flex-col items-center justify-center px-5 py-20 text-center">
      <p className="font-display text-xl tracking-[0.3em] text-ink">{site.name}</p>
      <p className="eyebrow mt-10 text-accent">Ошибка</p>
      <h1 className="mt-3 font-display text-3xl font-medium tracking-tight sm:text-4xl">
        Что-то пошло не так
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Мы уже разбираемся. Попробуйте обновить страницу или свяжитесь с нами:{" "}
        <a href={site.phoneHref} className="text-accent hover:underline">
          {site.phone}
        </a>
        .
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-bg transition-colors hover:bg-ink/85"
        >
          Обновить
        </button>
        <Link
          href="/"
          className="border border-ink/25 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ink hover:text-bg"
        >
          На главную
        </Link>
      </div>
    </main>
  );
}
