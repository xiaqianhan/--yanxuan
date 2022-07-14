<template>
  <!-- 购物车 -->
  <div class="container">
    <!-- 头部 -->
    <div class="header">购物车</div>

    <!-- 购物车为空时显示 -->
    <div v-if="cartDetail.length === 0" class="empty">
      <img src="../assets/img/cart-empty.webp" alt="">
      <div>去添加点什么吧</div>
    </div>
    <!-- 当购物车有数据时 -->
    <div v-else>
      <div v-for="(item, index) in cartDetail" :key="index" class="item">
        <input type="checkbox" v-model="item.checked" @change="toggleCheckOne(item)">
        <img :src="item.pic" alt="" class="pic">
        <div class="detail">
          <div class="name">{{item.name}}</div>
          <div class="info">
            <div class="price">￥{{item.price}}</div>
            <div class="selnum">
              <span class="label less" @click="less(item)">-</span>
              <input type="text" class="label num" v-model.number="item.num" @change="updateCart(item)">
              <span class="label more" @click="more(item)">+</span>
            </div>
          </div>
        </div>
        <!-- 删除 -->
        <i class="iconfont icon-shanchu1" @click="delCart(item, index)"></i>
      </div>
    </div>

    <!-- 商品选中 -->
    <div class="foot">
      <div class="checkall">
        <input type="checkbox" class="check-all" v-model="checkAllFlag" @change="toggleCheckAll">
        <span class="checked">已选 ({{checkNum}})</span>
      </div>
      <div class="total">合计:￥{{total}}</div>
      <!-- :class="{'btn-disable': checkNum === 0}":如果checkNum为0,样式起作用 -->
      <div class="confirm" @click="confirm" :class="{'btn-disable': checkNum === 0}">下单</div>
    </div>

    <!-- 底部菜单 -->
    <nav-footer />

    <loading v-show="isLoading"/>
  </div>
</template>

<script>
import { API_CART_DETAIL, API_USER_VERIFY, API_CART_UPDATE, API_CART_CHECK, API_CART_DEL, API_ORDER_CREATE } from '@/api.config.js'
import NavFooter from '../components/NavFooter'
import Loading from '../components/Loading'

