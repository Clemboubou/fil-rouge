<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm border p-8 mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          🔒 Politique de Confidentialité
        </h1>
        <p class="text-gray-600 mb-4">
          <strong>Dernière mise à jour :</strong> {{ lastUpdated }}
        </p>
        <p class="text-gray-700 leading-relaxed">
          Chez QuizMaster, nous respectons votre vie privée et nous nous engageons à protéger vos données personnelles.
          Cette politique explique comment nous collectons, utilisons et protégeons vos informations.
        </p>
      </div>

      <!-- Navigation rapide -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 class="text-lg font-semibold text-blue-900 mb-3">📑 Navigation rapide</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <a href="#data-collection" class="text-blue-700 hover:text-blue-900 underline">1. Données collectées</a>
          <a href="#data-usage" class="text-blue-700 hover:text-blue-900 underline">2. Utilisation des données</a>
          <a href="#cookies" class="text-blue-700 hover:text-blue-900 underline">3. Cookies et traceurs</a>
          <a href="#data-sharing" class="text-blue-700 hover:text-blue-900 underline">4. Partage des données</a>
          <a href="#your-rights" class="text-blue-700 hover:text-blue-900 underline">5. Vos droits RGPD</a>
          <a href="#data-security" class="text-blue-700 hover:text-blue-900 underline">6. Sécurité des données</a>
          <a href="#contact" class="text-blue-700 hover:text-blue-900 underline">7. Contact</a>
        </div>
      </div>

      <!-- Gestion des cookies -->
      <div class="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">🍪 Gestion de vos cookies</h2>
        <p class="text-gray-700 mb-4">
          Vous pouvez modifier vos préférences de cookies à tout moment :
        </p>
        <div class="flex flex-wrap gap-3">
          <button
            @click="showCookieSettings"
            class="btn-primary"
          >
            ⚙️ Gérer les cookies
          </button>
          <button
            @click="revokeConsent"
            class="btn-secondary"
          >
            🔄 Révoquer le consentement
          </button>
        </div>
      </div>

      <!-- Exercice des droits RGPD -->
      <div class="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">⚖️ Exercez vos droits RGPD</h2>
        <p class="text-gray-700 mb-4">
          Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="p-4 bg-gray-50 rounded-lg">
            <h3 class="font-semibold text-gray-900 mb-2">👁️ Droit d'accès</h3>
            <p class="text-sm text-gray-600 mb-3">Obtenez une copie de toutes vos données personnelles.</p>
            <button @click="requestDataAccess" class="btn-sm btn-secondary">
              Demander mes données
            </button>
          </div>

          <div class="p-4 bg-gray-50 rounded-lg">
            <h3 class="font-semibold text-gray-900 mb-2">✏️ Droit de rectification</h3>
            <p class="text-sm text-gray-600 mb-3">Corrigez ou mettez à jour vos informations.</p>
            <router-link to="/dashboard" class="btn-sm btn-secondary">
              Modifier mes données
            </router-link>
          </div>

          <div class="p-4 bg-gray-50 rounded-lg">
            <h3 class="font-semibold text-gray-900 mb-2">🗑️ Droit à l'effacement</h3>
            <p class="text-sm text-gray-600 mb-3">Supprimez définitivement votre compte et vos données.</p>
            <button @click="requestDataDeletion" class="btn-sm btn-danger">
              Supprimer mon compte
            </button>
          </div>

          <div class="p-4 bg-gray-50 rounded-lg">
            <h3 class="font-semibold text-gray-900 mb-2">📤 Droit à la portabilité</h3>
            <p class="text-sm text-gray-600 mb-3">Exportez vos données dans un format lisible.</p>
            <button @click="requestDataExport" class="btn-sm btn-secondary">
              Exporter mes données
            </button>
          </div>
        </div>

        <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 class="font-semibold text-yellow-800 mb-2">⏱️ Délais de traitement</h3>
          <p class="text-sm text-yellow-700">
            Nous nous engageons à traiter votre demande dans un délai maximum de <strong>30 jours</strong>.
            Vous recevrez un email de confirmation et serez tenu informé de l'avancement de votre demande.
          </p>
        </div>
      </div>

      <!-- Contenu détaillé de la politique -->
      <div class="space-y-8">
        <!-- Section 1: Données collectées -->
        <section id="data-collection" class="bg-white rounded-lg shadow-sm border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">1. 📊 Données que nous collectons</h2>

          <div class="space-y-4">
            <div>
              <h3 class="font-medium text-gray-900 mb-2">Données d'identification</h3>
              <ul class="list-disc list-inside text-gray-700 text-sm space-y-1">
                <li>Nom, prénom, adresse email</li>
                <li>Mot de passe (chiffré)</li>
                <li>Rôle (étudiant, formateur, administrateur)</li>
              </ul>
            </div>

            <div>
              <h3 class="font-medium text-gray-900 mb-2">Données d'activité</h3>
              <ul class="list-disc list-inside text-gray-700 text-sm space-y-1">
                <li>Résultats aux quiz et scores obtenus</li>
                <li>Temps passé sur les quiz</li>
                <li>Progression et badges débloqués</li>
                <li>Historique de navigation sur la plateforme</li>
              </ul>
            </div>

            <div>
              <h3 class="font-medium text-gray-900 mb-2">Données techniques</h3>
              <ul class="list-disc list-inside text-gray-700 text-sm space-y-1">
                <li>Adresse IP et géolocalisation approximative</li>
                <li>Type de navigateur et système d'exploitation</li>
                <li>Cookies et identifiants de session</li>
                <li>Logs de connexion et d'activité</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Section 2: Utilisation des données -->
        <section id="data-usage" class="bg-white rounded-lg shadow-sm border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">2. 🎯 Comment nous utilisons vos données</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-3">
              <h3 class="font-medium text-gray-900">Finalités principales</h3>
              <ul class="list-disc list-inside text-gray-700 text-sm space-y-1">
                <li>Fournir et améliorer nos services</li>
                <li>Gérer votre compte et authentification</li>
                <li>Calculer vos scores et progression</li>
                <li>Générer les classements et badges</li>
                <li>Support client et assistance technique</li>
              </ul>
            </div>

            <div class="space-y-3">
              <h3 class="font-medium text-gray-900">Finalités secondaires (avec consentement)</h3>
              <ul class="list-disc list-inside text-gray-700 text-sm space-y-1">
                <li>Analyses statistiques et amélioration UX</li>
                <li>Personnalisation du contenu</li>
                <li>Communications marketing (newsletters)</li>
                <li>Études de marché et recherche</li>
              </ul>
            </div>
          </div>

          <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p class="text-sm text-blue-800">
              <strong>Base légale :</strong> Nous traitons vos données sur la base de votre consentement,
              de l'exécution du contrat de service, et de nos intérêts légitimes à améliorer nos services.
            </p>
          </div>
        </section>

        <!-- Section 3: Cookies -->
        <section id="cookies" class="bg-white rounded-lg shadow-sm border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">3. 🍪 Cookies et technologies similaires</h2>

          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-gray-50">
                  <th class="text-left p-3 font-medium">Type de cookie</th>
                  <th class="text-left p-3 font-medium">Finalité</th>
                  <th class="text-left p-3 font-medium">Durée</th>
                  <th class="text-left p-3 font-medium">Consentement</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr>
                  <td class="p-3">🔧 Essentiels</td>
                  <td class="p-3">Authentification, navigation, sécurité</td>
                  <td class="p-3">Session / 30 jours</td>
                  <td class="p-3"><span class="text-red-600">Obligatoires</span></td>
                </tr>
                <tr>
                  <td class="p-3">📊 Analytics</td>
                  <td class="p-3">Mesure d'audience, statistiques d'usage</td>
                  <td class="p-3">13 mois</td>
                  <td class="p-3"><span class="text-green-600">Optionnel</span></td>
                </tr>
                <tr>
                  <td class="p-3">🎯 Marketing</td>
                  <td class="p-3">Publicités personnalisées, remarketing</td>
                  <td class="p-3">13 mois</td>
                  <td class="p-3"><span class="text-green-600">Optionnel</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Section 4: Vos droits -->
        <section id="your-rights" class="bg-white rounded-lg shadow-sm border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">5. ⚖️ Vos droits selon le RGPD</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-3">
              <div class="flex items-start space-x-3">
                <span class="text-lg">👁️</span>
                <div>
                  <h3 class="font-medium">Droit d'accès</h3>
                  <p class="text-sm text-gray-600">Accédez à toutes vos données personnelles</p>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <span class="text-lg">✏️</span>
                <div>
                  <h3 class="font-medium">Droit de rectification</h3>
                  <p class="text-sm text-gray-600">Corrigez les données inexactes</p>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <span class="text-lg">🗑️</span>
                <div>
                  <h3 class="font-medium">Droit à l'effacement</h3>
                  <p class="text-sm text-gray-600">Supprimez vos données (droit à l'oubli)</p>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <span class="text-lg">⏸️</span>
                <div>
                  <h3 class="font-medium">Droit à la limitation</h3>
                  <p class="text-sm text-gray-600">Limitez le traitement de vos données</p>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex items-start space-x-3">
                <span class="text-lg">📤</span>
                <div>
                  <h3 class="font-medium">Droit à la portabilité</h3>
                  <p class="text-sm text-gray-600">Exportez vos données dans un format standard</p>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <span class="text-lg">🚫</span>
                <div>
                  <h3 class="font-medium">Droit d'opposition</h3>
                  <p class="text-sm text-gray-600">Opposez-vous au traitement de vos données</p>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <span class="text-lg">🔄</span>
                <div>
                  <h3 class="font-medium">Retrait du consentement</h3>
                  <p class="text-sm text-gray-600">Retirez votre consentement à tout moment</p>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <span class="text-lg">⚖️</span>
                <div>
                  <h3 class="font-medium">Droit de réclamation</h3>
                  <p class="text-sm text-gray-600">Saisissez la CNIL en cas de litige</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Section 6: Contact -->
        <section id="contact" class="bg-white rounded-lg shadow-sm border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">7. 📞 Contact et réclamations</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-medium text-gray-900 mb-3">Délégué à la Protection des Données (DPO)</h3>
              <div class="space-y-2 text-sm text-gray-700">
                <p><strong>Email :</strong> dpo@quizmaster.com</p>
                <p><strong>Adresse :</strong> QuizMaster<br>
                Service Protection des Données<br>
                123 Avenue de la République<br>
                75011 Paris, France</p>
                <p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
              </div>
            </div>

            <div>
              <h3 class="font-medium text-gray-900 mb-3">Commission Nationale de l'Informatique et des Libertés (CNIL)</h3>
              <div class="space-y-2 text-sm text-gray-700">
                <p>En cas de litige, vous pouvez saisir la CNIL :</p>
                <p><strong>Site web :</strong> <a href="https://www.cnil.fr" target="_blank" class="text-blue-600 hover:text-blue-800 underline">www.cnil.fr</a></p>
                <p><strong>Adresse :</strong> 3 Place de Fontenoy<br>
                TSA 80715<br>
                75334 Paris Cedex 07</p>
                <p><strong>Téléphone :</strong> 01 53 73 22 22</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Footer de la politique -->
      <div class="mt-8 text-center text-sm text-gray-500">
        <p>Cette politique de confidentialité peut être mise à jour. La date de dernière modification est indiquée en haut de cette page.</p>
        <p class="mt-2">
          <router-link to="/" class="text-blue-600 hover:text-blue-800 underline">
            ← Retour à l'accueil
          </router-link>
        </p>
      </div>
    </div>

    <!-- Modal de confirmation -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ modalContent.title }}</h3>
        <p class="text-gray-700 mb-6">{{ modalContent.message }}</p>
        <div class="flex justify-end space-x-3">
          <button @click="closeModal" class="btn-secondary">Annuler</button>
          <button @click="confirmAction" class="btn-danger">Confirmer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const lastUpdated = ref('22 septembre 2024')
