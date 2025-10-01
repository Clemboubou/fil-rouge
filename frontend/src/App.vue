<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Navigation -->
    <nav class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700" v-if="!isAuthPage">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <!-- Logo -->
            <router-link to="/" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-lg">Q</span>
              </div>
              <span class="text-xl font-bold text-gray-900 dark:text-white">QuizMaster</span>
            </router-link>
          </div>

          <!-- Navigation Links -->
          <div class="flex items-center space-x-4">
            <template v-if="authStore.isAuthenticated">
              <router-link
                :to="authStore.isAdmin ? '/admin' : '/dashboard'"
                class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {{ authStore.isStudent ? 'Profil' : languageStore.t('nav.dashboard') }}
              </router-link>

              <router-link
                v-if="authStore.isTrainer || authStore.isAdmin"
                to="/my-quizzes"
                class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Mes Quiz
              </router-link>

              <router-link
                to="/quizzes"
                class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Quiz
              </router-link>

              <router-link
                to="/subscription"
                class="flex items-center space-x-1 text-yellow-600 dark:text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors border border-yellow-300 dark:border-yellow-600 hover:border-yellow-400"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>Premium</span>
              </router-link>

              <router-link
                v-if="authStore.isAdmin"
                to="/admin"
                class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {{ languageStore.t('nav.admin') }}
              </router-link>

              <div class="relative" ref="userMenuRef">
                <button
                  @click="showUserMenu = !showUserMenu"
                  data-cy="user-menu"
                  class="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <span class="text-primary-600 dark:text-primary-400 font-medium text-xs">
                      {{ (authStore.user?.firstName || authStore.user?.username || 'U').charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <span>{{ authStore.user?.firstName || authStore.user?.username || languageStore.t('nav.user') }}</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                <!-- User Dropdown Menu -->
                <div
                  v-show="showUserMenu"
                  class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700"
                >
                  <div class="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                    {{ authStore.user?.email }}
                  </div>
                  <button
                    @click="handleLogout"
                    data-cy="logout-button"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {{ languageStore.t('nav.logout') }}
                  </button>
                </div>
              </div>
            </template>

            <template v-else>
              <router-link
                to="/login"
                data-cy="login-link"
                class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {{ languageStore.t('nav.login') }}
              </router-link>
              <router-link
                to="/register"
                class="btn-primary"
              >
                {{ languageStore.t('nav.register') }}
              </router-link>
            </template>

            <!-- Language Selector -->
            <button
              @click="languageStore.toggleLanguage()"
              class="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-2 py-1 rounded-md text-sm font-medium transition-colors"
              :title="languageStore.currentLanguageName"
            >
              <span>{{ languageStore.currentLanguageFlag }}</span>
            </button>

            <!-- Dark Mode Toggle -->
            <button
              @click="themeStore.toggleTheme()"
              class="flex items-center justify-center w-9 h-9 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-md transition-colors"
              :title="themeStore.isDark ? 'Mode clair' : 'Mode sombre'"
            >
              <!-- Sun Icon -->
              <svg
                v-if="themeStore.isDark"
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                ></path>
              </svg>
              <!-- Moon Icon -->
              <svg
                v-else
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Loading overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center space-x-3">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 dark:border-primary-400"></div>
        <span class="text-gray-700 dark:text-gray-300">{{ languageStore.t('common.loading') }}</span>
      </div>
    </div>

    <!-- Toast notifications -->
    <div class="fixed top-4 right-4 space-y-2 z-40">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="max-w-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 animate-slide-up"
        :class="{
          'border-l-4 border-l-success-500': toast.type === 'success',
          'border-l-4 border-l-danger-500': toast.type === 'error',
          'border-l-4 border-l-warning-500': toast.type === 'warning',
          'border-l-4 border-l-primary-500': toast.type === 'info'
        }"
      >
        <div class="flex items-start">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ toast.title }}</p>
            <p v-if="toast.message" class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ toast.message }}</p>
          </div>
          <button
            @click="removeToast(toast.id)"
            class="ml-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
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
import { useLanguageStore } from './stores/language'
import { useThemeStore } from './stores/theme'
import CookieBanner from './components/CookieBanner.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const languageStore = useLanguageStore()
const themeStore = useThemeStore()

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
      title: languageStore.t('auth.logoutSuccess')
    })
    router.push('/')
  } catch (error) {
    addToast({
      type: 'error',
      title: languageStore.t('auth.logoutError'),
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

  // Initialize theme
  themeStore.initTheme()

  // Global error handler
  window.addEventListener('unhandledrejection', (event) => {
    addToast({
      type: 'error',
      title: languageStore.t('notifications.errorOccurred'),
      message: event.reason?.message || languageStore.t('notifications.somethingWrong')
    })
  })

  // Provide toast functionality globally
  window.showToast = addToast
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>