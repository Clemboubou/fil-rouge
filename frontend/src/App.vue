<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200" v-if="!isAuthPage">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <!-- Logo -->
            <router-link to="/" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-lg">Q</span>
              </div>
              <span class="text-xl font-bold text-gray-900">QuizMaster</span>
            </router-link>
          </div>

          <!-- Navigation Links -->
          <div class="flex items-center space-x-4">
            <template v-if="authStore.isAuthenticated">
              <router-link
                to="/dashboard"
                class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Dashboard
              </router-link>

              <router-link
                v-if="authStore.isAdmin"
                to="/admin"
                class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Admin
              </router-link>

              <div class="relative" ref="userMenuRef">
                <button
                  @click="showUserMenu = !showUserMenu"
                  class="flex items-center space-x-2 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span class="text-primary-600 font-medium text-xs">
                      {{ authStore.user?.username?.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <span>{{ authStore.user?.username }}</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                <!-- User Dropdown Menu -->
                <div
                  v-show="showUserMenu"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                >
                  <div class="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                    {{ authStore.user?.email }}
                  </div>
                  <button
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </template>

            <template v-else>
              <router-link
                to="/login"
                class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign in
              </router-link>
              <router-link
                to="/register"
                class="btn-primary"
              >
                Sign up
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Loading overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 flex items-center space-x-3">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        <span class="text-gray-700">Loading...</span>
      </div>
    </div>

    <!-- Toast notifications -->
    <div class="fixed top-4 right-4 space-y-2 z-40">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg p-4 animate-slide-up"
        :class="{
          'border-l-4 border-l-success-500': toast.type === 'success',
          'border-l-4 border-l-danger-500': toast.type === 'error',
          'border-l-4 border-l-warning-500': toast.type === 'warning',
          'border-l-4 border-l-primary-500': toast.type === 'info'
        }"
      >
        <div class="flex items-start">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">{{ toast.title }}</p>
            <p v-if="toast.message" class="text-sm text-gray-500 mt-1">{{ toast.message }}</p>
          </div>
          <button
            @click="removeToast(toast.id)"
            class="ml-3 text-gray-400 hover:text-gray-600"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <main class="flex-1">
      <router-view />
    </main>

    <!-- RGPD Cookie Banner -->
    <CookieBanner />
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import CookieBanner from './components/CookieBanner.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const showUserMenu = ref(false)
const userMenuRef = ref(null)
const isLoading = ref(false)
const toasts = ref([])

// Computed properties
const isAuthPage = computed(() => {
  return ['Login', 'Register'].includes(route.name)
})

// Toast management
let toastId = 0

const addToast = (toast) => {
  const id = ++toastId
  toasts.value.push({ ...toast, id })

  setTimeout(() => {
    removeToast(id)
  }, 5000)
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// Event handlers
const handleLogout = async () => {
  try {
    isLoading.value = true
    await authStore.logout()
    showUserMenu.value = false
    addToast({
      type: 'success',
      title: 'Signed out successfully'
    })
    router.push('/')
  } catch (error) {
    addToast({
      type: 'error',
      title: 'Error signing out',
      message: error.message
    })
  } finally {
    isLoading.value = false
  }
}

const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    showUserMenu.value = false
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)

  // Initialize auth state
  authStore.initializeAuth()

  // Global error handler
  window.addEventListener('unhandledrejection', (event) => {
    addToast({
      type: 'error',
      title: 'An error occurred',
      message: event.reason?.message || 'Something went wrong'
    })
  })

  // Provide toast functionality globally
  window.showToast = addToast
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>