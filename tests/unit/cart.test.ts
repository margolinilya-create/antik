// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { useCart, type CartItem } from "@/lib/cart/store";

const sample: CartItem = {
  slug: "samovar-ryumka-batashev",
  title: "Самовар «рюмка»",
  price: 72000,
  currency: "RUB",
  price_on_request: false,
  image: null,
};

describe("cart store", () => {
  beforeEach(() => useCart.setState({ items: [] }));

  it("adds an item", () => {
    useCart.getState().add(sample);
    expect(useCart.getState().items).toHaveLength(1);
    expect(useCart.getState().has(sample.slug)).toBe(true);
  });

  it("does not add duplicates by slug", () => {
    useCart.getState().add(sample);
    useCart.getState().add(sample);
    expect(useCart.getState().items).toHaveLength(1);
  });

  it("removes an item", () => {
    useCart.getState().add(sample);
    useCart.getState().remove(sample.slug);
    expect(useCart.getState().items).toHaveLength(0);
    expect(useCart.getState().has(sample.slug)).toBe(false);
  });

  it("clears all items", () => {
    useCart.getState().add(sample);
    useCart.getState().add({ ...sample, slug: "other" });
    useCart.getState().clear();
    expect(useCart.getState().items).toHaveLength(0);
  });
});
