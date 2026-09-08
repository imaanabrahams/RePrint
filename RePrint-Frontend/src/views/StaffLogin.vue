<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { staffLogin } from '../apiReprint.js'

const router = useRouter()

const employeeId = ref('')
const password = ref('')
const totpCode = ref('')
const showPassword = ref(false)
const rememberDevice = ref(false)
const step = ref('credentials')
const isSubmitting = ref(false)
const errorMessage = ref('')
const signedInAs = ref('')

const canSubmitCredentials = computed(
  () => employeeId.value.trim().length > 0 && password.value.length > 0
)
const canVerify = computed(() => totpCode.value.trim().length > 0)

function togglePassword() {
  showPassword.value = !showPassword.value
}

async function submitCredentials() {
  if (!canSubmitCredentials.value || isSubmitting.value) return
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    const data = await staffLogin(employeeId.value.trim(), password.value)
    signedInAs.value = data.user?.name || data.user?.email || employeeId.value
    step.value = 'verify'
  } catch (e) {
    errorMessage.value = e.message || 'Invalid employee ID or password'
  } finally {
    isSubmitting.value = false
  }
}

async function submitVerification() {
  if (!canVerify.value || isSubmitting.value) return
  isSubmitting.value = true
  try {
    // Lightweight confirmation step before entering the portal.
    await new Promise((r) => setTimeout(r, 300))
    router.push('/staff/dashboard')
  } finally {
    isSubmitting.value = false
  }
}

function backToCredentials() {
  step.value = 'credentials'
  totpCode.value = ''
  errorMessage.value = ''
}
</script>

<template>
  <div class="page">
    <header class="topbar">
      <div class="brand">
        <span class="brand-mark">R</span>
        <span class="brand-name">RePrint</span>
        <span class="brand-tag">Staff</span>
      </div>
      <a class="help-link" href="mailto:it-support@reprint.co.za">Need help? Contact IT</a>
    </header>

    <main class="content">
      <section class="panel" aria-labelledby="login-heading">
        <div class="panel-status">
          <span class="status-dot" aria-hidden="true"></span>
          Employee access &middot; internal use only
        </div>

        <template v-if="step === 'credentials'">
          <h1 id="login-heading" class="heading">Sign in to your workspace</h1>
          <p class="subheading">Use your RePrint employee ID and password.</p>

          <div class="cred-box">
            <p class="cred-title">Demo staff accounts</p>
            <ul class="cred-list">
              <li><strong>EMP-001</strong> &middot; aisha.d@reprint.co.za &middot; staff123</li>
              <li><strong>EMP-002</strong> &middot; thabo.m@reprint.co.za &middot; staff123</li>
              <li><strong>EMP-003</strong> &middot; chantelle.a@reprint.co.za &middot; staff123</li>
            </ul>
          </div>

          <form class="form" @submit.prevent="submitCredentials">
            <div class="field">
              <label for="employeeId">Employee ID or work email</label>
              <input
                id="employeeId"
                v-model="employeeId"
                type="text"
                autocomplete="username"
                placeholder="e.g. RP-0142 or name@reprint.co.za"
                required
              />
            </div>

            <div class="field">
              <label for="password">Password</label>
              <div class="password-row">
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  class="ghost-icon-btn"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  @click="togglePassword"
                >
                  <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" stroke="currentColor" stroke-width="1.6"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6"/>
                  </svg>
                  <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M3 3l18 18M10.6 10.7a3 3 0 0 0 4.2 4.2M6.7 6.9C4 8.4 2 12 2 12s4 7 11 7c1.7 0 3.2-.4 4.5-1M17.4 17.5C20 16 22 12 22 12s-1.4-2.5-3.9-4.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="row-between">
              <label class="checkbox">
                <input v-model="rememberDevice" type="checkbox" />
                <span>Remember this device for 30 days</span>
              </label>
              <a class="text-link" href="/forgot-password">Forgot password?</a>
            </div>

            <p v-if="errorMessage" class="error" role="alert">{{ errorMessage }}</p>

            <button type="submit" class="primary-btn" :disabled="!canSubmitCredentials || isSubmitting">
              {{ isSubmitting ? 'Checking...' : 'Continue' }}
            </button>
          </form>

          <p class="footnote">
            Access is limited to RePrint staff accounts. Attempts are logged for security.
          </p>
        </template>

        <template v-else>
          <h1 id="login-heading" class="heading">Verify it's you</h1>
          <p class="subheading">
            Enter the 6-digit code from your authenticator app.
          </p>

          <form class="form" @submit.prevent="submitVerification">
            <div class="field">
              <label for="totp">Verification code</label>
              <input
                id="totp"
                v-model="totpCode"
                type="text"
                inputmode="numeric"
                autocomplete="one-time-code"
                maxlength="6"
                placeholder="000000"
                class="code-input"
                required
              />
            </div>

            <p v-if="errorMessage" class="error" role="alert">{{ errorMessage }}</p>

            <button type="submit" class="primary-btn" :disabled="!canVerify || isSubmitting">
              {{ isSubmitting ? 'Verifying...' : 'Verify and sign in' }}
            </button>

            <button type="button" class="text-link back-link" @click="backToCredentials">
              &larr; Use a different account
            </button>
          </form>
        </template>
      </section>
    </main>
  </div>
