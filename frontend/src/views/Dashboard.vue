<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">
          Bienvenue, {{ authStore.user?.firstName || authStore.user?.username }}!
        </h1>
        <p class="mt-2 text-gray-600">
          {{
            authStore.isAdmin ? 'Gérez toute la plateforme QuizMaster' :
            authStore.isTrainer ? 'Gérez vos quiz et suivez les progrès des étudiants' :
            'Continuez votre apprentissage'
          }}
        </p>
        <div v-if="authStore.isAdmin" class="mt-4">
          <router-link
            to="/admin"
            class="btn-primary inline-flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Aller au panneau admin
          </router-link>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <!-- Dashboard Content -->
      <div v-else class="space-y-6">
        <!-- User Progress (for students) -->
        <UserProgress v-if="!authStore.isTrainer && !authStore.isAdmin" />

        <!-- Admin Quick Actions -->
        <div v-if="authStore.isAdmin" class="card">
          <div class="card-body">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Actions administrateur</h2>
            <div class="flex flex-wrap gap-4">
              <router-link to="/admin" class="btn-primary">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Panneau d'administration
              </router-link>
            </div>
          </div>
        </div>

        <!-- Quick Actions for Trainers -->
        <div v-if="authStore.isTrainer" class="card">
          <div class="card-body">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
            <div class="flex flex-wrap gap-4">
              <router-link to="/create-quiz" class="btn-primary">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Créer un nouveau quiz
              </router-link>
              <router-link to="/my-quizzes" class="btn-secondary">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Mes quiz
              </router-link>
            </div>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Column (2/3 width) -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Badges Display (for students) -->
            <BadgeDisplay v-if="!authStore.isTrainer && !authStore.isAdmin" />

            <!-- Available Quizzes -->
            <div class="card">
              <div class="card-body">
                <div class="flex items-center justify-between mb-4">
                  <h2 class="text-lg font-semibold text-gray-900">Quiz disponibles</h2>
                  <router-link
                    to="/quizzes"
                    class="text-primary-600 hover:text-primary-800 text-sm font-medium"
                  >
                    Voir tous
                  </router-link>
                </div>
                <QuizList :limit="6" />
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="card">
              <div class="card-body">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">Activité récente</h2>
                <div class="space-y-3">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm text-gray-900">Découvrez les nouvelles fonctionnalités de gamification !</p>
                      <p class="text-xs text-gray-500">Gagnez des points, des badges et montez dans le classement</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column (1/3 width) -->
          <div class="space-y-6">
            <!-- Leaderboard -->
            <div class="card">
              <div class="card-body">
                <Leaderboard :limit="5" />
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="card">
              <div class="card-body">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">📊 Statistiques</h3>
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Quiz terminés</span>
                    <span class="font-semibold">{{ userStats.totalQuizzes || 0 }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Score moyen</span>
                    <span class="font-semibold">{{ userStats.averageScore || 0 }}%</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Points totaux</span>
                    <span class="font-semibold text-yellow-600">{{ authStore.user?.totalPoints || 0 }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Rang classement</span>
                    <span class="font-semibold">#{{ userStats.rank || '-' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useQuizStore } from '@/stores/quiz'
import UserProgress from '@/components/UserProgress.vue'
import BadgeDisplay from '@/components/BadgeDisplay.vue'
import Leaderboard from '@/components/Leaderboard.vue'
import QuizList from '@/components/QuizList.vue'
import { gamificationAPI } from '@/services/api'

export default {
  name: 'Dashboard',
  components: {
    UserProgress,
    BadgeDisplay,
    Leaderboard,
    QuizList
  },
  setup() {
    const authStore = useAuthStore()
    const quizStore = useQuizStore()
    const isLoading = ref(true)
    const userStats = ref({})

    const fetchUserStats = async () => {
      try {
        if (!authStore.isTrainer && !authStore.isAdmin) {
          // Fetch gamification profile for students
          const response = await gamificationAPI.getProfile()
          // L'API renvoie {success: true, data: {user, stats, badges}}
          const data = response.data.data || response.data
          userStats.value = data.stats || {}
        }
      } catch (error) {
        console.error('Error fetching user stats:', error)
      }
    }

    const initializeDashboard = async () => {
      try {
        isLoading.value = true
        await Promise.all([
          quizStore.fetchQuizzes({ limit: 6 }),
          fetchUserStats()
        ])
      } catch (error) {
        console.error('Error initializing dashboard:', error)
      } finally {
        isLoading.value = false
      }
    }

    onMounted(() => {
      initializeDashboard()
    })

    return {
      authStore,
      quizStore,
      isLoading,
      userStats
    }
  }
}
</script>

<style scoped>
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200;
}

.card-body {
  @apply p-6;
}

.btn-primary {
  @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500;
}

.btn-secondary {
  @apply inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500;
}
</style>