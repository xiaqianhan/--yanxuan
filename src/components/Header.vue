<template>
    <div class="header">
        <div class="home" @click="goHome">
            <i class="iconfont icon-shouye"></i>
        </div>
        <img class="logo" src="../assets/img/logo.png" alt />
        <div class="search">
            <i class="iconfont icon-icon-test" @click="goSearch"></i>
            <i class="iconfont icon-gouwuchekong" @click="goCart"></i>
        <span class="cart-num" v-if="cartNum > 0">{{cartNum}}</span>
        </div>
    </div>
</template>

<script>
import { API_CART_NUM } from '@/api.config.js'
import { mapState, mapMutations } from 'vuex'

export default {
  data () {
    return {
      // cartNum: 0
    }
  },
  computed: {
    ...mapState(['cartNum']) // 结构商品数量
  },
  methods: {
    ...mapMutations(['initCartNum', 'setUserinfo']), // 解构对应方法
    goHome () {
      this.$router.push('/')
    },
    goSearch () {
      this.$router.push('/search')
    },
    goCart () {
      this.$router.push('/cart')
    },
    async getCartNum () {
      const res = await this.$axios.get(API_CART_NUM)
      if (res) {
        // res.num:为当前购物车中的商品数量
        // res.user:为用户信息
        this.initCartNum(res.num)
        this.setUserinfo(res.user)
      } else {
        this.initCartNum(0)
        this.setUserinfo(null)
      }
    }
  },
  created () {
    this.getCartNum()
  }
}
</script>

<style lang="scss" scoped>
.header {
  height: 0.88rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding: 0 0.3rem;
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: $colorA;
  .iconfont {
    font-size: 0.56rem;
  }
  .icon-icon-test {
    margin-right: 0.1rem;
  }
  .logo {
    width: 1.72rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .cart-num {
    width: 0.36rem;
    height: 0.36rem;
    background-color: $colorB;
    text-align: center;
    line-height: 0.36rem;
    border-radius: 50%;
    position: absolute;
    top: 0.04rem;
    right: 0.2rem;
    color: $colorA;
  }
}
</style>
