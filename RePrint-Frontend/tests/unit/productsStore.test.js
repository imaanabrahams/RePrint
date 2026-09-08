import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useProductsStore } from "../../src/stores/productsStores";
import * as api from "../../src/apiReprint";

describe("Products store", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
    setActivePinia(createPinia());
  });

  it("is initialized from the local catalog", () => {
    const products = useProductsStore();
    expect(products.products.length).toBeGreaterThan(0);
    expect(products.source).toBe("local");
    expect(products.loaded).toBe(false);
  });

  it("byId find a product by numeric id", () => {
    const products = useProductsStore();
    const found = products.byId(1);
    expect(found).toBeDefined();
    expect(found.id).toBe(1);
    expect(products.byId(999)).toBeUndefined();
  });

  it("featured returns only featured products", () => {
    const products = useProductsStore();
    const featured = products.featured;
    expect(featured.length).toBeGreaterThan(0);
    expect(featured.every((p) => p.featured)).toBe(true);
  });

  it("load uses the API catalog when the response has images", async () => {
    vi.spyOn(api.api, "get").mockResolvedValue([
      {
        id: 1,
        name: "X",
        category: "Home",
        base_price: "100",
        rating: 4.5,
        reviews: 10,
        image_url: "/images/x.png",
        description: "d",
        options: '["Small","Large"]',
        featured: 1,
      },
    ]);
    const products = useProductsStore();
    await products.load();
    expect(products.source).toBe("api");
    expect(products.loaded).toBe(true);
    expect(products.products[0].name).toBe("X");
    expect(products.products[0].options).toEqual(["Small", "Large"]);
    expect(products.products[0].featured).toBe(true);
  });

  it("falls back to local catalog when the API has no products", async () => {
    const getSpy = vi.spyOn(api.api, "get").mockResolvedValue([]);
    const products = useProductsStore();
    await products.load();
    expect(products.source).toBe("local");
    expect(products.loaded).toBe(true);
    expect(products.products.length).toBeGreaterThan(0);
    expect(getSpy).toHaveBeenCalledWith("/products");
  });

  it("falls back to local catalog when the API request throws", async () => {
    vi.spyOn(api.api, "get").mockRejectedValue(new Error("network"));
    const products = useProductsStore();
    await products.load();
    expect(products.source).toBe("local");
    expect(products.loaded).toBe(true);
  });
});
