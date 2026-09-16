import { createRouter, createWebHistory } from 'vue-router'

// маршруты сайта: главная, классификатор и страница о проекте
const router = createRouter({
  history: createWebHistory(),
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
