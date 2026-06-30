"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "antik-cookie-consent";

/** Lightweight cookie/localStorage consent banner (RU). One-time, dismissible. */
export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let accepted = false;
    try {
      accepted = !!localStorage.getItem(KEY);
    } catch {
      accepted = true; // storage blocked — don't nag
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!accepted) setShow(true);
  }, []);

  if (!show) return null;

  function accept() {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1280px] flex-col items-start gap-3 px-5 py-4 text-xs leading-relaxed text-muted sm:flex-row sm:items-center sm:justify-between sm:text-sm">
        <p>
          Мы используем cookie и локальное хранилище для работы сайта и аналитики.
          Продолжая пользоваться сайтом, вы соглашаетесь с{" "}
          <Link
            href="/politika-konfidencialnosti"
            className="text-accent hover:underline"
          >
            Политикой конфиденциальности
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 bg-ink px-5 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-bg transition-colors hover:bg-ink/85"
        >
          Принять
        </button>
      </div>
    </div>
  );
}
