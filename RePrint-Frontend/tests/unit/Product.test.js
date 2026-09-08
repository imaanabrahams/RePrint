import { beforeEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";
import Product from "../../src/views/Product.vue";
import { useProductsStore } from "../../src/stores/productsStores";
import { useCartStore } from "../../src/stores/cartStores";

describe("Product view", () => {
  let router;
  beforeEach(async () => {
    setActivePinia(createPinia());
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/product/:id", component: Product, props: true },
        { path: "/", component: { template: "<div />" } },
      ],
    });
    router.push("/product/1");
    await router.isReady();
  });

  it("renders the product details", () => {
    const products = useProductsStore();
    const product = products.byId(1);
    const wrapper = mount(Product, {
      props: { id: 1 },
      global: { plugins: [router] },
    });
    expect(wrapper.find(".title").text()).toBe(product.name);
    expect(wrapper.text()).toContain(product.category);
    expect(wrapper.find(".desc").text()).toBe(product.description);
  });

  it("selects the first option by default", async () => {
    const wrapper = mount(Product, {
      props: { id: 1 },
      global: { plugins: [router] },
    });
    await new Promise((r) => setTimeout(r, 0));
    expect(wrapper.find(".opt.active").text()).not.toBe("");
  });

  it("adds the product to the cart with quantity and option", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const cart = useCartStore();
    const wrapper = mount(Product, {
      props: { id: 1 },
      global: { plugins: [router] },
    });
    await wrapper.find(".add-btn").trigger("click");
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].id).toBe(1);
    expect(cart.items[0].quantity).toBe(1);
  });

  it("shows added feedback after adding to cart", async () => {
    const wrapper = mount(Product, {
      props: { id: 1 },
      global: { plugins: [router] },
    });
    await wrapper.find(".add-btn").trigger("click");
    await new Promise((r) => setTimeout(r, 10));
    expect(wrapper.find(".add-btn").text()).toContain("Added to cart!");
  });

  it("renders product not found for an invalid id", async () => {
    await router.push("/product/999");
    await router.isReady();
    const wrapper = mount(Product, {
      props: { id: 999 },
      global: { plugins: [router] },
    });
    expect(wrapper.find(".notfound").exists()).toBe(true);
    expect(wrapper.text()).toContain("Product not found");
  });
});
