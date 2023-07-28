import { createRouter, createWebHashHistory } from 'vue-router';
import { routes } from './routes';
import { useAuthStore } from '@/store/authStore';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/landing',
      name: 'landing',
      component: () => import('@/views/pages/Landing.vue')
    },
    ...routes,
    {
      path: '/:catchAll(.*)',
      name: 'notfound',
      component: () => import('@/views/pages/NotFound.vue')
    }
  ]
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  authStore.currentUser = currentUser;
  // check if router requires auth
  if (!to.meta.requiresAuth) return next();
  // if requieres auth and user is not logged in redirect to login
  if (to.meta.requiresAuth && authStore.isLoggedIn === false) {
    return next({ name: 'login' });
  }
  // if view is only for admin redirect normal user
  if (to.meta.onlyAdmin && !authStore.currentUser.role === 'admin') return next({ name: 'user' });
  return next();
});

export default router;
