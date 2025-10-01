import { useLanguageStore } from '@/stores/language'
import { watch } from 'vue'

export default {
  mounted(el, binding) {
    const languageStore = useLanguageStore()

    function updateText() {
      if (binding.value) {
        el.textContent = languageStore.t(binding.value)
      }
    }

    updateText()

    // Watch for language changes
    el._unwatchLanguage = watch(
      () => languageStore.currentLanguage,
      () => updateText()
    )
  },

  updated(el, binding) {
    const languageStore = useLanguageStore()
    if (binding.value) {
      el.textContent = languageStore.t(binding.value)
    }
  },

  unmounted(el) {
    if (el._unwatchLanguage) {
      el._unwatchLanguage()
    }
  }
}