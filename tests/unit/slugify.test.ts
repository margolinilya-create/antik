import { describe, it, expect } from "vitest";
import { slugify, cn } from "@/lib/utils";

describe("slugify", () => {
  it("transliterates Cyrillic to a clean ASCII slug", () => {
    const s = slugify("Самовар жаровой, Тула");
    expect(s).toMatch(/^[a-z0-9-]+$/);
    expect(s).toContain("samovar");
    expect(s).not.toMatch(/\s/);
  });

  it("collapses separators and trims dashes", () => {
    expect(slugify("  Чайная   пара!!! ")).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("lowercases latin input", () => {
    expect(slugify("Imperial Porcelain")).toBe("imperial-porcelain");
  });
});

describe("cn", () => {
  it("merges and dedupes tailwind classes", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-ink", false && "hidden", "font-medium")).toContain("text-ink");
  });
});
