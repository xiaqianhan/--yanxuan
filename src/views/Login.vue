<template>
  <div>
    <form-comp formType="login" @onClick="onLogin" />
    <!-- <toast /> -->
  </div>
</template>

<script>
import FormComp from '../components/Form'
import { API_USER_LOGIN } from '@/api.config.js'
// import Toast from '../components/Toast'

export default {
  components: { FormComp },
  methods: {
    async onLogin ({ username, password }) {
      // user:存的是当前登录用户的信息
      const { code, msg, user } = await this.$axios.post(API_USER_LOGIN, {
        username,
        password
      })
      if (code === 0) {
        // 未登录
        // alert(msg)
        this.$showToast({
          msg
        })
      } else if (code === 1) {
        // 已登录
        // alert('登陆成功')
        this.$showToast({
          msg: '登录成功'
        })
        console.log(user)
        // 保存用户信息到vuex
        this.$store.commit('setUserinfo', user)
        this.$router.go(-1)
      }
    }
  }
}
// session:服务端 VS cookie:客户端
</script>

<style>
</style>
