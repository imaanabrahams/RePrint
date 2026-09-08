import { beforeEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import Footer from "../../src/components/FooterComp.vue";

describe("Footer", () => {
  let pinia;
  beforeEach(() => {
    localStorage.clear();
    pinia = createPinia();
    setActivePinia(pinia);
  });

  it("renders the brand and company information", () => {
    const wrapper = mount(Footer, { global: { plugins: [pinia] } });
    expect(wrapper.text()).toContain("RePrint");
    expect(wrapper.text()).toContain("hello@reprint.com");
    expect(wrapper.text()).toContain("+27 987 3456");
  });

  it("renders shop and company navigation links", () => {
    const wrapper = mount(Footer, { global: { plugins: [pinia] } });
    expect(wrapper.text()).toContain("All Products");
    expect(wrapper.text()).toContain("Create Your Own");
    expect(wrapper.text()).toContain("Contact Us");
  });

  it("shows the current year in the copyright", () => {
    const wrapper = mount(Footer, { global: { plugins: [pinia] } });
    const year = new Date().getFullYear();
    expect(wrapper.text()).toContain(`© ${year} RePrint. All rights reserved.`);
  });

  it("hides the staff column for non-admins", () => {
    const wrapper = mount(Footer, { global: { plugins: [pinia] } });
    expect(wrapper.text()).not.toContain("Admin log in");
  });

  it("shows the staff column for admins", () => {
    localStorage.setItem("reprint_token", "t");
    localStorage.setItem(
      "reprint_user",
      JSON.stringify({ id: 1, role: "admin" }),
    );
    const wrapper = mount(Footer, { global: { plugins: [pinia] } });
    expect(wrapper.text()).toContain("Admin log in");
  });
});
