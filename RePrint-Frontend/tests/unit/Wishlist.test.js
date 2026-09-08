import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import Wishlist from "../../src/views/Wishlist.vue";
import { useWishlistStore } from "../../src/stores/wishlistStores";
import { useCartStore } from "../../src/stores/cartStores";

const push = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => ({ push }),
  RouterLink: { template: "<a><slot/></a>" },
}));
vi.mock("../../src/components/RatingstarsComp.vue", () => ({
  default: { template: "<span class='mock-rating'/>" },
}));

const product = { id: 1, name: "Vase", category: "Home", price: 200, rating: 4, image: "/v.png" };

describe("Wishlist view", () => {
  let pinia;
  beforeEach(() => {
    push.mockClear();
    pinia = createPinia();
    setActivePinia(pinia);
  });

  it("shows the empty state when there are no wishlist items", () => {
    const wrapper = mount(Wishlist, { global: { plugins: [pinia] } });
    expect(wrapper.text()).toContain("Your wishlist is empty");
  });

  it("lists wishlisted products with their price", () => {
    const wishlist = useWishlistStore();
    wishlist.add(product);
    const wrapper = mount(Wishlist, { global: { plugins: [pinia] } });
    expect(wrapper.findAll(".card")).toHaveLength(1);
    expect(wrapper.text()).toContain("Vase");
    expect(wrapper.text()).toContain("1 item saved");
  });

  it("adds a wishlisted product to the cart", async () => {
    const wishlist = useWishlistStore();
    const cart = useCartStore();
    wishlist.add(product);
    const wrapper = mount(Wishlist, { global: { plugins: [pinia] } });
    await wrapper.find(".add").trigger("click");
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].id).toBe(1);
  });

  it("removes a product from the wishlist", async () => {
    const wishlist = useWishlistStore();
    wishlist.add(product);
    const wrapper = mount(Wishlist, { global: { plugins: [pinia] } });
    await wrapper.find(".wish").trigger("click");
    expect(wishlist.isWished(1)).toBe(false);
  });

  it("navigates to the product page", async () => {
    const wishlist = useWishlistStore();
    wishlist.add(product);
    const wrapper = mount(Wishlist, { global: { plugins: [pinia] } });
    await wrapper.find(".thumb").trigger("click");
    expect(push).toHaveBeenCalledWith("/product/1");
  });
});
