<script setup>
import { useWishlistStore } from "../stores/wishlistStores.js";
import { useCartStore } from "../stores/cartStores.js";
import RatingStars from "../components/RatingstarsComp.vue/index.js";
import { useRouter } from "vue-router";
import { formatRand } from "../currencyReprint.js";

const wishlist = useWishlistStore();
const cart = useCartStore();
const router = useRouter();

function viewProduct(product) {
  router.push(`/product/${product.id}`);
}
</script>

<template>
  <div class="wishlist container fade-up">
    <div class="head">
      <span class="section-label">Saved for later</span>
      <h1 class="page-title">My wishlist</h1>
      <p v-if="wishlist.count" class="count">
        {{ wishlist.count }} {{ wishlist.count === 1 ? "item" : "items" }} saved
      </p>
    </div>

    <div v-if="wishlist.items.length === 0" class="empty">
      <div class="empty-icon">♡</div>
      <h2>Your wishlist is empty</h2>
      <p>Tap the heart on any product to save it here.</p>
      <RouterLink to="/shop" class="btn btn-primary"
        >Browse products</RouterLink
      >
    </div>

    <div v-else class="grid">
      <article v-for="product in wishlist.items" :key="product.id" class="card">
        <div class="thumb-wrap">
          <div
            class="thumb"
            @click="viewProduct(product)"
            role="button"
            :aria-label="product.name"
          >
            <img :src="product.image" :alt="product.name" />
          </div>
          <button
            class="wish wished"
            @click="wishlist.remove(product.id)"
            :aria-label="`Remove ${product.name} from wishlist`"
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
          <h3 class="name" @click="viewProduct(product)">{{ product.name }}</h3>
          <div class="meta">
            <RatingStars :rating="product.rating" :size="15" />
            <span class="reviews">{{ product.rating }}</span>
          </div>
          <div class="row">
            <span class="price">{{ formatRand(product.price) }}</span>
            <button class="add" @click="cart.addToCart(product)">
              Add to cart
            </button>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.wishlist {
  padding-top: 56px;
}

.head {
  margin-bottom: 32px;
}

.count {
  color: var(--grey);
  margin-top: 6px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 26px;
}

.card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
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
}

.wish {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  color: #fff;
  background: var(--star);
  display: grid;
  place-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
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
  font-size: 19px;
  font-weight: 800;
  color: var(--primary);
}

.add {
  padding: 9px 16px;
  border-radius: 10px;
  background: var(--primary);
  color: #fff;
  font-weight: 600;
  font-size: 13.5px;
}

.add:hover {
  background: var(--primary-dark);
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
  font-size: 60px;
  color: var(--star);
}

.empty p {
  color: var(--grey);
  margin-bottom: 10px;
}
</style>