const showModal = ref(false)
const modalContent = ref({})
const pendingAction = ref(null)

const showCookieSettings = () => {
  // Emit event to show cookie banner with settings
  window.dispatchEvent(new CustomEvent('showCookieSettings'))
}

const revokeConsent = () => {
  modalContent.value = {
    title: 'Révoquer le consentement cookies',
    message: 'Êtes-vous sûr de vouloir révoquer votre consentement ? Le banner de cookies sera affiché à nouveau.'
  }
  pendingAction.value = 'revoke'
  showModal.value = true
}

const requestDataAccess = () => {
  modalContent.value = {
    title: 'Demande d\'accès aux données',
    message: 'Nous allons préparer un export de toutes vos données personnelles. Vous recevrez un email avec un lien de téléchargement dans les 48h.'
  }
  pendingAction.value = 'access'
  showModal.value = true
}

const requestDataDeletion = () => {
  modalContent.value = {
    title: 'Suppression définitive du compte',
    message: 'ATTENTION : Cette action est irréversible. Toutes vos données (scores, badges, progression) seront définitivement supprimées.'
  }
  pendingAction.value = 'deletion'
  showModal.value = true
}

const requestDataExport = () => {
  modalContent.value = {
    title: 'Export des données',
    message: 'Nous allons préparer un export de vos données au format JSON. Vous recevrez un email avec le fichier dans les 48h.'
  }
  pendingAction.value = 'export'
  showModal.value = true
}

