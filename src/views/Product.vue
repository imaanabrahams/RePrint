<script setup>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useProductsStore } from "../stores/productsStores.js";
import { useCartStore } from "../stores/cartStores.js";
import RatingStars from "../components/RatingstarsComp.vue/index.js";
import { formatRand } from "../currencyReprint.js";

const route = useRoute();
const products = useProductsStore();
const cart = useCartStore();

const product = computed(() => products.byId(route.params.id));
const selectedOption = ref("");
const quantity = ref(1);
const faq = ref(0);
const added = ref(false);

watch(
  () => product.value?.options,
  (options) => {
    const first = options?.[0];
    if (first && !options.includes(selectedOption.value)) {
      selectedOption.value = first;
    }
  },
  { immediate: true },
);

watch(
  () => route.params.id,
  () => {
    quantity.value = 1;
    added.value = false;
  },
);

function add() {
  cart.addToCart(product.value, quantity.value, selectedOption.value);
  added.value = true;
  setTimeout(() => (added.value = false), 1600);
}

const faqs = [
  {
    q: "What materials are used?",
    a: "We use premium archival paper, eco-friendly inks and high-quality fabrics to ensure your products look great and last for years.",
  },
  {
    q: "How long does delivery take?",
    a: "Most orders are printed within 1–2 business days and delivered in 3–7 days, depending on your location. Express options are available at checkout.",
  },
  {
    q: "Can I return a product?",
    a: "Yes. If you are not happy with your print, you can request a return or reprint within 30 days of delivery.",
  },
];
</script>

<template>
  <div v-if="product" class="detail fade-up container">
    <nav class="crumbs">
      <RouterLink to="/">Home</RouterLink> /
      <RouterLink to="/shop">Shop</RouterLink> /
      <span>{{ product.name }}</span>
    </nav>

    <div class="layout">
      <div class="gallery">
        <div class="stage">
          <img :src="product.image" :alt="product.name" class="pimg" />
        </div>
      </div>

      <div class="info">
        <p class="cat">{{ product.category }}</p>
        <h1 class="title">{{ product.name }}</h1>

        <div class="rating-row">
          <RatingStars :rating="product.rating" :size="18" />
          <span class="reviews"
            >{{ product.rating }} · {{ product.reviews }} reviews</span
          >
        </div>

        <p class="price">{{ formatRand(product.price) }}</p>
        <p class="desc">{{ product.description }}</p>

        <div class="option-block">
          <label>Options</label>
          <div class="options">
            <button
              v-for="o in product.options"
              :key="o"
              class="opt"
              :class="{ active: selectedOption === o }"
              @click="selectedOption = o"
            >
              {{ o }}
            </button>
          </div>
        </div>

        <div class="qty-block">
          <label>Quantity</label>
          <div class="stepper">
            <button @click="quantity = Math.max(1, quantity - 1)">−</button>
            <span>{{ quantity }}</span>
            <button @click="quantity++">+</button>
          </div>
        </div>

        <button class="btn btn-primary add-btn" @click="add">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 6h12l-1 12a2 2 0 0 1-2 1.8H9A2 2 0 0 1 7 18L6 6zm3 1v3a3 3 0 0 0 6 0V7"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
          {{ added ? "Added to cart!" : "Add to Cart" }}
        </button>
        <p class="hint">Free shipping on orders over R1000</p>
      </div>
    </div>

    <section class="faq">
      <span class="section-label">Good to know</span>
      <div class="faq-list">
        <div class="faq-item" v-for="(f, i) in faqs" :key="i">
          <button class="faq-q" @click="faq = faq === i ? -1 : i">
            {{ f.q }}
            <span class="chev" :class="{ open: faq === i }">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.4"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </button>
          <div class="faq-a" :class="{ open: faq === i }">
            <p>{{ f.a }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>

  <div v-else class="container notfound fade-up">
    <h1>Product not found</h1>
    <RouterLink to="/shop" class="btn btn-primary">Back to shop</RouterLink>
  </div>
</template>

<style scoped>
.detail {
  padding-top: 40px;
}

.crumbs {
  color: var(--grey);
  font-size: 14px;
  margin-bottom: 30px;
}

.crumbs a {
  color: var(--primary);
  font-weight: 600;
}

.layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
}

.stage {
  border-radius: var(--radius-lg);
  padding: 12px;
  box-shadow: var(--shadow);
  background: var(--bg-card);
  aspect-ratio: 4 / 3;
  display: grid;
  place-items: center;
}

.pimg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 18px;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.cat {
  color: var(--primary);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 13px;
}

.title {
  font-size: clamp(30px, 4vw, 44px);
  font-weight: 800;
  letter-spacing: -0.5px;
  line-height: 1.1;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reviews {
  color: var(--grey);
  font-size: 14px;
}

.price {
  font-size: 32px;
  font-weight: 800;
  color: var(--primary);
}

.desc {
  color: var(--grey);
  font-size: 15.5px;
  line-height: 1.7;
}

.option-block label,
.qty-block label {
  display: block;
  font-weight: 700;
  font-size: 14.5px;
  margin-bottom: 10px;
}

.options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.opt {
  padding: 11px 22px;
  border-radius: 10px;
  background: var(--bg-card);
  font-weight: 600;
  border: 2px solid transparent;
  transition: all 0.15s ease;
}

.opt:hover {
  border-color: var(--accent);
}

.opt.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

.qty-block {
  margin-top: 6px;
}

.stepper {
  display: inline-flex;
  align-items: center;
  background: var(--bg-card);
  border-radius: 10px;
  overflow: hidden;
}

.stepper button {
  width: 44px;
  height: 44px;
  font-size: 20px;
  color: var(--primary);
  transition: background 0.15s ease;
}

.stepper button:hover {
  background: rgba(85, 133, 100, 0.15);
}

.stepper span {
  width: 48px;
  text-align: center;
  font-weight: 700;
}

.add-btn {
  width: 100%;
  padding: 16px;
  font-size: 16px;
  margin-top: 10px;
}

.hint {
  color: var(--grey);
  font-size: 13.5px;
  text-align: center;
}

.faq {
  padding-top: 80px;
  max-width: 760px;
  margin: 0 auto;
}

.section-label {
  text-align: center;
  display: block;
  margin-bottom: 20px;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.faq-item {
  background: var(--bg-card);
  border-radius: 14px;
  overflow: hidden;
}

.faq-q {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  font-size: 16px;
  font-weight: 700;
  text-align: left;
}

.chev {
  color: var(--primary);
  transition: transform 0.2s ease;
  display: grid;
  place-items: center;
}

.chev.open {
  transform: rotate(180deg);
}

.faq-a {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
}

.faq-a.open {
  max-height: 300px;
}

.faq-a p {
  padding: 0 24px 20px;
  color: var(--grey);
  font-size: 15px;
}

.notfound {
  text-align: center;
  padding: 120px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
    gap: 36px;
  }
}
</style>
