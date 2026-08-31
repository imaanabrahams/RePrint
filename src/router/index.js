import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { getToken, getStoredUser } from '../api'

const routes = [
  {
    path: '/admin',
    redirect: '/hr',
  },
  {
    path: '/hr',
    name: 'hr-overview',
    component: () => import('../views/AdminView.vue'),
    meta: { requiresAuth: true, adminOnly: true, tab: 'dashboard' },
  },
  {
    path: '/hr/employees',
    name: 'hr-employees',
    component: () => import('../views/AdminView.vue'),
    meta: { requiresAuth: true, adminOnly: true, tab: 'employees' },
  },
  {
    path: '/hr/shifts',
    name: 'hr-shifts',
    component: () => import('../views/AdminView.vue'),
    meta: { requiresAuth: true, adminOnly: true, tab: 'shifts' },
  },
  { path: '/', name: 'home', component: HomeView },
  { path: '/shop', name: 'shop', component: () => import('../views/ShopView.vue') },
  {
    path: '/product/:id',
    name: 'product',
    component: () => import('../views/ProductView.vue'),
    props: true,
  },
  {
    path: '/create',
    name: 'create',
    component: () => import('../views/CreateView.vue'),
  },
  { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
  { path: '/signup', name: 'signup', component: () => import('../views/SignupView.vue') },
  { path: '/contact', name: 'contact', component: () => import('../views/ContactView.vue') },
  { path: '/cart', name: 'cart', component: () => import('../views/CartView.vue') },
  {
    path: '/wishlist',
    name: 'wishlist',
    component: () => import('../views/WishlistView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && to.meta.adminOnly) {
    const user = getStoredUser()
    if (getToken() && user?.role !== 'admin') {
      return { name: 'home' }
    }
  } else if (to.meta.requiresAuth && !getToken()) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  return true
})

export default router
