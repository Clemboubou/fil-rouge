<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">📊 Analytics Dashboard</h1>
            <p class="mt-2 text-gray-600 dark:text-gray-400 dark:text-gray-500">
              Analyse détaillée des performances et de l'engagement des utilisateurs
            </p>
          </div>

          <!-- Filters and Actions -->
          <div class="flex items-center space-x-4">
            <!-- Quiz Filter -->
            <div class="min-w-0 flex-1">
              <select
                v-model="selectedQuiz"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">Tous les quiz</option>
                <option
                  v-for="quiz in availableQuizzes"
                  :key="quiz.id"
                  :value="quiz.id"
                >
                  {{ quiz.title }}
                </option>
              </select>
            </div>

            <!-- Time Range Filter -->
            <div class="min-w-0 flex-1">
              <select
                v-model="selectedTimeRange"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="7d">7 derniers jours</option>
                <option value="30d">30 derniers jours</option>
                <option value="90d">90 derniers jours</option>
                <option value="1y">1 an</option>
              </select>
            </div>

            <!-- Refresh Button -->
            <button
              @click="refreshData"
              :disabled="loading"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              <svg
                class="w-4 h-4 mr-2"
                :class="{ 'animate-spin': loading }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              {{ loading ? 'Actualisation...' : 'Actualiser' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Premium Feature Banner for Free Users -->
      <div v-if="!isPremiumUser" class="mb-8 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-8 w-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
          <div class="ml-4 flex-1">
            <h3 class="text-lg font-medium text-yellow-800">
              🚀 Débloquez les Analytics Avancés avec Premium
            </h3>
            <p class="mt-1 text-sm text-yellow-700">
              Accédez à des visualisations détaillées, des exports de données et des insights avancés pour optimiser vos formations.
            </p>
          </div>
          <div class="ml-4 flex-shrink-0">
            <router-link
              to="/subscription"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-800 bg-yellow-200 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Passer à Premium
            </router-link>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="flex items-center space-x-3">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span class="text-gray-600 dark:text-gray-400 dark:text-gray-500">Chargement des analytics...</span>
        </div>
      </div>

      <!-- Analytics Content -->
      <div v-else>
        <!-- Basic Analytics (Always Visible) -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">📈 Vue d'ensemble</h2>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">Quiz Créés</p>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ basicStats.totalQuizzes }}</p>
                </div>
                <div class="text-blue-500">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">Participants Totaux</p>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ basicStats.totalParticipants }}</p>
                </div>
                <div class="text-green-500">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">Taux Moyen</p>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ basicStats.averageSuccessRate }}%</p>
                </div>
                <div class="text-yellow-500">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">Cette Semaine</p>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ basicStats.weeklyParticipants }}</p>
                  <p class="text-xs text-green-600 dark:text-green-400 mt-1">+{{ basicStats.weeklyGrowth }}% vs semaine dernière</p>
                </div>
                <div class="text-purple-500">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Premium Analytics Charts -->
        <div v-if="isPremiumUser">
          <AnalyticsCharts
            :quiz-id="selectedQuiz"
            :time-range="selectedTimeRange"
            @export-data="handleExportData"
          />
        </div>

        <!-- Free User Limited View -->
        <div v-else class="space-y-6">
          <!-- Simple Quiz List -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">📋 Mes Quiz - Vue Simplifiée</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 mt-1">
                Passez au plan Premium pour accéder aux analytics détaillés et aux graphiques interactifs.
              </p>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">Quiz</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">Participants</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">Statut</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">Créé le</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                  <tr
                    v-for="quiz in basicQuizStats"
                    :key="quiz.id"
                    class="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900"
                  >
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div>
                          <div class="text-sm font-medium text-gray-900 dark:text-white">{{ quiz.title }}</div>
                          <div class="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">{{ quiz.category }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900 dark:text-white">{{ quiz.participants }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        :class="[
                          'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                          quiz.isPublished ? 'bg-green-100 dark:bg-green-900 text-green-800' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800'
                        ]"
                      >
                        {{ quiz.isPublished ? 'Publié' : 'Brouillon' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                      {{ formatDate(quiz.createdAt) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Premium Features Preview -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden opacity-60">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 relative">
              <div class="absolute inset-0 bg-gradient-to-r from-transparent to-white z-10"></div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">📊 Analytics Avancés (Premium)</h3>
              <div class="absolute top-4 right-4 z-20">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800">
                  🔒 Premium
                </span>
              </div>
            </div>
            <div class="p-6 relative">
              <div class="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10"></div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 filter blur-sm">
                <div class="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <span class="text-gray-400 dark:text-gray-500">Graphique de Participation</span>
                </div>
                <div class="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <span class="text-gray-400 dark:text-gray-500">Taux de Réussite par Catégorie</span>
                </div>
              </div>
              <div class="absolute inset-0 flex items-center justify-center z-20">
                <div class="text-center">
                  <h4 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Débloquez les Analytics Complets</h4>
                  <p class="text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-4">Visualisations interactives, exports de données et insights détaillés</p>
                  <router-link
                    to="/subscription"
                    class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Passer à Premium - 9,99€/mois
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recommendations Section -->
        <div v-if="recommendations.length > 0" class="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">💡 Recommandations</h3>
          <div class="space-y-3">
            <div
              v-for="(recommendation, index) in recommendations"
              :key="index"
              class="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg"
            >
              <div class="flex-shrink-0">
                <svg class="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ recommendation.title }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 mt-1">{{ recommendation.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AnalyticsCharts from '@/components/AnalyticsCharts.vue'

const authStore = useAuthStore()

// Reactive data
const loading = ref(true)
const selectedQuiz = ref('')
const selectedTimeRange = ref('30d')

// Check if user is premium
const isPremiumUser = computed(() => {
  return authStore.user?.plan === 'premium' // This would come from user subscription status
})

// Mock data
const basicStats = ref({
  totalQuizzes: 12,
  totalParticipants: 847,
  averageSuccessRate: 78.5,
  weeklyParticipants: 123,
  weeklyGrowth: 15.2
})

const availableQuizzes = ref([
  { id: 1, title: 'JavaScript Fundamentals' },
  { id: 2, title: 'React Advanced Concepts' },
  { id: 3, title: 'Node.js Backend Development' },
  { id: 4, title: 'CSS Grid and Flexbox' }
])

const basicQuizStats = ref([
  {
    id: 1,
    title: 'JavaScript Fundamentals',
    category: 'Programming',
    participants: 234,
    isPublished: true,
    createdAt: '2024-09-15T10:30:00Z'
  },
  {
    id: 2,
    title: 'React Components',
    category: 'Frontend',
    participants: 187,
    isPublished: true,
    createdAt: '2024-09-10T14:20:00Z'
  },
  {
    id: 3,
    title: 'API Design Patterns',
    category: 'Backend',
    participants: 0,
    isPublished: false,
    createdAt: '2024-09-20T09:15:00Z'
  }
])

const recommendations = ref([
  {
    title: 'Quiz JavaScript Fundamentals très populaire',
    description: 'Ce quiz a un taux de participation élevé. Considérez créer du contenu similaire.'
  },
  {
    title: 'Améliorez les questions difficiles',
    description: 'La question #3 du quiz React a un taux d\'échec de 65%. Ajoutez des explications détaillées.'
  },
  {
    title: 'Publiez votre quiz en brouillon',
    description: 'Le quiz "API Design Patterns" est prêt à être publié pour recevoir des participants.'
  }
])

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const refreshData = async () => {
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    // In real app, fetch fresh data from API
  } catch (error) {
    console.error('Error refreshing data:', error)
  } finally {
    loading.value = false
  }
}

const handleExportData = (exportInfo) => {
  console.log('Export data:', exportInfo)
  // Handle data export
}

const loadAnalyticsData = async () => {
  loading.value = true
  try {
    // In real app, fetch data based on selectedQuiz and selectedTimeRange
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (error) {
    console.error('Error loading analytics:', error)
  } finally {
    loading.value = false
  }
}

// Watchers
watch([selectedQuiz, selectedTimeRange], () => {
  loadAnalyticsData()
})

// Lifecycle
onMounted(() => {
  loadAnalyticsData()
})
</script>

<style scoped>
/* Custom styles for the analytics dashboard */
.analytics-dashboard {
  font-family: 'Inter', sans-serif;
}
</style>