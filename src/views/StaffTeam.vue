<script setup>
import { ref, computed, onMounted } from 'vue'
import { getEmployees } from '../apiReprint.js'

const employees = ref([])
const loading = ref(true)

onMounted(async () => {
  employees.value = await getEmployees()
  loading.value = false
})

const statusColors = {
  active: '#1d5534',
  on_leave: '#7a5b0e',
  terminated: '#8a2020',
}

const departmentLabels = {
  production: 'Production',
  design: 'Design',
  sales: 'Sales',
  hr: 'HR',
  management: 'Management',
  support: 'Support',
}

const filterStatus = ref('all')

const filteredEmployees = computed(() => {
  if (filterStatus.value === 'all') return employees.value
  return employees.value.filter(e => e.status === filterStatus.value)
})

function initials(name) {
  if (!name) return 'U'
  return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()
}
</script>

<template>
  <section class="stats-row">
    <div class="stat-card">
      <p class="stat-label">Team members</p>
      <p class="stat-value">{{ employees.length }}</p>
      <p class="stat-sub">Across all departments</p>
    </div>
    <div class="stat-card">
      <p class="stat-label">Active</p>
      <p class="stat-value">{{ employees.filter(e => e.status === 'active').length }}</p>
      <p class="stat-sub">Currently employed</p>
    </div>
    <div class="stat-card">
      <p class="stat-label">Departments</p>
      <p class="stat-value">{{ new Set(employees.map(e => e.department).filter(Boolean)).size }}</p>
      <p class="stat-sub">Active departments</p>
    </div>
  </section>

  <section class="card">
    <div class="card-header">
      <h2>Team</h2>
      <span class="card-header-sub">{{ filteredEmployees.length }} people</span>
    </div>

    <div class="filter-tabs">
      <button class="filter-tab" :class="{ active: filterStatus === 'all' }" @click="filterStatus = 'all'">All</button>
      <button class="filter-tab" :class="{ active: filterStatus === 'active' }" @click="filterStatus = 'active'">Active</button>
      <button class="filter-tab" :class="{ active: filterStatus === 'on_leave' }" @click="filterStatus = 'on_leave'">On leave</button>
    </div>

    <p v-if="loading" class="cell-secondary">Loading team...</p>
    <p v-else-if="!filteredEmployees.length" class="cell-secondary">No team members found.</p>

    <div v-else class="team-grid">
      <div class="team-card" v-for="emp in filteredEmployees" :key="emp.id">
        <div class="team-card-top">
          <div class="avatar" :style="{ background: emp.status === 'active' ? '#e4f7ea' : '#fbe9e5', color: emp.status === 'active' ? '#1d5534' : '#8a2020' }">
            {{ initials(emp.name) }}
          </div>
          <div>
            <p class="team-name">{{ emp.name || emp.email }}</p>
            <p class="team-role">{{ emp.position || '---' }} &middot; {{ departmentLabels[emp.department] || emp.department || '---' }}</p>
          </div>
        </div>
        <div class="team-meta">
          <span class="status-dot" :style="{ background: statusColors[emp.status] || '#8a8a8a' }"></span>
          {{ emp.status ? emp.status.replace('_', ' ') : 'Unknown' }}
          <span v-if="emp.hourly_rate"> &middot; R{{ Number(emp.hourly_rate).toFixed(2) }}/hr</span>
        </div>
        <p class="cell-secondary">{{ emp.email }}</p>
      </div>
    </div>
  </section>
</template>
