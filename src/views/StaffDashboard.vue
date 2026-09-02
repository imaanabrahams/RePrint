<script setup>
import { ref, computed, onMounted } from 'vue'
import { getOrders, getMaterials, getEmployees, getNotifications } from '../apiReprint.js'

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
  pending: { bg: '#eef1ec', color: '#3d4c42', label: 'Pending' },
  confirmed: { bg: '#e4eefb', color: '#1f4268', label: 'Confirmed' },
  printing: { bg: '#e4f7ea', color: '#1d5534', label: 'Printing' },
  quality_check: { bg: '#fdf3dd', color: '#7a5b0e', label: 'Quality check' },
  shipped: { bg: '#e8e4fb', color: '#3e2870', label: 'Shipped' },
  delivered: { bg: '#eef1ec', color: '#3d4c42', label: 'Delivered' },
  cancelled: { bg: '#fbe9e5', color: '#8a2020', label: 'Cancelled' },
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
  return `R ${Number(n || 0).toFixed(2)}`
}
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
}

const stats = computed(() => [
  { label: 'Orders today', value: orders.value.filter(o => isToday(o.created_at)).length, sub: 'Across all channels' },
  { label: 'In production', value: orders.value.filter(o => PRODUCTION_STATUSES.includes(o.status)).length, sub: 'Confirmed through quality check' },
  { label: 'Revenue', value: formatPrice(orders.value.reduce((s, o) => s + Number(o.total_price || 0), 0)), sub: 'Total across all orders' },
  { label: 'Active team', value: employees.value.filter(e => e.status === 'active').length, sub: `of ${employees.value.length} members` },
])

const productionOrders = computed(() =>
  orders.value.filter(o => PRODUCTION_STATUSES.includes(o.status)).slice(0, 5)
)
const recentOrders = computed(() => orders.value.slice(0, 6))

