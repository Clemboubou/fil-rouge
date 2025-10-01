<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white" data-cy="welcome-message">
          {{
            authStore.isStudent ? 'Mon Profil' :
            languageStore.t('dashboard.welcome', { name: authStore.user?.firstName || authStore.user?.username })
          }}{{ authStore.isStudent ? '' : '!' }}
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          {{
            authStore.isStudent ? 'Gérez vos informations et suivez vos progrès' :
            authStore.isAdmin ? $t('dashboard.manageAdminPlatform') :
            authStore.isTrainer ? $t('dashboard.manageQuizzes') :
            $t('dashboard.continueLearning')
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
            {{ $t('dashboard.goToAdminPanel') }}
          </router-link>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400"></div>
      </div>

      <!-- Dashboard Content -->
      <div v-else class="space-y-6">
        <!-- User Progress (for students) -->
        <UserProgress v-if="!authStore.isTrainer && !authStore.isAdmin" />

        <!-- Admin Quick Actions -->
        <div v-if="authStore.isAdmin" class="card">
          <div class="card-body">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ $t('dashboard.adminActions') }}</h2>
            <div class="flex flex-wrap gap-4">
              <router-link to="/admin" class="btn-primary">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                {{ $t('dashboard.adminPanel') }}
              </router-link>
            </div>
          </div>
        </div>

        <!-- Quick Actions for Trainers -->
        <div v-if="authStore.isTrainer" class="card">
          <div class="card-body">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ $t('dashboard.quickActions') }}</h2>
            <div class="flex flex-wrap gap-4">
              <router-link to="/create-quiz" class="btn-primary">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                {{ $t('dashboard.createNewQuiz') }}
              </router-link>
              <router-link to="/my-quizzes" class="btn-secondary">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                {{ $t('dashboard.myQuizzes') }}
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

            <!-- Quick Actions for Trainers -->
            <div v-if="authStore.isTrainer" class="card">
              <div class="card-body">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions Rapides</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <router-link
                    to="/my-quizzes"
                    class="flex items-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                  >
                    <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mr-4">
                      <svg class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900 dark:text-white">Mes Quiz</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Gérer mes quiz créés</p>
                    </div>
                  </router-link>

                  <router-link
                    to="/create-quiz"
                    class="flex items-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                  >
                    <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4">
                      <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900 dark:text-white">Créer un Quiz</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Nouveau quiz</p>
                    </div>
                  </router-link>

                  <router-link
                    to="/analytics"
                    class="flex items-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                  >
                    <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-4">
                      <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900 dark:text-white">Analytics</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Voir les statistiques</p>
                    </div>
                  </router-link>

                  <router-link
                    to="/quizzes"
                    class="flex items-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                      <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900 dark:text-white">Découvrir les Quiz</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Parcourir tous les quiz</p>
                    </div>
                  </router-link>
                </div>
              </div>
            </div>

            <!-- Quick Action for Students - Browse Quizzes -->
            <div v-if="!authStore.isTrainer && !authStore.isAdmin" class="card">
              <div class="card-body">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Commencer à Apprendre</h2>
                <router-link
                  to="/quizzes"
                  class="flex items-center p-6 border-2 border-primary-200 dark:border-primary-800 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors group"
                >
                  <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mr-4 group-hover:bg-primary-200 dark:group-hover:bg-primary-800 transition-colors">
                    <svg class="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">Découvrir les Quiz</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Parcourez tous les quiz disponibles et commencez à apprendre</p>
                  </div>
                  <svg class="w-6 h-6 text-gray-400 dark:text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </router-link>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="card">
              <div class="card-body">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ $t('dashboard.recentActivity') }}</h2>
                <div class="space-y-3">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm text-gray-900 dark:text-white">{{ $t('dashboard.discoverGamification') }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('dashboard.earnPointsBadges') }}</p>
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
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">📊 {{ $t('dashboard.statistics') }}</h3>
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('dashboard.quizzesCompleted') }}</span>
                    <span class="font-semibold text-gray-900 dark:text-white">{{ userStats.totalQuizzes || 0 }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('dashboard.averageScore') }}</span>
                    <span class="font-semibold text-gray-900 dark:text-white">{{ userStats.averageScore || 0 }}%</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('dashboard.totalPoints') }}</span>
                    <span class="font-semibold text-yellow-600 dark:text-yellow-500">{{ authStore.user?.totalPoints || 0 }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('dashboard.leaderboardRank') }}</span>
                    <span class="font-semibold text-gray-900 dark:text-white">#{{ userStats.rank || '-' }}</span>
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useQuizStore } from '@/stores/quiz'
import { useLanguageStore } from '@/stores/language'
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
    const router = useRouter()
    const authStore = useAuthStore()
    const quizStore = useQuizStore()
    const languageStore = useLanguageStore()
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

    const handleTakeQuiz = (quiz) => {
      router.push(`/quiz/${quiz.id}`)
    }

    onMounted(() => {
      initializeDashboard()
    })

    return {
      authStore,
      quizStore,
      languageStore,
      isLoading,
      userStats,
      handleTakeQuiz
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