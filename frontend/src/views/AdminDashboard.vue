<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400 dark:text-gray-500">
          Manage users, quizzes, and system settings
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <!-- Dashboard Content -->
      <div v-else class="space-y-8">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Total Users -->
          <div class="card">
            <div class="card-body">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">Total Users</p>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats?.totalUsers || 0 }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Total Quizzes -->
          <div class="card">
            <div class="card-body">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">Total Quizzes</p>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats?.totalQuizzes || 0 }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Total Attempts -->
          <div class="card">
            <div class="card-body">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">Total Attempts</p>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats?.totalAttempts || 0 }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Average Score -->
          <div class="card">
            <div class="card-body">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">Average Score</p>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats?.averageScore || 0 }}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- User Management -->
          <div class="card">
            <div class="card-body">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">User Management</h3>
                  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">Manage user accounts and roles</p>
                </div>
                <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
                </svg>
              </div>
              <div class="mt-4">
                <router-link
                  to="/admin/users"
                  class="btn-primary w-full"
                >
                  Manage Users
                </router-link>
              </div>
            </div>
          </div>

          <!-- Quiz Management -->
          <div class="card">
            <div class="card-body">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Quiz Management</h3>
                  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">Oversee all quizzes and content</p>
                </div>
                <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div class="mt-4">
                <router-link
                  to="/admin/quizzes"
                  class="btn-primary w-full"
                >
                  Manage Quizzes
                </router-link>
              </div>
            </div>
          </div>

          <!-- System Statistics -->
          <div class="card">
            <div class="card-body">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">System Statistics</h3>
                  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">View detailed analytics</p>
                </div>
                <svg class="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div class="mt-4">
                <button class="btn-outline w-full" @click="loadStats">
                  Refresh Stats
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="card">
          <div class="card-header">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
          </div>
          <div class="card-body">
            <div v-if="stats?.recentAttempts?.length" class="space-y-4">
              <div
                v-for="attempt in stats.recentAttempts.slice(0, 5)"
                :key="attempt.id"
                class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <span class="text-primary-600 dark:text-primary-400 font-semibold">
                      {{ attempt.user?.firstName?.charAt(0) || 'U' }}
                    </span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">
                      {{ attempt.user?.firstName }} {{ attempt.user?.lastName }}
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">
                      Completed: {{ attempt.quiz?.title }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-gray-900 dark:text-white">{{ attempt.percentage }}%</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">
                    {{ new Date(attempt.completedAt).toLocaleDateString() }}
                  </p>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400 dark:text-gray-500">
              No recent activity
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminAPI } from '@/services/api'

// State
const isLoading = ref(true)
const stats = ref(null)

// Methods
const loadStats = async () => {
  try {
    isLoading.value = true
    const response = await adminAPI.getAdminStats()
    stats.value = response.data
  } catch (error) {
    console.error('Error loading admin stats:', error)
    // Fallback to regular dashboard stats
    try {
      const fallbackResponse = await adminAPI.getAdminStats()
      stats.value = fallbackResponse.data
    } catch (fallbackError) {
      console.error('Error loading fallback stats:', fallbackError)
    }
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadStats()
})
</script>