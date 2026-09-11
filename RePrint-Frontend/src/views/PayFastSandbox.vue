<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "../stores/cartStores.js";
import { simulatePayfastOutcome } from "../api/client.js";
import { formatRand } from "../utils/currency.js";

const router = useRouter();
const cart = useCartStore();
const pending = ref(null);
const loading = ref(false);

onMounted(() => {
  const raw = sessionStorage.getItem("pf_pending");
  if (!raw) {
    router.replace("/cart");
    return;
  }
  pending.value = JSON.parse(raw);
});

async function resolve(outcome) {
  loading.value = true;
  try {
    await simulatePayfastOutcome(pending.value.payment_id, outcome);
  } finally {
    sessionStorage.removeItem("pf_pending");
    cart.clear();
    const status = outcome === "COMPLETE" ? "success" : "cancelled";
    router.push(
      `/order-confirmation/${pending.value.order_id}?payment_id=${pending.value.payment_id}&status=${status}`,
    );
  }
}
</script>

<template>
  <div class="pf-container fade-up" v-if="pending">
    <div class="pf-card">
      <div class="pf-brand">PayFast <span class="pf-badge">Sandbox</span></div>
      <p class="pf-item">{{ pending.item_name }}</p>
      <p class="pf-amount">{{ formatRand(pending.amount) }}</p>
      <p class="pf-note">
        This is a simulated payment page for demo purposes — no real card
        details are collected and no money moves.
      </p>
      <div class="pf-actions">
        <button
          class="btn btn-primary"
          :disabled="loading"
          @click="resolve('COMPLETE')"
        >
          {{ loading ? "Processing..." : "Approve payment" }}
        </button>
        <button
          class="btn btn-accent"
          :disabled="loading"
          @click="resolve('FAILED')"
        >
          Cancel / decline
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pf-container {
  min-height: calc(100vh - 80px);
  display: grid;
  place-items: center;
  padding: 24px;
}
.pf-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 36px;
  width: 100%;
  max-width: 380px;
  text-align: center;
}
.pf-brand {
  font-weight: 800;
  font-size: 18px;
  margin-bottom: 18px;
  color: var(--dark);
}
.pf-badge {
  background: var(--primary);
  color: #fff;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 6px;
  vertical-align: middle;
  margin-left: 6px;
}
.pf-item { color: var(--grey); font-size: 14px; margin-bottom: 4px; }
.pf-amount { font-size: 32px; font-weight: 800; color: var(--primary); margin-bottom: 18px; }
.pf-note { color: var(--grey); font-size: 12.5px; margin-bottom: 24px; }
.pf-actions { display: flex; flex-direction: column; gap: 10px; }
</style>