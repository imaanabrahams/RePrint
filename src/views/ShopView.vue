<script setup>
import { computed, ref } from 'vue'
import { useProductsStore } from '../stores/products'
import ProductCard from '../components/ProductCard.vue'

const products = useProductsStore()
const active = ref('All')
const categories = ['All', 'Home Decor', 'Office', 'Gaming', 'Toys', 'Garden']

const filtered = computed(() =>
  active.value === 'All'
    ? products.products
    : products.products.filter((p) => p.category === active.value)
)
</script>

<template>
  <div class="shop fade-up container">
    <div class="shop-head">
      <div>
        <span class="section-label">Our Collection</span>
        <h1 class="page-title">Shop all products</h1>
      </div>
      <span class="count">{{ filtered.length }} items</span>
    </div>

    <div class="layout">
      <aside class="sidebar">
        <h3>Categories</h3>
        <button
          v-for="c in categories"
          :key="c"
          class="cat"
          :class="{ active: active === c }"
          @click="active = c"
        >
          <span class="dot"></span>
          {{ c }}
        </button>

        <div class="sidebar-box">
          <h4>Need something unique?</h4>
          <p>Design a fully personalised product in minutes.</p>
          <RouterLink to="/create" class="btn btn-accent btn-sm">Create now</RouterLink>
        </div>
      </aside>

      <div class="grid">
        <ProductCard v-for="p in filtered" :key="p.id" :product="p" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.shop {
  padding-top: 56px;
}

.shop-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 36px;
}

.count {
  color: var(--grey);
  font-weight: 600;
  background: var(--bg-card);
  padding: 9px 18px;
  border-radius: 30px;
}

.layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 36px;
}

.sidebar {
  align-self: start;
  position: sticky;
  top: 100px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: var(--shadow);
}

.sidebar h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.cat {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 12px;
  border-radius: 10px;
  font-weight: 600;
  color: var(--grey);
  text-align: left;
  transition: background 0.15s ease, color 0.15s ease;
}

.cat:hover {
  background: rgba(85, 133, 100, 0.1);
  color: var(--dark);
}

.cat.active {
  background: var(--primary);
  color: #fff;
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--accent);
}

.sidebar-box {
  margin-top: 16px;
  background: var(--bg);
  border-radius: 12px;
  padding: 18px;
}

.sidebar-box h4 {
  font-size: 15px;
  margin-bottom: 6px;
}

.sidebar-box p {
  color: var(--grey);
  font-size: 13.5px;
  margin-bottom: 12px;
}

.btn-sm {
  padding: 10px 18px;
  font-size: 13.5px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 26px;
}

@media (max-width: 1000px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 760px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
  }

  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
