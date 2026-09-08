<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStores";

const router = useRouter();
const auth = useAuthStore();

const form = ref({ name: "", email: "", password: "", confirm: "" });
const loading = ref(false);
const err = ref("");

async function submit() {
  if (!form.value.name || !form.value.email || !form.value.password) return;
  if (form.value.password !== form.value.confirm) return;
  loading.value = true;
  err.value = "";
  try {
    await auth.register(form.value.name, form.value.email, form.value.password);
    router.push("/");
  } catch (e) {
    err.value = e.message || "Registration failed";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="auth fade-up">
    <div class="auth-card">
      <div class="brand">
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
      </div>

      <h1 class="title">Create your account</h1>
      <p class="subtitle">Join RePrint and start creating in minutes.</p>

      <p v-if="err" class="error" role="alert">{{ err }}</p>

      <form @submit.prevent="submit" class="form">
        <label>
          <span>Full name</span>
          <input
            v-model="form.name"
            class="input-field"
            placeholder="Jane Doe"
            required
          />
        </label>

        <label>
          <span>Email</span>
          <input
            v-model="form.email"
            type="email"
            class="input-field"
            placeholder="you@example.com"
            required
          />
        </label>

        <label>
          <span>Password</span>
          <input
            v-model="form.password"
            type="password"
            class="input-field"
            placeholder="Create a password"
            required
          />
        </label>

        <label>
          <span>Confirm password</span>
          <input
            v-model="form.confirm"
            type="password"
            class="input-field"
            placeholder="Repeat your password"
            required
            :class="{ error: form.confirm && form.confirm !== form.password }"
          />
        </label>

        <button
          type="submit"
          class="btn btn-primary submit"
          :disabled="loading"
        >
          {{ loading ? "Creating account..." : "Create account" }}
        </button>
      </form>

      <p class="terms">
        By signing up you agree to our <a href="#">Terms</a> and
        <a href="#">Privacy Policy</a>.
      </p>

      <div class="auth-links">
        <span>Already have an account?</span>
        <RouterLink to="/login" class="btn btn-accent login-link"
          >Log in</RouterLink
        >
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
  padding: 44px 44px;
  width: 100%;
  max-width: 500px;
  box-shadow: var(--shadow);
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  margin-bottom: 6px;
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
  margin-top: 10px;
}

.subtitle {
  color: var(--grey);
  text-align: center;
  margin: 8px 0 24px;
}

.error {
  background: rgba(224, 83, 83, 0.12);
  border: 1px solid #e05353;
  color: #b23b3b;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 14px;
  margin-bottom: 16px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form label > span {
  display: block;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
}

.error {
  outline-color: #e05353 !important;
}

.submit {
  width: 100%;
  padding: 15px;
  font-size: 16px;
  margin-top: 6px;
}

.terms {
  font-size: 13px;
  color: var(--grey);
  text-align: center;
  margin: 18px 0 20px;
}

.terms a {
  color: var(--primary);
  font-weight: 600;
}

.auth-links {
  text-align: center;
  color: var(--grey);
  font-size: 14px;
  border-top: 1px solid rgba(85, 133, 100, 0.25);
  padding-top: 18px;
}

.login-link {
  width: 100%;
  margin-top: 12px;
  padding: 13px;
}
</style>
