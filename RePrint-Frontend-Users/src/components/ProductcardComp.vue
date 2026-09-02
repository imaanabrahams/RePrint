<script setup>
import { useRouter } from "vue-router";
import { useCartStore } from "../stores/cartStores.js";
import { useWishlistStore } from "../stores/wishlistStores.js";
import RatingStars from "./RatingstarsComp.vue";
import { formatRand } from "../currencyReprint.js";

const props = defineProps({
  product: { type: Object, required: true },
  variant: { type: String, default: "default" },
});

const router = useRouter();
const cart = useCartStore();
const wishlist = useWishlistStore();

function goToProduct(product) {
  router.push(`/product/${product.id}`);
}
</script>

<template>
  <article class="card" :class="{ light: variant === 'light' }">
    <div class="thumb-wrap">
      <div
        class="thumb"
        @click="goToProduct(product)"
        role="button"
        :aria-label="product.name"
      >
        <img :src="product.image" :alt="product.name" />
      </div>
      <button
        class="wish"
        :class="{ wished: wishlist.isWished(product.id) }"
        @click.stop="wishlist.toggle(product)"
        :aria-label="
          wishlist.isWished(product.id)
            ? 'Remove from wishlist'
            : 'Add to wishlist'
        "
      >
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 20.3 4.1 12.5a5.1 5.1 0 0 1 7.2-7.2l.7.7.7-.7a5.1 5.1 0 0 1 7.2 7.2L12 20.3z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
    <div class="body">
      <p class="cat">{{ product.category }}</p>
      <h3 class="name" @click="goToProduct(product)">{{ product.name }}</h3>
      <div class="meta">
        <RatingStars :rating="product.rating" :size="15" />
        <span class="reviews">{{ product.reviews }}</span>
      </div>
      <div class="row">
        <span class="price">{{ formatRand(product.price) }}</span>
        <button
          class="add"
          @click="cart.addToCart(product)"
          aria-label="Add to cart"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              stroke-width="2.4"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
}

.card.light {
  background: var(--bg);
  border: 1px solid rgba(85, 133, 100, 0.18);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.1);
}

.thumb-wrap {
  position: relative;
  padding: 10px 10px 0;
}

.thumb {
  aspect-ratio: 4 / 3;
  display: grid;
  place-items: center;
  cursor: pointer;
  overflow: hidden;
  border-radius: var(--radius);
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card:hover .thumb img {
  transform: scale(1.04);
}

.wish {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  color: var(--grey);
  display: grid;
  place-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transition:
    transform 0.15s ease,
    color 0.15s ease,
    background 0.15s ease;
}

.wish:hover {
  transform: scale(1.1);
}

.wish.wished {
  color: #fff;
  background: var(--star);
}

.body {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.cat {
  color: var(--grey);
  font-size: 12.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.name {
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
}

.name:hover {
  text-decoration: underline;
}

.meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.reviews {
  color: var(--grey);
  font-size: 13px;
}

.row {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price {
  font-size: 20px;
  font-weight: 800;
  color: var(--primary);
}

.add {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--accent);
  color: var(--dark);
  display: grid;
  place-items: center;
  transition:
    background 0.15s ease,
    transform 0.15s ease;
}

.add:hover {
  background: var(--accent-soft);
  transform: scale(1.05);
}
</style>
