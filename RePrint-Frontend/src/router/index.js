import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/staff/login',
      name: 'EmployeeLogin',
      component: () => import('@/views/EmployeeLogin.vue'),
    },
    {
      path: '/staff',
      component: () => import('@/layouts/StaffLayout.vue'),
      children: [
        {
          path: 'dashboard',
          name: 'DashboardOverview',
          component: () => import('@/views/DashboardOverview.vue'),
          meta: { title: 'Production overview' },
        },
        {
          path: 'print-queue',
          name: 'PrintQueue',
          component: () => import('@/views/PrintQueue.vue'),
          meta: { title: 'Print queue' },
        },
        {
          path: 'inventory',
          name: 'Inventory',
          component: () => import('@/views/Inventory.vue'),
          meta: { title: 'Inventory' },
        },
        {
          path: 'orders',
          name: 'Orders',
          component: () => import('@/views/Orders.vue'),
          meta: { title: 'Orders' },
        },
        {
          path: 'team',
          name: 'Team',
          component: () => import('@/views/Team.vue'),
          meta: { title: 'Team' },
        },
      ],
    },
  ],
})

export default router