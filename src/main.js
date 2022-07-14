import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/reset.css'
import './assets/css/border.css'
import './assets/js/rem.js'
import './assets/iconfont/iconfont.css'
import axios from 'axios'
import ToastPlugin from './plugins/Toast'
import VConsole from 'vconsole'

// eslint-disable-next-line no-new
new VConsole() // 在手机上也可以看到控制台
Vue.use(ToastPlugin)

Vue.config.productionTip = false
Vue.prototype.$axios = axios
// 相当于每次请求URL地址的时候都会在后面拼上/api
axios.defaults.baseURL = '/api'

// 接口拦截
axios.interceptors.response.use(response => {
  // console.log(response)
  const res = response.data
  if (res.status === 1) { // 请求成功,data过滤掉
    return res.data
  } else if (res.status === 0) { // 请求失败
    console.error(res)
    return Promise.reject(res)
  }
}, error => {
  console.error(error)
  return Promise.reject(error)
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
