import './assets/main.css'
import './assets/tailwind.css' 
import 'element-plus/dist/index.css'
import 'primeicons/primeicons.css'
import ElementPlus from 'element-plus'
import router from './router'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
})
app.use(createPinia())
app.use(ElementPlus)
app.use(router)
app.mount('#app')
