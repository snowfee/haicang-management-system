import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import * as filters from '@/filters/index'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { size: 'small' })
console.log(filters)
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]))

Vue.config.productionTip = false

// 全局变量
Vue.prototype.EXCELSERVE = 'http://www.haic168.com:7521' 
Vue.prototype.WEBSOCKETSERVE = 'ws://www.haic168.com:7521/backend/websocket/newOrder'

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App) // h为createElement的别名 jsx语法
})
