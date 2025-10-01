<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ isEditMode ? 'Edit Quiz' : 'Create New Quiz' }}
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400 dark:text-gray-500">
          {{ isEditMode ? 'Update your quiz details and questions' : 'Design an engaging quiz for your students' }}
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <!-- Quiz Form -->
      <form v-else @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Quiz Details -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Quiz Details</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quiz Title *
              </label>
              <input
                id="title"
                v-model="quizForm.title"
                type="text"
                required
                class="input"
                :class="{ 'border-red-500': errors.title }"
                placeholder="Enter quiz title"
              />
              <p v-if="errors.title" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.title }}</p>
            </div>

            <div>
              <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category *
              </label>
              <select
                id="category"
                v-model="quizForm.category"
                required
                class="input"
                :class="{ 'border-red-500': errors.category }"
              >
                <option value="">Select category</option>
                <option value="technology">Technology</option>
                <option value="science">Science</option>
                <option value="history">History</option>
                <option value="language">Language</option>
                <option value="mathematics">Mathematics</option>
                <option value="other">Other</option>
              </select>
              <p v-if="errors.category" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.category }}</p>
            </div>
          </div>

          <div class="mt-6">
            <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              v-model="quizForm.description"
              rows="3"
              class="input"
              placeholder="Describe what this quiz covers..."
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <label for="difficulty" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Difficulty Level
              </label>
              <select
                id="difficulty"
                v-model="quizForm.difficulty"
                class="input"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label for="timeLimit" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time per Question (seconds)
              </label>
              <input
                id="timeLimit"
                v-model.number="quizForm.timeLimit"
                type="number"
                min="10"
                max="300"
                class="input"
                placeholder="30"
              />
            </div>

            <div>
              <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                id="status"
                v-model="quizForm.status"
                class="input"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Questions Section -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Questions ({{ quizForm.questions.length }})
            </h2>
            <button
              type="button"
              @click="addQuestion"
              class="btn-primary"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add Question
            </button>
          </div>

          <div v-if="quizForm.questions.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400 dark:text-gray-500">
            <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p>No questions added yet. Click "Add Question" to get started.</p>
          </div>

          <div v-else class="space-y-6">
            <QuestionForm
              v-for="(question, index) in quizForm.questions"
              :key="question.id || index"
              :question="question"
              :index="index"
              @update="updateQuestion"
              @delete="deleteQuestion"
            />
          </div>

          <p v-if="errors.questions" class="mt-4 text-sm text-red-600 dark:text-red-400">{{ errors.questions }}</p>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-between items-center">
          <button
            type="button"
            @click="goBack"
            class="btn-outline"
          >
            Cancel
          </button>

          <div class="flex space-x-4">
            <button
              v-if="!isEditMode"
              type="button"
              @click="saveDraft"
              :disabled="isSaving"
              class="btn-secondary"
            >
              {{ isSaving ? 'Saving...' : 'Save as Draft' }}
            </button>

            <button
              type="submit"
              :disabled="isSaving"
              class="btn-primary"
            >
              {{ isSaving
                ? 'Saving...'
                : isEditMode
                  ? 'Update Quiz'
                  : 'Create Quiz' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/quiz'
import { useAuthStore } from '@/stores/auth'
import QuestionForm from '@/components/QuestionForm.vue'

const route = useRoute()
const router = useRouter()
const quizStore = useQuizStore()
const authStore = useAuthStore()

const isLoading = ref(false)
const isSaving = ref(false)
const errors = ref({})

const quizForm = reactive({
  title: '',
  description: '',
  category: '',
  difficulty: 'beginner',
  timeLimit: 30,
  status: 'draft',
  questions: []
})

// Computed properties
const isEditMode = computed(() => !!route.params.id)
const quizId = computed(() => route.params.id)

// Methods
const validateForm = () => {
  errors.value = {}

  if (!quizForm.title.trim()) {
    errors.value.title = 'Quiz title is required'
  }

  if (!quizForm.category) {
    errors.value.category = 'Category is required'
  }

  if (quizForm.questions.length === 0) {
    errors.value.questions = 'At least one question is required'
  } else {
    // Validate each question
    const invalidQuestions = quizForm.questions.filter(q =>
      !q.question.trim() ||
      q.options.some(opt => !opt.trim()) ||
      !q.correctAnswer
    )

    if (invalidQuestions.length > 0) {
      errors.value.questions = 'All questions must have a question text, options, and correct answer'
    }
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    isSaving.value = true

    const quizData = {
      ...quizForm,
      createdBy: authStore.user.id
    }

    if (isEditMode.value) {
      await quizStore.updateQuiz(quizId.value, quizData)
    } else {
      await quizStore.createQuiz(quizData)
    }

    router.push('/dashboard')
  } catch (error) {
    console.error('Error saving quiz:', error)
  } finally {
    isSaving.value = false
  }
}

const saveDraft = async () => {
  if (!quizForm.title.trim()) {
    errors.value.title = 'Quiz title is required to save as draft'
    return
  }

  try {
    isSaving.value = true

    const quizData = {
      ...quizForm,
      status: 'draft',
      createdBy: authStore.user.id
    }

    await quizStore.createQuiz(quizData)
    router.push('/dashboard')
  } catch (error) {
    console.error('Error saving draft:', error)
  } finally {
    isSaving.value = false
  }
}

const addQuestion = () => {
  const newQuestion = {
    id: Date.now(), // Temporary ID
    question: '',
    type: 'multiple-choice',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: ''
  }

  quizForm.questions.push(newQuestion)
}

const updateQuestion = (index, updatedQuestion) => {
  quizForm.questions[index] = { ...updatedQuestion }
}

const deleteQuestion = (index) => {
  if (confirm('Are you sure you want to delete this question?')) {
    quizForm.questions.splice(index, 1)
  }
}

const loadQuizForEdit = async () => {
  if (!isEditMode.value) return

  try {
    isLoading.value = true
    await quizStore.fetchQuiz(quizId.value)

    const quiz = quizStore.currentQuiz
    if (quiz) {
      Object.assign(quizForm, {
        title: quiz.title,
        description: quiz.description,
        category: quiz.category,
        difficulty: quiz.difficulty || 'beginner',
        timeLimit: quiz.timeLimit || 30,
        status: quiz.status || 'draft',
        questions: quiz.questions || []
      })
    }
  } catch (error) {
    console.error('Error loading quiz:', error)
    router.push('/dashboard')
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  if (confirm('Are you sure you want to leave? Any unsaved changes will be lost.')) {
    router.push('/dashboard')
  }
}

// Lifecycle
onMounted(() => {
  // Check if user has trainer permissions
  if (!authStore.hasPermission('create_quiz')) {
    router.push('/dashboard')
    return
  }

  if (isEditMode.value) {
    loadQuizForEdit()
  }
})

// Prevent navigation away with unsaved changes
const hasUnsavedChanges = computed(() => {
  return quizForm.title || quizForm.description || quizForm.questions.length > 0
})

const handleBeforeUnload = (event) => {
  if (hasUnsavedChanges.value && !isSaving.value) {
    event.preventDefault()
    event.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
    return event.returnValue
  }
}

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onMounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>