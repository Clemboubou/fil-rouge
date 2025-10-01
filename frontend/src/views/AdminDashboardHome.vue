<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Administration Dashboard</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400 dark:text-gray-500">Vue d'ensemble de la plateforme QuizMaster</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <!-- Dashboard Content -->
      <div v-else class="space-y-6">
        <!-- Overview Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Total Users -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">Total Utilisateurs</p>
                <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ stats.overview?.totalUsers || 0 }}</p>
                <p class="text-sm text-green-600 dark:text-green-400 mt-2">
                  +{{ stats.thisWeek?.newUsers || 0 }} cette semaine
                </p>
              </div>
              <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
            </div>
            <div class="mt-4 flex gap-2 text-xs">
              <span class="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 rounded">{{ stats.overview?.activeUsers || 0 }} actifs</span>
              <span class="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 rounded">{{ stats.overview?.inactiveUsers || 0 }} inactifs</span>
            </div>
          </div>

          <!-- Total Quizzes -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">Total Quiz</p>
                <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ stats.overview?.totalQuizzes || 0 }}</p>
                <p class="text-sm text-green-600 dark:text-green-400 mt-2">
                  +{{ stats.thisWeek?.newQuizzes || 0 }} cette semaine
                </p>
              </div>
              <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
            </div>
            <div class="mt-4 flex gap-2 text-xs">
              <span class="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 rounded">{{ stats.overview?.publishedQuizzes || 0 }} publiés</span>
              <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded">{{ stats.overview?.draftQuizzes || 0 }} brouillons</span>
            </div>
          </div>

          <!-- Total Attempts -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">Tentatives</p>
                <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ stats.overview?.totalAttempts || 0 }}</p>
                <p class="text-sm text-green-600 dark:text-green-400 mt-2">
                  +{{ stats.thisWeek?.attempts || 0 }} cette semaine
                </p>
              </div>
              <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="mt-4 text-xs">
              <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 rounded">{{ stats.overview?.completedAttempts || 0 }} complétées</span>
            </div>
          </div>

          <!-- Average Score -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">Score Moyen</p>
                <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ stats.overview?.averageScore?.toFixed(1) || 0 }}%</p>
                <p class="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-2">
                  {{ stats.overview?.totalQuestions || 0 }} questions totales
                </p>
              </div>
              <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Users by Role -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Répartition des Utilisateurs</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center p-4 bg-red-50 rounded-lg">
              <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ stats.usersByRole?.admins || 0 }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 mt-1">Administrateurs</p>
            </div>
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ stats.usersByRole?.trainers || 0 }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 mt-1">Formateurs</p>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats.usersByRole?.students || 0 }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 mt-1">Étudiants</p>
            </div>
          </div>
        </div>

        <!-- Quick Actions & Stats -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Quick Actions -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions Rapides</h2>
            <div class="space-y-3">
              <router-link
                to="/admin/users"
                class="flex items-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
              >
                <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="font-semibold text-gray-900 dark:text-white">Gérer les Utilisateurs</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">Voir, modifier rôles, désactiver comptes</p>
                </div>
                <svg class="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </router-link>

              <router-link
                to="/admin/quizzes"
                class="flex items-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
              >
                <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="font-semibold text-gray-900 dark:text-white">Gérer les Quiz</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">Voir statistiques, modifier, supprimer</p>
                </div>
                <svg class="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </router-link>

              <button
                @click="refreshStats"
                class="w-full flex items-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <div class="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                </div>
                <div class="flex-1 text-left">
                  <p class="font-semibold text-gray-900 dark:text-white">Actualiser les Stats</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">Mise à jour des données en temps réel</p>
                </div>
              </button>
            </div>
          </div>

          <!-- Platform Health -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Santé de la Plateforme</h2>
            <div class="space-y-4">
              <!-- User Activity Rate -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Taux d'Activité Utilisateurs</span>
                  <span class="text-sm font-bold text-gray-900 dark:text-white">{{ userActivityRate }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="h-2 rounded-full transition-all duration-500"
                    :class="userActivityRate >= 80 ? 'bg-green-500' : userActivityRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'"
                    :style="{ width: userActivityRate + '%' }"
                  ></div>
                </div>
              </div>

              <!-- Quiz Publish Rate -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Taux de Publication Quiz</span>
                  <span class="text-sm font-bold text-gray-900 dark:text-white">{{ quizPublishRate }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="h-2 rounded-full transition-all duration-500"
                    :class="quizPublishRate >= 80 ? 'bg-green-500' : quizPublishRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'"
                    :style="{ width: quizPublishRate + '%' }"
                  ></div>
                </div>
              </div>

              <!-- Average Engagement -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Engagement Moyen</span>
                  <span class="text-sm font-bold text-gray-900 dark:text-white">{{ averageEngagement }}</span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">Tentatives par utilisateur actif</p>
              </div>

              <!-- Growth Indicator -->
              <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Croissance cette semaine</span>
                  <span class="inline-flex items-center text-sm font-bold" :class="weeklyGrowth >= 0 ? 'text-green-600' : 'text-red-600'">
                    <svg v-if="weeklyGrowth >= 0" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                    </svg>
                    <svg v-else class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                    {{ Math.abs(weeklyGrowth) }}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Recent Users -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Derniers Utilisateurs Inscrits</h2>
            <div class="space-y-3">
              <div
                v-for="user in stats.recent?.users || []"
                :key="user.id"
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-3">
                    <span class="text-primary-600 dark:text-primary-400 font-semibold">{{ user.firstName?.charAt(0) }}{{ user.lastName?.charAt(0) }}</span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">{{ user.firstName }} {{ user.lastName }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">{{ user.email }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <span :class="[
                    'px-2 py-1 text-xs rounded',
                    user.role === 'admin' ? 'bg-red-100 dark:bg-red-900 text-red-800' :
                    user.role === 'trainer' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800' :
                    'bg-green-100 dark:bg-green-900 text-green-800'
                  ]">
                    {{ user.role }}
                  </span>
                  <p class="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">{{ formatDate(user.createdAt) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Quizzes -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Derniers Quiz Créés</h2>
            <div class="space-y-3">
              <div
                v-for="quiz in stats.recent?.quizzes || []"
                :key="quiz.id"
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ quiz.title }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">Par {{ quiz.creator?.firstName }} {{ quiz.creator?.lastName }}</p>
                </div>
                <div class="text-right">
                  <span :class="[
                    'px-2 py-1 text-xs rounded',
                    quiz.isPublished ? 'bg-green-100 dark:bg-green-900 text-green-800' :
                    'bg-gray-100 dark:bg-gray-800 text-gray-800'
                  ]">
                    {{ quiz.isPublished ? 'Publié' : 'Brouillon' }}
                  </span>
                  <p class="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">{{ formatDate(quiz.createdAt) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Attempts -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activité Récente</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">Utilisateur</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">Quiz</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">Score</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                <tr v-for="attempt in stats.recent?.attempts || []" :key="attempt.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ attempt.user?.firstName }} {{ attempt.user?.lastName }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">{{ attempt.user?.email }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 dark:text-white">{{ attempt.quiz?.title }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-semibold text-primary-600 dark:text-primary-400">{{ attempt.score }}%</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                    {{ formatDate(attempt.createdAt) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const stats = ref({})
const isLoading = ref(true)

// Computed metrics for platform health
const userActivityRate = computed(() => {
  if (!stats.value.overview) return 0
  const total = stats.value.overview.totalUsers
  const active = stats.value.overview.activeUsers
  return total > 0 ? Math.round((active / total) * 100) : 0
})

const quizPublishRate = computed(() => {
  if (!stats.value.overview) return 0
  const total = stats.value.overview.totalQuizzes
  const published = stats.value.overview.publishedQuizzes
  return total > 0 ? Math.round((published / total) * 100) : 0
})

const averageEngagement = computed(() => {
  if (!stats.value.overview) return '0'
  const attempts = stats.value.overview.totalAttempts || 0
  const active = stats.value.overview.activeUsers || 1
  return (attempts / active).toFixed(1)
})

const weeklyGrowth = computed(() => {
  if (!stats.value.thisWeek || !stats.value.overview) return 0
  const newUsers = stats.value.thisWeek.newUsers || 0
  const totalUsers = stats.value.overview.totalUsers || 1
  const weeklyPercentage = (newUsers / totalUsers) * 100
  return Math.round(weeklyPercentage * 10) / 10
})

const fetchStats = async () => {
  try {
    isLoading.value = true
    const token = localStorage.getItem('token')
    const response = await axios.get(`${API_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    stats.value = response.data.data
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    window.showToast?.({
      type: 'error',
      title: 'Erreur',
      message: 'Impossible de charger les statistiques'
    })
  } finally {
    isLoading.value = false
  }
}

const refreshStats = () => {
  window.showToast?.({
    type: 'info',
    title: 'Actualisation...',
    message: 'Mise à jour des statistiques'
  })
  fetchStats()
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchStats()
})
</script>