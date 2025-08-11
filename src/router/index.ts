import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: { name: 'home' } },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login/index.vue')
    },
    {
      name: 'home',
      path: '/home',
      component: () => import('@/views/home/index.vue'),
      redirect: { name: 'article-control' }, // 可设置默认重定向
      children: [
        {
          name: 'article-class',
          path: 'article-class',
          component: () => import('@/views/home/ArticleClass.vue')
        },
        {
          name: 'article-control',
          path: 'article-control',
          component: () => import('@/views/home/ArticleControl.vue')
        },
        {
          name: 'change-img',
          path: 'change-img',
          component: () => import('@/views/home/ChangeImg.vue')
        },
        {
          name: 'change-mm',
          path: 'change-mm',
          component: () => import('@/views/home/ChangeMm.vue')
        },
        {
          name: 'foundation-data',
          path: 'foundation-data',
          component: () => import('@/views/home/FoundationData.vue')
        }
      ]
    }
  ]
})

// GOOD
router.beforeEach((to) => {
  const userstore = useUserStore()
  const { token } = userstore
  if (to.name !== 'login' && !token) {
    ElMessage({
      message: '请先完成登录',
      type: 'warning',
      duration: 2000
    })
    return { name: 'login' }
  }
})

export default router
