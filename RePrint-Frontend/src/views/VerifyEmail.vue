<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { verifyEmail } from "../api/client.js";

const route = useRoute();
const status = ref("checking"); // checking | success | error
const message = ref("");

onMounted(async () => {
  const token = route.query.token;
  if (!token) {
    status.value = "error";
    message.value = "Missing verification token.";
    return;
  }
  try {
    await verifyEmail(token);
    status.value = "success";
  } catch (e) {
    status.value = "error";
    message.value = e.message || "This link is invalid or has expired.";
  }
});
</script>

<template>
  <div class="auth fade-up">
    <div class="auth-card">
      <template v-if="status === 'checking'">
        <h1 class="title">Verifying…</h1>
      </template>
      <template v-else-if="status === 'success'">
        <h1 class="title">Email verified ✓</h1>
        <p class="subtitle">Your account is confirmed.</p>
        <RouterLink to="/login" class="btn btn-primary submit">Log in</RouterLink>
      </template>
      <template v-else>
        <h1 class="title">Verification failed</h1>
        <p class="subtitle">{{ message }}</p>
        <RouterLink to="/" class="btn btn-primary submit">Back home</RouterLink>
      </template>
    </div>
  </div>
</template>

<style scoped>
.auth { min-height: calc(100vh - 80px); display: grid; place-items: center; padding: 24px; }
.auth-card { background: var(--bg-card); border-radius: var(--radius-lg); box-shadow: var(--shadow); padding: 36px; width: 100%; max-width: 400px; text-align: center; }
.title { font-size: 24px; margin-bottom: 6px; }
.subtitle { color: var(--grey); font-size: 14px; margin-bottom: 20px; }
.submit { width: 100%; padding: 14px; }
</style>