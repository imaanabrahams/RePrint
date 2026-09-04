<script setup>
import { ref, computed, onMounted } from 'vue'
import { getOrders, getMaterials, getEmployees, getNotifications } from '@/apiReprint.js'

const orders = ref([])
const materials = ref([])
const employees = ref([])
const notifications = ref([])
const loading = ref(true)

onMounted(async () => {
  const [ordersData, materialsData, employeesData, notificationsData] = await Promise.all([
    getOrders(),
    getMaterials(),
    getEmployees(),
    getNotifications(),
  ])
  orders.value = ordersData
  materials.value = materialsData
  employees.value = employeesData
  notifications.value = notificationsData
  loading.value = false
})

const PRODUCTION_STATUSES = ['confirmed', 'printing', 'quality_check']

const orderStatusStyles = {
  pending: { bg: '#eef1ec', color: '#5b6f60', label: 'Pending' },
  confirmed: { bg: '#e4eefb', color: '#2f5d8a', label: 'Confirmed' },
  printing: { bg: '#e4f7ea', color: '#2f6b45', label: 'Printing' },
  quality_check: { bg: '#fdf3dd', color: '#9a6d1f', label: 'Quality check' },
  shipped: { bg: '#e8e4fb', color: '#5d4e9a', label: 'Shipped' },
  delivered: { bg: '#eef1ec', color: '#5b6f60', label: 'Delivered' },
  cancelled: { bg: '#fbe9e5', color: '#b3492f', label: 'Cancelled' },
}

const notificationColors = {
  info: '#2f5d8a',
  order: '#2f6b45',
  payment: '#9a6d1f',
  consultation: '#5d4e9a',
  system: '#b3492f',
}

function isToday(iso) {
  const d = new Date(iso)
  const now = new Date()
  return d.toDateString() === now.toDateString()
}
function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}
function formatPrice(n) {
  return `R ${Number(n).toFixed(2)}`
}

const stats = computed(() => [
  { label: 'Orders today', value: orders.value.filter(o => isToday(o.created_at)).length, sub: 'Across all channels' },
  { label: 'In production', value: orders.value.filter(o => PRODUCTION_STATUSES.includes(o.status)).length, sub: 'Confirmed through quality check' },
  { label: 'Materials out of stock', value: materials.value.filter(m => !m.in_stock).length, sub: `of ${materials.value.length} tracked` },
  { label: 'Active employees', value: employees.value.filter(e => e.status === 'active').length, sub: `of ${employees.value.length} total` },
])

const productionOrders = computed(() =>
  orders.value.filter(o => PRODUCTION_STATUSES.includes(o.status)).slice(0, 5)
)
const recentOrders = computed(() => orders.value.slice(0, 6))
</script>

<template>
  <section class="stats-row">
    <div class="stat-card" v-for="s in stats" :key="s.label">
      <p class="stat-label">{{ s.label }}</p>
      <p class="stat-value">{{ s.value }}</p>
      <p class="stat-sub">{{ s.sub }}</p>
    </div>
  </section>

  <section class="grid-two">
    <div class="card">
      <div class="card-header">
        <h2>Production queue</h2>
        <router-link to="/staff/print-queue" class="card-header-sub">View all &rarr;</router-link>
      </div>
      <p v-if="loading" class="cell-secondary">Loading…</p>
      <table v-else class="table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Product</th>
            <th>Status</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in productionOrders" :key="o.id">
            <td>
              <div class="cell-primary">#{{ o.id }}</div>
              <div class="cell-secondary">{{ o.customer.name }}</div>
            </td>
            <td class="cell-secondary">{{ o.product?.name ?? '—' }}</td>
            <td>
              <span class="badge" :style="{ background: orderStatusStyles[o.status].bg, color: orderStatusStyles[o.status].color }">
                {{ orderStatusStyles[o.status].label }}
              </span>
            </td>
            <td class="cell-secondary">{{ timeAgo(o.updated_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="card-header">
        <h2>Alerts</h2>
        <span class="card-header-sub">{{ notifications.filter(n => !n.read).length }} unread</span>
      </div>
      <ul class="alert-list">
        <li v-for="n in notifications" :key="n.id" class="alert-item">
          <span class="alert-dot" :style="{ background: notificationColors[n.type] }"></span>
          <div>
            <p class="alert-message">{{ n.message }}</p>
            <p class="alert-time">{{ timeAgo(n.created_at) }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>

  <section class="grid-two">
    <div class="card">
      <div class="card-header">
        <h2>Materials</h2>
        <router-link to="/staff/inventory" class="card-header-sub">View all &rarr;</router-link>
      </div>
      <ul class="inventory-list">
        <li v-for="m in materials.slice(0, 5)" :key="m.id" class="inventory-item">
          <div class="inventory-top">
            <div>
              <span class="cell-primary">{{ m.name }} &middot; {{ m.color }}</span>
              <span v-if="m.properties?.type" class="tag" :class="{ recycled: m.properties.type === 'recycled' }">
                {{ m.properties.type }}
              </span>
            </div>
            <span class="badge" :style="m.in_stock ? { background: '#e4f7ea', color: '#2f6b45' } : { background: '#fbe9e5', color: '#b3492f' }">
              {{ m.in_stock ? 'In stock' : 'Out of stock' }}
            </span>
          </div>
        </li>
      </ul>
    </div>

    <div class="card">
      <div class="card-header">
        <h2>Recent orders</h2>
        <router-link to="/staff/orders" class="card-header-sub">View all &rarr;</router-link>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Product</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in recentOrders" :key="o.id">
            <td>
              <div class="cell-primary">#{{ o.id }}</div>
              <div class="cell-secondary">{{ o.customer.name }}</div>
            </td>
            <td class="cell-secondary">{{ o.product?.name ?? '—' }}</td>
            <td class="cell-secondary">{{ formatPrice(o.total_price) }}</td>
            <td>
              <span class="badge" :style="{ background: orderStatusStyles[o.status].bg, color: orderStatusStyles[o.status].color }">
                {{ orderStatusStyles[o.status].label }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>