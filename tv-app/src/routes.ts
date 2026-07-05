import { ESRouteType } from '@extscreen/es3-router'
import home from './pages/yecao-home/index.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: home
  },
  {
    path: '/home',
    name: 'home',
    component: home
  },
  {
    path: '/yecao-code',
    name: 'yecao-code',
    component: () => import('./pages/yecao-code/index.vue')
  },
  {
    path: '/yecao-download',
    name: 'yecao-download',
    component: () => import('./pages/yecao-download/index.vue')
  },
  {
    path: '/yecao-settings',
    name: 'yecao-settings',
    component: () => import('./pages/yecao-settings/index.vue')
  },
  {
    path: '/yecao-remote',
    name: 'yecao-remote',
    component: () => import('./pages/yecao-remote/index.vue')
  },
  {
    path: '/yecao-manager',
    name: 'yecao-manager',
    component: () => import('./pages/yecao-manager/index.vue')
  },
  {
    path: '/error',
    name: 'error',
    component: home
  }
]

export default routes
