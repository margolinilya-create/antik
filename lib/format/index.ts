import type { Currency, ConditionGrade, ItemStatus } from "@/types/database";

const currencyLocale: Record<Currency, string> = {
  RUB: "ru-RU",
  USD: "en-US",
  EUR: "de-DE",
};

/** "85 000 ₽" / "Цена по запросу". */
export function formatPrice(
  price: number | null,
  currency: Currency = "RUB",
  onRequest = false,
): string {
  if (onRequest || price == null) return "Цена по запросу";
  return new Intl.NumberFormat(currencyLocale[currency], {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

/** Dimensions in mm -> human "В 45 × Ш 20 см" (converted to cm). */
export function formatDimensions(d: {
  height_mm?: number | null;
  width_mm?: number | null;
  depth_mm?: number | null;
  diameter_mm?: number | null;
}): string | null {
  const parts: string[] = [];
  const cm = (mm: number) => (mm / 10).toLocaleString("ru-RU");
  if (d.height_mm) parts.push(`В ${cm(d.height_mm)}`);
  if (d.width_mm) parts.push(`Ш ${cm(d.width_mm)}`);
  if (d.depth_mm) parts.push(`Г ${cm(d.depth_mm)}`);
  if (d.diameter_mm) parts.push(`⌀ ${cm(d.diameter_mm)}`);
  if (parts.length === 0) return null;
  return `${parts.join(" × ")} см`;
}

export const conditionLabel: Record<ConditionGrade, string> = {
  mint: "Идеальное",
  excellent: "Отличное",
  good: "Хорошее",
  fair: "Удовлетворительное",
  restored: "Реставрировано",
  as_is: "Как есть",
};

export const statusLabel: Record<ItemStatus, string> = {
  draft: "Черновик",
  in_stock: "В наличии",
  reserved: "В резерве",
  sold: "Продано",
  archived: "В архиве",
};
