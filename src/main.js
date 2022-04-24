import Vue from 'vue'
import App from './App.vue'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import router from './route.js'
Vue.use(router)

import * as Ws from './js/ws.js'
Vue.prototype.$SOCKET = Ws

import axios from 'axios'
const service = axios.create({
  baseURL: "http://localhost:9999",
  // baseURL: "http://chat-api.wuyan94zl.cn",
  timeout: 10000 // 请求超时时间
});
service.interceptors.request.use(config => {
  let access_token = localStorage.getItem("_token")
  if (access_token) {
    config.headers['Authorization'] = access_token
  }
  return config
})
service.interceptors.response.use(
  response => {
    return response
  },
  error => {
    let err = error.response.status
    if (err == 401) {
      localStorage.removeItem("_token");
      localStorage.removeItem("_userId");
      localStorage.removeItem("_chatList");
      router.replace({
        path: '/login'
      })
    }
  }
)
export default service
Vue.prototype.$axios = service

Vue.use(MintUI)
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  document.title = "go-zero chat"
  if (to.name == 'login' || to.name == 'register') {
    next()
  } else {
    let token = localStorage.getItem('_token')
    if (!token) {
      next('/login')
    } else {
      next()
    }
  }
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')