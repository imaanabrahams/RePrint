<script setup>
import { ref, computed } from 'vue'

// --- current employee (would come from auth/session in production) ---
const employee = ref({
  name: 'Aisha Daniels',
  role: 'Production Coordinator',
  employeeId: 'RP-0142',
  initials: 'AD',
})

const now = new Date()
const greeting = computed(() => {
  const h = now.getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
})

// --- print queue ---
const printQueue = ref([
  { id: 'J-1042', orderId: '#10298', customer: 'Nomvula K.', item: 'Phone stand (custom logo)', material: 'PLA · Recycled', printer: 'Printer 02', status: 'Printing', progress: 64, eta: '48 min' },
  { id: 'J-1043', orderId: '#10301', customer: 'Craig P.', item: 'Desk organizer, 3-slot', material: 'PETG', printer: 'Printer 04', status: 'Printing', progress: 22, eta: '2h 10m' },
  { id: 'J-1044', orderId: '#10303', customer: 'Fatima A.', item: 'Personalized keychain x5', material: 'PLA · Recycled', printer: '—', status: 'Queued', progress: 0, eta: 'Starts ~15 min' },
  { id: 'J-1045', orderId: '#10305', customer: 'Werner S.', item: 'Cable clip set', material: 'PLA', printer: 'Printer 01', status: 'Post-processing', progress: 100, eta: 'Ready in 20 min' },
  { id: 'J-1046', orderId: '#10306', customer: 'Lindiwe M.', item: 'Mini planter, textured', material: 'PETG · Recycled', printer: '—', status: 'Queued', progress: 0, eta: 'Starts ~40 min' },
])

const statusStyles = {
  Printing: { bg: '#e4f7ea', color: '#2f6b45' },
  Queued: { bg: '#eef1ec', color: '#5b6f60' },
  'Post-processing': { bg: '#fdf3dd', color: '#9a6d1f' },
  'Ready to ship': { bg: '#e4eefb', color: '#2f5d8a' },
}

// --- printer fleet ---
const printers = ref([
  { name: 'Printer 01', model: 'Prusa MK4', status: 'Post-processing', job: 'J-1045', utilization: 78 },
  { name: 'Printer 02', model: 'Prusa MK4', status: 'Printing', job: 'J-1042', utilization: 91 },
  { name: 'Printer 03', model: 'Bambu X1C', status: 'Idle', job: null, utilization: 34 },
  { name: 'Printer 04', model: 'Bambu X1C', status: 'Printing', job: 'J-1043', utilization: 85 },
  { name: 'Printer 05', model: 'Prusa MK4', status: 'Needs attention', job: null, utilization: 12 },
  { name: 'Printer 06', model: 'Creality K1', status: 'Maintenance', job: null, utilization: 0 },
])

const printerStatusStyles = {
  Printing: { color: '#2f6b45', dot: '#4a6b52' },
  Idle: { color: '#5b6f60', dot: '#9db3a3' },
  'Post-processing': { color: '#9a6d1f', dot: '#d6a13c' },
  'Needs attention': { color: '#b3492f', dot: '#b3492f' },
  Maintenance: { color: '#7a7a7a', dot: '#a8a8a8' },
}

// --- filament inventory ---
const inventory = ref([
  { material: 'PLA', color: 'Ocean Blue', type: 'Recycled', remaining: 620, threshold: 500 },
  { material: 'PLA', color: 'Charcoal', type: 'Virgin', remaining: 210, threshold: 500 },
  { material: 'PETG', color: 'Natural', type: 'Recycled', remaining: 340, threshold: 400 },
  { material: 'PETG', color: 'Forest Green', type: 'Virgin', remaining: 890, threshold: 500 },
  { material: 'TPU', color: 'Black', type: 'Virgin', remaining: 95, threshold: 300 },
])

function stockPercent(item) {
  return Math.min(100, Math.round((item.remaining / (item.threshold * 1.6)) * 100))
}
function isLowStock(item) {
  return item.remaining < item.threshold
}

// --- recent orders ---
const recentOrders = ref([
  { id: '#10306', customer: 'Lindiwe M.', item: 'Mini planter, textured', total: 'R 245', status: 'Processing', date: 'Today, 09:41' },
  { id: '#10305', customer: 'Werner S.', item: 'Cable clip set', total: 'R 180', status: 'Processing', date: 'Today, 08:55' },
  { id: '#10303', customer: 'Fatima A.', item: 'Personalized keychain x5', total: 'R 320', status: 'Paid', date: 'Today, 08:12' },
  { id: '#10301', customer: 'Craig P.', item: 'Desk organizer, 3-slot', total: 'R 410', status: 'Processing', date: 'Yesterday, 17:20' },
  { id: '#10298', customer: 'Nomvula K.', item: 'Phone stand (custom logo)', total: 'R 195', status: 'Processing', date: 'Yesterday, 15:03' },
  { id: '#10291', customer: 'Bongani T.', item: 'Vase, spiral pattern', total: 'R 275', status: 'Shipped', date: 'Yesterday, 11:47' },
])

