import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import Signup from "../../src/views/Signup.vue";
import { useAuthStore } from "../../src/stores/authStores";
import * as api from "../../src/apiReprint";

const push = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => ({ push }),
  RouterLink: { template: "<a><slot/></a>" },
}));

describe("Signup view", () => {
  let pinia;
  beforeEach(() => {
    localStorage.clear();
    push.mockClear();
    pinia = createPinia();
    setActivePinia(pinia);
  });

  it("renders the registration form", () => {
    const wrapper = mount(Signup, { global: { plugins: [pinia] } });
    expect(wrapper.text()).toContain("Create your account");
    expect(wrapper.findAll("input")).toHaveLength(4);
  });

  it("does not submit when fields are missing", async () => {
    const spy = vi.spyOn(api, "register").mockResolvedValue({ user: {} });
    const wrapper = mount(Signup, { global: { plugins: [pinia] } });
    await wrapper.find("form").trigger("submit");
    expect(spy).not.toHaveBeenCalled();
  });

  it("does not submit when passwords do not match", async () => {
    const spy = vi.spyOn(api, "register").mockResolvedValue({ user: {} });
    const wrapper = mount(Signup, { global: { plugins: [pinia] } });
    const inputs = wrapper.findAll("input");
    await inputs[0].setValue("Jane");
    await inputs[1].setValue("jane@x.com");
    await inputs[2].setValue("secret1");
    await inputs[3].setValue("secret2");
    await wrapper.find("form").trigger("submit");
    expect(spy).not.toHaveBeenCalled();
  });

  it("registers successfully and redirects home", async () => {
    vi.spyOn(api, "register").mockResolvedValue({
      user: { id: 1, name: "Jane", role: "user" },
    });
    localStorage.setItem("reprint_token", "t");
    const wrapper = mount(Signup, { global: { plugins: [pinia] } });
    const inputs = wrapper.findAll("input");
    await inputs[0].setValue("Jane");
    await inputs[1].setValue("jane@x.com");
    await inputs[2].setValue("secret1");
    await inputs[3].setValue("secret1");
    await wrapper.find("form").trigger("submit");
    await new Promise((r) => setTimeout(r, 10));
    expect(push).toHaveBeenCalledWith("/");
  });

  it("shows an error when registration fails", async () => {
    vi.spyOn(api, "register").mockRejectedValue(new Error("Email in use"));
    const wrapper = mount(Signup, { global: { plugins: [pinia] } });
    const inputs = wrapper.findAll("input");
    await inputs[0].setValue("Jane");
    await inputs[1].setValue("jane@x.com");
    await inputs[2].setValue("secret1");
    await inputs[3].setValue("secret1");
    await wrapper.find("form").trigger("submit");
    await new Promise((r) => setTimeout(r, 10));
    expect(wrapper.find(".error").exists()).toBe(true);
    expect(wrapper.text()).toContain("Email in use");
  });
});
