import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getToken,
  getStoredUser,
  clearSession,
} from "../api/client";

export const useAuthStore = defineStore("auth", () => {
  // Hydrate initial state from localStorage (via api/client.js) so a page
  // refresh doesn't log the user out — the store just mirrors what's stored.
  const token = ref(getToken() || null);
  const user = ref(getStoredUser());

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === "admin");
  // apiLogin persists the token/user to localStorage internally;
  // we re-read getToken() here rather than trusting the response directly
  // so the store always matches what's actually in storage.
  async function login(email, password) {
    const data = await apiLogin(email, password);
    token.value = getToken();
    user.value = data.user;
    return data;
  }

  async function register(name, email, password) {
    const data = await apiRegister(name, email, password);
    token.value = getToken();
    user.value = data.user;
    return data;
  }

  function logout() {
    clearSession();
    token.value = null;
    user.value = null;
  }

  return { token, user, isAuthenticated, isAdmin, login, register, logout };
});
