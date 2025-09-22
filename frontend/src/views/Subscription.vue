<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          Choisissez votre plan
        </h1>
        <p class="text-gray-600 max-w-2xl mx-auto">
          Débloquez toutes les fonctionnalités de QuizMaster avec notre plan Premium.
          Créez des quiz illimités et accédez aux analytics avancés.
        </p>
      </div>

      <!-- Current Subscription Status -->
      <div v-if="subscriptionStatus" class="mb-8 p-6 bg-white rounded-lg shadow-sm border">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Plan actuel</h3>
            <p class="text-gray-600">
              <span :class="subscriptionStatus.plan === 'premium' ? 'text-yellow-600' : 'text-gray-600'" class="font-medium">
                {{ subscriptionStatus.plan === 'premium' ? 'Premium' : 'Gratuit' }}
              </span>
              <span v-if="subscriptionStatus.plan === 'premium' && subscriptionStatus.currentPeriodEnd">
                - Expire le {{ formatDate(subscriptionStatus.currentPeriodEnd) }}
              </span>
            </p>
          </div>
          <div v-if="subscriptionStatus.plan === 'premium'" class="flex space-x-3">
            <button
              @click="openBillingPortal"
              :disabled="loading"
              class="btn-secondary"
            >
              Gérer l'abonnement
            </button>
            <button
              v-if="!subscriptionStatus.cancelAtPeriodEnd"
              @click="cancelSubscription"
              :disabled="loading"
              class="btn-danger"
            >
              Annuler
            </button>
            <button
              v-else
              @click="reactivateSubscription"
              :disabled="loading"
              class="btn-primary"
            >
              Réactiver
            </button>
          </div>
        </div>

        <div v-if="subscriptionStatus.cancelAtPeriodEnd" class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p class="text-yellow-800 text-sm">
            ⚠️ Votre abonnement sera annulé le {{ formatDate(subscriptionStatus.currentPeriodEnd) }}
          </p>
        </div>
      </div>

      <!-- Pricing Plans -->
      <div class="grid md:grid-cols-2 gap-8 mb-8">
        <!-- Free Plan -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="text-center">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Plan Gratuit</h3>
            <div class="text-3xl font-bold text-gray-900 mb-4">
              0€
              <span class="text-base font-normal text-gray-600">/mois</span>
            </div>
          </div>

          <ul class="space-y-3 mb-6">
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-700">5 quiz maximum (formateurs)</span>
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-700">Accès à tous les quiz</span>
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-700">Système de points et badges</span>
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-700">Classements basiques</span>
            </li>
          </ul>

          <button
            v-if="subscriptionStatus?.plan !== 'free'"
            disabled
            class="w-full btn-disabled"
          >
            Plan actuel
          </button>
          <button
            v-else
            disabled
            class="w-full btn-disabled"
          >
            Plan actuel
          </button>
        </div>

        <!-- Premium Plan -->
        <div class="bg-white rounded-lg shadow-sm border-2 border-yellow-500 p-6 relative">
          <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span class="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Recommandé
            </span>
          </div>

          <div class="text-center">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Plan Premium</h3>
            <div class="text-3xl font-bold text-gray-900 mb-4">
              9,99€
              <span class="text-base font-normal text-gray-600">/mois</span>
            </div>
          </div>

          <ul class="space-y-3 mb-6">
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-700">Quiz illimités</span>
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-700">Analytics avancés</span>
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-700">Export des données (CSV, PDF)</span>
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-700">Support prioritaire</span>
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-700">Branding personnalisé</span>
            </li>
          </ul>

          <button
            v-if="subscriptionStatus?.plan === 'premium' && subscriptionStatus?.isActive"
            disabled
            class="w-full btn-disabled"
          >
            Plan actuel
          </button>
          <button
            v-else
            @click="subscribeToPremium"
            :disabled="loading"
            class="w-full btn-primary"
          >
            <span v-if="loading" class="animate-spin mr-2">⏳</span>
            Passer au Premium
          </button>
        </div>
      </div>

      <!-- Features Comparison -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Comparaison détaillée</h3>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4 font-medium text-gray-900">Fonctionnalité</th>
                <th class="text-center py-3 px-4 font-medium text-gray-900">Gratuit</th>
                <th class="text-center py-3 px-4 font-medium text-gray-900">Premium</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr>
                <td class="py-3 px-4 text-gray-700">Création de quiz (formateurs)</td>
                <td class="py-3 px-4 text-center">5 max</td>
                <td class="py-3 px-4 text-center text-green-600">Illimité</td>
              </tr>
              <tr>
                <td class="py-3 px-4 text-gray-700">Participation aux quiz</td>
                <td class="py-3 px-4 text-center text-green-600">✓</td>
                <td class="py-3 px-4 text-center text-green-600">✓</td>
              </tr>
              <tr>
                <td class="py-3 px-4 text-gray-700">Système de gamification</td>
                <td class="py-3 px-4 text-center text-green-600">✓</td>
                <td class="py-3 px-4 text-center text-green-600">✓</td>
              </tr>
              <tr>
                <td class="py-3 px-4 text-gray-700">Analytics avancés</td>
                <td class="py-3 px-4 text-center text-gray-400">✗</td>
                <td class="py-3 px-4 text-center text-green-600">✓</td>
              </tr>
              <tr>
                <td class="py-3 px-4 text-gray-700">Export de données</td>
                <td class="py-3 px-4 text-center text-gray-400">✗</td>
                <td class="py-3 px-4 text-center text-green-600">✓</td>
              </tr>
              <tr>
                <td class="py-3 px-4 text-gray-700">Support</td>
                <td class="py-3 px-4 text-center">Standard</td>
                <td class="py-3 px-4 text-center text-green-600">Prioritaire</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- FAQ -->
      <div class="mt-12">
        <h3 class="text-lg font-semibold text-gray-900 mb-6 text-center">Questions fréquentes</h3>
        <div class="space-y-4 max-w-2xl mx-auto">
          <div class="bg-white rounded-lg border p-4">
            <h4 class="font-medium text-gray-900 mb-2">Puis-je annuler mon abonnement à tout moment ?</h4>
            <p class="text-gray-600 text-sm">Oui, vous pouvez annuler votre abonnement à tout moment. Votre accès Premium restera actif jusqu'à la fin de votre période de facturation.</p>
          </div>
          <div class="bg-white rounded-lg border p-4">
            <h4 class="font-medium text-gray-900 mb-2">Que se passe-t-il si j'atteins la limite de 5 quiz ?</h4>
            <p class="text-gray-600 text-sm">Vous ne pourrez plus créer de nouveaux quiz tant que vous n'aurez pas supprimé des quiz existants ou que vous n'aurez pas souscrit au plan Premium.</p>
          </div>
          <div class="bg-white rounded-lg border p-4">
            <h4 class="font-medium text-gray-900 mb-2">Le paiement est-il sécurisé ?</h4>
            <p class="text-gray-600 text-sm">Oui, tous les paiements sont traités de manière sécurisée par Stripe, conforme aux normes PCI DSS.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { subscriptionAPI } from '@/services/api'
