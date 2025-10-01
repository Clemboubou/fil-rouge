import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import frFR from '@/assets/locales/fr_FR.json'
import enGB from '@/assets/locales/en_GB.json'

const translations = {
  fr: frFR,
  en: enGB
}

const defaultLanguage = 'fr'

export const useLanguageStore = defineStore('language', () => {
  // State
  const currentLanguage = ref(localStorage.getItem('language') || defaultLanguage)

  // Getters
  const t = computed(() => {
    return (key, params = {}) => {
      const keys = key.split('.')
      let value = translations[currentLanguage.value]

      for (const k of keys) {
        if (value && typeof value === 'object') {
          value = value[k]
        } else {
          return key // Return key if translation not found
        }
      }

      // Handle parameters like {name}
      if (typeof value === 'string' && Object.keys(params).length > 0) {
        return value.replace(/\{(\w+)\}/g, (match, key) => {
          return params[key] !== undefined ? params[key] : match
        })
      }

      return value || key
    }
  })

  const availableLanguages = computed(() => [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ])

  const currentLanguageName = computed(() => {
    const lang = availableLanguages.value.find(l => l.code === currentLanguage.value)
    return lang ? lang.name : 'Français'
  })

  const currentLanguageFlag = computed(() => {
    const lang = availableLanguages.value.find(l => l.code === currentLanguage.value)
    return lang ? lang.flag : '🇫🇷'
  })

  // Actions
  function setLanguage(lang) {
    if (translations[lang]) {
      currentLanguage.value = lang
      localStorage.setItem('language', lang)
      document.documentElement.lang = lang
    }
  }

  function toggleLanguage() {
    const newLang = currentLanguage.value === 'fr' ? 'en' : 'fr'
    setLanguage(newLang)
  }

  // Initialize
  document.documentElement.lang = currentLanguage.value

  return {
    currentLanguage,
    t,
    availableLanguages,
    currentLanguageName,
    currentLanguageFlag,
    setLanguage,
    toggleLanguage
  }
})