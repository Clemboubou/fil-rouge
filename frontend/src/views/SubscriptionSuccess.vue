<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 text-center">
      <div>
        <div class="mx-auto h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
          <svg class="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Bienvenue dans Premium !
        </h2>

        <p class="text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-8">
          Votre abonnement Premium a été activé avec succès. Vous avez maintenant accès à toutes les fonctionnalités avancées de QuizMaster.
        </p>

        <div class="bg-white dark:bg-gray-800 rounded-lg border p-6 mb-8 text-left">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ce qui vous attend :</h3>
          <ul class="space-y-3">
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-700 dark:text-gray-300">Création de quiz illimitée</span>
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-700 dark:text-gray-300">Analytics avancés et détaillés</span>
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-700 dark:text-gray-300">Export de données (CSV, PDF)</span>
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-700 dark:text-gray-300">Support prioritaire</span>
            </li>
          </ul>
        </div>

        <div class="space-y-4">
          <router-link
            to="/dashboard"
            class="w-full btn-primary"
          >
            Aller au tableau de bord
          </router-link>

          <router-link
            to="/subscription"
            class="w-full btn-secondary"
          >
            Gérer mon abonnement
          </router-link>
        </div>

        <p class="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-6">
          Vous recevrez un email de confirmation avec les détails de votre abonnement.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  // Optionally verify the session_id from Stripe if needed
  const sessionId = route.query.session_id

  if (!sessionId) {
    // If no session_id, redirect to subscription page
    router.push('/subscription')
  }
})
</script>

<style scoped>
.btn-primary {
  @apply inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500;
}

.btn-secondary {
  @apply inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500;
}
</style>