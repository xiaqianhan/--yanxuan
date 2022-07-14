import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userinfo: null, // 保存用户当前信息
    cartNum: 0 // 保存商品信息
  },
  mutations: { // 唯一修改state的入口
    setUserinfo (state, userinfo) {
      state.userinfo = userinfo
    },
    setCartNum (state, num) {
      state.cartNum += num
    },
    initCartNum (state, num) { // 将读取到的购物车数量设置给cartNum
      state.cartNum = num
    }
  },
  actions: {
  },
  modules: {
  }
})
