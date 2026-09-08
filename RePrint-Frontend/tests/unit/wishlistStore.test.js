import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useWishlistStore } from "../../src/stores/wishlistStores";

const productA = { id: 1, name: "A" };
const productB = { id: 2, name: "B" };

describe("Wishlist store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("starts empty", () => {
    const wishlist = useWishlistStore();
    expect(wishlist.items).toEqual([]);
    expect(wishlist.count).toBe(0);
  });

  it("adds an item via toggle when absent", () => {
    const wishlist = useWishlistStore();
    wishlist.toggle(productA);
    expect(wishlist.items).toHaveLength(1);
    expect(wishlist.isWished(1)).toBe(true);
    expect(wishlist.count).toBe(1);
  });

  it("removes an item via toggle when present", () => {
    const wishlist = useWishlistStore();
    wishlist.toggle(productA);
    wishlist.toggle(productA);
    expect(wishlist.items).toHaveLength(0);
    expect(wishlist.isWished(1)).toBe(false);
  });

  it("add does not create duplicates", () => {
    const wishlist = useWishlistStore();
    wishlist.add(productA);
    wishlist.add(productA);
    expect(wishlist.items).toHaveLength(1);
  });

  it("remove removes an item by id", () => {
    const wishlist = useWishlistStore();
    wishlist.add(productA);
    wishlist.add(productB);
    wishlist.remove(1);
    expect(wishlist.items).toHaveLength(1);
    expect(wishlist.items[0].id).toBe(2);
  });

  it("isWished reflects presence", () => {
    const wishlist = useWishlistStore();
    expect(wishlist.isWished(1)).toBe(false);
    wishlist.add(productA);
    expect(wishlist.isWished(1)).toBe(true);
  });
});
