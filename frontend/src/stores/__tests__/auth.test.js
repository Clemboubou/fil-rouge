import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'

// Mock API
vi.mock('@/services/api', () => ({
  authAPI: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getProfile: vi.fn(),
    updateProfile: vi.fn()
  },
  apiRequest: vi.fn((fn) => fn())
}))

describe('Auth Store', () => {
  let authStore

  beforeEach(() => {
    setActivePinia(createPinia())
    authStore = useAuthStore()

    // Clear localStorage
    localStorage.clear()

    // Mock window.showToast
    window.showToast = vi.fn()
  })

  describe('Initial State', () => {
    it('should have initial state with no user', () => {
      expect(authStore.user).toBeNull()
      expect(authStore.token).toBeNull()
      expect(authStore.isLoading).toBe(false)
      expect(authStore.isAuthenticated).toBe(false)
    })
  })

  describe('Computed Properties', () => {
    it('should compute isAuthenticated correctly', () => {
      expect(authStore.isAuthenticated).toBe(false)

      authStore.token = 'test-token'
      authStore.user = { id: 1, role: 'user' }

      expect(authStore.isAuthenticated).toBe(true)
    })

    it('should compute isTrainer correctly', () => {
      authStore.user = { role: 'trainer' }
      expect(authStore.isTrainer).toBe(true)

      authStore.user = { role: 'user' }
      expect(authStore.isTrainer).toBe(false)
    })

    it('should compute isStudent correctly', () => {
      authStore.user = { role: 'user' }
      expect(authStore.isStudent).toBe(true)

      authStore.user = { role: 'trainer' }
      expect(authStore.isStudent).toBe(false)
    })

    it('should compute isAdmin correctly', () => {
      authStore.user = { role: 'admin' }
      expect(authStore.isAdmin).toBe(true)

      authStore.user = { role: 'user' }
      expect(authStore.isAdmin).toBe(false)
    })
  })

  describe('Login Action', () => {
    it('should login successfully', async () => {
      const { authAPI } = await import('@/services/api')
      const mockResponse = {
        token: 'test-token',
        user: {
          id: 1,
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user'
        }
      }

      authAPI.login.mockResolvedValue(mockResponse)

      await authStore.login({
        email: 'test@example.com',
        password: 'password123'
      })

      expect(authStore.token).toBe('test-token')
      expect(authStore.user).toEqual(mockResponse.user)
      expect(localStorage.getItem('token')).toBe('test-token')
      expect(window.showToast).toHaveBeenCalledWith({
        type: 'success',
        title: 'Welcome back!',
        message: expect.stringContaining('John Doe')
      })
    })

    it('should clear auth data on login failure', async () => {
      const { authAPI } = await import('@/services/api')
      authAPI.login.mockRejectedValue(new Error('Login failed'))

      await expect(authStore.login({
        email: 'test@example.com',
        password: 'wrong'
      })).rejects.toThrow()

      expect(authStore.token).toBeNull()
      expect(authStore.user).toBeNull()
    })
  })

  describe('Register Action', () => {
    it('should register successfully', async () => {
      const { authAPI } = await import('@/services/api')
      const mockResponse = {
        token: 'new-token',
        user: {
          id: 2,
          email: 'new@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          role: 'user'
        }
      }

      authAPI.register.mockResolvedValue(mockResponse)

      await authStore.register({
        email: 'new@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith'
      })

      expect(authStore.token).toBe('new-token')
      expect(authStore.user).toEqual(mockResponse.user)
      expect(window.showToast).toHaveBeenCalledWith({
        type: 'success',
        title: 'Account created!',
        message: expect.stringContaining('Jane')
      })
    })
  })

  describe('Logout Action', () => {
    it('should logout successfully', async () => {
      const { authAPI } = await import('@/services/api')

      // Set initial auth state
      authStore.token = 'test-token'
      authStore.user = { id: 1, email: 'test@example.com' }
      localStorage.setItem('token', 'test-token')
      localStorage.setItem('user', JSON.stringify(authStore.user))

      authAPI.logout.mockResolvedValue({})

      await authStore.logout()

      expect(authStore.token).toBeNull()
      expect(authStore.user).toBeNull()
      expect(localStorage.getItem('token')).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
      expect(window.showToast).toHaveBeenCalledWith({
        type: 'success',
        title: 'Signed out',
        message: 'You have been successfully signed out'
      })
    })

    it('should logout even if API call fails', async () => {
      const { authAPI } = await import('@/services/api')

      authStore.token = 'test-token'
      authStore.user = { id: 1 }

      authAPI.logout.mockRejectedValue(new Error('API error'))

      await authStore.logout()

      // Should still clear auth data
      expect(authStore.token).toBeNull()
      expect(authStore.user).toBeNull()
    })
  })

  describe('Initialize Auth', () => {
    it('should restore auth from localStorage', () => {
      const storedUser = {
        id: 1,
        email: 'test@example.com',
        role: 'user'
      }

      localStorage.setItem('token', 'stored-token')
      localStorage.setItem('user', JSON.stringify(storedUser))

      authStore.initializeAuth()

      expect(authStore.token).toBe('stored-token')
      expect(authStore.user).toEqual(storedUser)
    })

    it('should handle corrupted localStorage data', () => {
      localStorage.setItem('token', 'test-token')
      localStorage.setItem('user', 'invalid-json')

      authStore.initializeAuth()

      expect(authStore.token).toBeNull()
      expect(authStore.user).toBeNull()
    })
  })

  describe('Permissions', () => {
    it('should check trainer permissions correctly', () => {
      authStore.user = { role: 'trainer' }

      expect(authStore.hasPermission('create_quiz')).toBe(true)
      expect(authStore.hasPermission('take_quiz')).toBe(false)
    })

    it('should check user permissions correctly', () => {
      authStore.user = { role: 'user' }

      expect(authStore.hasPermission('take_quiz')).toBe(true)
      expect(authStore.hasPermission('create_quiz')).toBe(false)
    })

    it('should return false when no user', () => {
      expect(authStore.hasPermission('any_permission')).toBe(false)
    })
  })

  describe('Intended Route', () => {
    it('should set and get intended route', () => {
      authStore.setIntendedRoute('/quiz/123')
      expect(authStore.intendedRoute).toBe('/quiz/123')

      const route = authStore.getIntendedRoute()
      expect(route).toBe('/quiz/123')
      expect(authStore.intendedRoute).toBeNull()
    })

    it('should return default route when no intended route', () => {
      authStore.user = { role: 'user' }
      const route = authStore.getIntendedRoute()
      expect(route).toBe('/dashboard')
    })

    it('should return admin route for admin user', () => {
      authStore.user = { role: 'admin' }
      const route = authStore.getIntendedRoute()
      expect(route).toBe('/admin')
    })
  })
})
