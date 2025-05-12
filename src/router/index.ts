import { createRouter, createWebHistory } from 'vue-router'
import ChatPage from '../views/ChatPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', // Define la ruta para la página del ChatBot
      name: 'chat', // Un nombre para la ruta
      component: ChatPage
      // lazy loading
      //component: () => import('../views/ChatPage.vue')
    },
    /*{
      path: '/configUser',
      name: 'configUser',
      component: HomeView,
    },*/

  ],
})

export default router
