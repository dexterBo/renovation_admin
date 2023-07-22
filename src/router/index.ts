/*
 * @Author: luoxi
 * @Date: 2022-01-25 09:51:12
 * @LastEditors: luoxi
 * @LastEditTime: 2022-01-25 12:25:51
 * @FilePath: \vue-admin-box\src\router\index.ts
 * @Description: 
 */
/**
 * @description 所有人可使用的参数配置列表
 * @params hideMenu: 是否隐藏当前路由结点不在导航中展示
 * @params alwayShow: 只有一个子路由时是否总是展示菜单，默认false
 */
import { reactive } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
import { createNameComponent } from './createNode'
import NProgress from '@/utils/system/nprogress'
import Layout from '@/layout/index.vue'
import { shallowRef } from 'vue'


NProgress.configure({ showSpinner: false })


/** 
 * @name 初始化必须要的路由
 * @description 使用reactive属性使得modules可以在路由菜单里面实时响应，搞定菜单回显的问题
 * @detail 针对modules的任何修改，均会同步至菜单级别，记住，是针对变量名为：moduels的修改
 **/
let modules = reactive([
  {
    path: '/',
    component: shallowRef(Layout),
    redirect: '/color',
    meta: { title: '色彩管理', icon: 'sfont system-home' },
    children: [
      {
        path: 'color',
        component: createNameComponent(() => import('@/views/main/color/index.vue')),
        meta: { title: '色彩管理', icon: 'sfont system-home', hideClose: true }
      }
    ]
  },
  {
    path: '/product',
    component: shallowRef(Layout),
    redirect: '/product',
    meta: { title: '产品管理', icon: 'sfont system-home' },
    children: [
      {
        path: 'product',
        component: createNameComponent(() => import('@/views/main/product/index.vue')),
        meta: { title: '产品管理', icon: 'sfont system-home', hideClose: true }
      }
    ]
  },
  {
    path: '/authorize',
    component: shallowRef(Layout),
    redirect: '/authorize',
    meta: { title: '授权管理', icon: 'sfont system-home' },
    children: [
      {
        path: 'authorize',
        component: createNameComponent(() => import('@/views/main/authorize/index.vue')),
        meta: { title: '授权管理', icon: 'sfont system-home', hideClose: true }
      }
    ]
  },
  {
    path: '/client',
    component: shallowRef(Layout),
    redirect: '/client',
    meta: { title: '授权管理', icon: 'sfont system-home' },
    children: [
      {
        path: 'client',
        component: createNameComponent(() => import('@/views/main/client/index.vue')),
        meta: { title: '客户管理', icon: 'sfont system-home', hideClose: true }
      }
    ]
  },
  {
    path: '/login',
    component: createNameComponent(() => import('@/views/system/login.vue')),
    hideMenu: true,
    meta: { title: '登录', hideTabs: true }
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/404',
    hideMenu: true,
    meta: { title: 'message.menu.system.name' },
    children: [
      {
        path: '/404',
        component: createNameComponent(() => import('@/views/system/404.vue')),
        meta: { title: 'message.menu.system.404', hideTabs: true }
      },
      {
        path: '/401',
        component: createNameComponent(() => import('@/views/system/401.vue')),
        meta: { title: 'message.menu.system.401', hideTabs: true }
      },
      {
        path: '/redirect/:path(.*)',
        component: createNameComponent(() => import('@/views/system/redirect.vue')),
        meta: { title: 'message.menu.system.redirect', hideTabs: true }
      }
    ]
  },
  {
    // 找不到路由重定向到404页面
    path: "/:pathMatch(.*)",
    component: Layout,
    redirect: "/404",
    hideMenu: true,
    meta: { title: '' },
    children: []
  },
])

const router = createRouter({
  history: createWebHashHistory(),
  routes: modules
})

// 未授权时可访问的白名单
const whiteList = ['/login']

// 路由跳转前的监听操作
router.beforeEach((to, _from, next) => {
  NProgress.start();
  if (store.state.user.token) {
    if (to.path === '/login') {
      next('/')
      return
    }
    next()
  } else if (whiteList.includes(to.path)) {
    next()
  } else {
    next("/login"); // 全部重定向到登录页
  }
});

// 路由跳转后的监听操作
router.afterEach((to: any, _from) => {
  const keepAliveComponentsName = store.getters['keepAlive/keepAliveComponentsName'] || []
  const name = to.matched[to.matched.length - 1].components.default.name
  if (to.meta && to.meta.cache && name && !keepAliveComponentsName.includes(name)) {
    store.commit('keepAlive/addKeepAliveComponentsName', name)
  }
  NProgress.done()
});

export {
  modules
}

export default router
