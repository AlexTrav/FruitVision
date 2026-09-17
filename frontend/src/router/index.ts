import { createRouter, createWebHistory } from 'vue-router'

// BASE_URL учитывает --base сборки (например, "/FruitVision/" на GitHub Pages)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/classify',
      name: 'classify',
      component: () => import('../views/ClassifierView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 } // при переходе между страницами всегда скроллим наверх
  },
})

export default router
