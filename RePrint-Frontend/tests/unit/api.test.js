import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "../../src/apiReprint";

const TOKEN_KEY = "reprint_token";
const USER_KEY = "reprint_user";

describe("session helpers", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it("getToken returns the stored token or null", () => {
    expect(api.getToken()).toBeNull();
    localStorage.setItem(TOKEN_KEY, "tok");
    expect(api.getToken()).toBe("tok");
  });

  it("setSession stores token and user", () => {
    api.setSession({ token: "t", user: { id: 1 } });
    expect(localStorage.getItem(TOKEN_KEY)).toBe("t");
    expect(JSON.parse(localStorage.getItem(USER_KEY))).toEqual({ id: 1 });
  });

  it("getStoredUser parses the user from storage", () => {
    expect(api.getStoredUser()).toBeNull();
    localStorage.setItem(USER_KEY, JSON.stringify({ id: 7, role: "admin" }));
    expect(api.getStoredUser()).toEqual({ id: 7, role: "admin" });
  });

  it("getStoredUser returns null when the payload is invalid JSON", () => {
    localStorage.setItem(USER_KEY, "{bad json");
    expect(api.getStoredUser()).toBeNull();
  });

  it("clearSession removes token and user", () => {
    localStorage.setItem(TOKEN_KEY, "t");
    localStorage.setItem(USER_KEY, "{}");
    api.clearSession();
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(USER_KEY)).toBeNull();
  });
});

describe("API data functions", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it("getOrders returns mock orders when the request fails", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("down"));
    const orders = await api.getOrders();
    expect(Array.isArray(orders)).toBe(true);
    expect(orders.length).toBeGreaterThan(0);
  });

  it("getMaterials returns mock materials when the request fails", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("down"));
    const materials = await api.getMaterials();
    expect(materials.length).toBe(6);
  });

  it("getEmployees returns mock employees when the request fails", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("down"));
    const employees = await api.getEmployees();
    expect(employees.length).toBeGreaterThan(0);
  });

  it("getNotifications returns mock notifications when the request fails", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("down"));
    const notifications = await api.getNotifications();
    expect(notifications.length).toBeGreaterThan(0);
  });

  it("login posts to /auth/login and stores the session", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({ token: "jwt", user: { id: 1, role: "user" } }),
    });
    const data = await api.login("a@b.com", "pass");
    expect(data.token).toBe("jwt");
    expect(localStorage.getItem(TOKEN_KEY)).toBe("jwt");
    expect(api.getToken()).toBe("jwt");
  });

  it("throws an error response when the API returns an error", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => JSON.stringify({ error: "Invalid credentials" }),
    });
    await expect(api.login("a@b.com", "wrong")).rejects.toThrow(
      "Invalid credentials",
    );
  });
});
