import Link from "next/link";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-1 flex-col items-center justify-center px-5 py-20 text-center">
      <Link
        href="/"
        className="font-display text-xl tracking-[0.3em] text-ink"
        aria-label={`${site.name} — на главную`}
      >
        {site.name}
      </Link>
      <p className="eyebrow mt-10 text-accent">Ошибка 404</p>
      <h1 className="mt-3 font-display text-3xl font-medium tracking-tight sm:text-4xl">
        Страница не найдена
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Возможно, предмет продан, ссылка устарела или адрес введён с ошибкой.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/catalog"
          className="bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-bg transition-colors hover:bg-ink/85"
        >
          В каталог
        </Link>
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
