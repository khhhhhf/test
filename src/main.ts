import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

import router from './router'

const app = createApp(App)
/* console.log(asd)
console.log(aa) */

app.use(createPinia())
app.use(router)

app.mount('#app')
