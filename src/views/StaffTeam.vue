<script setup>
import { ref, onMounted } from 'vue'
import { getEmployees } from '../apiReprint.js'

const employees = ref([])
const loading = ref(true)

onMounted(async () => {
  employees.value = await getEmployees()
  loading.value = false
})

const statusColors = {
  active: '#4a6b52',
  on_leave: '#d6a13c',
  terminated: '#a8a8a8',
}

const departmentLabels = {
  production: 'Production',
  design: 'Design',
  sales: 'Sales',
  hr: 'HR',
  management: 'Management',
  support: 'Support',
}

function initials(name) {
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
      <p class="stat-label">On shift today</p>
      <p class="stat-value">{{ employees.filter(e => e.todays_shift).length }}</p>
      <p class="stat-sub">Scheduled for today</p>
    </div>
  </section>

  <section class="card">
    <div class="card-header">
      <h2>Team</h2>
      <span class="card-header-sub">{{ employees.length }} people</span>
    </div>

    <p v-if="loading" class="cell-secondary">Loading team...</p>

    <div v-else class="team-grid">
      <div class="team-card" v-for="emp in employees" :key="emp.id">
        <div class="team-card-top">
          <div class="avatar">{{ initials(emp.user.name) }}</div>
          <div>
            <p class="team-name">{{ emp.user.name }}</p>
            <p class="team-role">{{ emp.position }} &middot; {{ departmentLabels[emp.department] }}</p>
          </div>
        </div>
        <div class="team-meta">
          <span class="status-dot" :style="{ background: statusColors[emp.status] }"></span>
          {{ emp.status.replace('_', ' ') }}
          <span v-if="emp.todays_shift"> &middot; {{ emp.todays_shift.start_time }}-{{ emp.todays_shift.end_time }}</span>
          <span v-else> &middot; No shift today</span>
        </div>
        <p class="cell-secondary">{{ emp.employee_id }}</p>
      </div>
    </div>
  </section>
</template>
