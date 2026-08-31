<script setup>
import { computed } from 'vue'
import { useCartStore } from '../stores/cart'
import { formatRand } from '../currency.js'

const cart = useCartStore()

const shipping = computed(() => (cart.subtotal >= 1000 || cart.subtotal === 0 ? 0 : 80))
const total = computed(() => cart.subtotal + shipping.value)
</script>

<template>
  <div class="cart-container container fade-up">
    <div class="head">
      <span class="section-label">Shopping Cart</span>
      <h1 class="page-title">Your cart</h1>
    </div>

    <div v-if="cart.items.length === 0" class="empty">
      <div class="empty-icon">🛒</div>
      <h2>Your cart is empty</h2>
      <p>Looks like you haven't added anything yet.</p>
      <RouterLink to="/shop" class="btn btn-primary">Browse products</RouterLink>
    </div>

    <div v-else class="layout">
      <div class="items">
        <div class="item" v-for="item in cart.items" :key="`${item.id}-${item.option}`">
          <div class="thumb">
            <img :src="item.image" :alt="item.name" />
          </div>
          <div class="info">
            <h3>{{ item.name }}</h3>
            <p class="cat">{{ item.category }}</p>
            <p v-if="item.option && item.option !== 'default'" class="option">{{ item.option }}</p>
            <div class="stepper">
              <button @click="cart.updateQuantity(item.id, item.quantity - 1, item.option)">−</button>
              <span>{{ item.quantity }}</span>
              <button @click="cart.updateQuantity(item.id, item.quantity + 1, item.option)">+</button>
            </div>
          </div>
          <div class="price-col">
            <span class="price">{{ formatRand(item.price * item.quantity) }}</span>
            <button class="remove" @click="cart.removeFromCart(item.id, item.option)" aria-label="Remove">✕</button>
          </div>
        </div>

        <RouterLink to="/shop" class="continue">← Continue shopping</RouterLink>
      </div>

      <aside class="summary">
        <h2>Order summary</h2>
        <div class="line">
          <span>Subtotal</span>
          <span>{{ formatRand(cart.subtotal) }}</span>
        </div>
        <div class="line">
          <span>Shipping</span>
          <span>{{ shipping === 0 ? 'Free' : formatRand(shipping) }}</span>
        </div>
        <div class="line total">
          <span>Total</span>
          <span>{{ formatRand(total) }}</span>
        </div>
        <button class="btn btn-primary checkout" @click="cart.clear()">Checkout</button>
        <p class="note">Demo checkout — no payment is processed.</p>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.cart-container {
  padding-top: 56px;
}

.head {
  margin-bottom: 32px;
}

.layout {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 36px;
  align-items: start;
}

.items {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.item {
  display: flex;
  align-items: center;
  gap: 20px;
  background: var(--bg-card);
  border-radius: 16px;
  padding: 18px;
  box-shadow: var(--shadow);
}

.thumb {
  width: 92px;
  height: 92px;
  border-radius: 12px;
  background: var(--bg);
  overflow: hidden;
  flex-shrink: 0;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info {
  flex: 1;
}

.info h3 {
  font-size: 16.5px;
}

.cat {
  color: var(--grey);
  font-size: 12.5px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  margin: 2px 0 10px;
}

.option {
  color: var(--primary);
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
}

.stepper {
  display: inline-flex;
  align-items: center;
  background: var(--bg);
  border-radius: 8px;
  overflow: hidden;
}

.stepper button {
  width: 34px;
  height: 34px;
  font-size: 17px;
  color: var(--primary);
  font-weight: 700;
}

.stepper span {
  width: 36px;
  text-align: center;
  font-weight: 700;
}

.price-col {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.price {
  font-size: 17px;
  font-weight: 800;
  color: var(--primary);
}

.remove {
  color: var(--grey);
  font-size: 15px;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  transition: background 0.15s ease, color 0.15s ease;
}

.remove:hover {
  background: #f3baba;
  color: #b23b3b;
}

.continue {
  color: var(--primary);
  font-weight: 600;
  font-size: 14px;
}

.summary {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 30px;
  box-shadow: var(--shadow);
  position: sticky;
  top: 100px;
}

.summary h2 {
  font-size: 20px;
  margin-bottom: 20px;
}

.line {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  color: var(--dark);
  font-size: 15px;
  border-bottom: 1px solid rgba(85, 133, 100, 0.16);
}

.line span:last-child {
  font-weight: 600;
}

.line.total {
  font-size: 18px;
  font-weight: 800;
  color: var(--primary);
  border-bottom: none;
  padding-top: 18px;
}

.checkout {
  width: 100%;
  padding: 15px;
  margin-top: 6px;
}

.note {
  text-align: center;
  color: var(--grey);
  font-size: 12.5px;
  margin-top: 12px;
}

.empty {
  text-align: center;
  padding: 80px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-icon {
  font-size: 64px;
}

.empty p {
  color: var(--grey);
  margin-bottom: 10px;
}

@media (max-width: 820px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .summary {
    position: static;
  }
}
</style>