export default {
  data () {
    return {
      cartDetail: [],
      // checkNum: 0, // 已选择商品数量
      // total: 0, // 合计总价格
      isLoading: false,
      checkAllFlagTemp: false
    }
  },
  components: { NavFooter, Loading },
  computed: {
    checkNum () { // 已选择商品数量的动态变化
      return this.cartDetail.reduce((sum, product) => { // reduce():用于求和
        if (product.checked) {
          sum += product.num
        }
        return sum
      }, 0)
    },
    checkAllFlag: {
      get () { // 获取值
        const selectNum = this.cartDetail.reduce((sum, product) => {
          if (product.checked) {
            sum++
          }
          return sum
        }, 0)
        return selectNum === this.cartDetail.length // 当购物车商品全选中时返回true
      },
      set (val) {
        // console.log(val)
        this.checkAllFlagTemp = val
      }
    },
    total () { // 计算总价
      const t = this.cartDetail.reduce((sum, product) => {
        if (product.checked) {
          sum += product.price * product.num
        }
        return sum
      }, 0)
      return t.toFixed(1) // 保留小数点后一位
    }
  },
  methods: {
    async getCartDetail () {
      this.isLoading = true
      const res = await this.$axios.get(API_CART_DETAIL)
      console.log(res)
      this.cartDetail = res
      this.isLoading = false
    },
    toggleCheckOne (item) {
      this.updateCart(item)
    },
    async updateCart (item) {
      await this.$axios.post(API_CART_UPDATE, item)
    },
    // 全选取消则商品选择取消
    toggleCheckAll () {
      this.cartDetail.forEach(product => {
        product.checked = this.checkAllFlagTemp
      })
      this.$axios.post(API_CART_CHECK, { // 将数据同步到数据库中
        checkAllFlag: this.checkAllFlagTemp
      })
    },
    less (item) { // 减少购买商品数量
      if (item.num > 1) {
        item.num--
      } else {
        this.$showToast({
          msg: '数量不能小于1'
        })
        return
      }
      this.updateCart(item)
    },
    more (item) { // 增加购买商品数量,在实际中还应该判断商品库存数量
      item.num++
      this.updateCart(item)
    },
    // 删除购物车
    delCart (item, index) {
      this.$showToast({
        btnShow: true,
        msg: '确认删除吗',
        callback: async () => {
          // deletedCout:表示当前删除商品的数量
          const { deletedCout } = await this.$axios.post(API_CART_DEL, item)
          if (deletedCout > 0) {
            // splice(): 用于删除数组指定下标的元素
            this.cartDetail.splice(index, 1)
            this.$showToast({
              msg: '删除成功'
            })
          }
        }
      })
    },
    async confirm () {
      if (this.checkNum > 0) {
        // filter():能过滤出数组中符合条件的元素(这里选出的是checked为ture的元素)
        const list = this.cartDetail.filter(item => item.checked)
        const { orderNo } = await this.$axios.post(API_ORDER_CREATE, {
          list,
          total: this.total
        })
        // console.log(orderNo)
        this.$router.push(`/order/${orderNo}`)
      }
    }
  },
  async created () { // 钩子函数，验证用户是否登录
    const user = await this.$axios.get(API_USER_VERIFY)
    if (!user) {
      this.$showToast({
        btnShow: true,
        msg: '请登录',
        callback: () => {
          this.$router.push('/profile/login')
        }
      })
    } else {
      this.getCartDetail()
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  position: absolute;
  top: 0;
  bottom: 1.94rem;
  left: 0;
  right: 0;
  background-color: $colorE;
  overflow-y: scroll; //垂直方向上可以产生滚动条
}
.header{
  height: 0.88rem;
  line-height: 0.88rem;
  font-size: $fontD;
  background-color: $colorA;
  color: $colorC;
  padding: 0 0.2rem;
}
.empty{
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  img{
    width: 2.2rem;
    height: 2.2rem;
  }
}
.item{
  display: flex;
  align-items: center;
  background-color: $colorA;
  margin-top: 0.2rem;
  padding: 0.2rem;
  .name{
    font-size: $fontB;
    color: $colorC;
    font-weight: 700;
  }
  .pic{
    width: 1.56rem;
    height: 1.56rem;
    margin: 0 0.2rem;
    border-radius: 0.06rem;
  }
  .detail{
    flex: 1;
    .info{
      display: flex;
      position: relative;
      .price{
        flex: 1;
        color: $colorB;
        font-size: $fontC;
      }
      .selnum{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1.5rem;
        height: 0.46rem;
        line-height: 0.46rem;
        border: 1px solid $colorD;
        position: absolute;
        right: 0.4rem;
        bottom: 0;
        .label{
          width: 0.5rem;
          text-align: center;
        }
        .less{
          border-right: 1px solid $colorD;
        }
        .more{
          border-left: 1px solid $colorD;
        }
        .num{
          border: none;
          outline: none;
        }
      }
    }
  }
  .icon-shanchu1{
    padding: 0.2rem;
  }
}
.foot{
  position: fixed;
  left: 0;
  bottom: 0.97rem;
  width: 100%;
  height: 1.2rem;
  background-color: $colorA;
  display: flex;
  align-items: center;
  .check-all{
    margin: 0.2rem;
  }
  .checked{
    margin: 0 0.2rem;
  }
  .total{
    flex: 1;
    text-align: right;
    margin-right: 0.2rem;
    color: $colorB;
  }
  .confirm{
    background-color: $colorB;
    height: 100%;
    width: 2.4rem;
    text-align: center;
    line-height: 1.2rem;
    color: $colorA;
  }
}
.btn-disable{
  background-color: $colorD;
}
</style>
