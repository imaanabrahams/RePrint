import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import ProductCard from "../../src/components/ProductcardComp.vue";
import { useCartStore } from "../../src/stores/cartStores";
import { useWishlistStore } from "../../src/stores/wishlistStores";

const pushMock = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => ({ push: pushMock }),
  useRoute: () => ({ path: "/shop" }),
}));

const product = {
  id: 5,
  name: "Test Mug",
  category: "Office",
  price: 249,
  rating: 4.5,
  reviews: 12,
  image: "/img.png",
};

describe("ProductCard", () => {
  beforeEach(() => {
    pushMock.mockClear();
    setActivePinia(createPinia());
  });

  it("renders product name, category and formatted price", () => {
    const wrapper = mount(ProductCard, {
      props: { product },
      global: { plugins: [createPinia()] },
    });
    expect(wrapper.find(".name").text()).toBe("Test Mug");
    expect(wrapper.find(".cat").text()).toBe("Office");
    expect(wrapper.find(".price").text()).toContain("R249");
  });

  it("adds the product to the cart", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const cart = useCartStore();
    const wrapper = mount(ProductCard, {
      props: { product },
      global: { plugins: [pinia] },
    });
    await wrapper.find(".add").trigger("click");
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].id).toBe(5);
  });

  it("toggles the product in the wishlist", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wishlist = useWishlistStore();
    const wrapper = mount(ProductCard, {
      props: { product },
      global: { plugins: [pinia] },
    });
    await wrapper.find(".wish").trigger("click");
    expect(wishlist.isWished(5)).toBe(true);
    await wrapper.find(".wish").trigger("click");
    expect(wishlist.isWished(5)).toBe(false);
  });

  it("navigates to the product detail page", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mount(ProductCard, {
      props: { product },
      global: { plugins: [pinia] },
    });
    await wrapper.find(".thumb").trigger("click");
    expect(pushMock).toHaveBeenCalledWith("/product/5");
  });

  it("applies the light variant class", () => {
    const wrapper = mount(ProductCard, {
      props: { product, variant: "light" },
      global: { plugins: [createPinia()] },
    });
    expect(wrapper.find(".card").classes()).toContain("light");
  });
});
