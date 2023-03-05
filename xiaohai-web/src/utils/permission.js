import Layout from '@/layout/index'
import { asyncRoutes } from '@/router'

// 遍历后台传来的路由字符串，转换为组件对象
export function filterAsyncRouter(asyncRouterMap) {
  return asyncRouterMap.filter(route => {
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
        route.path = '/' + route.path
      } else {
        if (route.path !== 'dictData/:id') {
          route.component = loadView(route.component)
        }
      }
    }
    if (route.children != null && route.children && route.children.length) {
      // 添加字典
      if (route.path === '/system') {
        route.children.push(asyncRoutes)
        console.log(route.children, ",'asyncRoutes'")
      }
      route.children = filterAsyncRouter(route.children)
    }

    return true
  })
}

export const loadView = (view) => {
  if (process.env.NODE_ENV === 'development') {
    return (resolve) => require([`@/views/${view}`], resolve)
  } else {
    // 使用 import 实现生产环境的路由懒加载
    // return () => import(`@/views${view}`)
    return (resolve) => require([`@/views/${view}`], resolve)
  }
}
