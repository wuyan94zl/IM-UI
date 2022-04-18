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
  baseURL: "http://localhost:8888",
  timeout: 10000 // 请求超时时间
});
service.interceptors.request.use(config => {
  let access_token = localStorage.getItem("_token")
  if (access_token) {
    config.headers['Authorization'] = access_token
  }
  console.log(config);
  return config
})
service.interceptors.response.use(
  response => {
    return response
  },
  error => {
    console.log(error);
    // let err = error.response.status
    // if (err == 401) {
    //   router.replace({
    //     path: '/login'
    //   })
    // }
  }
)
export default service
Vue.prototype.$axios = service

Vue.use(MintUI)
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  console.log("路由名称", to.name)
  if (to.name != 'login') {
    let token = localStorage.getItem('_token')
    if (!token) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')