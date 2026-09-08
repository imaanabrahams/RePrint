<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const employee = {
  name: 'Aisha Daniels',
  role: 'Production Coordinator',
  employeeId: 'RP-0142',
  initials: 'AD',
}

const route = useRoute()

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
})

const pageTitle = computed(() => route.meta.title || 'Overview')

const navItems = [
  { to: '/staff/dashboard', label: 'Overview' },
  { to: '/staff/print-queue', label: 'Print queue' },
  { to: '/staff/inventory', label: 'Inventory' },
  { to: '/staff/orders', label: 'Orders' },
  { to: '/staff/team', label: 'Team' },
]

const navIcons = {
  Overview: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  'Print queue': '<path d="M4 7l8-4 8 4v10l-8 4-8-4V7Z"/><path d="M4 7l8 4 8-4M12 11v10"/>',
  Inventory: '<path d="M20 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2M3 8h18l-1.2 11a2 2 0 0 1-2 1.8H6.2a2 2 0 0 1-2-1.8L3 8Z"/>',
  Orders: '<path d="M3 9h18M3 5h18v14H3V5Z"/>',
  Team: '<circle cx="12" cy="8" r="3.2"/><path d="M5 20c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5"/>',
}
</script>

<template>
  <div class="staff-app">
    <aside class="sidebar">
      <div class="brand">
        <span class="brand-mark">R</span>
        <span class="brand-name">RePrint</span>
      </div>

      <nav class="nav">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-item"
          active-class="active"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke-width="1.6" v-html="navIcons[item.label]"></svg>
          {{ item.label }}
        </router-link>
      </nav>

      <router-link class="nav-item logout" to="/staff/login">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        Sign out
      </router-link>
    </aside>

    <div class="main">
      <header class="topbar">
        <div>
          <p class="eyebrow">{{ greeting }}, {{ employee.name.split(' ')[0] }}</p>
          <h1 class="page-title">{{ pageTitle }}</h1>
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
        <router-view />
      </main>
    </div>
  </div>
</template>
