import { Star } from "lucide-react";
import type { Testimonial } from "@/lib/queries/content";

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;
  return (
    <section>
      <div className="mb-8 flex items-center gap-6">
        <p className="eyebrow text-accent">Отзывы коллекционеров</p>
        <div className="gold-rule flex-1" />
      </div>
      <div className="grid gap-px border border-line bg-line md:grid-cols-3">
        {items.slice(0, 3).map((t) => (
          <figure key={t.id} className="flex flex-col bg-bg p-7">
            <div className="flex gap-0.5" aria-label={`Оценка ${t.rating} из 5`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`size-3.5 ${i < t.rating ? "fill-accent text-accent" : "text-faint"}`}
                  strokeWidth={1}
                  aria-hidden
                />
              ))}
            </div>
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink/85">
              «{t.text_ru}»
            </blockquote>
            <figcaption className="mt-5 text-[0.72rem] uppercase tracking-[0.12em] text-faint">
              {t.author_name}
              {t.author_role ? ` · ${t.author_role}` : ""}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
