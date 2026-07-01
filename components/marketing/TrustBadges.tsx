import { ShieldCheck, Truck, Search } from "lucide-react";

const badges = [
  { Icon: ShieldCheck, label: "Подлинность гарантирована" },
  { Icon: Truck, label: "Страховка и доставка" },
  { Icon: Search, label: "Персональный подбор" },
];

/** Compact trust row shown next to the item CTA. */
export function TrustBadges() {
  return (
    <ul className="grid grid-cols-3 gap-2 border-y border-line py-4">
      {badges.map(({ Icon, label }) => (
        <li key={label} className="flex flex-col items-center gap-2 text-center">
          <Icon className="size-5 text-ink" strokeWidth={1} aria-hidden />
          <span className="text-[0.68rem] leading-tight text-muted">{label}</span>
        </li>
      ))}
    </ul>
  );
}
