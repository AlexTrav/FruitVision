import { createApp } from 'vue'
import App from './App.vue'
import { vReveal } from './directives/reveal'
import router from './router'
import './style.css'

const app = createApp(App)

app.use(router)
app.directive('reveal', vReveal) // директива v-reveal для плавного появления секций при скролле

app.mount('#app')