const orderStatusStyles = {
  Paid: { bg: '#e4eefb', color: '#2f5d8a' },
  Processing: { bg: '#fdf3dd', color: '#9a6d1f' },
  Shipped: { bg: '#e4f7ea', color: '#2f6b45' },
  Delivered: { bg: '#eef1ec', color: '#5b6f60' },
}

// --- alerts ---
const alerts = ref([
  { type: 'error', message: 'Printer 05 stopped mid-print — nozzle clog suspected', time: '12 min ago' },
  { type: 'warning', message: 'TPU Black filament below reorder threshold (95g left)', time: '1h ago' },
  { type: 'warning', message: 'PLA Charcoal (Virgin) below reorder threshold', time: '3h ago' },
  { type: 'info', message: 'Order #10298 customization approved by customer', time: '5h ago' },
])

const alertStyles = {
  error: { bg: '#fbe9e5', color: '#b3492f' },
  warning: { bg: '#fdf3dd', color: '#9a6d1f' },
  info: { bg: '#e4eefb', color: '#2f5d8a' },
}

// --- top-line stats ---
const stats = computed(() => [
  { label: 'Active print jobs', value: printQueue.value.filter(j => j.status !== 'Ready to ship').length, sub: `${printQueue.value.filter(j => j.status === 'Queued').length} queued` },
  { label: 'Printers online', value: `${printers.value.filter(p => p.status !== 'Maintenance').length}/${printers.value.length}`, sub: `${printers.value.filter(p => p.status === 'Needs attention').length} need attention` },
  { label: 'Orders today', value: recentOrders.value.filter(o => o.date.startsWith('Today')).length, sub: 'Across all channels' },
  { label: 'Low stock alerts', value: inventory.value.filter(isLowStock).length, sub: 'Filament spools' },
])
</script>

