<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <div class="relative bg-gradient-to-r from-primary-600 to-primary-800 overflow-hidden">
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-primary-800 mix-blend-multiply"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-24 md:py-32">
          <div class="text-center">
            <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-6">
              {{ $t('home.welcomeTo') }}
              <span class="block text-primary-200">QuizMaster</span>
            </h1>
            <p class="max-w-2xl mx-auto text-xl text-primary-100 mb-8">
              {{ $t('home.heroDescription') }}
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <router-link
                v-if="!authStore.isAuthenticated"
                to="/register"
                class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 transition-colors shadow-lg"
              >
                {{ $t('home.getStartedFree') }}
              </router-link>
              <router-link
                :to="authStore.isAuthenticated ? '/dashboard' : '/login'"
                class="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white dark:bg-gray-800 hover:text-primary-700 transition-colors"
              >
                {{ authStore.isAuthenticated ? $t('home.goToDashboard') : $t('auth.signIn') }}
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Decorative elements -->
      <div class="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 rounded-full bg-primary-400 opacity-20"></div>
      <div class="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-48 h-48 rounded-full bg-primary-300 opacity-20"></div>
    </div>

    <!-- Features Section -->
    <div class="py-24 bg-white dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
            {{ $t('home.whyChoose') }}
          </h2>
          <p class="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400 dark:text-gray-500">
            {{ $t('home.experienceLearning') }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ $t('home.interactiveQuizzes') }}</h3>
            <p class="text-gray-600 dark:text-gray-400 dark:text-gray-500">
              {{ $t('home.interactiveQuizzesDesc') }}
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ $t('home.progressTracking') }}</h3>
            <p class="text-gray-600 dark:text-gray-400 dark:text-gray-500">
              {{ $t('home.progressTrackingDesc') }}
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ $t('home.timedChallenges') }}</h3>
            <p class="text-gray-600 dark:text-gray-400 dark:text-gray-500">
              {{ $t('home.timedChallengesDesc') }}
            </p>
          </div>

          <!-- Feature 4 -->
          <div class="text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ $t('home.leaderboards') }}</h3>
            <p class="text-gray-600 dark:text-gray-400 dark:text-gray-500">
              {{ $t('home.leaderboardsDesc') }}
            </p>
          </div>

          <!-- Feature 5 -->
          <div class="text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ $t('home.createContent') }}</h3>
            <p class="text-gray-600 dark:text-gray-400 dark:text-gray-500">
              {{ $t('home.createContentDesc') }}
            </p>
          </div>

          <!-- Feature 6 -->
          <div class="text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ $t('home.instantFeedback') }}</h3>
            <p class="text-gray-600 dark:text-gray-400 dark:text-gray-500">
              {{ $t('home.instantFeedbackDesc') }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div v-if="stats" class="py-16 bg-primary-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
            {{ $t('home.joinCommunity') }}
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">{{ stats.totalUsers || '1,000+' }}</div>
            <div class="text-lg text-gray-600 dark:text-gray-400 dark:text-gray-500">{{ $t('home.activeLearners') }}</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">{{ stats.totalQuizzes || '500+' }}</div>
            <div class="text-lg text-gray-600 dark:text-gray-400 dark:text-gray-500">{{ $t('home.quizzesAvailable') }}</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">{{ stats.totalAttempts || '10,000+' }}</div>
            <div class="text-lg text-gray-600 dark:text-gray-400 dark:text-gray-500">{{ $t('home.quizzesCompleted') }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="py-16 bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-extrabold text-white mb-4">
          {{ $t('home.readyToStart') }}
        </h2>
        <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          {{ $t('home.joinThousands') }}
        </p>

        <div v-if="!authStore.isAuthenticated" class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            to="/register"
            class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-800 transition-colors"
          >
            {{ $t('home.signUpNow') }}
          </router-link>
          <router-link
            to="/login"
            class="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white dark:bg-gray-800 hover:text-gray-900 dark:text-white transition-colors"
          >
            {{ $t('auth.signIn') }}
          </router-link>
        </div>

        <div v-else>
          <router-link
            to="/dashboard"
            class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-800 transition-colors"
          >
            {{ $t('home.goToDashboard') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { statsAPI, apiRequest } from '@/services/api'

const authStore = useAuthStore()
const stats = ref(null)

onMounted(async () => {
  try {
    // Try to load public stats (may not be available without backend)
    const response = await apiRequest(
      () => statsAPI.getDashboardStats(),
      null // Don't show error toast for optional stats
    )
    stats.value = response
  } catch (error) {
    // Ignore error - stats are optional for landing page
    console.log('Stats not available:', error.message)
  }
})
</script>