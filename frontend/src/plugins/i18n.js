import { useLanguageStore } from '@/stores/language'

export default {
  install(app) {
    // Create a reactive translation function
    app.config.globalProperties.$t = function(key) {
      const languageStore = useLanguageStore()
      return languageStore.t(key)
    }

    app.config.globalProperties.$lang = function() {
      return useLanguageStore()
    }
  }
}