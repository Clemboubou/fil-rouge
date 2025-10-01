import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // State - default to light mode
  const isDark = ref(false)

  // Initialize theme from localStorage or default to light
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')

    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      // Default to light mode
      isDark.value = false
    }

    applyTheme()
  }

  // Apply theme to document
  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Toggle theme
  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  // Watch for changes
  watch(isDark, () => {
    applyTheme()
  })

  return {
    isDark,
    initTheme,
    toggleTheme
  }
})