<template>
  <div class="dashboard">
    <aside class="sidebar">
      <div class="brand">
        <span class="brand-mark">R</span>
        <span class="brand-name">RePrint</span>
      </div>

      <nav class="nav">
        <a class="nav-item active" href="#">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="9" rx="1.5" stroke="currentColor" stroke-width="1.6"/><rect x="14" y="3" width="7" height="5" rx="1.5" stroke="currentColor" stroke-width="1.6"/><rect x="14" y="12" width="7" height="9" rx="1.5" stroke="currentColor" stroke-width="1.6"/><rect x="3" y="16" width="7" height="5" rx="1.5" stroke="currentColor" stroke-width="1.6"/></svg>
          Overview
        </a>
        <a class="nav-item" href="#">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M4 7l8-4 8 4v10l-8 4-8-4V7Z" stroke="currentColor" stroke-width="1.6"/><path d="M4 7l8 4 8-4M12 11v10" stroke="currentColor" stroke-width="1.6"/></svg>
          Print queue
        </a>
        <a class="nav-item" href="#">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M20 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2M3 8h18l-1.2 11a2 2 0 0 1-2 1.8H6.2a2 2 0 0 1-2-1.8L3 8Z" stroke="currentColor" stroke-width="1.6"/></svg>
          Inventory
        </a>
        <a class="nav-item" href="#">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M3 9h18M3 5h18v14H3V5Z" stroke="currentColor" stroke-width="1.6"/></svg>
          Orders
        </a>
        <a class="nav-item" href="#">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.2" stroke="currentColor" stroke-width="1.6"/><path d="M5 20c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5" stroke="currentColor" stroke-width="1.6"/></svg>
          Team
        </a>
      </nav>

      <a class="nav-item logout" href="/staff/login">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        Sign out
      </a>
    </aside>

    <div class="main">
      <header class="topbar">
        <div>
          <p class="eyebrow">{{ greeting }}, {{ employee.name.split(' ')[0] }}</p>
          <h1 class="page-title">Production overview</h1>
        </div>
        <div class="profile">
          <div class="profile-text">
            <span class="profile-name">{{ employee.name }}</span>
            <span class="profile-role">{{ employee.role }} &middot; {{ employee.employeeId }}</span>
          </div>
          <div class="avatar">{{ employee.initials }}</div>
        </div>
      </header>

      <main class="content">
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
              <h2>Print queue</h2>
              <span class="card-header-sub">{{ printQueue.length }} jobs</span>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Item</th>
                  <th>Material</th>
                  <th>Printer</th>
                  <th>Status</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="job in printQueue" :key="job.id">
                  <td>
                    <div class="cell-primary">{{ job.orderId }}</div>
                    <div class="cell-secondary">{{ job.customer }}</div>
                  </td>
                  <td class="cell-secondary">{{ job.item }}</td>
                  <td class="cell-secondary">{{ job.material }}</td>
                  <td class="cell-secondary">{{ job.printer }}</td>
                  <td>
                    <span class="badge" :style="{ background: statusStyles[job.status].bg, color: statusStyles[job.status].color }">
                      {{ job.status }}
                    </span>
                  </td>
                  <td>
                    <div class="progress-cell">
                      <div class="progress-track">
                        <div class="progress-fill" :style="{ width: job.progress + '%' }"></div>
                      </div>
                      <span class="cell-secondary">{{ job.eta }}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="card">
            <div class="card-header">
              <h2>Alerts</h2>
              <span class="card-header-sub">{{ alerts.length }} active</span>
            </div>
            <ul class="alert-list">
              <li v-for="(a, i) in alerts" :key="i" class="alert-item">
                <span class="alert-dot" :style="{ background: alertStyles[a.type].color }"></span>
                <div>
                  <p class="alert-message">{{ a.message }}</p>
                  <p class="alert-time">{{ a.time }}</p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section class="card">
          <div class="card-header">
            <h2>Printer fleet</h2>
            <span class="card-header-sub">{{ printers.length }} machines</span>
          </div>
          <div class="printer-grid">
            <div class="printer-card" v-for="p in printers" :key="p.name">
              <div class="printer-top">
                <span class="printer-name">{{ p.name }}</span>
                <span class="status-dot" :style="{ background: printerStatusStyles[p.status].dot }"></span>
              </div>
              <p class="printer-model">{{ p.model }}</p>
              <p class="printer-status" :style="{ color: printerStatusStyles[p.status].color }">{{ p.status }}</p>
              <p class="printer-job" v-if="p.job">Running {{ p.job }}</p>
              <div class="util-track">
                <div class="util-fill" :style="{ width: p.utilization + '%' }"></div>
              </div>
              <p class="cell-secondary">{{ p.utilization }}% utilization today</p>
            </div>
          </div>
        </section>

        <section class="grid-two">
          <div class="card">
            <div class="card-header">
              <h2>Filament inventory</h2>
              <span class="card-header-sub">{{ inventory.filter(isLowStock).length }} low</span>
            </div>
            <ul class="inventory-list">
              <li v-for="item in inventory" :key="item.material + item.color" class="inventory-item">
                <div class="inventory-top">
                  <div>
                    <span class="cell-primary">{{ item.material }} &middot; {{ item.color }}</span>
                    <span class="tag" :class="{ recycled: item.type === 'Recycled' }">{{ item.type }}</span>
                  </div>
                  <span class="cell-secondary" :class="{ 'low-stock-text': isLowStock(item) }">{{ item.remaining }}g</span>
                </div>
                <div class="util-track">
                  <div
                    class="util-fill"
                    :class="{ 'fill-low': isLowStock(item) }"
                    :style="{ width: stockPercent(item) + '%' }"
                  ></div>
                </div>
              </li>
            </ul>
          </div>

          <div class="card">
            <div class="card-header">
              <h2>Recent orders</h2>
              <span class="card-header-sub">Last 24 hours</span>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Item</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="o in recentOrders" :key="o.id">
                  <td>
                    <div class="cell-primary">{{ o.id }}</div>
                    <div class="cell-secondary">{{ o.customer }}</div>
                  </td>
                  <td class="cell-secondary">{{ o.item }}</td>
                  <td class="cell-secondary">{{ o.total }}</td>
                  <td>
                    <span class="badge" :style="{ background: orderStatusStyles[o.status].bg, color: orderStatusStyles[o.status].color }">
                      {{ o.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  --bg: #eef4ef;
  --panel-bg: #ffffff;
  --panel-border: #dfe9e1;
  --input-border: #cfe8d6;
  --text-primary: #1f2e24;
  --text-secondary: #6b7c70;
  --accent: #4a6b52;
  --accent-hover: #3d5a44;
  --error: #b3492f;

  display: flex;
  min-height: 100vh;
  background: var(--bg);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: var(--text-primary);
}

/* --- sidebar --- */
.sidebar {
  width: 220px;
  flex-shrink: 0;
  background: var(--panel-bg);
  border-right: 1px solid var(--panel-border);
  display: flex;
  flex-direction: column;
  padding: 22px 16px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 8px 24px;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: var(--accent);
  color: #fff;
  font-weight: 700;
  font-size: 13px;
}

.brand-name {
  font-weight: 700;
  font-size: 15px;
  color: #4a6357;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
}

.nav-item:hover {
  background: #f2f7f3;
  color: var(--text-primary);
}

.nav-item.active {
  background: #e4f7ea;
  color: var(--accent-hover);
}

.nav-item.logout {
  margin-top: auto;
  border-top: 1px solid var(--panel-border);
  padding-top: 14px;
}

/* --- main --- */
.main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  border-bottom: 1px solid var(--panel-border);
  background: var(--panel-bg);
}

