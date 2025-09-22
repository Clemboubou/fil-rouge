import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { quizAPI, statsAPI, apiRequest } from '@/services/api'

export const useQuizStore = defineStore('quiz', () => {
  // State
  const quizzes = ref([])
  const currentQuiz = ref(null)
  const currentQuestions = ref([])
  const currentAnswers = ref({})
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const quizResults = ref(null)
  const leaderboard = ref([])
  const userAttempts = ref([])
  const dashboardStats = ref(null)

  // Quiz taking state
  const currentQuestionIndex = ref(0)
  const timeRemaining = ref(30) // 30 seconds per question
  const quizStartTime = ref(null)
  const isQuizActive = ref(false)

  // Getters
  const totalQuestions = computed(() => currentQuestions.value.length)
  const isLastQuestion = computed(() =>
    currentQuestionIndex.value >= totalQuestions.value - 1
  )
  const progressPercentage = computed(() =>
    totalQuestions.value > 0
      ? Math.round(((currentQuestionIndex.value + 1) / totalQuestions.value) * 100)
      : 0
  )
  const currentQuestion = computed(() =>
    currentQuestions.value[currentQuestionIndex.value] || null
  )

  // Quiz management actions
  const fetchQuizzes = async (filters = {}) => {
    try {
      isLoading.value = true

      const response = await apiRequest(
        () => quizAPI.getQuizzes(filters),
        'Failed to load quizzes'
      )

      quizzes.value = response.quizzes || response

      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const fetchQuiz = async (id) => {
    try {
      isLoading.value = true

      const response = await apiRequest(
        () => quizAPI.getQuiz(id),
        'Failed to load quiz'
      )

      currentQuiz.value = response.quiz || response

      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const createQuiz = async (quizData) => {
    try {
      isLoading.value = true

      const response = await apiRequest(
        () => quizAPI.createQuiz(quizData),
        'Failed to create quiz'
      )

      // Add to local quizzes array
      quizzes.value.unshift(response.quiz || response)

      window.showToast?.({
        type: 'success',
        title: 'Quiz created',
        message: 'Your quiz has been successfully created'
      })

      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateQuiz = async (id, quizData) => {
    try {
      isLoading.value = true

      const response = await apiRequest(
        () => quizAPI.updateQuiz(id, quizData),
        'Failed to update quiz'
      )

      // Update in local quizzes array
      const index = quizzes.value.findIndex(q => q.id === id)
      if (index !== -1) {
        quizzes.value[index] = response.quiz || response
      }

      // Update current quiz if it's the same
      if (currentQuiz.value?.id === id) {
        currentQuiz.value = response.quiz || response
      }

      window.showToast?.({
        type: 'success',
        title: 'Quiz updated',
        message: 'Your quiz has been successfully updated'
      })

      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const deleteQuiz = async (id) => {
    try {
      isLoading.value = true

      await apiRequest(
        () => quizAPI.deleteQuiz(id),
        'Failed to delete quiz'
      )

      // Remove from local quizzes array
      const index = quizzes.value.findIndex(q => q.id === id)
      if (index !== -1) {
        quizzes.value.splice(index, 1)
      }

      // Clear current quiz if it's the same
      if (currentQuiz.value?.id === id) {
        currentQuiz.value = null
      }

      window.showToast?.({
        type: 'success',
        title: 'Quiz deleted',
        message: 'The quiz has been successfully deleted'
      })
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Quiz taking actions
  const startQuiz = async (id) => {
    try {
      isLoading.value = true

      // Fetch quiz questions
      const response = await apiRequest(
        () => quizAPI.getQuizQuestions(id),
        'Failed to load quiz questions'
      )

      currentQuestions.value = response.questions || []
      currentAnswers.value = {}
      currentQuestionIndex.value = 0
      timeRemaining.value = 30
      quizStartTime.value = new Date()
      isQuizActive.value = true
      quizResults.value = null

      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const answerQuestion = (questionId, answer) => {
    currentAnswers.value[questionId] = answer
  }

  const nextQuestion = () => {
    if (!isLastQuestion.value) {
      currentQuestionIndex.value++
      timeRemaining.value = 30 // Reset timer for next question
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value--
      timeRemaining.value = 30 // Reset timer
    }
  }

  const submitQuiz = async (quizId) => {
    try {
      isSubmitting.value = true
      isQuizActive.value = false

      // Convert answers to the format expected by the API (A, B, C, D)
      const convertedAnswers = {}
      for (const [questionId, selectedOptionValue] of Object.entries(currentAnswers.value)) {
        const question = currentQuestions.value.find(q => q.id == questionId)
        if (question) {
          // Find which option letter corresponds to the selected value
          if (question.optionA === selectedOptionValue) convertedAnswers[questionId] = 'A'
          else if (question.optionB === selectedOptionValue) convertedAnswers[questionId] = 'B'
          else if (question.optionC === selectedOptionValue) convertedAnswers[questionId] = 'C'
          else if (question.optionD === selectedOptionValue) convertedAnswers[questionId] = 'D'
        }
      }

      console.log('Debug - Original answers:', currentAnswers.value)
      console.log('Debug - Converted answers:', convertedAnswers)
      console.log('Debug - Current questions:', currentQuestions.value)

      // Validate that we have converted answers
      if (Object.keys(convertedAnswers).length === 0) {
        throw new Error('No valid answers to submit')
      }

      // Calculate time taken
      const timeTaken = quizStartTime.value ? Math.floor((new Date() - quizStartTime.value) / 1000) : null

      console.log('Debug - Final payload:', { answers: convertedAnswers, timeTaken })

      const response = await apiRequest(
        () => quizAPI.submitQuiz(quizId, convertedAnswers, timeTaken),
        'Failed to submit quiz'
      )

      // Handle the response structure (data.attempt)
      const attemptData = response.attempt || response
      quizResults.value = attemptData

      console.log('Debug - Response received:', response)
      console.log('Debug - Attempt data:', attemptData)

      window.showToast?.({
        type: 'success',
        title: 'Quiz submitted',
        message: `You scored ${attemptData.score}/${attemptData.totalQuestions}!`
      })

      return response
    } catch (error) {
      throw error
    } finally {
      isSubmitting.value = false
    }
  }

  const endQuiz = () => {
    isQuizActive.value = false
    timeRemaining.value = 0
  }

  // Statistics and leaderboard actions
  const fetchLeaderboard = async (quizId = null, limit = 10) => {
    try {
      const response = await apiRequest(
        () => quizId
          ? quizAPI.getLeaderboard(quizId, limit)
          : quizAPI.getGlobalLeaderboard(limit),
        'Failed to load leaderboard'
      )

      leaderboard.value = response.leaderboard || response

      return response
    } catch (error) {
      throw error
    }
  }

  const fetchUserAttempts = async (userId) => {
    try {
      const response = await apiRequest(
        () => quizAPI.getUserAttempts(userId),
        'Failed to load user attempts'
      )

      userAttempts.value = response.attempts || response

      return response
    } catch (error) {
      throw error
    }
  }

  const fetchDashboardStats = async () => {
    try {
      const response = await apiRequest(
        () => statsAPI.getDashboardStats(),
        'Failed to load dashboard statistics'
      )

      dashboardStats.value = response

      return response
    } catch (error) {
      throw error
    }
  }

  const fetchQuizStats = async (quizId) => {
    try {
      const response = await apiRequest(
        () => statsAPI.getQuizStats(quizId),
        'Failed to load quiz statistics'
      )

      return response
    } catch (error) {
      throw error
    }
  }

  // Timer management
  const startTimer = () => {
    const timer = setInterval(() => {
      if (timeRemaining.value > 0 && isQuizActive.value) {
        timeRemaining.value--
      } else {
        clearInterval(timer)
        if (isQuizActive.value) {
          // Auto-advance to next question or submit quiz
          if (isLastQuestion.value) {
            submitQuiz(currentQuiz.value?.id)
          } else {
            nextQuestion()
          }
        }
      }
    }, 1000)

    return timer
  }

  // Reset quiz state
  const resetQuizState = () => {
    currentQuiz.value = null
    currentQuestions.value = []
    currentAnswers.value = {}
    currentQuestionIndex.value = 0
    timeRemaining.value = 30
    quizStartTime.value = null
    isQuizActive.value = false
    quizResults.value = null
  }

  // Search and filter helpers
  const searchQuizzes = (searchTerm) => {
    if (!searchTerm) return quizzes.value

    const term = searchTerm.toLowerCase()
    return quizzes.value.filter(quiz =>
      quiz.title.toLowerCase().includes(term) ||
      quiz.description.toLowerCase().includes(term) ||
      quiz.category?.toLowerCase().includes(term)
    )
  }

  const filterQuizzesByCategory = (category) => {
    if (!category) return quizzes.value
    return quizzes.value.filter(quiz => quiz.category === category)
  }

  return {
    // State
    quizzes,
    currentQuiz,
    currentQuestions,
    currentAnswers,
    isLoading,
    isSubmitting,
    quizResults,
    leaderboard,
    userAttempts,
    dashboardStats,
    currentQuestionIndex,
    timeRemaining,
    quizStartTime,
    isQuizActive,

    // Getters
    totalQuestions,
    isLastQuestion,
    progressPercentage,
    currentQuestion,

    // Actions
    fetchQuizzes,
    fetchQuiz,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    startQuiz,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    submitQuiz,
    endQuiz,
    fetchLeaderboard,
    fetchUserAttempts,
    fetchDashboardStats,
    fetchQuizStats,
    startTimer,
    resetQuizState,
    searchQuizzes,
    filterQuizzesByCategory
  }
})