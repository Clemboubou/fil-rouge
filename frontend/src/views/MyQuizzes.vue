<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Mes Quiz</h1>
            <p class="mt-2 text-gray-600 dark:text-gray-400 dark:text-gray-500">Gérez vos quiz créés</p>
          </div>
          <router-link
            to="/create-quiz"
            class="btn-primary"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Créer un Quiz
          </router-link>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">Total Quiz</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ myQuizzes.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">Publiés</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ publishedCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">Brouillons</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ draftCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">Tentatives</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalAttempts }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex-1 min-w-[200px]">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher un quiz..."
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <select
            v-model="filterStatus"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="published">Publiés</option>
            <option value="draft">Brouillons</option>
          </select>
          <select
            v-model="sortBy"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="recent">Plus récents</option>
            <option value="oldest">Plus anciens</option>
            <option value="title">Titre A-Z</option>
            <option value="attempts">Plus de tentatives</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <!-- Quizzes Grid -->
      <div v-else-if="filteredQuizzes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="quiz in filteredQuizzes"
          :key="quiz.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
        >
          <div class="p-6">
            <!-- Status Badge -->
            <div class="flex items-center justify-between mb-3">
              <span
                :class="[
                  'inline-flex px-3 py-1 text-xs font-semibold rounded-full',
                  quiz.isPublished
                    ? 'bg-green-100 dark:bg-green-900 text-green-800'
                    : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800'
                ]"
              >
                {{ quiz.isPublished ? 'Publié' : 'Brouillon' }}
              </span>
              <div class="flex items-center space-x-2">
                <button
                  @click="viewStats(quiz)"
                  class="text-blue-600 dark:text-blue-400 hover:text-blue-800"
                  title="Voir statistiques"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </button>
                <router-link
                  :to="`/edit-quiz/${quiz.id}`"
                  class="text-primary-600 dark:text-primary-400 hover:text-primary-800"
                  title="Modifier"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </router-link>
                <button
                  @click="confirmDelete(quiz)"
                  class="text-red-600 dark:text-red-400 hover:text-red-800"
                  title="Supprimer"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Quiz Title -->
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {{ quiz.title }}
            </h3>

            <!-- Quiz Description -->
            <p class="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-4 line-clamp-3">
              {{ quiz.description || 'Pas de description' }}
            </p>

            <!-- Quiz Meta -->
            <div class="space-y-2 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-gray-500 dark:text-gray-400 dark:text-gray-500">Catégorie:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ quiz.category || 'Général' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500 dark:text-gray-400 dark:text-gray-500">Difficulté:</span>
                <span
                  :class="[
                    'font-medium capitalize',
                    quiz.difficulty === 'easy' || quiz.difficulty === 'beginner' ? 'text-green-600' :
                    quiz.difficulty === 'medium' || quiz.difficulty === 'intermediate' ? 'text-yellow-600' :
                    'text-red-600'
                  ]"
                >
                  {{ quiz.difficulty }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500 dark:text-gray-400 dark:text-gray-500">Questions:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ quiz.questions?.length || 0 }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500 dark:text-gray-400 dark:text-gray-500">Tentatives:</span>
                <span class="font-medium text-primary-600 dark:text-primary-400">{{ quiz.attemptCount || 0 }}</span>
              </div>
            </div>

            <!-- Footer -->
            <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p class="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                Créé le {{ new Date(quiz.createdAt).toLocaleDateString('fr-FR') }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">Aucun quiz trouvé</h3>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
          {{ searchQuery ? 'Aucun résultat pour votre recherche' : 'Commencez par créer votre premier quiz' }}
        </p>
        <div class="mt-6">
          <router-link to="/create-quiz" class="btn-primary">
            Créer un Quiz
          </router-link>
        </div>
      </div>

      <!-- Stats Modal -->
      <div
        v-if="showStatsModal && selectedQuiz"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
        @click="closeStatsModal"
      >
        <div
          class="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white dark:bg-gray-800"
          @click.stop
        >
          <div class="mt-3">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                Statistiques: {{ selectedQuiz.title }}
              </h3>
              <button
                @click="closeStatsModal"
                class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:text-gray-500"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div v-if="quizStats" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-blue-50 p-4 rounded-lg">
                  <p class="text-sm text-blue-600 dark:text-blue-400">Total Tentatives</p>
                  <p class="text-2xl font-bold text-blue-900">{{ quizStats.totalAttempts || 0 }}</p>
                </div>
                <div class="bg-green-50 p-4 rounded-lg">
                  <p class="text-sm text-green-600 dark:text-green-400">Score Moyen</p>
                  <p class="text-2xl font-bold text-green-900">{{ quizStats.averageScore || 0 }}%</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="bg-yellow-50 p-4 rounded-lg">
                  <p class="text-sm text-yellow-600 dark:text-yellow-500">Meilleur Score</p>
                  <p class="text-2xl font-bold text-yellow-900">{{ quizStats.bestScore || 0 }}%</p>
                </div>
                <div class="bg-red-50 p-4 rounded-lg">
                  <p class="text-sm text-red-600 dark:text-red-400">Pire Score</p>
                  <p class="text-2xl font-bold text-red-900">{{ quizStats.worstScore || 0 }}%</p>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            </div>

            <div class="mt-6 flex justify-end">
              <button
                @click="closeStatsModal"
                class="btn-primary"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { quizAPI } from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()

// State
const myQuizzes = ref([])
const isLoading = ref(true)
const searchQuery = ref('')
const filterStatus = ref('all')
const sortBy = ref('recent')
const showStatsModal = ref(false)
const selectedQuiz = ref(null)
const quizStats = ref(null)

// Computed
const publishedCount = computed(() =>
  myQuizzes.value.filter(quiz => quiz.isPublished).length
)

const draftCount = computed(() =>
  myQuizzes.value.filter(quiz => !quiz.isPublished).length
)

const totalAttempts = computed(() =>
  myQuizzes.value.reduce((total, quiz) => total + (quiz.attemptCount || 0), 0)
)

const filteredQuizzes = computed(() => {
  let filtered = [...myQuizzes.value]

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(quiz =>
      quiz.title.toLowerCase().includes(query) ||
      quiz.description?.toLowerCase().includes(query) ||
      quiz.category?.toLowerCase().includes(query)
    )
  }

  // Filter by status
  if (filterStatus.value === 'published') {
    filtered = filtered.filter(quiz => quiz.isPublished)
  } else if (filterStatus.value === 'draft') {
    filtered = filtered.filter(quiz => !quiz.isPublished)
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'recent':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt)
      case 'title':
        return a.title.localeCompare(b.title)
      case 'attempts':
        return (b.attemptCount || 0) - (a.attemptCount || 0)
      default:
        return 0
    }
  })

  return filtered
})

