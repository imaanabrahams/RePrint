<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCartStore } from "../stores/cartStores";
import { useWishlistStore } from "../stores/wishlistStores";
import { useAuthStore } from "../stores/authStores";

const route = useRoute();
const router = useRouter();
const cart = useCartStore();
const wishlist = useWishlistStore();
const auth = useAuthStore();
const open = ref(false);

const links = computed(() => {
  const base = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/create", label: "Create" },
    { to: "/contact", label: "Contact" },
  ];
  if (auth.isAdmin) {
    base.push({ to: "/hr", label: "HR System" });
  }
  return base;
});

function isActive(to) {
  if (to === "/") return route.path === "/";
  return route.path.startsWith(to);
}
</script>

<template>
  <header class="nav">
    <div class="container nav-inner">
      <RouterLink to="/" class="brand">
        <span class="logo">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 7c0-1.7 1.3-3 3-3h10c1.7 0 3 1.3 3 3v1H4V7z"
              fill="currentColor"
            />
            <path
              d="M4 10h16v8c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3v-8z"
              fill="currentColor"
              opacity="0.85"
            />
          </svg>
        </span>
        <span class="word">RePrint</span>
      </RouterLink>

      <nav class="links" :class="{ open }">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="link"
          :class="{ active: isActive(link.to) }"
          @click="open = false"
        >
          {{ link.label }}
          <span class="underline"></span>
        </RouterLink>
      </nav>

      <div class="actions">
        <RouterLink to="/wishlist" class="cart-btn heart" aria-label="Wishlist">
          <svg
            width="23"
            height="23"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 20.3 4.1 12.5a5.1 5.1 0 0 1 7.2-7.2l.7.7.7-.7a5.1 5.1 0 0 1 7.2 7.2L12 20.3z"
              fill="currentColor"
            />
          </svg>
          <span v-if="wishlist.count" class="count">{{ wishlist.count }}</span>
        </RouterLink>

        <RouterLink to="/cart" class="cart-btn" aria-label="Cart">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 6h12l-1 12a2 2 0 0 1-2 1.8H9A2 2 0 0 1 7 18L6 6zm3 1v3a3 3 0 0 0 6 0V7"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span v-if="cart.count" class="count">{{ cart.count }}</span>
        </RouterLink>

        <RouterLink
          v-if="auth.isAuthenticated"
          to="/cart"
          class="btn btn-primary nav-cta"
        >
          Account
        </RouterLink>
        <RouterLink v-else to="/signup" class="btn btn-primary nav-cta">
          Sign Up
        </RouterLink>

        <button
          class="burger"
          @click="open = !open"
          :aria-expanded="open"
          aria-label="Menu"
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg-card);
  backdrop-filter: blur(6px);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
}

.nav-inner {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--primary);
  color: var(--white);
  display: grid;
  place-items: center;
  box-shadow: 0 4px 10px rgba(85, 133, 100, 0.3);
}

.word {
  font-size: 24px;
  font-weight: 800;
  color: var(--dark);
  letter-spacing: -0.5px;
}

.word::after {
  content: "";
  display: block;
  height: 2px;
  width: 26px;
  background: var(--primary);
  margin-top: 1px;
}

.links {
  display: flex;
  align-items: center;
  gap: 34px;
}

.link {
  position: relative;
  font-weight: 600;
  color: rgba(10, 11, 16, 0.8);
  padding: 6px 2px;
  transition: color 0.15s ease;
}

.link:hover {
  color: var(--dark);
}

.underline {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: var(--primary);
  border-radius: 2px;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.2s ease;
}

.link.active {
  color: var(--primary);
}

.link.active .underline {
  transform: scaleX(1);
}

.actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.heart {
  position: relative;
}

.heart::after {
  content: "";
  position: absolute;
  right: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 22px;
  background: rgba(85, 133, 100, 0.25);
}

.cart-btn {
  position: relative;
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  color: var(--primary);
  background: transparent;
  transition: background 0.15s ease;
}

.cart-btn:hover {
  background: rgba(85, 133, 100, 0.12);
}

.count {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 19px;
  height: 19px;
  padding: 0 4px;
  border-radius: 10px;
  background: var(--star);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  display: grid;
  place-items: center;
}

.nav-cta {
  padding: 11px 22px;
  font-size: 14px;
}

.burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 6px;
}

.burger span {
  width: 22px;
  height: 2.5px;
  background: var(--primary);
  border-radius: 2px;
}

@media (max-width: 820px) {
  .burger {
    display: flex;
  }

  .links {
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    background: var(--bg-card);
    padding: 12px 24px 20px;
    box-shadow: 0 20px 30px rgba(0, 0, 0, 0.06);
    transform: translateY(-130%);
    transition: transform 0.25s ease;
  }

  .links.open {
    transform: translateY(0);
  }

  .link {
    width: 100%;
    padding: 12px 2px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  .nav-cta {
    display: none;
  }
}
</style>
