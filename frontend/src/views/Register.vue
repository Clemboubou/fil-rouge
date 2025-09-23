<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-xl">Q</span>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <router-link
            to="/login"
            class="font-medium text-primary-600 hover:text-primary-500 transition-colors"
          >
            sign in to your existing account
          </router-link>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700">
              First Name
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
              placeholder="Enter your first name"
            />
            <p v-if="errors.firstName" data-cy="first-name-error" class="mt-1 text-sm text-red-600">{{ errors.firstName }}</p>
          </div>

          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700">
              Last Name
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
              placeholder="Enter your last name"
            />
            <p v-if="errors.lastName" data-cy="last-name-error" class="mt-1 text-sm text-red-600">{{ errors.lastName }}</p>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email address
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
              placeholder="Enter your email address"
            />
            <p v-if="errors.email" data-cy="email-error" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
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
              placeholder="Enter your password"
            />
            <p v-if="errors.password" data-cy="password-error" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
            <p class="mt-1 text-sm text-gray-500">
              Password must be at least 8 characters long
            </p>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Confirm Password
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
              placeholder="Confirm your password"
            />
            <p v-if="errors.confirmPassword" data-cy="confirm-password-error" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
          </div>

          <div>
            <label for="role" class="block text-sm font-medium text-gray-700">
              Account Type
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
              <option value="">Select account type</option>
              <option value="user">Student - Take quizzes and track progress</option>
              <option value="trainer">Trainer - Create and manage quizzes</option>
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
            I agree to the
            <a href="#" class="text-primary-600 hover:text-primary-500">Terms of Service</a>
            and
            <a href="#" class="text-primary-600 hover:text-primary-500">Privacy Policy</a>
          </label>
        </div>
        <p v-if="errors.agreeToTerms" data-cy="terms-error" class="text-sm text-red-600">{{ errors.agreeToTerms }}</p>

        <div>
          <button
            type="submit"
            :disabled="authStore.isLoading"
            data-cy="register-button"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg
                v-if="!authStore.isLoading"
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
            {{ authStore.isLoading ? 'Creating account...' : 'Create account' }}
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

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
  agreeToTerms: false
})

const errors = ref({})

const validateForm = () => {
  errors.value = {}

  if (!form.firstName) {
    errors.value.firstName = 'First name is required'
  } else if (form.firstName.length < 2) {
    errors.value.firstName = 'First name must be at least 2 characters'
  }

  if (!form.lastName) {
    errors.value.lastName = 'Last name is required'
  } else if (form.lastName.length < 2) {
    errors.value.lastName = 'Last name must be at least 2 characters'
  }

  if (!form.email) {
    errors.value.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.value.email = 'Please enter a valid email address'
  }

  if (!form.password) {
    errors.value.password = 'Password is required'
  } else if (form.password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters'
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
    errors.value.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  }

  if (!form.confirmPassword) {
    errors.value.confirmPassword = 'Please confirm your password'
  } else if (form.password !== form.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
  }

  if (!form.role) {
    errors.value.role = 'Please select an account type'
  }

  if (!form.agreeToTerms) {
    errors.value.agreeToTerms = 'You must agree to the terms and conditions'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    await authStore.register({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      role: form.role
    })

    // Redirect to dashboard after successful registration
    router.push('/dashboard')
  } catch (error) {
    // Error handling is done in the store and shown via toast
    console.error('Registration error:', error)

    // Clear passwords on error
    form.password = ''
    form.confirmPassword = ''

    // Focus first name field for retry
    setTimeout(() => {
      document.getElementById('firstName')?.focus()
    }, 100)
  }
}
</script>