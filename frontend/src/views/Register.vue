<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 bg-primary-600 dark:bg-primary-500 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-xl">Q</span>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {{ showVerification ? '📧 Vérification Email' : $t('auth.createYourAccount') }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          <span v-if="!showVerification">
            {{ $t('auth.or') }}
            <router-link
              to="/login"
              class="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors"
            >
              {{ $t('auth.signInToExistingAccount') }}
            </router-link>
          </span>
          <span v-else>
            Entrez le code à 6 chiffres envoyé à<br><strong class="text-gray-900 dark:text-white">{{ registeredEmail }}</strong>
          </span>
        </p>
      </div>

      <!-- STEP 1: Registration Form -->
      <form v-if="!showVerification" class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('auth.firstName') }}
            </label>
            <input
              id="firstName"
              v-model="form.firstName"
              name="firstName"
              type="text"
              autocomplete="given-name"
              required
              data-cy="first-name-input"
              class="mt-1 input"
              :class="{ 'border-red-500': errors.firstName }"
              :placeholder="$t('auth.firstNamePlaceholder')"
            />
            <p v-if="errors.firstName" data-cy="first-name-error" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.firstName }}</p>
          </div>

          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('auth.lastName') }}
            </label>
            <input
              id="lastName"
              v-model="form.lastName"
              name="lastName"
              type="text"
              autocomplete="family-name"
              required
              data-cy="last-name-input"
              class="mt-1 input"
              :class="{ 'border-red-500': errors.lastName }"
              :placeholder="$t('auth.lastNamePlaceholder')"
            />
            <p v-if="errors.lastName" data-cy="last-name-error" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.lastName }}</p>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('auth.emailAddress') }}
            </label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              data-cy="email-input"
              class="mt-1 input"
              :class="{ 'border-red-500': errors.email }"
              :placeholder="$t('auth.emailPlaceholder')"
            />
            <p v-if="errors.email" data-cy="email-error" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.email }}</p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('auth.password') }}
            </label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              data-cy="password-input"
              class="mt-1 input"
              :class="{ 'border-red-500': errors.password }"
              :placeholder="$t('auth.passwordPlaceholder')"
            />
            <p v-if="errors.password" data-cy="password-error" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.password }}</p>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ $t('auth.passwordMinLength') }}
            </p>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('auth.confirmPassword') }}
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              name="confirmPassword"
              type="password"
              autocomplete="new-password"
              required
              data-cy="confirm-password-input"
              class="mt-1 input"
              :class="{ 'border-red-500': errors.confirmPassword }"
              :placeholder="$t('auth.confirmPasswordPlaceholder')"
            />
            <p v-if="errors.confirmPassword" data-cy="confirm-password-error" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
          </div>

          <div>
            <label for="role" class="block text-sm font-medium text-gray-700">
              {{ $t('auth.accountType') }}
            </label>
            <select
              id="role"
              v-model="form.role"
              name="role"
              required
              data-cy="role-select"
              class="mt-1 input"
              :class="{ 'border-red-500': errors.role }"
            >
              <option value="">{{ $t('auth.selectAccountType') }}</option>
              <option value="user">{{ $t('auth.studentDesc') }}</option>
              <option value="trainer">{{ $t('auth.trainerDesc') }}</option>
            </select>
            <p v-if="errors.role" data-cy="role-error" class="mt-1 text-sm text-red-600">{{ errors.role }}</p>
          </div>
        </div>

        <div class="flex items-center">
          <input
            id="terms"
            v-model="form.agreeToTerms"
            name="terms"
            type="checkbox"
            required
            data-cy="terms-checkbox"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            :class="{ 'border-red-500': errors.agreeToTerms }"
          />
          <label for="terms" class="ml-2 block text-sm text-gray-900">
            {{ $t('auth.agreeToTerms') }}
            <a href="#" class="text-primary-600 hover:text-primary-500">{{ $t('auth.termsOfService') }}</a>
            {{ $t('auth.and') }}
            <a href="#" class="text-primary-600 hover:text-primary-500">{{ $t('auth.privacyPolicy') }}</a>
          </label>
        </div>
        <p v-if="errors.agreeToTerms" data-cy="terms-error" class="text-sm text-red-600">{{ errors.agreeToTerms }}</p>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            data-cy="register-button"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg
                v-if="!isLoading"
                class="h-5 w-5 text-primary-500 group-hover:text-primary-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"
                />
              </svg>
              <div v-else class="h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
            </span>
            {{ isLoading ? $t('auth.creatingAccount') : $t('auth.createAccount') }}
          </button>
        </div>
      </form>

      <!-- STEP 2: Verification Form -->
      <form v-else class="mt-8 space-y-6" @submit.prevent="handleVerification">
        <div class="bg-primary-50 border border-primary-200 rounded-lg p-4 text-center">
          <p class="text-sm text-primary-800">
            📬 Un code de vérification a été envoyé à votre email.<br>
            Le code expire dans <strong>15 minutes</strong>.
          </p>
        </div>

        <div>
          <label for="code" class="block text-sm font-medium text-gray-700 text-center mb-2">
            Code de vérification
          </label>
          <input
            id="code"
            v-model="verificationCode"
            name="code"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="6"
            required
            data-cy="verification-code-input"
            class="mt-1 input text-center text-2xl font-bold tracking-widest"
            :class="{ 'border-red-500': verificationError }"
            placeholder="000000"
            @input="verificationCode = verificationCode.replace(/[^0-9]/g, '')"
          />
          <p v-if="verificationError" data-cy="verification-error" class="mt-2 text-sm text-red-600 text-center">{{ verificationError }}</p>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading || verificationCode.length !== 6"
            data-cy="verify-button"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <div v-if="isLoading" class="h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
              <svg v-else class="h-5 w-5 text-primary-500 group-hover:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </span>
            {{ isLoading ? 'Vérification...' : 'Vérifier le code' }}
          </button>
        </div>

        <div class="text-center">
          <button
            type="button"
            @click="handleResendCode"
            :disabled="isLoading || resendCooldown > 0"
            class="text-sm text-primary-600 hover:text-primary-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ resendCooldown > 0 ? `Renvoyer le code (${resendCooldown}s)` : 'Renvoyer le code' }}
          </button>
        </div>

        <div class="text-center">
          <button
            type="button"
            @click="showVerification = false"
            class="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Retour au formulaire
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()
const languageStore = useLanguageStore()

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
  agreeToTerms: false
})

