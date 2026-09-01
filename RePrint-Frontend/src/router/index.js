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
<<<<<<< HEAD
      component: () => import('@/views/employeeDashboard.vue') }
=======
      component: () => import('@/views/employeeDashboard.vue') 
    }
>>>>>>> 6d56780f8c6d48ab053964ac4b8ad4bd76f4f12c
  ],
})

export default router