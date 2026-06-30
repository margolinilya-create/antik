import { ShieldCheck, BadgeCheck, Truck, RotateCcw } from "lucide-react";
import { guarantees } from "@/lib/site";

const icons = [ShieldCheck, BadgeCheck, Truck, RotateCcw];

export function GuaranteesStrip() {
  return (
    <section className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
      {guarantees.map((g, i) => {
        const Icon = icons[i] ?? ShieldCheck;
        return (
          <div key={g.title} className="bg-bg p-6">
            <Icon className="size-6 text-ink" strokeWidth={1} aria-hidden />
            <h3 className="mt-4 text-sm font-medium tracking-tight text-ink">
              {g.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{g.text}</p>
          </div>
        );
      })}
    </section>
  );
}
