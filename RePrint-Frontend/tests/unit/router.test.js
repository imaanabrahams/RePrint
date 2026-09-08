import { describe, expect, it } from "vitest";
import { routes } from "../../src/router/indexRouter";

describe("Router definitions", () => {
  it("defines all expected public routes", () => {
    const paths = routes.map((r) => r.path);
    expect(paths).toContain("/");
    expect(paths).toContain("/shop");
    expect(paths).toContain("/product/:id");
    expect(paths).toContain("/create");
    expect(paths).toContain("/login");
    expect(paths).toContain("/signup");
    expect(paths).toContain("/contact");
    expect(paths).toContain("/cart");
    expect(paths).toContain("/wishlist");
    expect(paths).toContain("/staff/login");
  });

  it("redirects /admin to /hr", () => {
    const adminRoute = routes.find((r) => r.path === "/admin");
    expect(adminRoute.redirect).toBe("/hr");
  });

  it("marks admin routes as admin-only and auth-required", () => {
    const hr = routes.find((r) => r.path === "/hr");
    expect(hr.meta.requiresAuth).toBe(true);
    expect(hr.meta.adminOnly).toBe(true);
    const staffLogin = routes.find((r) => r.path === "/staff/login");
    expect(staffLogin?.meta?.requiresAuth).toBeFalsy();
  });

  it("gives each staff child route a title", () => {
    const staff = routes.find((r) => r.path === "/staff");
    expect(staff.redirect).toBe("/staff/dashboard");
    expect(staff.children.length).toBe(5);
    expect(staff.children.every((c) => c.meta.title)).toBe(true);
  });

  it("has five admin tabs routed to the Admin view", () => {
    const adminRoutes = routes.filter((r) => r.path.startsWith("/hr"));
    expect(adminRoutes).toHaveLength(5);
  });
});
