<script setup>
import { ref, computed, onMounted } from 'vue'
import { getOrders } from '@/services/api'

const orders = ref([])
const loading = ref(true)

onMounted(async () => {
  orders.value = await getOrders()
  loading.value = false
})

// Matches the `status` ENUM on the orders table exactly.
const statusStyles = {
  pending: { bg: '#eef1ec', color: '#5b6f60', label: 'Pending' },
  confirmed: { bg: '#e4eefb', color: '#2f5d8a', label: 'Confirmed' },
  printing: { bg: '#e4f7ea', color: '#2f6b45', label: 'Printing' },
  quality_check: { bg: '#fdf3dd', color: '#9a6d1f', label: 'Quality check' },
  shipped: { bg: '#e8e4fb', color: '#5d4e9a', label: 'Shipped' },
  delivered: { bg: '#eef1ec', color: '#5b6f60', label: 'Delivered' },
  cancelled: { bg: '#fbe9e5', color: '#b3492f', label: 'Cancelled' },
}

const filters = ['All', 'pending', 'confirmed', 'printing', 'quality_check', 'shipped', 'delivered', 'cancelled']
const activeFilter = ref('All')

const filteredOrders = computed(() =>
  activeFilter.value === 'All'
    ? orders.value
    : orders.value.filter(o => o.status === activeFilter.value)
)

function formatDate(iso) {
  return new Date(iso).toLocaleString('en-ZA', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}
function formatPrice(n) {
  return `R ${Number(n).toFixed(2)}`
}
</script>

<template>
  <section class="stats-row">
    <div class="stat-card">
      <p class="stat-label">Total orders</p>
      <p class="stat-value">{{ orders.length }}</p>
      <p class="stat-sub">All statuses</p>
    </div>
    <div class="stat-card">
      <p class="stat-label">Awaiting confirmation</p>
      <p class="stat-value">{{ orders.filter(o => o.status === 'pending').length }}</p>
      <p class="stat-sub">Needs review</p>
    </div>
    <div class="stat-card">
      <p class="stat-label">In production</p>
      <p class="stat-value">{{ orders.filter(o => ['confirmed', 'printing', 'quality_check'].includes(o.status)).length }}</p>
      <p class="stat-sub">Confirmed through quality check</p>
    </div>
  </section>

  <section class="card">
    <div class="card-header">
      <h2>Orders</h2>
      <span class="card-header-sub">{{ filteredOrders.length }} of {{ orders.length }}</span>
    </div>

    <div class="filter-tabs">
      <button
        v-for="f in filters"
        :key="f"
        class="filter-tab"
        :class="{ active: activeFilter === f }"
        @click="activeFilter = f"
      >
        {{ f === 'All' ? 'All' : statusStyles[f].label }}
      </button>
    </div>

    <p v-if="loading" class="cell-secondary">Loading orders…</p>

    <table v-else class="table">
      <thead>
        <tr>
          <th>Order</th>
          <th>Product</th>
          <th>Material</th>
          <th>Qty</th>
          <th>Total</th>
          <th>Status</th>
          <th>Placed</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="o in filteredOrders" :key="o.id">
          <td>
            <div class="cell-primary">#{{ o.id }}</div>
            <div class="cell-secondary">{{ o.customer.name }}</div>
          </td>
          <td class="cell-secondary">{{ o.product?.name ?? '—' }}</td>
          <td class="cell-secondary">{{ o.material ? `${o.material.name} · ${o.material.color}` : '—' }}</td>
          <td class="cell-secondary">{{ o.quantity }}</td>
          <td class="cell-secondary">{{ formatPrice(o.total_price) }}</td>
          <td>
            <span class="badge" :style="{ background: statusStyles[o.status].bg, color: statusStyles[o.status].color }">
              {{ statusStyles[o.status].label }}
            </span>
          </td>
          <td class="cell-secondary">{{ formatDate(o.created_at) }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>