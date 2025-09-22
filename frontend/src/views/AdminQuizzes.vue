<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              Quiz Management
            </h1>
            <p class="mt-2 text-gray-600">
              Oversee all quizzes and manage content
            </p>
          </div>
          <router-link
            to="/admin"
            class="btn-outline"
          >
            ← Back to Admin
          </router-link>
        </div>
      </div>

      <!-- Stats Summary -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-600">Total Quizzes</p>
                <p class="text-xl font-bold text-gray-900">{{ quizzes.length }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-600">Published</p>
                <p class="text-xl font-bold text-gray-900">{{ publishedCount }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-600">Drafts</p>
                <p class="text-xl font-bold text-gray-900">{{ draftCount }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-600">Total Attempts</p>
                <p class="text-xl font-bold text-gray-900">{{ totalAttempts }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <!-- Quizzes Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="quiz in quizzes"
          :key="quiz.id"
          class="card hover:shadow-lg transition-shadow duration-200"
        >
          <div class="card-body">
            <div class="flex items-center justify-between mb-3">
              <span
                :class="[
                  'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                  quiz.isPublished
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                ]"
              >
                {{ quiz.isPublished ? 'Published' : 'Draft' }}
              </span>
              <div class="flex items-center space-x-2">
                <button
                  @click="viewQuizStats(quiz.id)"
                  class="text-blue-600 hover:text-blue-800"
                  title="View Statistics"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </button>
                <button
                  @click="deleteQuiz(quiz.id)"
                  class="text-red-600 hover:text-red-800"
                  title="Delete Quiz"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>

            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              {{ quiz.title }}
            </h3>

            <p class="text-sm text-gray-600 mb-4 line-clamp-2">
              {{ quiz.description || 'No description provided' }}
            </p>

            <div class="space-y-2 text-sm text-gray-500">
              <div class="flex items-center justify-between">
                <span>Category:</span>
                <span class="font-medium">{{ quiz.category || 'General' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span>Difficulty:</span>
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
                <span>Questions:</span>
                <span class="font-medium">{{ quiz.totalQuestions || 0 }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span>Creator:</span>
                <span class="font-medium">{{ quiz.creator?.firstName }} {{ quiz.creator?.lastName }}</span>
              </div>
            </div>

            <div class="mt-4 pt-4 border-t border-gray-200">
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>Created: {{ new Date(quiz.createdAt).toLocaleDateString() }}</span>
                <span v-if="quiz.attempts?.length">{{ quiz.attempts.length }} attempts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!isLoading && quizzes.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No quizzes found</h3>
        <p class="mt-1 text-sm text-gray-500">No quizzes have been created yet.</p>
      </div>

      <!-- Quiz Stats Modal -->
      <div
        v-if="showStatsModal"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
        @click="closeStatsModal"
      >
        <div
          class="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white"
          @click.stop
        >
          <div class="mt-3">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">
                Quiz Statistics: {{ selectedQuiz?.title }}
              </h3>
              <button
                @click="closeStatsModal"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div v-if="quizStats" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-blue-50 p-4 rounded-lg">
                  <p class="text-sm text-blue-600">Total Attempts</p>
                  <p class="text-2xl font-bold text-blue-900">{{ quizStats.totalAttempts }}</p>
                </div>
                <div class="bg-green-50 p-4 rounded-lg">
                  <p class="text-sm text-green-600">Average Score</p>
                  <p class="text-2xl font-bold text-green-900">{{ quizStats.averageScore }}%</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="bg-yellow-50 p-4 rounded-lg">
                  <p class="text-sm text-yellow-600">Best Score</p>
                  <p class="text-2xl font-bold text-yellow-900">{{ quizStats.bestScore }}</p>
                </div>
                <div class="bg-red-50 p-4 rounded-lg">
                  <p class="text-sm text-red-600">Worst Score</p>
                  <p class="text-2xl font-bold text-red-900">{{ quizStats.worstScore }}</p>
                </div>
              </div>
            </div>

            <div class="mt-6 flex justify-end">
              <button
                @click="closeStatsModal"
                class="btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { adminAPI } from '@/services/api'

// State
const isLoading = ref(true)
const quizzes = ref([])
const showStatsModal = ref(false)
const selectedQuiz = ref(null)
const quizStats = ref(null)

// Computed
const publishedCount = computed(() =>
  quizzes.value.filter(quiz => quiz.isPublished).length
)

const draftCount = computed(() =>
  quizzes.value.filter(quiz => !quiz.isPublished).length
)

const totalAttempts = computed(() =>
  quizzes.value.reduce((total, quiz) => total + (quiz.attempts?.length || 0), 0)
)

// Methods
const loadQuizzes = async () => {
  try {
    isLoading.value = true
    const response = await adminAPI.getAllQuizzes()
    quizzes.value = response.data?.quizzes || response.data || response
  } catch (error) {
    console.error('Error loading quizzes:', error)
    window.showToast?.({
      type: 'error',
      message: 'Failed to load quizzes'
    })
  } finally {
    isLoading.value = false
  }
}

const deleteQuiz = async (quizId) => {
  if (!confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) return

  try {
    await adminAPI.deleteQuiz(quizId)
    window.showToast?.({
      type: 'success',
      message: 'Quiz deleted successfully'
    })
    await loadQuizzes()
  } catch (error) {
    console.error('Error deleting quiz:', error)
    window.showToast?.({
      type: 'error',
      message: 'Failed to delete quiz'
    })
  }
}

const viewQuizStats = async (quizId) => {
  try {
    selectedQuiz.value = quizzes.value.find(q => q.id === quizId)
    const response = await adminAPI.getQuizStats(quizId)
    quizStats.value = response.data
    showStatsModal.value = true
  } catch (error) {
    console.error('Error loading quiz stats:', error)
    window.showToast?.({
      type: 'error',
      message: 'Failed to load quiz statistics'
    })
  }
}

const closeStatsModal = () => {
  showStatsModal.value = false
  selectedQuiz.value = null
  quizStats.value = null
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
</style>