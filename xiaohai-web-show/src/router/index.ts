// 路由配置文件
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { getToken } from '@/utils/auth'
import { generateTitle } from '@/utils/publicMethods'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    children: [
      { path: '/', meta: { title: '首页' }, component: () => import('@/views/home/HomeIndex.vue') },
      {
        path: '/category',
        meta: { title: '分类' },
        component: () => import('@/views/category/CategoryIndex.vue')
      },
      {
        path: '/tags',
        meta: { title: '标签' },
        component: () => import('@/views/tags/TagsIndex.vue')
      },
      {
        path: '/back',
        meta: { title: '归档' },
        component: () => import('@/views/back/BackIndex.vue')
      },
      {
        path: '/message',
        meta: { title: '留言版' },
        component: () => import('@/views/message/MessageIndex.vue')
      },
      {
        path: '/links',
        meta: { title: '友链' },
        component: () => import('@/views/links/LinksIndex.vue')
      },
      {
        path: '/about',
        meta: { title: '关于' },
        component: () => import('@/views/about/AboutIndex.vue')
      },
      {
        path: '/article/:id',
        meta: { title: '文章' },
        component: () => import('@/views/article/ArticleIndex.vue')
      },
      {
        path: '/navigate',
        meta: { title: '导航' },
        component: () => import('@/views/navigate/NavigateIndex.vue')
      },
      {
        path: '/login',
        meta: { title: '登录' },
        component: () => import('@/views/login/LoginIndex.vue')
      },
      {
        path: '/register',
        meta: { title: '注册' },
        component: () => import('@/views/login/RegisterIndex.vue')
      },
      {
        path: '/writing',
        meta: { title: '创作' },
        component: () => import('@/views/article/writingIndex.vue')
      },
      {
        path: '/space',
        meta: { title: '个人空间' },
        component: () => import('@/views/space/SpaceIndex.vue')
      }
    ]
  }
]

const router = createRouter({
  // history: createWebHashHistory(),
  history: createWebHistory(), // 去掉地址栏里的#
  routes
})

const blackList = ['/writing', '/space']

router.beforeEach((to, from, next) => {
  // set page title
  document.title = generateTitle(to.meta.title)

  // 未登录
  if (!getToken()) {
    if (blackList.indexOf(to.path) >= 0) {
      next('/login')
    }
  }
  next()
})

export default router
