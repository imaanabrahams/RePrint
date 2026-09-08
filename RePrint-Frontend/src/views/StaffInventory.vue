<script setup>
import { ref, computed, onMounted } from 'vue'
import { getMaterials } from '../apiReprint.js'

const materials = ref([])
const loading = ref(true)

onMounted(async () => {
  materials.value = await getMaterials()
  loading.value = false
})

const showOutOfStockOnly = ref(false)
const filteredMaterials = computed(() =>
  showOutOfStockOnly.value ? materials.value.filter(m => !m.in_stock) : materials.value
)

function materialType(material) {
  return material.properties?.type
}
</script>

<template>
  <section class="stats-row">
    <div class="stat-card">
      <p class="stat-label">Materials tracked</p>
      <p class="stat-value">{{ materials.length }}</p>
      <p class="stat-sub">Distinct material/color combos</p>
    </div>
    <div class="stat-card">
      <p class="stat-label">Out of stock</p>
      <p class="stat-value">{{ materials.filter(m => !m.in_stock).length }}</p>
      <p class="stat-sub">Needs restocking</p>
    </div>
    <div class="stat-card">
      <p class="stat-label">Recycled options</p>
      <p class="stat-value">{{ materials.filter(m => materialType(m) === 'recycled').length }}</p>
      <p class="stat-sub">Based on properties.type</p>
    </div>
  </section>

  <section class="card">
    <div class="card-header">
      <h2>Materials</h2>
      <span class="card-header-sub">{{ filteredMaterials.length }} of {{ materials.length }}</span>
    </div>

    <div class="filter-tabs">
      <button class="filter-tab" :class="{ active: !showOutOfStockOnly }" @click="showOutOfStockOnly = false">All materials</button>
      <button class="filter-tab" :class="{ active: showOutOfStockOnly }" @click="showOutOfStockOnly = true">Out of stock only</button>
    </div>

    <p v-if="loading" class="cell-secondary">Loading materials...</p>

    <table v-else class="table">
      <thead>
        <tr>
          <th>Material &amp; color</th>
          <th>Type</th>
          <th>Price / gram</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="m in filteredMaterials" :key="m.id">
          <td class="cell-primary">{{ m.name }} &middot; {{ m.color }}</td>
          <td>
            <span v-if="materialType(m)" class="tag" :class="{ recycled: materialType(m) === 'recycled' }">
              {{ materialType(m) }}
            </span>
            <span v-else class="cell-secondary">---</span>
          </td>
          <td class="cell-secondary">R {{ Number(m.price_per_gram).toFixed(2) }}</td>
          <td>
            <span class="badge" :style="m.in_stock ? { background: '#e4f7ea', color: '#2f6b45' } : { background: '#fbe9e5', color: '#b3492f' }">
              {{ m.in_stock ? 'In stock' : 'Out of stock' }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
