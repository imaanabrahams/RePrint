import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { RouterLink } from "vue-router";
import { useAuthStore } from "../../src/stores/authStores";
import { useCartStore } from "../../src/stores/cartStores";
import { useWishlistStore } from "../../src/stores/wishlistStores";
import Navbar from "../../src/components/NavbarComp.vue";

vi.mock("vue-router", async (orig) => {
  const actual = await orig();
  return {
    ...actual,
    useRoute: () => ({ path: "/" }),
    useRouter: () => ({ push: vi.fn() }),
  };
});

describe("Navbar", () => {
  let pinia;
  beforeEach(() => {
    localStorage.clear();
    pinia = createPinia();
    setActivePinia(pinia);
  });

  it("renders the public navigation links", () => {
    const wrapper = mount(Navbar, {
      global: { plugins: [pinia] },
    });
    const text = wrapper.text();
    expect(text).toContain("Home");
    expect(text).toContain("Shop");
    expect(text).toContain("Create");
    expect(text).toContain("Contact");
  });

  it("shows the sign up CTA when unauthenticated", () => {
    const wrapper = mount(Navbar, { global: { plugins: [pinia] } });
    expect(wrapper.find(".nav-cta").text()).toBe("Sign Up");
  });

  it("shows the account CTA when authenticated", () => {
    localStorage.setItem("reprint_token", "t");
    localStorage.setItem(
      "reprint_user",
      JSON.stringify({ id: 1, role: "user" }),
    );
    const wrapper = mount(Navbar, { global: { plugins: [pinia] } });
    expect(wrapper.find(".nav-cta").text()).toBe("Account");
  });

  it("adds the HR system link for admins", () => {
    localStorage.setItem("reprint_token", "t");
    localStorage.setItem(
      "reprint_user",
      JSON.stringify({ id: 1, role: "admin" }),
    );
    const wrapper = mount(Navbar, { global: { plugins: [pinia] } });
    expect(wrapper.text()).toContain("HR System");
  });

  it("does not show the HR system link for regular users", () => {
    localStorage.setItem("reprint_token", "t");
    localStorage.setItem(
      "reprint_user",
      JSON.stringify({ id: 1, role: "user" }),
    );
    const wrapper = mount(Navbar, { global: { plugins: [pinia] } });
    expect(wrapper.text()).not.toContain("HR System");
  });

  it("displays cart and wishlist badge counts", () => {
    const cart = useCartStore();
    const wishlist = useWishlistStore();
    cart.addToCart({ id: 1, name: "A", price: 10 }, 2);
    wishlist.add({ id: 2, name: "B" });
    const wrapper = mount(Navbar, { global: { plugins: [pinia] } });
    const counts = wrapper.findAll(".count");
    expect(counts.length).toBe(2);
    expect(counts[0].text()).toBe("1");
    expect(counts[1].text()).toBe("2");
  });
});