const showVerification = ref(false)
const registeredEmail = ref('')
const verificationCode = ref('')
const verificationError = ref('')
const errors = ref({})
const isLoading = ref(false)
const resendCooldown = ref(0)

const validateForm = () => {
  errors.value = {}

  if (!form.firstName) {
    errors.value.firstName = languageStore.t('auth.errors.firstNameRequired')
  } else if (form.firstName.length < 2) {
    errors.value.firstName = languageStore.t('auth.errors.firstNameMinLength')
  }

  if (!form.lastName) {
    errors.value.lastName = languageStore.t('auth.errors.lastNameRequired')
  } else if (form.lastName.length < 2) {
    errors.value.lastName = languageStore.t('auth.errors.lastNameMinLength')
  }

  if (!form.email) {
    errors.value.email = languageStore.t('auth.errors.emailRequired')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.value.email = languageStore.t('auth.errors.emailInvalid')
  }

  if (!form.password) {
    errors.value.password = languageStore.t('auth.errors.passwordRequired')
  } else if (form.password.length < 8) {
    errors.value.password = languageStore.t('auth.errors.passwordMinLength')
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
    errors.value.password = languageStore.t('auth.errors.passwordComplexity')
  }

  if (!form.confirmPassword) {
    errors.value.confirmPassword = languageStore.t('auth.errors.passwordConfirmRequired')
  } else if (form.password !== form.confirmPassword) {
    errors.value.confirmPassword = languageStore.t('auth.errors.passwordMismatch')
  }

  if (!form.role) {
    errors.value.role = languageStore.t('auth.errors.roleRequired')
  }

  if (!form.agreeToTerms) {
    errors.value.agreeToTerms = languageStore.t('auth.errors.termsRequired')
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isLoading.value = true

  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
    const response = await axios.post(`${API_URL}/auth/register`, {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      role: form.role
    })

    if (response.data.success && response.data.data.requiresVerification) {
      registeredEmail.value = form.email
      showVerification.value = true
      window.showToast({
        type: 'success',
        title: 'Email envoyé !',
        message: 'Vérifiez votre boîte email pour le code de vérification.'
      })
    }
  } catch (error) {
    console.error('Registration error:', error)
    window.showToast({
      type: 'error',
      title: 'Erreur d\'inscription',
      message: error.response?.data?.message || 'Une erreur est survenue'
    })
  } finally {
    isLoading.value = false
  }
}

const handleVerification = async () => {
  if (verificationCode.value.length !== 6) {
    verificationError.value = 'Le code doit contenir 6 chiffres'
    return
  }

  isLoading.value = true
  verificationError.value = ''

  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
    const response = await axios.post(`${API_URL}/auth/verify-email`, {
      email: registeredEmail.value,
      code: verificationCode.value
    })

    if (response.data.success) {
      // Store user and token
      authStore.user = response.data.data.user
      authStore.token = response.data.data.token
      authStore.isAuthenticated = true
      localStorage.setItem('token', response.data.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.data.user))

      window.showToast({
        type: 'success',
        title: 'Inscription réussie !',
        message: 'Bienvenue sur QuizMaster 🎉'
      })

      router.push('/dashboard')
    }
  } catch (error) {
    console.error('Verification error:', error)
    verificationError.value = error.response?.data?.message || 'Code invalide ou expiré'
    verificationCode.value = ''
  } finally {
    isLoading.value = false
  }
}

const handleResendCode = async () => {
  if (resendCooldown.value > 0) return

  isLoading.value = true

  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
    await axios.post(`${API_URL}/auth/resend-verification`, {
      email: registeredEmail.value
    })

    window.showToast({
      type: 'success',
      title: 'Code renvoyé !',
      message: 'Un nouveau code a été envoyé à votre email.'
    })

    // Start cooldown
    resendCooldown.value = 60
    const interval = setInterval(() => {
      resendCooldown.value--
      if (resendCooldown.value <= 0) {
        clearInterval(interval)
      }
    }, 1000)
  } catch (error) {
    console.error('Resend error:', error)
    window.showToast({
      type: 'error',
      title: 'Erreur',
      message: error.response?.data?.message || 'Impossible de renvoyer le code'
    })
  } finally {
    isLoading.value = false
  }
}
</script>