<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStores";
import { api } from "../apiReprint";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const email = ref("admin@reprint.com");
const password = ref("");
const loading = ref(false);
const err = ref("");
const notice = ref("");

const apiUp = ref(null);

const tab = computed(() => route.meta.tab || "dashboard");

function goToTab(name) {
  router.push({ name });
}

const overview = ref(null);
const employees = ref([]);
const shifts = ref([]);
const orders = ref([]);
const orderStats = ref(null);
const materials = ref([]);
const products = ref([]);
const deptFilter = ref("");
const statusFilter = ref("");
const orderStatusFilter = ref("");
const materialTypeFilter = ref("");
const loadingData = ref(false);

const departments = computed(() => {
  const set = new Set(employees.value.map((e) => e.department).filter(Boolean));
  return ["", ...set];
});

const filteredEmployees = computed(() => {
  return employees.value.filter((e) => {
    const d = deptFilter.value && e.department !== deptFilter.value;
    const s = statusFilter.value && e.status !== statusFilter.value;
    return !d && !s;
  });
});

const orderStatusLabels = {
  pending: "Pending",
  confirmed: "Confirmed",
  printing: "Printing",
  quality_check: "Quality check",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const filteredOrders = computed(() => {
  if (!orderStatusFilter.value) return orders.value;
  return orders.value.filter((o) => o.status === orderStatusFilter.value);
});

const materialTypeLabel = (m) => {
  const t = m.properties?.type;
  if (t === "recycled") return "Recycled";
  if (t === "virgin") return "Virgin";
  return "Standard";
};

const filteredMaterials = computed(() => {
  if (!materialTypeFilter.value) return materials.value;
  if (materialTypeFilter.value === "out") {
    return materials.value.filter((m) => !m.in_stock);
  }
  return materials.value;
});

const totalRevenue = computed(() => {
  if (orderStats.value && orderStats.value.total_revenue) return Number(orderStats.value.total_revenue);
  return orders.value.reduce((sum, o) => sum + Number(o.total_price || 0), 0);
});

function fmtPrice(n) {
  if (n === null || n === undefined) return "—";
  return "R" + Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

async function doLogin() {
  loading.value = true;
  err.value = "";
  try {
    await auth.login(email.value, password.value);
    notice.value = `Signed in as ${auth.user?.name || email.value}`;
    await loadData();
  } catch (e) {
    err.value = e.message || "Login failed";
  } finally {
    loading.value = false;
  }
}

async function loadData() {
  if (!auth.isAuthenticated) return;
  loadingData.value = true;
  err.value = "";
  try {
    const [ov, emp, sh, ord, om, mat, prods] = await Promise.all([
      api.get("/hr/reports/overview"),
      api.get("/hr/employees"),
      api.get("/hr/shifts"),
      api.get("/orders"),
      api.get("/orders/stats"),
      api.get("/materials"),
      api.get("/products"),
    ]);
    overview.value = ov;
    employees.value = emp;
    shifts.value = sh;
    orders.value = ord;
    orderStats.value = om;
    materials.value = mat;
    products.value = prods;
  } catch (e) {
    err.value = e.message || "Failed to load data";
  } finally {
    loadingData.value = false;
  }
}

async function logout() {
  auth.logout();
  overview.value = null;
  employees.value = [];
  shifts.value = [];
  orders.value = [];
  orderStats.value = null;
  materials.value = [];
  products.value = [];
  router.push({ name: "hr-overview" });
}

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString();
}

function fmtMoney(n) {
  if (n === null || n === undefined) return "—";
  return "R" + Number(n).toLocaleString();
}

onMounted(() => {
  checkApi();
  if (auth.isAuthenticated && auth.isAdmin) {
    loadData();
  }
});

async function checkApi() {
  apiUp.value = null;
  try {
    await api.get("/health", { auth: false });
    apiUp.value = true;
  } catch {
    apiUp.value = false;
  }
}
</script>

<template>
  <div class="admin fade-up container">
    <div class="head">
      <span class="section-label">Staff Portal</span>
      <h1 class="page-title">Admin System</h1>
      <p>
        Manage the team, shifts and Admin reports from one place. Access is
        restricted to administrators.
      </p>
    </div>

    <p v-if="notice" class="notice" role="status">{{ notice }}</p>
    <p v-if="err" class="error" role="alert">{{ err }}</p>

    <div v-if="apiUp === false" class="banner error-banner" role="alert">
      ⚠ The backend API is not reachable. Start the RePrint-API server (<code
        >npm run dev</code
      >
      in the RePrint-API folder on port 5000), then refresh this page.
    </div>

    <!-- LOGIN GATE -->
    <div
      v-if="!auth.isAuthenticated || !auth.isAdmin"
      class="panel login-panel"
    >
      <div class="brand">
        <span class="logo">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 7c0-1.7 1.3-3 3-3h10c1.7 0 3 1.3 3 3v1H4V7z"
              fill="currentColor"
            />
            <path
              d="M4 10h16v8c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3v-8z"
              fill="currentColor"
              opacity="0.85"
            />
          </svg>
        </span>
        <span class="word">RePrint</span>
      </div>
      <h2>Admin sign in</h2>
      <p class="sub">
        Enter your administrator credentials to open the staff portal.
      </p>

      <form class="form" @submit.prevent="doLogin">
        <label>
          <span>Email</span>
          <input
            v-model="email"
            type="email"
            class="input-field"
            placeholder="you@example.com"
            required
          />
        </label>
        <label>
          <span>Password</span>
          <input
            v-model="password"
            type="password"
            class="input-field"
            placeholder="Password"
            required
          />
        </label>
        <button
          type="submit"
          class="btn btn-primary submit"
          :disabled="loading"
        >
          {{ loading ? "Signing in..." : "Sign in" }}
        </button>
      </form>
      <p class="hint">Demo credentials — admin@reprint.com / password123</p>

      <div class="cred-box">
        <p class="cred-title">Staff login details</p>
        <ul class="cred-list">
          <li><strong>Admin:</strong> admin@reprint.com / password123</li>
          <li><strong>Customer:</strong> user@reprint.com / user123</li>
        </ul>
      </div>
    </div>

    <!-- PORTAL -->
    <div v-else class="portal">
      <div class="toolbar">
        <div class="tabs">
          <button
            class="tab"
            :class="{ active: tab === 'dashboard' }"
            @click="goToTab('hr-overview')"
          >
            Overview
          </button>
          <button
            class="tab"
            :class="{ active: tab === 'employees' }"
            @click="goToTab('hr-employees')"
          >
            Employees <span class="pill">{{ employees.length }}</span>
          </button>
          <button
            class="tab"
            :class="{ active: tab === 'shifts' }"
            @click="goToTab('hr-shifts')"
          >
            Shifts <span class="pill">{{ shifts.length }}</span>
          </button>
          <button
            class="tab"
            :class="{ active: tab === 'orders' }"
            @click="goToTab('hr-orders')"
          >
            Orders <span class="pill">{{ orders.length }}</span>
          </button>
          <button
            class="tab"
            :class="{ active: tab === 'materials' }"
            @click="goToTab('hr-materials')"
          >
            Materials <span class="pill">{{ materials.length }}</span>
          </button>
        </div>
        <div class="toolbar-right">
          <button
            class="btn btn-accent btn-sm"
            @click="loadData"
            :disabled="loadingData"
          >
            Refresh
          </button>
          <button class="btn btn-primary btn-sm" @click="logout">
            Sign out
          </button>
        </div>
      </div>

      <p v-if="loadingData" class="loading">Loading…</p>

      <!-- OVERVIEW -->
      <template v-if="tab === 'dashboard' && overview">
        <div class="stat-grid stat-grid-4">
          <div
            class="stat"
            v-for="row in [
              { label: 'Active employees', value: overview.totalEmployees },
              { label: 'Shifts today', value: overview.shiftsToday },
              {
                label: 'Monthly payroll',
                value: fmtMoney(overview.totalPayroll),
                money: true,
              },
              { label: 'Total orders', value: orders.length },
            ]"
            :key="row.label"
          >
            <strong>{{ row.value }}</strong>
            <span>{{ row.label }}</span>
          </div>
        </div>

        <div class="stat-grid stat-grid-4">
          <div class="stat">
            <strong>{{ materials.filter(m => !m.in_stock).length }}</strong>
            <span>Materials out of stock</span>
          </div>
          <div class="stat">
            <strong>{{ materials.length }}</strong>
            <span>Materials tracked</span>
          </div>
          <div class="stat">
            <strong>{{ products.length }}</strong>
            <span>Products in store</span>
          </div>
          <div class="stat">
            <strong>{{ fmtPrice(totalRevenue) }}</strong>
            <span>Order revenue</span>
          </div>
        </div>

        <section class="panel">
          <h3>Employees by department</h3>
          <ul class="dept-list">
            <li v-for="d in overview.byDepartment || []" :key="d.department">
              <span>{{ d.department }}</span>
              <span class="dept-count">{{ d.count }}</span>
            </li>
            <li
              v-if="!overview.byDepartment || !overview.byDepartment.length"
              class="empty-line"
            >
              No data
            </li>
          </ul>
        </section>

        <section class="panel">
          <h3>Recent hires</h3>
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Department</th>
                <th>Hired</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="e in overview.recentHires || []" :key="e.id">
                <td>{{ e.name }}</td>
                <td>{{ e.position }}</td>
                <td>{{ e.department }}</td>
                <td>{{ fmtDate(e.hire_date) }}</td>
              </tr>
              <tr v-if="!(overview.recentHires || []).length">
                <td colspan="4" class="empty-line">No hires</td>
              </tr>
            </tbody>
          </table>
        </section>
      </template>

      <!-- EMPLOYEES -->
      <template v-if="tab === 'employees'">
        <div class="filters">
          <label>
            <span>Department</span>
            <select v-model="deptFilter" class="input-field">
              <option v-for="d in departments" :key="d" :value="d">
                {{ d || "All" }}
              </option>
            </select>
          </label>
          <label>
            <span>Status</span>
            <select v-model="statusFilter" class="input-field">
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="on_leave">On leave</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
        </div>

        <div class="panel" v-if="filteredEmployees.length">
          <table class="table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Position</th>
                <th>Department</th>
                <th>Type</th>
                <th>Hired</th>
                <th>Salary</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="e in filteredEmployees" :key="e.id">
                <td>{{ e.employee_id }}</td>
                <td>{{ e.name }}</td>
                <td>{{ e.position }}</td>
                <td>{{ e.department }}</td>
                <td>{{ e.employment_type }}</td>
                <td>{{ fmtDate(e.hire_date) }}</td>
                <td>{{ fmtMoney(e.salary) }}</td>
                <td>
                  <span class="status" :class="e.status">{{ e.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="loading">No employees match the filters.</p>
      </template>

      <!-- SHIFTS -->
      <template v-if="tab === 'shifts'">
        <div class="panel" v-if="shifts.length">
          <table class="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee</th>
                <th>Position</th>
                <th>Start</th>
                <th>End</th>
                <th>Break</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in shifts" :key="s.id">
                <td>{{ fmtDate(s.shift_date) }}</td>
                <td>{{ s.employee_name }}</td>
                <td>{{ s.position }}</td>
                <td>{{ s.start_time }}</td>
                <td>{{ s.end_time }}</td>
                <td>{{ s.break_minutes }}m</td>
                <td>
                  <span class="status" :class="s.status">{{ s.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="loading">No shifts scheduled.</p>
      </template>

      <!-- ORDERS -->
      <template v-if="tab === 'orders'">
        <div class="stat-grid stat-grid-4">
          <div class="stat">
            <strong>{{ orders.length }}</strong>
            <span>Total orders</span>
          </div>
          <div class="stat">
            <strong>{{ orders.filter(o => o.status === 'pending').length }}</strong>
            <span>Pending</span>
          </div>
          <div class="stat">
            <strong>{{ orders.filter(o => ['printing','quality_check','confirmed'].includes(o.status)).length }}</strong>
            <span>In production</span>
          </div>
          <div class="stat">
            <strong>{{ fmtPrice(totalRevenue) }}</strong>
            <span>Total revenue</span>
          </div>
        </div>

        <div class="filters">
          <label>
            <span>Status</span>
            <select v-model="orderStatusFilter" class="input-field">
              <option value="">All</option>
              <option v-for="(label, key) in orderStatusLabels" :key="key" :value="key">
                {{ label }}
              </option>
            </select>
          </label>
        </div>

        <div class="panel" v-if="filteredOrders.length">
          <table class="table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
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
                <td>#{{ o.id }}</td>
                <td>{{ o.customer_name || '—' }}</td>
                <td>{{ o.product_name || '—' }}</td>
                <td>{{ o.material_name || '—' }}</td>
                <td>{{ o.quantity }}</td>
                <td>{{ fmtPrice(o.total_price) }}</td>
                <td>
                  <span class="status" :class="o.status">{{ orderStatusLabels[o.status] || o.status }}</span>
                </td>
                <td>{{ fmtDate(o.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="loading">No orders in this view.</p>
      </template>

      <!-- MATERIALS -->
      <template v-if="tab === 'materials'">
        <div class="filters">
          <label>
            <span>Filter</span>
            <select v-model="materialTypeFilter" class="input-field">
              <option value="">All materials</option>
              <option value="out">Out of stock only</option>
            </select>
          </label>
        </div>

        <div class="panel" v-if="filteredMaterials.length">
          <table class="table">
            <thead>
              <tr>
                <th>Material</th>
                <th>Color</th>
                <th>Price / gram</th>
                <th>Properties</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in filteredMaterials" :key="m.id">
                <td>{{ m.name }}</td>
                <td>{{ m.color }}</td>
                <td>{{ fmtPrice(m.price_per_gram) }}</td>
                <td>
                  <span v-if="m.properties" class="status">{{ materialTypeLabel(m) }}</span>
                  <span v-else>—</span>
                </td>
                <td>
                  <span class="status" :class="m.in_stock ? 'active' : ''">{{ m.in_stock ? 'In stock' : 'Out of stock' }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="loading">No materials.</p>
      </template>
    </div>
  </div>
</template>

<style scoped>
.admin {
  padding-top: 56px;
  max-width: 1100px;
}

.head {
  text-align: center;
  max-width: 620px;
  margin: 0 auto 32px;
}

.head p {
  color: var(--grey);
  margin-top: 8px;
}

.panel {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 28px;
  box-shadow: var(--shadow);
}

.notice {
  background: rgba(85, 133, 100, 0.14);
  border: 1px solid var(--primary);
  color: var(--primary-dark);
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  margin-bottom: 16px;
}

.error {
  background: rgba(224, 83, 83, 0.12);
  border: 1px solid #e05353;
  color: #b23b3b;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  margin-bottom: 16px;
}

.banner {
  padding: 14px 16px;
  border-radius: 10px;
  font-size: 14px;
  margin-bottom: 16px;
}

.error-banner {
  background: rgba(224, 83, 83, 0.12);
  border: 1px solid #e05353;
  color: #b23b3b;
}

.banner code {
  background: rgba(0, 0, 0, 0.08);
  padding: 1px 6px;
  border-radius: 5px;
}

.login-panel {
  max-width: 460px;
  margin: 0 auto;
  text-align: center;
}

.login-panel .brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 8px;
}

.login-panel .logo {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: var(--primary);
  color: #fff;
  display: grid;
  place-items: center;
}

.login-panel .word {
  font-size: 24px;
  font-weight: 800;
}

.login-panel h2 {
  font-size: 26px;
  margin-top: 10px;
}

.sub {
  color: var(--grey);
  margin: 6px 0 22px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
}

.form label > span {
  display: block;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
}

.submit {
  width: 100%;
  padding: 15px;
  font-size: 16px;
}

.hint {
  margin-top: 16px;
  color: var(--grey);
  font-size: 13px;
}

.cred-box {
  margin-top: 18px;
  padding: 16px;
  border-radius: 12px;
  background: var(--accent-soft);
  border: 1px dashed var(--primary);
  text-align: left;
}

.cred-box .cred-title {
  font-weight: 700;
  font-size: 13px;
  margin-bottom: 8px;
  color: var(--primary-dark);
}

.cred-box .cred-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: var(--dark);
}

.cred-box .cred-list strong {
  color: var(--primary-dark);
}

.portal {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 20px;
  border-radius: 10px;
  font-weight: 600;
  color: var(--grey);
  background: var(--bg-card);
  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.tab:hover {
  background: rgba(85, 133, 100, 0.12);
}

.tab.active {
  background: var(--primary);
  color: #fff;
}

.pill {
  background: rgba(0, 0, 0, 0.12);
  border-radius: 20px;
  padding: 1px 9px;
  font-size: 12px;
}

.tab.active .pill {
  background: rgba(255, 255, 255, 0.25);
}

.toolbar-right {
  display: flex;
  gap: 10px;
}

.btn-sm {
  padding: 10px 18px;
  font-size: 13.5px;
}

.loading {
  color: var(--grey);
  text-align: center;
  padding: 20px 0;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-grid-4 {
  grid-template-columns: repeat(4, 1fr);
}

.stat {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 26px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
}

.stat strong {
  font-size: 34px;
  font-weight: 800;
  color: var(--primary);
}

.stat span {
  color: var(--grey);
  font-size: 14px;
  margin-top: 4px;
}

.panel h3 {
  font-size: 18px;
  margin-bottom: 16px;
}

.dept-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dept-list li {
  display: flex;
  justify-content: space-between;
  padding: 10px 14px;
  background: var(--bg);
  border-radius: 10px;
  font-weight: 600;
}

.dept-count {
  color: var(--primary);
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table th,
.table td {
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(85, 133, 100, 0.16);
}

.table thead th {
  color: var(--grey);
  font-size: 12.5px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: capitalize;
  background: rgba(143, 131, 137, 0.18);
  color: var(--grey);
}

.status.active {
  background: rgba(85, 133, 100, 0.18);
  color: var(--primary-dark);
}

.status.pending {
  background: rgba(143, 153, 147, 0.22);
  color: #3a4840;
}

.status.confirmed {
  background: rgba(59, 110, 170, 0.18);
  color: #1f4268;
}

.status.printing {
  background: rgba(48, 138, 86, 0.16);
  color: #1d5534;
}

.status.quality_check {
  background: rgba(170, 140, 40, 0.18);
  color: #7a5b0e;
}

.status.shipped {
  background: rgba(100, 70, 170, 0.16);
  color: #3e2870;
}

.status.delivered {
  background: rgba(100, 120, 110, 0.18);
  color: #2d3c35;
}

.status.cancelled {
  background: rgba(190, 50, 50, 0.14);
  color: #8a2020;
}

.status.on_leave {
  background: rgba(170, 150, 40, 0.18);
  color: #7a5b0e;
}

.empty-line {
  color: var(--grey);
  text-align: center;
}

.filters {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.filters label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-weight: 600;
  font-size: 13.5px;
}

.filters select {
  width: 180px;
}

@media (max-width: 700px) {
  .stat-grid {
    grid-template-columns: 1fr;
  }
}
</style>
