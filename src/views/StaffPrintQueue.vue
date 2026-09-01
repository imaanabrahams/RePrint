<script setup>
import { ref, computed, onMounted } from 'vue'
import { getOrders } from '../apiReprint.js'

const PRODUCTION_STATUSES = ['confirmed', 'printing', 'quality_check']

const orders = ref([])
const loading = ref(true)

onMounted(async () => {
  const all = await getOrders()
  orders.value = all.filter(o => PRODUCTION_STATUSES.includes(o.status))
  loading.value = false
})

const statusStyles = {
  confirmed: { bg: '#e4eefb', color: '#1f4268', label: 'Confirmed' },
  printing: { bg: '#e4f7ea', color: '#1d5534', label: 'Printing' },
  quality_check: { bg: '#fdf3dd', color: '#7a5b0e', label: 'Quality check' },
}

const filters = ['All', ...PRODUCTION_STATUSES]
const activeFilter = ref('All')

const filteredOrders = computed(() =>
  activeFilter.value === 'All'
    ? orders.value
    : orders.value.filter(o => o.status === activeFilter.value)
)

const productionStats = computed(() => ({
  confirmed: orders.value.filter(o => o.status === 'confirmed').length,
  printing: orders.value.filter(o => o.status === 'printing').length,
  quality_check: orders.value.filter(o => o.status === 'quality_check').length,
}))

function formatDate(iso) {
  return new Date(iso).toLocaleString('en-ZA', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <section class="stats-row">
    <div class="stat-card">
      <p class="stat-label">In production</p>
      <p class="stat-value">{{ orders.length }}</p>
      <p class="stat-sub">Total items being produced</p>
    </div>
    <div class="stat-card">
      <p class="stat-label">Confirmed</p>
      <p class="stat-value">{{ productionStats.confirmed }}</p>
      <p class="stat-sub">Awaiting printing</p>
    </div>
    <div class="stat-card">
      <p class="stat-label">Printing</p>
      <p class="stat-value">{{ productionStats.printing }}</p>
      <p class="stat-sub">Currently printing</p>
    </div>
    <div class="stat-card">
      <p class="stat-label">Quality check</p>
      <p class="stat-value">{{ productionStats.quality_check }}</p>
      <p class="stat-sub">Awaiting inspection</p>
    </div>
  </section>

  <section class="card">
    <div class="card-header">
      <h2>Production queue</h2>
      <span class="card-header-sub">{{ filteredOrders.length }} of {{ orders.length }} in production</span>
    </div>

    <div class="filter-tabs">
      <button
        v-for="f in filters"
        :key="f"
        class="filter-tab"
        :class="{ active: activeFilter === f }"
        @click="activeFilter = f"
      >
        {{ f === 'All' ? 'All' : statusStyles[f]?.label || f }}
      </button>
    </div>

    <p v-if="loading" class="cell-secondary">Loading production queue...</p>
    <p v-else-if="!filteredOrders.length" class="cell-secondary">Nothing in this stage right now.</p>

    <table v-else class="table">
      <thead>
        <tr>
          <th>Order</th>
          <th>Product</th>
          <th>Material</th>
          <th>Qty</th>
          <th>Status</th>
          <th>Last updated</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="o in filteredOrders" :key="o.id">
          <td>
            <div class="cell-primary">#{{ o.id }}</div>
            <div class="cell-secondary">{{ o.customer_name || 'Customer' }}</div>
          </td>
          <td class="cell-secondary">{{ o.product_name || '---' }}</td>
          <td class="cell-secondary">{{ o.material_name || '---' }}</td>
          <td class="cell-secondary">{{ o.quantity }}</td>
          <td>
            <span class="badge" :style="{ background: statusStyles[o.status]?.bg, color: statusStyles[o.status]?.color }">
              {{ statusStyles[o.status]?.label || o.status }}
            </span>
          </td>
          <td class="cell-secondary">{{ formatDate(o.updated_at) }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