const lowStockMaterials = computed(() =>
  materials.value.filter(m => !m.in_stock).slice(0, 4)
)
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
      <p v-if="loading" class="cell-secondary">Loading...</p>
      <table v-else-if="productionOrders.length" class="table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Status</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in productionOrders" :key="o.id">
            <td>
              <div class="cell-primary">#{{ o.id }}</div>
              <div class="cell-secondary">{{ o.customer_name || o.shipping_address?.split(',')[0] || 'Customer' }}</div>
            </td>
            <td class="cell-secondary">{{ o.product_name || '---' }}</td>
            <td class="cell-secondary">{{ o.quantity }}</td>
            <td>
              <span class="badge" :style="{ background: orderStatusStyles[o.status].bg, color: orderStatusStyles[o.status].color }">
                {{ orderStatusStyles[o.status].label }}
              </span>
            </td>
            <td class="cell-secondary">{{ timeAgo(o.updated_at) }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else class="cell-secondary">No items currently in production.</p>
    </div>

    <div class="card">
      <div class="card-header">
        <h2>Low stock alerts</h2>
        <router-link to="/staff/inventory" class="card-header-sub">View all &rarr;</router-link>
      </div>
      <p v-if="loading" class="cell-secondary">Loading...</p>
      <ul v-else-if="lowStockMaterials.length" class="alert-list">
        <li v-for="m in lowStockMaterials" :key="m.id" class="alert-item">
          <span class="alert-dot" style="background: #b3492f"></span>
          <div>
            <p class="alert-message">{{ m.name }} ({{ m.color }}) is out of stock</p>
            <p class="alert-time">{{ m.properties?.strength ? 'Strength: ' + m.properties.strength : 'Check supplier' }}</p>
          </div>
        </li>
      </ul>
      <p v-else class="cell-secondary">All materials in stock.</p>
    </div>
  </section>

  <section class="grid-two">
    <div class="card">
      <div class="card-header">
        <h2>Materials</h2>
        <router-link to="/staff/inventory" class="card-header-sub">View all &rarr;</router-link>
      </div>
      <p v-if="loading" class="cell-secondary">Loading...</p>
      <ul v-else-if="materials.length" class="inventory-list">
        <li v-for="m in materials.slice(0, 5)" :key="m.id" class="inventory-item">
          <div class="inventory-top">
            <div>
              <span class="cell-primary">{{ m.name }} &middot; {{ m.color }}</span>
              <span v-if="m.properties?.type" class="tag" :class="{ recycled: m.properties.type === 'recycled' }">
                {{ m.properties.type }}
              </span>
            </div>
            <span class="badge" :style="m.in_stock ? { background: '#e4f7ea', color: '#1d5534' } : { background: '#fbe9e5', color: '#8a2020' }">
              {{ m.in_stock ? 'In stock' : 'Out of stock' }}
            </span>
          </div>
        </li>
      </ul>
      <p v-else class="cell-secondary">No materials tracked.</p>
    </div>

    <div class="card">
      <div class="card-header">
        <h2>Recent orders</h2>
        <router-link to="/staff/orders" class="card-header-sub">View all &rarr;</router-link>
      </div>
      <p v-if="loading" class="cell-secondary">Loading...</p>
      <table v-else-if="recentOrders.length" class="table">
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
              <div class="cell-secondary">{{ o.customer_name || 'Customer' }}</div>
            </td>
            <td class="cell-secondary">{{ o.product_name || '---' }}</td>
            <td class="cell-secondary">{{ formatPrice(o.total_price) }}</td>
            <td>
              <span class="badge" :style="{ background: orderStatusStyles[o.status].bg, color: orderStatusStyles[o.status].color }">
                {{ orderStatusStyles[o.status].label }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="cell-secondary">No orders yet.</p>
    </div>
  </section>

  <section class="grid-two">
    <div class="card">
      <div class="card-header">
        <h2>Team members</h2>
        <router-link to="/staff/team" class="card-header-sub">View all &rarr;</router-link>
      </div>
      <p v-if="loading" class="cell-secondary">Loading...</p>
      <ul v-else-if="employees.length" class="team-preview">
        <li v-for="emp in employees.slice(0, 4)" :key="emp.id" class="team-preview-item">
          <div class="avatar" :style="{ background: emp.status === 'active' ? '#e4f7ea' : '#fbe9e5', color: emp.status === 'active' ? '#1d5534' : '#8a2020' }">
            {{ (emp.name || emp.email || 'U').charAt(0).toUpperCase() }}
          </div>
          <div>
            <p class="cell-primary">{{ emp.name || emp.email }}</p>
            <p class="cell-secondary">{{ emp.department || '---' }} &middot; {{ emp.position || '---' }}</p>
          </div>
        </li>
      </ul>
      <p v-else class="cell-secondary">No team members.</p>
    </div>

    <div class="card">
      <div class="card-header">
        <h2>Quick actions</h2>
      </div>
      <div class="quick-actions">
        <router-link to="/staff/print-queue" class="quick-action-btn">
          <span class="qa-icon">&#128424;</span>
          <span>Print queue</span>
        </router-link>
        <router-link to="/staff/inventory" class="quick-action-btn">
          <span class="qa-icon">&#128230;</span>
          <span>Inventory</span>
        </router-link>
        <router-link to="/staff/orders" class="quick-action-btn">
          <span class="qa-icon">&#128196;</span>
          <span>Orders</span>
        </router-link>
        <router-link to="/staff/team" class="quick-action-btn">
          <span class="qa-icon">&#128101;</span>
          <span>Team</span>
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.team-preview {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0;
  margin: 0;
}
.team-preview-item {
  display: flex;
  align-items: center;
  gap: 10px;
}
.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}
.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 12px;
  border-radius: 10px;
  border: 1px solid #e0e4de;
  background: #f6f8f5;
  color: #263b2e;
  font-weight: 600;
  font-size: 13px;
  text-decoration: none;
  transition: background 0.15s, border-color 0.15s;
}
.quick-action-btn:hover {
  background: #e4ebe2;
  border-color: #3d5a44;
}
.qa-icon {
  font-size: 18px;
}
</style>
