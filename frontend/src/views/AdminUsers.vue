<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              User Management
            </h1>
            <p class="mt-2 text-gray-600">
              Manage user accounts, roles, and permissions
            </p>
          </div>
          <router-link
            to="/admin"
            class="btn-outline"
          >
            ← Back to Admin
          </router-link>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <!-- Users Table -->
      <div v-else class="card">
        <div class="card-header">
          <h2 class="text-xl font-semibold text-gray-900">All Users</h2>
          <p class="text-sm text-gray-600 mt-1">Total: {{ users.length }} users</p>
        </div>
        <div class="card-body p-0">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span class="text-primary-600 font-semibold">
                          {{ user.firstName?.charAt(0) || 'U' }}
                        </span>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ user.firstName }} {{ user.lastName }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ user.email }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <select
                      v-model="user.role"
                      @change="updateUserRole(user.id, user.role)"
                      class="text-sm rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="user">Student</option>
                      <option value="trainer">Trainer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="[
                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                        user.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      ]"
                    >
                      {{ user.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ user.totalPoints || 0 }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ new Date(user.createdAt).toLocaleDateString() }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      v-if="user.isActive"
                      @click="deactivateUser(user.id)"
                      :disabled="user.role === 'admin'"
                      class="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      Deactivate
                    </button>
                    <button
                      v-else
                      @click="reactivateUser(user.id)"
                      class="text-green-600 hover:text-green-900"
                    >
                      Reactivate
                    </button>
                    <button
                      @click="viewUserStats(user.id)"
                      class="text-blue-600 hover:text-blue-900 ml-2"
                    >
                      View Stats
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- User Stats Modal -->
      <div
        v-if="showStatsModal"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
        @click="closeStatsModal"
      >
        <div
          class="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white"
          @click.stop
        >
          <div class="mt-3">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">
                User Statistics: {{ selectedUser?.firstName }} {{ selectedUser?.lastName }}
              </h3>
              <button
                @click="closeStatsModal"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div v-if="userStats" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-blue-50 p-4 rounded-lg">
                  <p class="text-sm text-blue-600">Total Attempts</p>
                  <p class="text-2xl font-bold text-blue-900">{{ userStats.totalAttempts }}</p>
                </div>
                <div class="bg-green-50 p-4 rounded-lg">
                  <p class="text-sm text-green-600">Average Score</p>
                  <p class="text-2xl font-bold text-green-900">{{ userStats.averageScore }}%</p>
                </div>
              </div>

              <div class="bg-yellow-50 p-4 rounded-lg">
                <p class="text-sm text-yellow-600">Best Score</p>
                <p class="text-2xl font-bold text-yellow-900">{{ userStats.bestScore }}</p>
              </div>

              <div v-if="userStats.recentAttempts?.length" class="mt-6">
                <h4 class="font-medium text-gray-900 mb-3">Recent Attempts</h4>
                <div class="space-y-2 max-h-48 overflow-y-auto">
                  <div
                    v-for="attempt in userStats.recentAttempts"
                    :key="attempt.id"
                    class="flex justify-between items-center p-3 bg-gray-50 rounded"
                  >
                    <span class="text-sm text-gray-900">{{ attempt.quiz?.title }}</span>
                    <span class="text-sm font-medium text-gray-600">{{ attempt.percentage }}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-6 flex justify-end">
              <button
                @click="closeStatsModal"
                class="btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminAPI } from '@/services/api'

// State
const isLoading = ref(true)
const users = ref([])
const showStatsModal = ref(false)
const selectedUser = ref(null)
const userStats = ref(null)

// Methods
const loadUsers = async () => {
  try {
    isLoading.value = true
    const response = await adminAPI.getAllUsers()
    users.value = response.data || response
  } catch (error) {
    console.error('Error loading users:', error)
    window.showToast?.({
      type: 'error',
      message: 'Failed to load users'
    })
  } finally {
    isLoading.value = false
  }
}

const updateUserRole = async (userId, newRole) => {
  try {
    await adminAPI.updateUserRole(userId, newRole)
    window.showToast?.({
      type: 'success',
      message: 'User role updated successfully'
    })
  } catch (error) {
    console.error('Error updating user role:', error)
    window.showToast?.({
      type: 'error',
      message: 'Failed to update user role'
    })
    // Revert the change in UI
    await loadUsers()
  }
}

const deactivateUser = async (userId) => {
  if (!confirm('Are you sure you want to deactivate this user?')) return

  try {
    await adminAPI.deactivateUser(userId)
    window.showToast?.({
      type: 'success',
      message: 'User deactivated successfully'
    })
    await loadUsers()
  } catch (error) {
    console.error('Error deactivating user:', error)
    window.showToast?.({
      type: 'error',
      message: 'Failed to deactivate user'
    })
  }
}

const reactivateUser = async (userId) => {
  try {
    await adminAPI.reactivateUser(userId)
    window.showToast?.({
      type: 'success',
      message: 'User reactivated successfully'
    })
    await loadUsers()
  } catch (error) {
    console.error('Error reactivating user:', error)
    window.showToast?.({
      type: 'error',
      message: 'Failed to reactivate user'
    })
  }
}

const viewUserStats = async (userId) => {
  try {
    selectedUser.value = users.value.find(u => u.id === userId)
    const response = await adminAPI.getUserStats(userId)
    userStats.value = response.data
    showStatsModal.value = true
  } catch (error) {
    console.error('Error loading user stats:', error)
    window.showToast?.({
      type: 'error',
      message: 'Failed to load user statistics'
    })
  }
}

const closeStatsModal = () => {
  showStatsModal.value = false
  selectedUser.value = null
  userStats.value = null
}

// Lifecycle
onMounted(() => {
  loadUsers()
})
</script>