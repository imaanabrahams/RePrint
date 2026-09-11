<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { getPaymentStatus } from "../api/client.js";
import { formatRand } from "../utils/currency.js";

const props = defineProps({ orderId: String });
const route = useRoute();

const payment = ref(null);
const polling = ref(true);
let interval = null;
let attempts = 0;

async function poll() {
  const paymentId = route.query.payment_id;
  if (!paymentId) {
    polling.value = false;
    return;
  }
  try {
    const data = await getPaymentStatus(paymentId);
    payment.value = data;
    if (data.status !== "pending" || attempts >= 6) {
      polling.value = false;
      clearInterval(interval);
    }
  } catch {
    // keep trying until attempts run out
  }
  attempts++;
}

onMounted(() => {
  poll();
  interval = setInterval(poll, 1500);
});
onUnmounted(() => clearInterval(interval));
</script>

<template>
  <div class="confirm-container fade-up">
    <div class="confirm-card">
      <template v-if="polling">
        <div class="spinner"></div>
        <h2>Confirming your payment…</h2>
      </template>

      <template v-else-if="payment?.status === 'completed'">
        <div class="icon success">✓</div>
        <h2>Payment successful</h2>
        <p>Order #{{ orderId }} is confirmed. Reference: {{ payment.transaction_id }}</p>
        <p class="amount">{{ formatRand(payment.amount) }}</p>
      </template>

      <template v-else>
        <div class="icon failed">✕</div>
        <h2>Payment {{ route.query.status === "cancelled" ? "cancelled" : "failed" }}</h2>
        <p>Order #{{ orderId }} was not paid. You can try again from your order history.</p>
      </template>

      <RouterLink to="/shop" class="btn btn-primary">Continue shopping</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.confirm-container { min-height: calc(100vh - 80px); display: grid; place-items: center; padding: 24px; }
.confirm-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 40px;
  max-width: 420px;
  text-align: center;
}
.icon {
  width: 56px; height: 56px; border-radius: 50%;
  display: grid; place-items: center; margin: 0 auto 16px;
  font-size: 26px; font-weight: 800; color: #fff;
}
.icon.success { background: var(--primary); }
.icon.failed { background: #b23b3b; }
.amount { font-size: 22px; font-weight: 800; color: var(--primary); margin: 10px 0 20px; }
.spinner {
  width: 36px; height: 36px; margin: 0 auto 16px;
  border: 4px solid rgba(85,133,100,0.2); border-top-color: var(--primary);
  border-radius: 50%; animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.confirm-card .btn { margin-top: 10px; }
</style>