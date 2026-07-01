/**
 * Thin site-wide trust strip ("authenticated · insured · delivered"),
 * shown above the header on every storefront page. Compact echo of the
 * homepage GuaranteesStrip — kept to one line.
 */
const POINTS = [
  "Гарантия подлинности",
  "Страхование и музейная упаковка",
  "Доставка по РФ и миру",
  "Персональный подбор",
];

export function TrustBar() {
  return (
    <div className="border-b border-line bg-elevated/60">
      <div className="mx-auto flex max-w-[1280px] items-center justify-center gap-x-6 gap-y-1 overflow-x-auto whitespace-nowrap px-5 py-2 text-[0.62rem] uppercase tracking-[0.16em] text-faint">
        {POINTS.map((p, i) => (
          <span key={p} className="flex items-center gap-x-6">
            {i > 0 && <span aria-hidden className="text-line">·</span>}
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}