// Methods
const loadMyQuizzes = async () => {
  try {
    isLoading.value = true
    const response = await quizAPI.getQuizzes({
      creator: authStore.user.id,
      limit: 100
    })

    if (response.data?.data?.quizzes) {
      myQuizzes.value = response.data.data.quizzes
    } else if (response.data?.quizzes) {
      myQuizzes.value = response.data.quizzes
    } else if (Array.isArray(response.data)) {
      myQuizzes.value = response.data
    } else {
      myQuizzes.value = []
    }

    // Get attempt counts for each quiz
    for (const quiz of myQuizzes.value) {
      try {
        const attemptsResponse = await quizAPI.getQuizStats(quiz.id)
        const stats = attemptsResponse.data?.data || attemptsResponse.data
        quiz.attemptCount = stats?.totalAttempts || 0
      } catch (err) {
        quiz.attemptCount = 0
      }
    }
  } catch (error) {
    console.error('Error loading quizzes:', error)
    window.showToast?.({
      type: 'error',
      title: 'Erreur',
      message: 'Impossible de charger vos quiz'
    })
  } finally {
    isLoading.value = false
  }
}

const viewStats = async (quiz) => {
  try {
    selectedQuiz.value = quiz
    showStatsModal.value = true
    const response = await quizAPI.getQuizStats(quiz.id)

    if (response.data?.data) {
      quizStats.value = response.data.data
    } else {
      quizStats.value = response.data
    }
  } catch (error) {
    console.error('Error loading quiz stats:', error)
    window.showToast?.({
      type: 'error',
      title: 'Erreur',
      message: 'Impossible de charger les statistiques'
    })
  }
}

const closeStatsModal = () => {
  showStatsModal.value = false
  selectedQuiz.value = null
  quizStats.value = null
}

const confirmDelete = async (quiz) => {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer "${quiz.title}" ?\nCette action est irréversible.`)) {
    return
  }

  try {
    await quizAPI.deleteQuiz(quiz.id)
    window.showToast?.({
      type: 'success',
      title: 'Succès',
      message: 'Quiz supprimé avec succès'
    })
    await loadMyQuizzes()
  } catch (error) {
    console.error('Error deleting quiz:', error)
    window.showToast?.({
      type: 'error',
      title: 'Erreur',
      message: 'Impossible de supprimer le quiz'
    })
  }
}

// Lifecycle
onMounted(() => {
  loadMyQuizzes()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
