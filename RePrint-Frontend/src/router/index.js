import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/staff/login',
      name: 'EmployeeLogin',
      component: () => import('@/views/employeeLogin.vue'),
    },
  ],
})

export default router