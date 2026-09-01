import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/staff/login',
      name: 'EmployeeLogin',
      component: () => import('@/views/employeeLogin.vue'),
    },
    { 
      path: '/staff/dashboard', 
      name: 'EmployeeDashboard', 
      component: () => import('@/views/employeeDashboard.vue') }
  ],
})

export default router