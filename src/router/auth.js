export default [
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('@/views/pages/auth/Login.vue')
  },
  {
    path: '/auth/signup',
    name: 'register',
    component: () => import('@/views/pages/auth/Register.vue')
  },
  {
    path: '/auth/signup_success',
    name: 'registerSuccess',
    component: () => import('@/views/pages/auth/CheckEmail.vue')
  },
  {
    path: '/auth/verify_email/:token',
    name: 'verifyEmail',
    component: () => import('@/views/pages/auth/VerifyEmail.vue')
  },
  {
    path: '/auth/resend_verification_email',
    name: 'resendVerificationEmail',
    component: () => import('@/views/pages/auth/ResendVerificationEmail.vue')
  },
  {
    path: '/auth/access',
    name: 'accessDenied',
    component: () => import('@/views/pages/auth/Access.vue')
  },
  {
    path: '/auth/error',
    name: 'error',
    component: () => import('@/views/pages/auth/Error.vue')
  }
];
