import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI, apiRequest } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(null)
  const isLoading = ref(false)
  const intendedRoute = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isTrainer = computed(() => user.value?.role === 'trainer')
  const isStudent = computed(() => user.value?.role === 'user')
  const isAdmin = computed(() => user.value?.role === 'admin')

  // Actions
  const login = async (credentials) => {
    try {
      isLoading.value = true

      const response = await apiRequest(
        () => authAPI.login(credentials),
        'Login Failed'
      )

      // Store auth data
      token.value = response.token
      user.value = response.user

      // Persist to localStorage
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))

      window.showToast?.({
        type: 'success',
        title: 'Welcome back!',
        message: `Signed in as ${response.user.firstName} ${response.user.lastName}`
      })

      return response
    } catch (error) {
      // Clear any existing auth data on login failure
      clearAuth()
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData) => {
    try {
      isLoading.value = true

      const response = await apiRequest(
        () => authAPI.register(userData),
        'Registration Failed'
      )

      // Store auth data
      token.value = response.token
      user.value = response.user

      // Persist to localStorage
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))

      window.showToast?.({
        type: 'success',
        title: 'Account created!',
        message: `Welcome to QuizMaster, ${response.user.firstName}!`
      })

      return response
    } catch (error) {
      // Clear any existing auth data on registration failure
      clearAuth()
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      isLoading.value = true

      // Call logout endpoint if token exists
      if (token.value) {
        try {
          await authAPI.logout()
        } catch (error) {
          // Continue with logout even if API call fails
          console.warn('Logout API call failed:', error)
        }
      }

      clearAuth()

      window.showToast?.({
        type: 'success',
        title: 'Signed out',
        message: 'You have been successfully signed out'
      })
    } catch (error) {
      // Ensure logout happens even if there's an error
      clearAuth()
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (profileData) => {
    try {
      isLoading.value = true

      const response = await apiRequest(
        () => authAPI.updateProfile(profileData),
        'Profile Update Failed'
      )

      // Update user data
      user.value = { ...user.value, ...response.user }

      // Update localStorage
      localStorage.setItem('user', JSON.stringify(user.value))

      window.showToast?.({
        type: 'success',
        title: 'Profile updated',
        message: 'Your profile has been successfully updated'
      })

      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const refreshUserData = async () => {
    try {
      if (!token.value) return

      const response = await apiRequest(
        () => authAPI.getProfile(),
        'Failed to refresh user data'
      )

      user.value = response.user
      localStorage.setItem('user', JSON.stringify(response.user))

      return response
    } catch (error) {
      // If refresh fails, clear auth data
      clearAuth()
      throw error
    }
  }

  const clearAuth = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const initializeAuth = () => {
    try {
      // Restore auth data from localStorage
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = JSON.parse(storedUser)

        // Optionally refresh user data to ensure it's current
        refreshUserData().catch(() => {
          // If refresh fails, clear stored auth data
          clearAuth()
        })
      }
    } catch (error) {
      console.error('Error initializing auth:', error)
      clearAuth()
    }
  }

  const setIntendedRoute = (route) => {
    intendedRoute.value = route
  }

  const getIntendedRoute = () => {
    const route = intendedRoute.value
    intendedRoute.value = null

    // If no intended route, redirect based on role
    if (!route) {
      return user.value?.role === 'admin' ? '/admin' : '/dashboard'
    }

    return route
  }

  // Check if user has specific permission
  const hasPermission = (permission) => {
    if (!user.value) return false

    // Define role-based permissions
    const permissions = {
      trainer: [
        'create_quiz',
        'edit_quiz',
        'delete_quiz',
        'view_quiz_stats',
        'manage_users'
      ],
      user: [
        'take_quiz',
        'view_results',
        'view_leaderboard'
      ]
    }

    const userPermissions = permissions[user.value.role] || []
    return userPermissions.includes(permission)
  }

  return {
    // State
    user,
    token,
    isLoading,
    intendedRoute,

    // Getters
    isAuthenticated,
    isTrainer,
    isStudent,
    isAdmin,

    // Actions
    login,
    register,
    logout,
    updateProfile,
    refreshUserData,
    clearAuth,
    initializeAuth,
    setIntendedRoute,
    getIntendedRoute,
    hasPermission
  }
})