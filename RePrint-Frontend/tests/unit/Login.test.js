import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { useAuthStore } from "../../src/stores/authStores";
import Login from "../../src/views/Login.vue";
import * as api from "../../src/apiReprint";

const push = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => ({ push }),
  RouterLink: { template: "<a><slot/></a>" },
}));

describe("Login view", () => {
  let pinia;
  beforeEach(() => {
    localStorage.clear();
    push.mockClear();
    pinia = createPinia();
    setActivePinia(pinia);
  });

  it("renders the login form", () => {
    const wrapper = mount(Login, { global: { plugins: [pinia] } });
    expect(wrapper.text()).toContain("Welcome back");
    expect(wrapper.find("input[type=email]").exists()).toBe(true);
    expect(wrapper.find("input[type=password]").exists()).toBe(true);
    expect(wrapper.find("button[type=submit]").text()).toBe("Log in");
  });

  it("does not submit when fields are empty", async () => {
    const spy = vi.spyOn(api, "login").mockResolvedValue({ user: {} });
    const wrapper = mount(Login, { global: { plugins: [pinia] } });
    await wrapper.find("form").trigger("submit");
    expect(spy).not.toHaveBeenCalled();
  });

  it("logs in successfully and redirects home", async () => {
    vi.spyOn(api, "login").mockResolvedValue({
      user: { id: 1, email: "a@b.com", role: "user" },
    });
    localStorage.setItem("reprint_token", "t");
    const wrapper = mount(Login, { global: { plugins: [pinia] } });
    await wrapper.find("input[type=email]").setValue("a@b.com");
    await wrapper.find("input[type=password]").setValue("secret");
    await wrapper.find("form").trigger("submit");
    await new Promise((r) => setTimeout(r, 10));
    expect(push).toHaveBeenCalledWith("/");
  });

  it("shows an error message on failed login", async () => {
    vi.spyOn(api, "login").mockRejectedValue(new Error("Bad credentials"));
    const wrapper = mount(Login, { global: { plugins: [pinia] } });
    await wrapper.find("input[type=email]").setValue("a@b.com");
    await wrapper.find("input[type=password]").setValue("wrong");
    await wrapper.find("form").trigger("submit");
    await new Promise((r) => setTimeout(r, 10));
    expect(wrapper.find(".error").exists()).toBe(true);
    expect(wrapper.text()).toContain("Bad credentials");
  });
});
