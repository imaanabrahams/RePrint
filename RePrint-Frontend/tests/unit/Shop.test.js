import { beforeEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";
import Shop from "../../src/views/Shop.vue";
import { useProductsStore } from "../../src/stores/productsStores";

describe("Shop view", () => {
  let router;
  beforeEach(async () => {
    setActivePinia(createPinia());
    router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: "/", component: Shop }],
    });
    router.push("/");
    await router.isReady();
  });

  it("renders all products initially", () => {
    const wrapper = mount(Shop, { global: { plugins: [router] } });
    expect(wrapper.findAll(".card")).toHaveLength(10);
  });

  it("filters products by category", async () => {
    const wrapper = mount(Shop, { global: { plugins: [router] } });
    const buttons = wrapper.findAll(".cat");
    const garden = buttons.find((b) => b.text().trim() === "Garden");
    await garden.trigger("click");
    const cards = wrapper.findAll(".card");
    expect(cards.length).toBeGreaterThan(0);
    expect(cards.every((c) => c.find(".cat").text() === "Garden")).toBe(true);
  });

  it("shows the item count", () => {
    const wrapper = mount(Shop, { global: { plugins: [router] } });
    expect(wrapper.find(".count").text()).toContain("10 items");
  });

  it("renders a category sidebar and promo box", () => {
    const wrapper = mount(Shop, { global: { plugins: [router] } });
    expect(wrapper.text()).toContain("Categories");
    expect(wrapper.text()).toContain("Need something unique?");
  });
});
