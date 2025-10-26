import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Landing from '@/views/Landing.vue'
import About from '@/views/About.vue'
import Questions from "@/views/Questions.vue";
import Result from "@/views/Result.vue";

const routes = [
    { path: '/', name: 'Landing', component: Landing },
    { path: '/about', name: 'About', component: About },
    { path: '/questions', name: 'Questions', component: Questions },
    { path: "/result", name: "Result", component: Result },

]

//Router
const router = createRouter({
    history: createWebHistory(),
    routes,
})

const app = createApp(App)
app.use(router)
app.mount('#app')

export default router
