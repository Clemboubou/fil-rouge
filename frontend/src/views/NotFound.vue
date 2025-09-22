<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
    <div class="text-center">
      <div class="mb-8">
        <h1 class="text-9xl font-bold text-primary-600">404</h1>
      </div>

      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        <p class="text-lg text-gray-600 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or the URL might be incorrect.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link
          to="/"
          class="btn-primary"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          Go Home
        </router-link>

        <button
          @click="goBack"
          class="btn-outline"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Go Back
        </button>
      </div>
    </div>

    <!-- Decorative illustration -->
    <div class="mt-16 text-gray-300">
      <svg class="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>