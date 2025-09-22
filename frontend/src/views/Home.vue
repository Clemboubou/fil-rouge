<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <div class="relative bg-gradient-to-r from-primary-600 to-primary-800 overflow-hidden">
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-primary-800 mix-blend-multiply"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-24 md:py-32">
          <div class="text-center">
            <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-6">
              Welcome to
              <span class="block text-primary-200">QuizMaster</span>
            </h1>
            <p class="max-w-2xl mx-auto text-xl text-primary-100 mb-8">
              The ultimate gamified learning platform. Create engaging quizzes,
              track progress, and compete with others in an interactive learning environment.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <router-link
                v-if="!authStore.isAuthenticated"
                to="/register"
                class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-gray-50 transition-colors shadow-lg"
              >
                Get Started Free
              </router-link>
              <router-link
                :to="authStore.isAuthenticated ? '/dashboard' : '/login'"
                class="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white hover:text-primary-700 transition-colors"
              >
                {{ authStore.isAuthenticated ? 'Go to Dashboard' : 'Sign In' }}
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Decorative elements -->
      <div class="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 rounded-full bg-primary-400 opacity-20"></div>
      <div class="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-48 h-48 rounded-full bg-primary-300 opacity-20"></div>
    </div>

    <!-- Features Section -->
    <div class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-extrabold text-gray-900 mb-4">
            Why Choose QuizMaster?
          </h2>
          <p class="max-w-2xl mx-auto text-lg text-gray-600">
            Experience learning like never before with our comprehensive quiz platform
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Interactive Quizzes</h3>
            <p class="text-gray-600">
              Create and take engaging quizzes with multiple choice questions, instant feedback, and real-time scoring.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Progress Tracking</h3>
            <p class="text-gray-600">
              Monitor your learning progress with detailed analytics, performance metrics, and achievement tracking.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Timed Challenges</h3>
            <p class="text-gray-600">
              Challenge yourself with time-limited questions that add excitement and urgency to your learning experience.
            </p>
          </div>

          <!-- Feature 4 -->
          <div class="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Leaderboards</h3>
            <p class="text-gray-600">
              Compete with others and climb the leaderboards. See how you rank against other learners globally.
            </p>
          </div>

          <!-- Feature 5 -->
          <div class="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Create Content</h3>
            <p class="text-gray-600">
              Trainers can easily create, edit, and manage quizzes with our intuitive quiz creation tools.
            </p>
          </div>

          <!-- Feature 6 -->
          <div class="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Instant Feedback</h3>
            <p class="text-gray-600">
              Get immediate feedback on your answers with explanations to help you learn from mistakes.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div v-if="stats" class="py-16 bg-primary-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-extrabold text-gray-900 mb-4">
            Join Our Learning Community
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="text-4xl font-bold text-primary-600 mb-2">{{ stats.totalUsers || '1,000+' }}</div>
            <div class="text-lg text-gray-600">Active Learners</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-primary-600 mb-2">{{ stats.totalQuizzes || '500+' }}</div>
            <div class="text-lg text-gray-600">Quizzes Available</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-primary-600 mb-2">{{ stats.totalAttempts || '10,000+' }}</div>
            <div class="text-lg text-gray-600">Quizzes Completed</div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="py-16 bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-extrabold text-white mb-4">
          Ready to Start Learning?
        </h2>
        <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of learners who are already improving their knowledge with QuizMaster.
        </p>

        <div v-if="!authStore.isAuthenticated" class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            to="/register"
            class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-100 transition-colors"
          >
            Sign Up Now
          </router-link>
          <router-link
            to="/login"
            class="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white hover:text-gray-900 transition-colors"
          >
            Sign In
          </router-link>
        </div>

        <div v-else>
          <router-link
            to="/dashboard"
            class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-100 transition-colors"
          >
            Go to Dashboard
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { statsAPI, apiRequest } from '@/services/api'

const authStore = useAuthStore()
const stats = ref(null)

onMounted(async () => {
  try {
    // Try to load public stats (may not be available without backend)
    const response = await apiRequest(
      () => statsAPI.getDashboardStats(),
      null // Don't show error toast for optional stats
    )
    stats.value = response
  } catch (error) {
    // Ignore error - stats are optional for landing page
    console.log('Stats not available:', error.message)
  }
})
</script>