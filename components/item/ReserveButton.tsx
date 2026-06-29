"use client";

import Link from "next/link";
import type { ItemStatus } from "@/types/database";

/**
 * Lead entry point. Routes to the inquiry/checkout form pre-filled with this
 * item. Cart-lite wiring (zustand) lands in phase 4; for now it's a direct
 * "оставить заявку" link, which already drives the deal funnel.
 */
export function ReserveButton({
  slug,
  status,
}: {
  slug: string;
  status: ItemStatus;
}) {
  if (status === "sold") {
    return (
      <button
        disabled
        className="w-full cursor-not-allowed border border-line px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-faint"
      >
        Продано
      </button>
    );
  }
  return (
    <Link
      href={`/checkout?item=${slug}`}
      className="block w-full bg-accent px-5 py-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-onaccent transition-colors hover:bg-accent-soft"
    >
      {status === "reserved" ? "Узнать о предмете" : "Запросить предмет"}
    </Link>
  );
}