.eyebrow {
  margin: 0 0 4px;
  font-size: 12.5px;
  color: var(--text-secondary);
}

.page-title {
  margin: 0;
  font-size: 21px;
  font-weight: 700;
  color: #2f4438;
}

.profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.profile-text {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.profile-name {
  font-size: 13.5px;
  font-weight: 600;
}

.profile-role {
  font-size: 12px;
  color: var(--text-secondary);
}

.avatar {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
}

.content {
  flex: 1;
  padding: 28px 32px 60px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* --- stats --- */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  background: var(--panel-bg);
  border: 1px solid var(--panel-border);
  border-radius: 12px;
  padding: 18px 20px;
}

.stat-label {
  margin: 0 0 8px;
  font-size: 12.5px;
  color: var(--text-secondary);
}

.stat-value {
  margin: 0 0 4px;
  font-size: 26px;
  font-weight: 700;
  color: #2f4438;
}

.stat-sub {
  margin: 0;
  font-size: 12px;
  color: var(--text-secondary);
}

/* --- cards / grid --- */
.grid-two {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 16px;
  align-items: start;
}

.card {
  background: var(--panel-bg);
  border: 1px solid var(--panel-border);
  border-radius: 12px;
  padding: 20px 22px 22px;
}

.card-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 14px;
}

.card-header h2 {
  margin: 0;
  font-size: 15.5px;
  font-weight: 700;
  color: #2f4438;
}

.card-header-sub {
  font-size: 12px;
  color: var(--text-secondary);
}

/* --- table --- */
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.table th {
  text-align: left;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--text-secondary);
  padding: 0 10px 10px 0;
  border-bottom: 1px solid var(--panel-border);
}

.table td {
  padding: 11px 10px 11px 0;
  border-bottom: 1px solid #f0f4f1;
  vertical-align: middle;
}

.table tr:last-child td {
  border-bottom: none;
}

.cell-primary {
  font-weight: 600;
  font-size: 13px;
}

.cell-secondary {
  font-size: 12.5px;
  color: var(--text-secondary);
}

.low-stock-text {
  color: var(--error);
  font-weight: 600;
}

.badge {
  display: inline-block;
  padding: 3px 9px;
  border-radius: 100px;
  font-size: 11.5px;
  font-weight: 600;
  white-space: nowrap;
}

.progress-cell {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 100px;
}

.progress-track,
.util-track {
  width: 100%;
  height: 6px;
  border-radius: 100px;
  background: #eef1ec;
  overflow: hidden;
}

.progress-fill,
.util-fill {
  height: 100%;
  border-radius: 100px;
  background: var(--accent);
}

.util-fill.fill-low {
  background: var(--error);
}

/* --- alerts --- */
.alert-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.alert-item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.alert-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 5px;
  flex-shrink: 0;
}

.alert-message {
  margin: 0 0 2px;
  font-size: 13px;
  line-height: 1.4;
}

.alert-time {
  margin: 0;
  font-size: 11.5px;
  color: var(--text-secondary);
}

/* --- printer fleet --- */
.printer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 14px;
}

.printer-card {
  border: 1px solid var(--panel-border);
  border-radius: 10px;
  padding: 14px 16px;
}

.printer-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.printer-name {
  font-weight: 600;
  font-size: 13.5px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.printer-model {
  margin: 0 0 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

.printer-status {
  margin: 0 0 2px;
  font-size: 12.5px;
  font-weight: 600;
}

.printer-job {
  margin: 0 0 10px;
  font-size: 12px;
  color: var(--text-secondary);
}

.printer-card .util-track {
  margin-top: 10px;
  margin-bottom: 6px;
}

/* --- inventory --- */
.inventory-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.inventory-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  gap: 10px;
}

.tag {
  display: inline-block;
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 100px;
  font-size: 10.5px;
  font-weight: 600;
  background: #eef1ec;
  color: var(--text-secondary);
}

.tag.recycled {
  background: #e4f7ea;
  color: var(--accent-hover);
}

/* --- responsive --- */
@media (max-width: 1080px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
  .grid-two {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .sidebar {
    display: none;
  }
  .topbar,
  .content {
    padding-left: 18px;
    padding-right: 18px;
  }
  .stats-row {
    grid-template-columns: 1fr 1fr;
  }
}
</style>