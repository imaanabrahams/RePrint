<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "../stores/cartStores.js";
import { useAuthStore } from "../stores/authStores.js";
import { createOrder, initiatePayfastPayment } from "../api/client.js";
import { formatRand } from "../utils/currency.js";

const router = useRouter();
const cart = useCartStore();
const auth = useAuthStore();

const shipping_address = ref(auth.user?.address || "");
const notes = ref("");
const loading = ref(false);
const err = ref("");

const shippingCost = computed(() =>
  cart.subtotal >= 1000 || cart.subtotal === 0 ? 0 : 80,
);
const total = computed(() => cart.subtotal + shippingCost.value);

async function submit() {
  if (!shipping_address.value) {
    err.value = "Shipping address is required";
    return;
  }
  loading.value = true;
  err.value = "";
  try {
    const first = cart.items[0];
    const order = await createOrder({
      product_id: first.id,
      material_id: first.material_id,
      quantity: first.quantity,
      shipping_address: shipping_address.value,
      notes: notes.value,
    });

    const payment = await initiatePayfastPayment(order.id);

    sessionStorage.setItem(
      "pf_pending",
      JSON.stringify({
        order_id: order.id,
        payment_id: payment.payment_id,
        amount: order.total_price,
        item_name: `RePrint order #${order.id}`,
      }),
    );

    router.push("/payfast-sandbox");
  } catch (e) {
    err.value = e.message || "Checkout failed";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="checkout-container container fade-up">
    <div class="head">
      <span class="section-label">Checkout</span>
      <h1 class="page-title">Complete your order</h1>
    </div>

    <div v-if="cart.items.length === 0" class="empty">
      <p>Your cart is empty.</p>
      <RouterLink to="/shop" class="btn btn-primary">Browse products</RouterLink>
    </div>

    <div v-else class="layout">
      <form class="form" @submit.prevent="submit">
        <p v-if="err" class="error" role="alert">{{ err }}</p>

        <label>
          <span>Shipping address</span>
          <textarea
            v-model="shipping_address"
            class="input-field"
            rows="3"
            placeholder="Street, suburb, city, postal code"
            required
          ></textarea>
        </label>

        <label>
          <span>Order notes (optional)</span>
          <textarea
            v-model="notes"
            class="input-field"
            rows="2"
            placeholder="Anything we should know?"
          ></textarea>
        </label>

        <button type="submit" class="btn btn-primary submit" :disabled="loading">
          {{ loading ? "Placing order..." : `Pay with PayFast — ${formatRand(total)}` }}
        </button>
      </form>

      <aside class="summary">
        <h2>Order summary</h2>
        <div v-for="item in cart.items" :key="`${item.id}-${item.option}`" class="line">
          <span>{{ item.name }} × {{ item.quantity }}</span>
          <span>{{ formatRand(item.price * item.quantity) }}</span>
        </div>
        <div class="line">
          <span>Shipping</span>
          <span>{{ shippingCost === 0 ? "Free" : formatRand(shippingCost) }}</span>
        </div>
        <div class="line total">
          <span>Total</span>
          <span>{{ formatRand(total) }}</span>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.checkout-container { padding-top: 56px; }
.head { margin-bottom: 32px; }
.layout {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 36px;
  align-items: start;
}
.form {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 30px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.form label { display: flex; flex-direction: column; gap: 6px; font-weight: 600; font-size: 14px; }
.error { color: #b23b3b; font-size: 14px; }
.submit { width: 100%; padding: 15px; margin-top: 6px; }
.summary {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 30px;
  box-shadow: var(--shadow);
  position: sticky;
  top: 100px;
}
.summary h2 { font-size: 20px; margin-bottom: 20px; }
.line {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-size: 14px;
  border-bottom: 1px solid rgba(85, 133, 100, 0.16);
}
.line.total { font-size: 18px; font-weight: 800; color: var(--primary); border-bottom: none; padding-top: 16px; }
.empty { text-align: center; padding: 80px 20px; }
@media (max-width: 820px) {
  .layout { grid-template-columns: 1fr; }
  .summary { position: static; }
}
</style>