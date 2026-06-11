import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomePage.vue'),
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/ProfilePage.vue'),
    },
    {
      path: '/mbti',
      name: 'MBTI',
      component: () => import('../views/MBTITest.vue'),
    },
    {
      path: '/result',
      name: 'Result',
      component: () => import('../views/ResultPage.vue'),
    },
    {
      path: '/recommend',
      name: 'Recommend',
      component: () => import('../views/RecommendPage.vue'),
    },
    {
      path: '/jd/:jobId',
      name: 'JDPage',
      component: () => import('../views/JDPage.vue'),
    },
    {
      path: '/chat',
      name: 'Chat',
      component: () => import('../views/ChatPage.vue'),
    },
  ],
})

export default router
