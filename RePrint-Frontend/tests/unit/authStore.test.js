import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useAuthStore } from "../../src/stores/authStores";
import * as api from "../../src/apiReprint";

const TOKEN_KEY = "reprint_token";
const USER_KEY = "reprint_user";

describe("Auth store", () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it("is unauthenticated and not admin by default", () => {
    const auth = useAuthStore();
    expect(auth.isAuthenticated).toBe(false);
    expect(auth.isAdmin).toBe(false);
  });

  it("restores token and user from localStorage on creation", () => {
    localStorage.setItem(TOKEN_KEY, "abc123");
    localStorage.setItem(USER_KEY, JSON.stringify({ id: 1, role: "admin" }));
    const auth = useAuthStore();
    expect(auth.token).toBe("abc123");
    expect(auth.isAuthenticated).toBe(true);
    expect(auth.isAdmin).toBe(true);
  });

  it("login calls the API and exposes the session", async () => {
    const spy = vi.spyOn(api, "login").mockResolvedValue({
      user: { id: 1, email: "a@b.com", role: "user" },
    });
    localStorage.setItem(TOKEN_KEY, "token-from-login");

    const auth = useAuthStore();
    const data = await auth.login("a@b.com", "pass");
    expect(spy).toHaveBeenCalledWith("a@b.com", "pass");
    expect(data.user.role).toBe("user");
    expect(auth.user.role).toBe("user");
    expect(auth.isAuthenticated).toBe(true);
    expect(auth.isAdmin).toBe(false);
  });

  it("register calls the API and stores admin/session", async () => {
    const spy = vi.spyOn(api, "register").mockResolvedValue({
      user: { id: 2, name: "N", email: "n@b.com", role: "admin" },
    });
    localStorage.setItem(TOKEN_KEY, "t2");

    const auth = useAuthStore();
    await auth.register("N", "n@b.com", "pass");
    expect(spy).toHaveBeenCalledWith("N", "n@b.com", "pass");
    expect(auth.isAdmin).toBe(true);
  });

  it("logout clears token, user and localStorage", async () => {
    localStorage.setItem(TOKEN_KEY, "t");
    localStorage.setItem(USER_KEY, JSON.stringify({ id: 1, role: "admin" }));
    const auth = useAuthStore();
    auth.logout();
    expect(auth.isAuthenticated).toBe(false);
    expect(auth.user).toBeNull();
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(USER_KEY)).toBeNull();
  });

  it("isAdmin is false for non-admin users", () => {
    localStorage.setItem(TOKEN_KEY, "t");
    localStorage.setItem(USER_KEY, JSON.stringify({ id: 1, role: "user" }));
    const auth = useAuthStore();
    expect(auth.isAuthenticated).toBe(true);
    expect(auth.isAdmin).toBe(false);
  });
});
