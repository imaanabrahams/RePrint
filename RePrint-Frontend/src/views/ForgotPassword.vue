<script setup>
import { ref } from "vue";
import { forgotPassword } from "../api/client.js";

const email = ref("");
const loading = ref(false);
const sent = ref(false);
const err = ref("");

async function submit() {
  loading.value = true;
  err.value = "";
  try {
    await forgotPassword(email.value);
    sent.value = true;
  } catch (e) {
    err.value = e.message || "Something went wrong";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="auth fade-up">
    <div class="auth-card">
      <h1 class="title">Forgot password</h1>
      <p class="subtitle">We'll email you a link to reset it.</p>

      <p v-if="err" class="error" role="alert">{{ err }}</p>

      <div v-if="sent" class="sent-msg">
        <p>If that email is registered, a reset link has been sent. Check your inbox.</p>
        <RouterLink to="/login" class="btn btn-primary">Back to login</RouterLink>
      </div>

      <form v-else @submit.prevent="submit" class="form">
        <label>
          <span>Email</span>
          <input
            v-model="email"
            type="email"
            class="input-field"
            placeholder="you@example.com"
            required
          />
        </label>
        <button type="submit" class="btn btn-primary submit" :disabled="loading">
          {{ loading ? "Sending..." : "Send reset link" }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.auth { min-height: calc(100vh - 80px); display: grid; place-items: center; padding: 24px; }
.auth-card { background: var(--bg-card); border-radius: var(--radius-lg); box-shadow: var(--shadow); padding: 36px; width: 100%; max-width: 400px; }
.title { font-size: 24px; margin-bottom: 6px; }
.subtitle { color: var(--grey); font-size: 14px; margin-bottom: 20px; }
.form { display: flex; flex-direction: column; gap: 16px; }
.form label { display: flex; flex-direction: column; gap: 6px; font-weight: 600; font-size: 14px; }
.submit { width: 100%; padding: 14px; }
.error { color: #b23b3b; font-size: 14px; margin-bottom: 10px; }
.sent-msg { display: flex; flex-direction: column; gap: 16px; }
</style>