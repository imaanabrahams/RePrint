import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getToken,
  getStoredUser,
  clearSession,
} from "../apiReprint";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(getToken() || null);
  const user = ref(getStoredUser());

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === "admin");

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
