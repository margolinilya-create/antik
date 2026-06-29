import { describe, it, expect } from "vitest";
import {
  formatPrice,
  formatDimensions,
  conditionLabel,
  statusLabel,
} from "@/lib/format";

describe("formatPrice", () => {
  it("formats RUB with the ruble sign and the amount", () => {
    const s = formatPrice(85000, "RUB");
    expect(s).toContain("₽");
    expect(s.replace(/\s/g, "")).toContain("85000");
  });

  it("returns 'Цена по запросу' when on request", () => {
    expect(formatPrice(24000, "RUB", true)).toBe("Цена по запросу");
  });

  it("returns 'Цена по запросу' when price is null", () => {
    expect(formatPrice(null, "RUB")).toBe("Цена по запросу");
  });

  it("supports other currencies", () => {
    expect(formatPrice(100, "USD")).toContain("$");
    expect(formatPrice(100, "EUR")).toContain("€");
  });
});

describe("formatDimensions", () => {
  it("converts mm to cm and labels them", () => {
    const s = formatDimensions({ height_mm: 450, width_mm: 200 });
    expect(s).toContain("В 45");
    expect(s).toContain("Ш 20");
    expect(s).toContain("см");
  });

  it("returns null when no dimensions given", () => {
    expect(formatDimensions({})).toBeNull();
  });

  it("handles diameter", () => {
    expect(formatDimensions({ diameter_mm: 340 })).toContain("⌀ 34");
  });
});

describe("labels", () => {
  it("maps conditions and statuses to Russian", () => {
    expect(conditionLabel.mint).toBe("Идеальное");
    expect(conditionLabel.restored).toBe("Реставрировано");
    expect(statusLabel.in_stock).toBe("В наличии");
    expect(statusLabel.sold).toBe("Продано");
    expect(statusLabel.reserved).toBe("В резерве");
  });
});
