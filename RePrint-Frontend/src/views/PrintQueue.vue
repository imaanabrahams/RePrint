<script setup>
import { ref, computed, onMounted } from 'vue'
import { getOrders } from '@/services/api'

// This page shows orders currently in production — i.e. orders whose
// `status` (a real column on the orders table) is confirmed, printing,
// or quality_check. There's no separate print_jobs/printers table in the
// schema, so per-printer assignment, job progress %, and ETA aren't shown
// here since they're not backed by real data yet.

const PRODUCTION_STATUSES = ['confirmed', 'printing', 'quality_check']

const orders = ref([])
const loading = ref(true)

onMounted(async () => {
  const all = await getOrders()
  orders.value = all.filter(o => PRODUCTION_STATUSES.includes(o.status))
  loading.value = false
})

const statusStyles = {
  confirmed: { bg: '#e4eefb', color: '#2f5d8a', label: 'Confirmed' },
  printing: { bg: '#e4f7ea', color: '#2f6b45', label: 'Printing' },
  quality_check: { bg: '#fdf3dd', color: '#9a6d1f', label: 'Quality check' },
}

const filters = ['All', ...PRODUCTION_STATUSES]
const activeFilter = ref('All')

const filteredOrders = computed(() =>
  activeFilter.value === 'All'
    ? orders.value
    : orders.value.filter(o => o.status === activeFilter.value)
)

function formatDate(iso) {
  return new Date(iso).toLocaleString('en-ZA', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
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
        {{ f === 'All' ? 'All' : statusStyles[f].label }}
      </button>
    </div>

    <p v-if="loading" class="cell-secondary">Loading production queue…</p>
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
            <div class="cell-secondary">{{ o.customer.name }}</div>
          </td>
          <td class="cell-secondary">{{ o.product?.name ?? '—' }}</td>
          <td class="cell-secondary">{{ o.material ? `${o.material.name} · ${o.material.color}` : '—' }}</td>
          <td class="cell-secondary">{{ o.quantity }}</td>
          <td>
            <span class="badge" :style="{ background: statusStyles[o.status].bg, color: statusStyles[o.status].color }">
              {{ statusStyles[o.status].label }}
            </span>
          </td>
          <td class="cell-secondary">{{ formatDate(o.updated_at) }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>