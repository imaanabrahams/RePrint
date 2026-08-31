<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const show = ref(false)

function submit() {
  if (!email.value || !password.value) return
  show.value = true
}
</script>

<template>
  <div class="auth fade-up">
    <div class="auth-card">
      <div class="brand">
        <span class="logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 7c0-1.7 1.3-3 3-3h10c1.7 0 3 1.3 3 3v1H4V7z" fill="currentColor"/>
            <path d="M4 10h16v8c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3v-8z" fill="currentColor" opacity="0.85"/>
          </svg>
        </span>
        <span class="word">RePrint</span>
      </div>

      <h1 class="title">Welcome back</h1>
      <p class="subtitle">Log in to manage your orders and designs.</p>

      <p v-if="show" class="notice" role="status">
        Signed in as <strong>{{ email }}</strong>. (Demo only — no backend connected.)
      </p>

      <form @submit.prevent="submit" class="form">
        <label>
          <span>Email</span>
          <input v-model="email" type="email" class="input-field" placeholder="you@example.com" required />
        </label>

        <label>
          <span>Password</span>
          <input v-model="password" type="password" class="input-field" placeholder="Enter your password" required />
        </label>

        <div class="row">
          <label class="remember">
            <input type="checkbox" />
            <span>Remember me</span>
          </label>
          <RouterLink to="/login" class="forgot">Forgot password?</RouterLink>
        </div>

        <button type="submit" class="btn btn-primary submit">Log in</button>
      </form>

      <div class="divider"><span>or</span></div>

      <div class="auth-links">
        <span>Don't have an account?</span>
        <RouterLink to="/signup" class="btn btn-accent signup-link">Create account</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth {
  min-height: calc(100vh - 80px);
  display: grid;
  place-items: center;
  padding: 48px 24px;
}

.auth-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 48px 44px;
  width: 100%;
  max-width: 480px;
  box-shadow: var(--shadow);
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  margin-bottom: 8px;
}

.logo {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: var(--primary);
  color: #fff;
  display: grid;
  place-items: center;
}

.word {
  font-size: 24px;
  font-weight: 800;
}

.title {
  font-size: 30px;
  font-weight: 800;
  text-align: center;
  margin-top: 12px;
}

.subtitle {
  color: var(--grey);
  text-align: center;
  margin: 8px 0 24px;
}

.notice {
  background: rgba(85, 133, 100, 0.14);
  border: 1px solid var(--primary);
  color: var(--primary-dark);
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 14px;
  margin-bottom: 16px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form label > span {
  display: block;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.remember {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--grey);
}

.remember input {
  accent-color: var(--primary);
  width: 16px;
  height: 16px;
}

.forgot {
  color: var(--primary);
  font-weight: 600;
  font-size: 13.5px;
}

.submit {
  width: 100%;
  padding: 15px;
  font-size: 16px;
  margin-top: 4px;
}

.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--grey);
  font-size: 13px;
  margin: 22px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(85, 133, 100, 0.25);
}

.auth-links {
  text-align: center;
  color: var(--grey);
  font-size: 14px;
}

.signup-link {
  width: 100%;
  margin-top: 12px;
  padding: 13px;
}
</style>
