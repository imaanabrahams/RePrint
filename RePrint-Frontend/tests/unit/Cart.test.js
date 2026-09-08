import { beforeEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";
import Cart from "../../src/views/Cart.vue";
import { useCartStore } from "../../src/stores/cartStores";

const product = { id: 1, name: "Mug", category: "Office", price: 100, image: "/m.png" };

function mountCart(pinia, router) {
  return mount(Cart, { global: { plugins: [pinia, router] } });
}

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [{ path: "/", component: { template: "<div/>" } }],
  });
}

describe("Cart view", () => {
  let pinia;
  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  it("shows the empty state when the cart has no items", () => {
    const wrapper = mountCart(pinia, makeRouter());
    expect(wrapper.text()).toContain("Your cart is empty");
    expect(wrapper.find(".empty").exists()).toBe(true);
  });

  it("lists cart items with a summary", () => {
    const cart = useCartStore();
    cart.addToCart({ ...product }, 2, "Large");
    const wrapper = mountCart(pinia, makeRouter());
    expect(wrapper.findAll(".item")).toHaveLength(1);
    expect(wrapper.text()).toContain("Order summary");
  });

  it("increments the quantity via the stepper", async () => {
    const cart = useCartStore();
    cart.addToCart({ ...product }, 1, "Large");
    const wrapper = mountCart(pinia, makeRouter());
    const plus = wrapper.findAll(".stepper button")[1];
    await plus.trigger("click");
    expect(cart.items[0].quantity).toBe(2);
  });

  it("removes an item via the remove button", async () => {
    const cart = useCartStore();
    cart.addToCart({ ...product }, 1, "Large");
    const wrapper = mountCart(pinia, makeRouter());
    await wrapper.find(".remove").trigger("click");
    expect(cart.items).toHaveLength(0);
  });

  it("charges shipping when subtotal is below R1000", () => {
    const cart = useCartStore();
    cart.addToCart({ ...product, price: 100 }, 1);
    const wrapper = mountCart(pinia, makeRouter());
    expect(wrapper.find(".line").text()).toContain("Subtotal");
    expect(wrapper.text()).toContain("R80");
  });

  it("offers free shipping when subtotal reaches R1000", () => {
    const cart = useCartStore();
    cart.addToCart({ ...product, price: 1000 }, 1);
    const wrapper = mountCart(pinia, makeRouter());
    expect(wrapper.text()).toContain("Free");
  });

  it("checkout clears the cart", async () => {
    const cart = useCartStore();
    cart.addToCart({ ...product }, 1);
    const wrapper = mountCart(pinia, makeRouter());
    await wrapper.find(".checkout").trigger("click");
    expect(cart.items).toHaveLength(0);
  });
});
