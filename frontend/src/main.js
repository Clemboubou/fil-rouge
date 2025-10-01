import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import VueCookies from 'vue-cookies'
import i18nPlugin from './plugins/i18n'
import './assets/css/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(VueCookies)
app.use(i18nPlugin)

app.mount('#app')