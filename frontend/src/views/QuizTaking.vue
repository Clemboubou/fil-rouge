<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading State -->
    <div v-if="quizStore.isLoading" class="flex justify-center items-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400 dark:text-gray-500">Loading quiz...</p>
      </div>
    </div>

    <!-- Quiz Content -->
    <div v-else-if="quizStore.isQuizActive && quizStore.currentQuestion" class="max-w-4xl mx-auto px-4 py-8">
      <!-- Quiz Header -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ quizStore.currentQuiz?.title }}</h1>
            <p class="text-gray-600 dark:text-gray-400 dark:text-gray-500">{{ quizStore.currentQuiz?.description }}</p>
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-1">Progress</div>
            <div class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ quizStore.currentQuestionIndex + 1 }} / {{ quizStore.totalQuestions }}
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            class="bg-primary-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${quizStore.progressPercentage}%` }"
          ></div>
        </div>

        <!-- Timer -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div
              class="quiz-timer"
              :class="{
                'danger': timeRemaining <= 10,
                'warning': timeRemaining <= 20 && timeRemaining > 10,
                'normal': timeRemaining > 20
              }"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {{ formatTime(timeRemaining) }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
              Question {{ quizStore.currentQuestionIndex + 1 }} of {{ quizStore.totalQuestions }}
            </div>
          </div>

          <button
            @click="endQuizEarly"
            class="text-red-600 dark:text-red-400 hover:text-red-800 text-sm font-medium"
          >
            End Quiz
          </button>
        </div>
      </div>

      <!-- Question Card -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-6">
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {{ quizStore.currentQuestion.text || quizStore.currentQuestion.question }}
          </h2>

          <!-- Question Image (if available) -->
          <div v-if="quizStore.currentQuestion.image" class="mb-6">
            <img
              :src="quizStore.currentQuestion.image"
              :alt="quizStore.currentQuestion.text || quizStore.currentQuestion.question"
              class="max-w-full h-auto rounded-lg shadow-sm"
            />
          </div>
        </div>

        <!-- Answer Options -->
        <div class="space-y-3">
          <div
            v-for="(option, index) in getQuestionOptions(quizStore.currentQuestion)"
            :key="index"
            class="relative"
          >
            <label
              class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900"
              :class="{
                'border-primary-500 bg-primary-50': selectedAnswer === option,
                'border-gray-200': selectedAnswer !== option
              }"
            >
              <input
                v-model="selectedAnswer"
                type="radio"
                :value="option"
                class="sr-only"
              />
              <div
                class="w-5 h-5 rounded-full border-2 flex-shrink-0 mr-3 flex items-center justify-center"
                :class="{
                  'border-primary-500 bg-primary-500': selectedAnswer === option,
                  'border-gray-300': selectedAnswer !== option
                }"
              >
                <div
                  v-if="selectedAnswer === option"
                  class="w-2 h-2 rounded-full bg-white dark:bg-gray-800"
                ></div>
              </div>
              <span class="text-gray-900 dark:text-white">{{ option }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex justify-between items-center">
        <button
          @click="previousQuestion"
          :disabled="quizStore.currentQuestionIndex === 0"
          class="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Previous
        </button>

        <div class="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
          {{ Object.keys(quizStore.currentAnswers).length }} / {{ quizStore.totalQuestions }} answered
        </div>

        <button
          v-if="!quizStore.isLastQuestion"
          @click="nextQuestion"
          :disabled="!selectedAnswer"
          class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </button>

        <button
          v-else
          @click="submitQuiz"
          :disabled="!selectedAnswer || quizStore.isSubmitting"
          class="btn-success disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="quizStore.isSubmitting">Submitting...</span>
          <span v-else>Submit Quiz</span>
        </button>
      </div>
    </div>

    <!-- Quiz Results -->
    <div v-else-if="quizStore.quizResults" class="max-w-4xl mx-auto px-4 py-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
        <div class="mb-8">
          <div
            class="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
            :class="{
              'bg-success-100': quizStore.quizResults.percentage >= 70,
              'bg-warning-100': quizStore.quizResults.percentage >= 50 && quizStore.quizResults.percentage < 70,
              'bg-danger-100': quizStore.quizResults.percentage < 50
            }"
          >
            <svg
              class="w-12 h-12"
              :class="{
                'text-success-600': quizStore.quizResults.percentage >= 70,
                'text-warning-600': quizStore.quizResults.percentage >= 50 && quizStore.quizResults.percentage < 70,
                'text-danger-600': quizStore.quizResults.percentage < 50
              }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>

          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Quiz Completed!</h2>
          <p class="text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-6">{{ quizStore.currentQuiz?.title }}</p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                {{ quizStore.quizResults.correctAnswers }}/{{ quizStore.quizResults.totalQuestions }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">Correct Answers</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-1">
                {{ quizStore.quizResults.percentage || Math.round((quizStore.quizResults.correctAnswers / quizStore.quizResults.totalQuestions) * 100) }}%
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">Score</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-warning-600 mb-1">
                {{ quizStore.quizResults.timeTaken ? quizStore.quizResults.timeTaken + 's' : 'N/A' }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">Time Taken</div>
            </div>
          </div>

          <div class="space-y-4">
            <router-link
              to="/dashboard"
              class="btn-primary mr-4"
            >
              Back to Dashboard
            </router-link>
            <button
              @click="retakeQuiz"
              class="btn-outline"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Quiz Not Found -->
    <div v-else class="max-w-4xl mx-auto px-4 py-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quiz Not Available</h2>
        <p class="text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-6">
          The quiz you're trying to access is not available or has been removed.
        </p>
        <router-link to="/dashboard" class="btn-primary">
          Back to Dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/quiz'

const route = useRoute()
const router = useRouter()
const quizStore = useQuizStore()

const selectedAnswer = ref('')
const timeRemaining = ref(30)
const timer = ref(null)

// Computed properties
const quizId = computed(() => route.params.id)

// Helper function to get question options
const getQuestionOptions = (question) => {
  if (!question) return []

  // If question has options array (old format)
  if (question.options && Array.isArray(question.options)) {
    return question.options
  }

  // If question has individual option fields (new format)
  const options = []
  if (question.optionA) options.push(question.optionA)
  if (question.optionB) options.push(question.optionB)
  if (question.optionC && question.optionC.trim()) options.push(question.optionC)
  if (question.optionD && question.optionD.trim()) options.push(question.optionD)

  return options
}

// Methods
const startQuiz = async () => {
  try {
    await quizStore.startQuiz(quizId.value)
    timeRemaining.value = quizStore.timeRemaining
    startTimer()
  } catch (error) {
    console.error('Error starting quiz:', error)
    router.push('/dashboard')
  }
}

const startTimer = () => {
  if (timer.value) {
    clearInterval(timer.value)
  }

  timer.value = setInterval(() => {
    if (timeRemaining.value > 0 && quizStore.isQuizActive) {
      timeRemaining.value--
      quizStore.timeRemaining = timeRemaining.value
    } else {
      clearInterval(timer.value)
      if (quizStore.isQuizActive) {
        // Auto-advance to next question or submit quiz
        if (quizStore.isLastQuestion) {
          submitQuiz()
        } else {
          nextQuestion()
        }
      }
    }
  }, 1000)
}

const nextQuestion = () => {
  // Save current answer
  if (selectedAnswer.value) {
    quizStore.answerQuestion(quizStore.currentQuestion.id, selectedAnswer.value)
  }

  // Move to next question
  quizStore.nextQuestion()
  selectedAnswer.value = quizStore.currentAnswers[quizStore.currentQuestion?.id] || ''
  timeRemaining.value = 30
}

const previousQuestion = () => {
  // Save current answer
  if (selectedAnswer.value) {
    quizStore.answerQuestion(quizStore.currentQuestion.id, selectedAnswer.value)
  }

  // Move to previous question
  quizStore.previousQuestion()
  selectedAnswer.value = quizStore.currentAnswers[quizStore.currentQuestion?.id] || ''
  timeRemaining.value = 30
}

const submitQuiz = async () => {
  // Save current answer
  if (selectedAnswer.value) {
    quizStore.answerQuestion(quizStore.currentQuestion.id, selectedAnswer.value)
  }

  try {
    await quizStore.submitQuiz(quizId.value)
    clearInterval(timer.value)
  } catch (error) {
    console.error('Error submitting quiz:', error)
  }
}

const endQuizEarly = () => {
  if (confirm('Are you sure you want to end the quiz early? Your current progress will be submitted.')) {
    submitQuiz()
  }
}

const retakeQuiz = () => {
  quizStore.resetQuizState()
  startQuiz()
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// Watch for answer changes
watch(selectedAnswer, (newAnswer) => {
  if (newAnswer && quizStore.currentQuestion) {
    quizStore.answerQuestion(quizStore.currentQuestion.id, newAnswer)
  }
})

// Lifecycle
onMounted(() => {
  startQuiz()
})

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})

// Prevent navigation away during quiz
const handleBeforeUnload = (event) => {
  if (quizStore.isQuizActive) {
    event.preventDefault()
    event.returnValue = 'You have an active quiz. Are you sure you want to leave?'
    return event.returnValue
  }
}

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>