import { loadStripe } from '@stripe/stripe-js'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const subscriptionStatus = ref(null)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const fetchSubscriptionStatus = async () => {
  try {
    const response = await subscriptionAPI.getStatus()
    subscriptionStatus.value = response.data.data
  } catch (error) {
    console.error('Error fetching subscription status:', error)
  }
}

const subscribeToPremium = async () => {
  try {
    loading.value = true

    const response = await subscriptionAPI.createCheckoutSession('price_premium_monthly')

    if (response.data.data.url) {
      window.location.href = response.data.data.url
    }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    alert('Erreur lors de la création de la session de paiement')
  } finally {
    loading.value = false
  }
}

const openBillingPortal = async () => {
  try {
    loading.value = true

    const response = await subscriptionAPI.createBillingPortalSession()

    if (response.data.data.url) {
      window.location.href = response.data.data.url
    }
  } catch (error) {
    console.error('Error opening billing portal:', error)
    alert('Erreur lors de l\'ouverture du portail de facturation')
  } finally {
    loading.value = false
  }
}

const cancelSubscription = async () => {
  if (!confirm('Êtes-vous sûr de vouloir annuler votre abonnement ?')) {
    return
  }

  try {
    loading.value = true

    await subscriptionAPI.cancel()
    await fetchSubscriptionStatus()

    alert('Abonnement annulé avec succès')
  } catch (error) {
    console.error('Error canceling subscription:', error)
    alert('Erreur lors de l\'annulation de l\'abonnement')
  } finally {
    loading.value = false
  }
}

const reactivateSubscription = async () => {
  try {
    loading.value = true

    await subscriptionAPI.reactivate()
    await fetchSubscriptionStatus()

    alert('Abonnement réactivé avec succès')
  } catch (error) {
    console.error('Error reactivating subscription:', error)
    alert('Erreur lors de la réactivation de l\'abonnement')
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  fetchSubscriptionStatus()
})
</script>

<style scoped>
.btn-primary {
  @apply inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-danger {
  @apply inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-disabled {
  @apply inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-500 bg-gray-100 cursor-not-allowed;
}
</style>