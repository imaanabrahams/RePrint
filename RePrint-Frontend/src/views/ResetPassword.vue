<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { resetPassword } from "../api/client.js";

const route = useRoute();
const router = useRouter();

const password = ref("");
const loading = ref(false);
const done = ref(false);
const err = ref("");

async function submit() {
  if (password.value.length < 6) {
    err.value = "Password must be at least 6 characters";
    return;
  }
  loading.value = true;
  err.value = "";
  try {
    await resetPassword(route.query.token, password.value);
    done.value = true;
    setTimeout(() => router.push("/login"), 1800);
  } catch (e) {
    err.value = e.message || "Reset failed — the link may have expired";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="auth fade-up">
    <div class="auth-card">
      <h1 class="title">Reset password</h1>

      <p v-if="err" class="error" role="alert">{{ err }}</p>

      <div v-if="done" class="sent-msg">
        <p>Password reset. Redirecting to login…</p>
      </div>

      <form v-else @submit.prevent="submit" class="form">
        <label>
          <span>New password</span>
          <input
            v-model="password"
            type="password"
            class="input-field"
            placeholder="At least 6 characters"
            required
          />
        </label>
        <button type="submit" class="btn btn-primary submit" :disabled="loading">
          {{ loading ? "Resetting..." : "Reset password" }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.auth { min-height: calc(100vh - 80px); display: grid; place-items: center; padding: 24px; }
.auth-card { background: var(--bg-card); border-radius: var(--radius-lg); box-shadow: var(--shadow); padding: 36px; width: 100%; max-width: 400px; }
.title { font-size: 24px; margin-bottom: 20px; }
.form { display: flex; flex-direction: column; gap: 16px; }
.form label { display: flex; flex-direction: column; gap: 6px; font-weight: 600; font-size: 14px; }
.submit { width: 100%; padding: 14px; }
.error { color: #b23b3b; font-size: 14px; margin-bottom: 10px; }
</style>