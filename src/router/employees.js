import AppLayout from '@/layout/AppLayout.vue';

export default [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '/employees',
        name: 'employees',
        component: () => import('@/views/pages/employee/Employees.vue')
      },
      {
        path: '/deliveries',
        name: 'deliveries',
        component: () => import('@/views/pages/delivery/Deliveries.vue')
      }
    ]
  }
];
