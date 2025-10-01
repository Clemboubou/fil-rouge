<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Découvrir les Quiz</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Parcourez et participez aux quiz disponibles</p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rechercher</label>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Titre, description..."
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500"
              @input="debouncedSearch"
            />
          </div>

          <!-- Category -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Catégorie</label>
            <select
              v-model="filters.category"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500"
              @change="debouncedLoadQuizzes"
            >
              <option value="">Toutes</option>
              <option value="programming">Programmation</option>
              <option value="mathematics">Mathématiques</option>
              <option value="science">Sciences</option>
              <option value="history">Histoire</option>
              <option value="language">Langues</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <!-- Difficulty -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Difficulté</label>
            <select
              v-model="filters.difficulty"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500"
              @change="debouncedLoadQuizzes"
            >
              <option value="">Toutes</option>
              <option value="beginner">Débutant</option>
              <option value="intermediate">Intermédiaire</option>
              <option value="advanced">Avancé</option>
            </select>
          </div>
        </div>

        <!-- Active Filters -->
        <div v-if="hasActiveFilters" class="mt-4 flex items-center gap-2 flex-wrap">
          <span class="text-sm text-gray-600 dark:text-gray-400">Filtres actifs:</span>
          <button
            v-if="filters.category"
            @click="clearFilter('category')"
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200"
          >
            {{ filters.category }}
            <svg class="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <button
            v-if="filters.difficulty"
            @click="clearFilter('difficulty')"
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200"
          >
            {{ filters.difficulty }}
            <svg class="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <button
            @click="clearAllFilters"
            class="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium"
          >
            Réinitialiser tous les filtres
          </button>
        </div>
      </div>

      <!-- Stats Summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Quiz Disponibles</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ pagination.totalQuizzes || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Catégories</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">6</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Résultats</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ quizzes.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-16">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mx-auto"></div>
          <p class="mt-4 text-gray-600 dark:text-gray-400">Chargement des quiz...</p>
        </div>
      </div>

      <!-- Quizzes Grid -->
      <div v-else-if="quizzes.length > 0" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="quiz in quizzes"
            :key="quiz.id"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer"
            @click="goToQuiz(quiz.id)"
          >
            <div class="p-6">
              <!-- Title -->
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {{ quiz.title }}
              </h3>

              <!-- Description -->
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {{ quiz.description || 'Pas de description disponible' }}
              </p>

              <!-- Meta -->
              <div class="space-y-2 text-sm mb-4">
                <div class="flex items-center justify-between">
                  <span class="text-gray-500 dark:text-gray-400">Créateur:</span>
                  <span class="font-medium text-gray-900 dark:text-white">
                    {{ quiz.creator?.firstName }} {{ quiz.creator?.lastName }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-500 dark:text-gray-400">Catégorie:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ quiz.category || 'Général' }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-500 dark:text-gray-400">Difficulté:</span>
                  <span
                    :class="[
                      'font-medium capitalize',
                      quiz.difficulty === 'beginner' ? 'text-green-600 dark:text-green-400' :
                      quiz.difficulty === 'intermediate' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-red-600 dark:text-red-400'
                    ]"
                  >
                    {{ quiz.difficulty }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-500 dark:text-gray-400">Questions:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ quiz.questionCount || 0 }}</span>
                </div>
              </div>

              <!-- Action Button -->
              <button
                @click.stop="goToQuiz(quiz.id)"
                class="w-full btn-primary"
              >
                Commencer le Quiz
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.totalPages > 1" class="flex justify-center items-center space-x-2 mt-8">
          <button
            @click="changePage(pagination.currentPage - 1)"
            :disabled="!pagination.hasPrev"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            Précédent
          </button>
          <span class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
            Page {{ pagination.currentPage }} sur {{ pagination.totalPages }}
          </span>
          <button
            @click="changePage(pagination.currentPage + 1)"
            :disabled="!pagination.hasNext"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            Suivant
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <svg class="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">Aucun quiz trouvé</h3>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {{ hasActiveFilters ? 'Essayez de modifier vos filtres' : 'Aucun quiz disponible pour le moment' }}
        </p>
        <button
          v-if="hasActiveFilters"
          @click="clearAllFilters"
          class="mt-4 btn-primary"
        >
          Réinitialiser les filtres
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { quizAPI } from '@/services/api'

const router = useRouter()

// State
const quizzes = ref([])
const isLoading = ref(true)
const filters = ref({
  search: '',
  category: '',
  difficulty: ''
})
const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  totalQuizzes: 0,
  hasNext: false,
  hasPrev: false
})

let searchTimeout = null

// Computed
const hasActiveFilters = computed(() => {
  return filters.value.search || filters.value.category || filters.value.difficulty
})

// Methods
const loadQuizzes = async () => {
  try {
    isLoading.value = true

    const params = {
      page: pagination.value.currentPage,
      limit: 12,
      published: 'true' // Only show published quizzes
    }

    if (filters.value.search) params.search = filters.value.search
    if (filters.value.category) params.category = filters.value.category
    if (filters.value.difficulty) params.difficulty = filters.value.difficulty

    const response = await quizAPI.getQuizzes(params)

    if (response.data?.data) {
      quizzes.value = response.data.data.quizzes || []
      pagination.value = {
        currentPage: response.data.data.pagination?.currentPage || 1,
        totalPages: response.data.data.pagination?.totalPages || 1,
        totalQuizzes: response.data.data.pagination?.totalQuizzes || 0,
        hasNext: response.data.data.pagination?.hasNext || false,
        hasPrev: response.data.data.pagination?.hasPrev || false
      }
    }
  } catch (error) {
    console.error('Error loading quizzes:', error)
    window.showToast?.({
      type: 'error',
      title: 'Erreur',
      message: 'Impossible de charger les quiz'
    })
  } finally {
    isLoading.value = false
  }
}

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.currentPage = 1
    loadQuizzes()
  }, 800)
}

const debouncedLoadQuizzes = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.currentPage = 1
    loadQuizzes()
  }, 300)
}

const clearFilter = (filterName) => {
  filters.value[filterName] = ''
  pagination.value.currentPage = 1
  loadQuizzes()
}

const clearAllFilters = () => {
  filters.value = {
    search: '',
    category: '',
    difficulty: ''
  }
  pagination.value.currentPage = 1
  loadQuizzes()
}

const changePage = (page) => {
  pagination.value.currentPage = page
  loadQuizzes()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goToQuiz = (quizId) => {
  router.push(`/quiz/${quizId}`)
}

// Lifecycle
onMounted(() => {
  loadQuizzes()
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
