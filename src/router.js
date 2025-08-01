// router.js
import { createRouter, createWebHistory } from 'vue-router'
import Login from './views/Login.vue'
import Home from './views/Home.vue'
import Settings from './views/Settings.vue'

    const routes = [
      { path: '/', redirect: '/login' }, 
      { path: '/login', component: Login },
      { path: '/home', component: Home, props: true },
      { path: '/settings', component: Settings, props: true }
    ]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router