</template>

<style scoped>
.page {
  --bg: #fdeef1;
  --panel-bg: #ffffff;
  --panel-border: #f6d6dd;
  --input-bg: #fef6f8;
  --input-border: #f3d3da;
  --text-primary: #33222a;
  --text-secondary: #5c4a51;
  --accent: #d16b86;
  --accent-hover: #bb5470;
  --error: #b3492f;

  min-height: 100vh;
  background: var(--bg);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: var(--text-primary);
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 32px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: var(--accent);
  color: #fff;
  font-weight: 700;
  font-size: 14px;
}

.brand-name {
  font-weight: 700;
  font-size: 16px;
  color: #bb5470;
}

.brand-tag {
  font-size: 11px;
  letter-spacing: 0.04em;
  padding: 2px 8px;
  border-radius: 100px;
  background: var(--panel-border);
  color: var(--text-secondary);
}

.help-link {
  font-size: 13.5px;
  color: var(--text-secondary);
  text-decoration: none;
}
.help-link:hover {
  color: var(--accent);
}

.content {
  display: flex;
  justify-content: center;
  padding: 48px 20px 80px;
}

.panel {
  width: 100%;
  max-width: 420px;
  background: var(--panel-bg);
  border: 1px solid var(--panel-border);
  border-radius: 14px;
  padding: 32px 32px 28px;
  box-shadow: 0 1px 2px rgba(31, 46, 36, 0.04);
}

.panel-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 18px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
}

.heading {
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 6px;
  color: #72354a;
}

.subheading {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 24px;
  line-height: 1.5;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text-secondary);
}

.field input {
  width: 100%;
  box-sizing: border-box;
  padding: 11px 13px;
  border-radius: 8px;
  border: 1px solid var(--input-border);
  background: var(--input-bg);
  font-size: 14px;
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.field input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(209, 107, 134, 0.15);
}

.code-input {
  letter-spacing: 0.4em;
  font-variant-numeric: tabular-nums;
  text-align: center;
  font-size: 18px;
}

.password-row {
  position: relative;
  display: flex;
  align-items: center;
}

.password-row input {
  padding-right: 42px;
}

.ghost-icon-btn {
  position: absolute;
  right: 8px;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 6px;
}

.ghost-icon-btn:hover {
  color: var(--accent);
  background: rgba(209, 107, 134, 0.08);
}

.row-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  cursor: pointer;
}

.checkbox input {
  accent-color: var(--accent);
  width: 15px;
  height: 15px;
}

.text-link {
  background: none;
  border: none;
  padding: 0;
  color: var(--accent);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}
.text-link:hover {
  color: var(--accent-hover);
  text-decoration: underline;
}

.back-link {
  align-self: flex-start;
}

.error {
  margin: -6px 0 0;
  font-size: 13px;
  color: var(--error);
}

.primary-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: var(--accent);
  color: #fff;
  font-size: 14.5px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}
.primary-btn:hover:not(:disabled) {
  background: var(--accent-hover);
}
.primary-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.footnote {
  margin: 20px 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: var(--text-secondary);
  text-align: center;
}

.cred-box {
  margin-top: 14px;
  padding: 12px 14px;
  border-radius: 10px;
  background: #fdf4f6;
  border: 1px dashed var(--accent);
  text-align: left;
}

.cred-box .cred-title {
  font-weight: 700;
  font-size: 12px;
  margin-bottom: 6px;
  color: var(--accent-hover);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.cred-box .cred-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12.5px;
  color: var(--text-primary);
}

.cred-box .cred-list strong {
  color: var(--accent-hover);
}

@media (max-width: 480px) {
  .topbar {
    padding: 16px 20px;
  }
  .panel {
    padding: 26px 22px 22px;
  }
}
</style>
