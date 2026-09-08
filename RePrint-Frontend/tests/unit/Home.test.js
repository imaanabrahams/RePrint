import { beforeEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";
import Home from "../../src/views/Home.vue";

describe("Home view", () => {
  let router;
  beforeEach(() => {
    setActivePinia(createPinia());
    router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: "/", component: Home }],
    });
  });

  it("renders the hero headline and CTAs", async () => {
    router.push("/");
    await router.isReady();
    const wrapper = mount(Home, { global: { plugins: [router] } });
    expect(wrapper.find(".hero-title").text()).toContain("Bring your photos");
    expect(wrapper.text()).toContain("Shop Now");
    expect(wrapper.text()).toContain("Create Your Own");
  });

  it("shows all three steps", async () => {
    router.push("/");
    await router.isReady();
    const wrapper = mount(Home, { global: { plugins: [router] } });
    expect(wrapper.text()).toContain("Three easy steps");
    expect(wrapper.findAll(".step")).toHaveLength(3);
  });

  it("renders testimonials", async () => {
    router.push("/");
    await router.isReady();
    const wrapper = mount(Home, { global: { plugins: [router] } });
    const cards = wrapper.findAll(".t-card");
    expect(cards.length).toBe(3);
    expect(wrapper.text()).toContain("Amelia Chen");
  });
});
