import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    // Handle network errors
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      window.showToast?.({
        type: 'error',
        title: 'Network Error',
        message: 'Please check your internet connection'
      })
    }

    return Promise.reject(error)
  }
)

// Auth API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data)
}

// Quiz API endpoints
export const quizAPI = {
  // Get all quizzes (with optional filtering)
  getQuizzes: (params = {}) => api.get('/quizzes', { params }),

  // Get single quiz by ID
  getQuiz: (id) => api.get(`/quizzes/${id}`),

  // Create new quiz (trainer only)
  createQuiz: (quizData) => api.post('/quizzes', quizData),

  // Update quiz (trainer only)
  updateQuiz: (id, quizData) => api.put(`/quizzes/${id}`, quizData),

  // Delete quiz (trainer only)
  deleteQuiz: (id) => api.delete(`/quizzes/${id}`),

  // Get quiz questions for taking
  getQuizQuestions: (id) => api.get(`/quizzes/${id}/questions`),

  // Submit quiz answers
  submitQuiz: (id, answers, timeTaken = null) => api.post(`/quizzes/${id}/attempts`, { answers, timeTaken }),

  // Get quiz statistics
  getQuizStats: (id) => api.get(`/quizzes/${id}/stats`),

  // Get user's quiz attempts
  getUserAttempts: (userId) => api.get(`/users/${userId}/attempts`),

  // Get leaderboard for a quiz
  getLeaderboard: (id, limit = 10) => api.get(`/quizzes/${id}/leaderboard`, {
    params: { limit }
  }),

  // Get global leaderboard
  getGlobalLeaderboard: (limit = 10) => api.get('/quizzes/leaderboard', {
    params: { limit }
  })
}

// User API endpoints
export const userAPI = {
  getUsers: () => api.get('/users'),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`)
}

// Admin API endpoints
export const adminAPI = {
  // User management
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUserRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  deactivateUser: (id) => api.put(`/users/${id}/deactivate`),
  reactivateUser: (id) => api.put(`/users/${id}/reactivate`),

  // Quiz management
  getAllQuizzes: () => api.get('/quizzes?page=1&limit=50'),
  deleteQuiz: (id) => api.delete(`/quizzes/${id}`),

  // Statistics
  getAdminStats: () => api.get('/stats/admin/dashboard'),
  getQuizStats: (id) => api.get(`/stats/quiz/${id}`),
  getUserStats: (id) => api.get(`/stats/user/${id}`)
}

// Statistics API endpoints
export const statsAPI = {
  getDashboardStats: () => api.get('/stats/dashboard'),
  getQuizStats: (id) => api.get(`/stats/quiz/${id}`),
  getUserStats: (id) => api.get(`/stats/user/${id}`)
}

// Gamification API endpoints
export const gamificationAPI = {
  getProfile: () => api.get('/gamification/profile'),
  getBadges: () => api.get('/gamification/badges'),
  getMyBadges: () => api.get('/gamification/my-badges'),
  getGlobalLeaderboard: (limit = 10) => api.get('/gamification/leaderboard/global', {
    params: { limit }
  }),
  getCategoryLeaderboard: (category, limit = 10) => api.get(`/gamification/leaderboard/category/${category}`, {
    params: { limit }
  }),
  getPlatformStats: () => api.get('/gamification/platform-stats'),
  markBadgesNotified: (badgeIds) => api.post('/gamification/badges/mark-notified', { badgeIds })
}

// Subscription API endpoints
export const subscriptionAPI = {
  getStatus: () => api.get('/subscription/status'),
  getPrices: () => api.get('/subscription/prices'),
  createCheckoutSession: (priceId) => api.post('/subscription/create-checkout-session', { priceId }),
  createBillingPortalSession: () => api.post('/subscription/create-billing-portal-session'),
  cancel: () => api.post('/subscription/cancel'),
  reactivate: () => api.post('/subscription/reactivate')
}

// Error handling helper
export const handleAPIError = (error) => {
  let message = 'An unexpected error occurred'

  if (error.response?.data?.message) {
    message = error.response.data.message
  } else if (error.response?.data?.error) {
    message = error.response.data.error
  } else if (error.message) {
    message = error.message
  }

  return {
    status: error.response?.status || 500,
    message
  }
}

// Generic API request helper with error handling
export const apiRequest = async (requestFn, errorTitle = 'API Error') => {
  try {
    const response = await requestFn()
    // Handle backend response structure: { success: true, data: {...} }
    if (response.data && response.data.success && response.data.data) {
      return response.data.data
    }
    return response.data
  } catch (error) {
    const errorInfo = handleAPIError(error)

    window.showToast?.({
      type: 'error',
      title: errorTitle,
      message: errorInfo.message
    })

    throw error
  }
}

export default api