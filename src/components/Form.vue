<template>
  <div>
    <form class="form">
      <!-- 用户名 -->
      <div class="form-item">
        <input type="text" placeholder="请输入用户名" v-model.trim="username">
        <div class="clear" @click="clearUsername" v-show="isClearUsername">
          <i class="iconfont icon-shanchu"></i>
        </div>
      </div>
      <!-- 密码 -->
      <div class="form-item">
        <input type="password" placeholder="请输入密码" v-model.trim="password">
        <div class="clear" @click="clearPassword" v-show="isClearPassword">
          <i class="iconfont icon-shanchu"></i>
        </div>
      </div>

      <div v-show="formType === 'regist'">
        <!-- 邮箱 -->
        <div class="form-item">
          <input type="text" placeholder="邮箱帐号" v-model.trim="email">
          <div class="clear" @click="clearEmail" v-show="isClearEmail">
            <i class="iconfont icon-shanchu"></i>
          </div>
        </div>
        <!-- 验证码 -->
        <div class="form-item">
          <input type="text" placeholder="请输入邮箱验证码" v-model.trim="code">
          <div class="status-msg" @click="getCode" v-show="!isShowStatusMsg">获取验证码</div>
          <div class="status-msg" v-show="isShowStatusMsg">{{statusMsg}}</div>
        </div>
      </div>

      <div class="back" @click="go" v-if="title && title.go">{{title.go}}</div>

      <div class="btn" @click="onClick" v-if="title && title.btn">{{title.btn}}</div>

    </form>
  </div>
</template>

<script>
import { API_USER_CODE } from '@/api.config.js'
import CryptoJS from 'crypto-js' // 加密组件

export default {
  data () {
    return {
      username: '',
      password: '',
      email: '',
      code: '',
      statusMsg: ''
    }
  },
  props: {
    // login regist
    formType: { // 表示当前form表单类型
      type: String,
      default: 'login' // 默认值
    }
  },
  methods: {
    clearUsername () {
      this.username = ''
    },
    clearPassword () {
      this.password = ''
    },
    clearEmail () {
      this.email = ''
    },
    // 获取验证码
    async getCode () {
      if (!this.email) {
        // alert('请输入邮箱')
        this.$showToast({
          msg: '请输入邮箱'
        })
        return
      }
      // /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
      if (!reg.test(this.email)) {
        // alert('请填写邮箱正确格式')
        this.$showToast({
          msg: '请填写邮箱正确格式'
        })
        return
      }
      const { code, msg } = await this.$axios.post(API_USER_CODE, {
        email: this.email
      })
      if (code === 1) { // 发送成功
        let count = 60
        this.statusMsg = `${count--}秒后重发`
        this.timer = setInterval(() => {
          this.statusMsg = `${count--}秒后重发`
          if (count === 0) {
            clearInterval(this.timer)
            this.statusMsg = ''
          }
        }, 1000)
        // this.statusMsg = count
      }
      // console.log(res)
      // alert(msg)s
      this.$showToast({
        msg
      })
    },
    // 验证表单
    verifyFrom () {
      let msg = '' // 表示当前那个内容没有输入，则用户提示信息存入msg中
      // trim():去掉空格
      if (this.username.trim() === '') {
        msg = '请输入用户名'
      } else if (this.password.trim() === '') {
        msg = '请输入密码'
      } else if (this.formType === 'regist' && this.email.trim() === '') {
        msg = '请输入邮箱'
      } else if (this.formType === 'regist' && this.code.trim() === '') {
        msg = '请输入验证码'
      }
      if (msg !== '') {
        // alert(msg)
        this.$showToast({
          msg
        })
        return false
      } else {
        return true
      }
    },
    onClick () {
      // CryptoJS.MD5():加密方法
      this.$data.password = CryptoJS.MD5(this.$data.password).toString()
      this.verifyFrom() && this.$emit('onClick', this.$data) // onClick:自定义事件,将参数传递给Regist.vue
    },
    // 跳转页面
    go () {
      this.$router.push(this.title.url)
    }
  },
  computed: {
    isClearUsername () {
      return this.username.length
    },
    isClearPassword () {
      return this.password.length
    },
    isClearEmail () {
      return this.email.length
    },
    isShowStatusMsg () {
      return this.statusMsg.length
    },
    title () {
      let data = {}
      if (this.formType === 'login') {
        data = {
          go: '注册账号',
          btn: '登录',
          url: '/profile/regist'
        }
      } else if (this.formType === 'regist') {
        data = {
          go: '回到登录',
          btn: '注册',
          url: '/profile/login'
        }
      }
      return data
    }
  }
}
</script>

<style lang="scss" scoped>
.form{
    display: block;
    padding: 0 0.3rem;
    &-item{
        // padding: 0 0.3rem;
        height: 0.96rem;
        line-height: 0.96rem;
        border-bottom:1px solid #ccc;
        display: flex;
        align-items: center;
        input{
            border: none;
            outline: none;
            flex: 1;
            background-color: $colorE;
        }
        .clear{
            width: 0.64rem;
            height: 0.64rem;
            text-align: center;
            line-height: 0.64rem;
        }
        .status-msg{
            height: 0.56rem;
            border: 1px solid #ccc;
            border-radius: 4px;
            line-height: 0.56rem;
            text-align: center;
            padding: 0 0.2rem;
            font-size: 0.1rem;
        }
    }
    .back{
        margin: 0.3rem 0;
        color: #7f7f7f;
    }
    .btn{
        width: 6.72rem;
        height: 0.96rem;
        margin: 0 auto;
        line-height: 0.96rem;
        background-color: $colorB;
        color: $colorA;
        text-align: center;
        font-size: $fontB;
    }
}
</style>
