import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useCartStore } from "../../src/stores/cartStores";

const product = { id: 1, name: "Sample", price: 100 };

describe("Cart store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("starts with an empty cart", () => {
    const cart = useCartStore();
    expect(cart.items).toEqual([]);
    expect(cart.count).toBe(0);
    expect(cart.subtotal).toBe(0);
  });

  it("adds a new item to the cart", () => {
    const cart = useCartStore();
    cart.addToCart(product, 2, "Large");
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0]).toMatchObject({ id: 1, option: "Large", quantity: 2 });
    expect(cart.count).toBe(2);
    expect(cart.subtotal).toBe(200);
  });

  it("increments quantity when the same item+option is added again", () => {
    const cart = useCartStore();
    cart.addToCart(product, 2, "Large");
    cart.addToCart(product, 3, "Large");
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].quantity).toBe(5);
    expect(cart.count).toBe(5);
  });

  it("treats different options as separate line items", () => {
    const cart = useCartStore();
    cart.addToCart(product, 1, "Small");
    cart.addToCart(product, 1, "Large");
    expect(cart.items).toHaveLength(2);
    expect(cart.count).toBe(2);
  });

  it("normalizes an empty option to a default key", () => {
    const cart = useCartStore();
    cart.addToCart(product, 1, "");
    cart.addToCart(product, 1, "default");
    expect(cart.items).toHaveLength(1);
  });

  it("updateQuantity sets a specific quantity", () => {
    const cart = useCartStore();
    cart.addToCart(product, 2, "Large");
    cart.updateQuantity(1, 4, "Large");
    expect(cart.items[0].quantity).toBe(4);
    expect(cart.subtotal).toBe(400);
  });

  it("updateQuantity removes the item when reaching zero or below", () => {
    const cart = useCartStore();
    cart.addToCart(product, 2, "Large");
    cart.updateQuantity(1, 0, "Large");
    expect(cart.items).toHaveLength(0);

    cart.addToCart(product, 2, "Large");
    cart.updateQuantity(1, -1, "Large");
    expect(cart.items).toHaveLength(0);
  });

  it("updateQuantity ignores unknown items", () => {
    const cart = useCartStore();
    cart.addToCart(product, 2);
    cart.updateQuantity(999, 5);
    expect(cart.items[0].quantity).toBe(2);
  });

  it("removeFromCart removes the matching line item", () => {
    const cart = useCartStore();
    cart.addToCart(product, 1, "Small");
    cart.addToCart(product, 1, "Large");
    cart.removeFromCart(1, "Small");
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].option).toBe("Large");
  });

  it("clear empties the cart", () => {
    const cart = useCartStore();
    cart.addToCart(product, 1);
    cart.addToCart({ id: 2, name: "B", price: 50 }, 3);
    cart.clear();
    expect(cart.items).toHaveLength(0);
    expect(cart.count).toBe(0);
    expect(cart.subtotal).toBe(0);
  });

  it("computes subtotal by summing price * quantity across items", () => {
    const cart = useCartStore();
    cart.addToCart({ id: 1, price: 100 }, 2);
    cart.addToCart({ id: 2, price: 50 }, 3);
    expect(cart.subtotal).toBe(350);
  });
});