const confirmAction = async () => {
  try {
    switch (pendingAction.value) {
      case 'revoke':
        // Revoke cookie consent
        window.dispatchEvent(new CustomEvent('revokeCookieConsent'))
        alert('Consentement révoqué. Le banner de cookies va réapparaître.')
        break

      case 'access':
      case 'export':
        // Request data access/export
        alert('Votre demande a été enregistrée. Vous recevrez un email de confirmation sous 48h.')
        break

      case 'deletion':
        // Request account deletion
        alert('Votre demande de suppression a été enregistrée. Vous recevrez un email de confirmation pour finaliser la procédure.')
        break
    }
  } catch (error) {
    console.error('Error processing GDPR request:', error)
    alert('Une erreur est survenue. Veuillez réessayer ou nous contacter directement.')
  }

  closeModal()
}

const closeModal = () => {
  showModal.value = false
  modalContent.value = {}
  pendingAction.value = null
}

onMounted(() => {
  // Listen for cookie settings events
  window.addEventListener('showCookieSettings', showCookieSettings)
})
</script>

<style scoped>
.btn-primary {
  @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500;
}

.btn-secondary {
  @apply inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500;
}

.btn-danger {
  @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500;
}

.btn-sm {
  @apply px-3 py-1.5 text-xs;
}

html {
  scroll-behavior: smooth;
}
</style>