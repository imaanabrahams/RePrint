import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/Home.vue";
import { getToken, getStoredUser } from "../apiReprint.js";

export const routes = [
  {
    path: "/admin",
    redirect: "/hr",
  },
  {
    path: "/hr",
    name: "hr-overview",
    component: () => import("../views/Admin.vue"),
    meta: { requiresAuth: true, adminOnly: true, tab: "dashboard" },
  },
  {
    path: "/hr/employees",
    name: "hr-employees",
    component: () => import("../views/Admin.vue"),
    meta: { requiresAuth: true, adminOnly: true, tab: "employees" },
  },
  {
    path: "/hr/shifts",
    name: "hr-shifts",
    component: () => import("../views/Admin.vue"),
    meta: { requiresAuth: true, adminOnly: true, tab: "shifts" },
  },
  {
    path: "/hr/orders",
    name: "hr-orders",
    component: () => import("../views/Admin.vue"),
    meta: { requiresAuth: true, adminOnly: true, tab: "orders" },
  },
  {
    path: "/hr/materials",
    name: "hr-materials",
    component: () => import("../views/Admin.vue"),
    meta: { requiresAuth: true, adminOnly: true, tab: "materials" },
  },
  { path: "/", name: "home", component: HomeView },
  {
    path: "/shop",
    name: "shop",
    component: () => import("../views/Shop.vue"),
  },
  {
    path: "/product/:id",
    name: "product",
    component: () => import("../views/Product.vue"),
    props: true,
  },
  {
    path: "/create",
    name: "create",
    component: () => import("../views/Create.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import("../views/Signup.vue"),
  },
  {
    path: "/contact",
    name: "contact",
    component: () => import("../views/Contact.vue"),
  },
  {
    path: "/cart",
    name: "cart",
    component: () => import("../views/Cart.vue"),
  },
  {
    path: "/wishlist",
    name: "wishlist",
    component: () => import("../views/Wishlist.vue"),
  },
  {
    path: "/staff/login",
    name: "staff-login",
    component: () => import("../views/StaffLogin.vue"),
  },
  {
    path: "/staff",
    component: () => import("../layouts/StaffLayout.vue"),
    redirect: "/staff/dashboard",
    children: [
      {
        path: "dashboard",
        name: "staff-dashboard",
        component: () => import("../views/StaffDashboard.vue"),
        meta: { title: "Overview" },
      },
      {
        path: "print-queue",
        name: "staff-print-queue",
        component: () => import("../views/StaffPrintQueue.vue"),
        meta: { title: "Print queue" },
      },
      {
        path: "inventory",
        name: "staff-inventory",
        component: () => import("../views/StaffInventory.vue"),
        meta: { title: "Inventory" },
      },
      {
        path: "orders",
        name: "staff-orders",
        component: () => import("../views/StaffOrders.vue"),
        meta: { title: "Orders" },
      },
      {
        path: "team",
        name: "staff-team",
        component: () => import("../views/StaffTeam.vue"),
        meta: { title: "Team" },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to) => {
  if (to.meta.requiresAuth && to.meta.adminOnly) {
    const user = getStoredUser();
    if (getToken() && user?.role !== "admin") {
      return { name: "home" };
    }
  } else if (to.meta.requiresAuth && !getToken()) {
    return { name: "login", query: { redirect: to.fullPath } };
  }
  return true;
});

export default router;
