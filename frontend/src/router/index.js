import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Import views
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Dashboard from '@/views/Dashboard.vue'
import QuizTaking from '@/views/QuizTaking.vue'
import QuizCreation from '@/views/QuizCreation.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'
import AdminUsers from '@/views/AdminUsers.vue'
import AdminQuizzes from '@/views/AdminQuizzes.vue'
import Subscription from '@/views/Subscription.vue'
import SubscriptionSuccess from '@/views/SubscriptionSuccess.vue'
import Privacy from '@/views/Privacy.vue'
import AnalyticsDashboard from '@/views/AnalyticsDashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Welcome to QuizMaster',
      requiresAuth: false
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Sign In',
      requiresAuth: false,
      redirectIfAuth: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      title: 'Sign Up',
      requiresAuth: false,
      redirectIfAuth: true
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      title: 'Dashboard',
      requiresAuth: true
    }
  },
  {
    path: '/quiz/:id',
    name: 'QuizTaking',
    component: QuizTaking,
    props: true,
    meta: {
      title: 'Taking Quiz',
      requiresAuth: true
    }
  },
  {
    path: '/create-quiz',
    name: 'QuizCreation',
    component: QuizCreation,
    meta: {
      title: 'Create Quiz',
      requiresAuth: true,
      requiresTrainer: true
    }
  },
  {
    path: '/edit-quiz/:id',
    name: 'QuizEdit',
    component: QuizCreation,
    props: true,
    meta: {
      title: 'Edit Quiz',
      requiresAuth: true,
      requiresTrainer: true
    }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: {
      title: 'Admin Dashboard',
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: AdminUsers,
    meta: {
      title: 'User Management',
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/admin/quizzes',
    name: 'AdminQuizzes',
    component: AdminQuizzes,
    meta: {
      title: 'Quiz Management',
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/subscription',
    name: 'Subscription',
    component: Subscription,
    meta: {
      title: 'Abonnement',
      requiresAuth: true
    }
  },
  {
    path: '/subscription/success',
    name: 'SubscriptionSuccess',
    component: SubscriptionSuccess,
    meta: {
      title: 'Abonnement activé',
      requiresAuth: true
    }
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: Privacy,
    meta: {
      title: 'Politique de Confidentialité',
      requiresAuth: false
    }
  },
  {
    path: '/analytics',
    name: 'AnalyticsDashboard',
    component: AnalyticsDashboard,
    meta: {
      title: 'Analytics Dashboard',
      requiresAuth: true,
      requiresTrainer: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: '404 - Page Not Found'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Set page title
  document.title = to.meta.title ? `${to.meta.title} | QuizMaster` : 'QuizMaster'

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Store the intended destination
      authStore.setIntendedRoute(to.fullPath)
      next('/login')
      return
    }

    // Check if route requires trainer role
    if (to.meta.requiresTrainer && authStore.user?.role !== 'trainer' && authStore.user?.role !== 'admin') {
      window.showToast?.({
        type: 'error',
        title: 'Access Denied',
        message: 'You need trainer privileges to access this page'
      })
      next('/dashboard')
      return
    }

    // Check if route requires admin role
    if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') {
      window.showToast?.({
        type: 'error',
        title: 'Access Denied',
        message: 'You need administrator privileges to access this page'
      })
      next('/dashboard')
      return
    }
  }

  // Redirect authenticated users from auth pages
  if (to.meta.redirectIfAuth && authStore.isAuthenticated) {
    next('/dashboard')
    return
  }

  next()
})

// Global error handler for route navigation
router.onError((error) => {
  console.error('Router error:', error)
  window.showToast?.({
    type: 'error',
    title: 'Navigation Error',
    message: 'Failed to navigate to the requested page'
  })
})

export default router