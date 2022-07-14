<template>
  <div>
    <header-comp/>
    <div class="detail" v-if="detail">
      <!-- 轮播图 -->
      <swiper height="7.5rem" :list="picUrls" class="swiper" />

      <!-- 商品基本信息 -->
      <div class="info">
        <div class="name">{{detail.name}}</div>
        <div class="desc">{{detail.simpleDesc}}</div>
        <div class="price">
          <!-- 有优惠价格显示优惠，否则显示原有价格 -->
          <span class="activity">￥{{detail.activityPrice || detail.retailPrice}}</span>
        </div>
      </div>

      <!-- 商品参数 -->
      <div class="attrlist" v-if="detail.attrList && detail.attrList.length > 0">
        <div class="title">商品参数</div>
        <div class="item" v-for="(item, index) in detail.attrList" :key="index">
          <span class="attr-name">{{item.attrName}}</span>
          <span class="attr-value">{{item.attrValue}}</span>
        </div>
      </div>

      <!-- 商品详情 -->
      <!-- 若果有商品详情信息的话加载对于html代码 -->
      <div v-html="detail.itemDetail && detail.itemDetail.detailHtml"></div>

    </div>
    <!-- 购物车按钮 -->
    <div class="footer">
      <div class="btn-cart" @click="addCart">加入购物车</div>
    </div>

    <!-- 加载页面 -->
    <loading v-show="isLoading"/>
  </div>

</template>

<script>
import { API_PRODUCT_DETAIL, API_USER_VERIFY, API_CART_ADD } from '@/api.config.js'
import HeaderComp from '../components/Header'
import Swiper from '../components/Swiper'
import Loading from '../components/Loading.vue'
import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      picUrls: [], // 轮播图的图片
      detail: {}, // 商品的详情信息
      isLoading: false
    }
  },
  components: { HeaderComp, Swiper, Loading },
  methods: {
    ...mapMutations(['setCartNum']),
    async getDetail () {
      // console.log(this.$route.params.id)
      this.isLoading = true
      const res = await this.$axios.get(API_PRODUCT_DETAIL, {
        params: {
          id: this.$route.params.id
        }
      })
      console.log(res)
      // 商品信息
      this.detail = res
      for (const item in res.itemDetail) {
        // 只要以picUrl开头的
        if (item.startsWith('picUrl')) {
          this.picUrls.push(res.itemDetail[item])
        }
      }
      this.isLoading = false
    },
    async addCart () {
      // 验证用户是否登录
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
        // const res = await this.$axios.post(API_CART_ADD, {
        await this.$axios.post(API_CART_ADD, {
          id: this.detail.id,
          name: this.detail.name,
          price: this.detail.activityPrice || this.detail.retailPrice,
          pic: this.detail.itemDetail.picUrl1
        })
        // console.log(res)
        this.setCartNum(1) // 商品数量加一
        this.$showToast({
          msg: '加入成功'
        })
      }
    }
  },
  created () {
    this.getDetail()
  }
}
</script>

<style lang="scss" scoped>
.swiper{
  margin-top: 0.88rem;
}
.detail{
  margin-bottom:1.04rem ;
}
.info{
  color: $colorA;
  padding: 0.1rem;
  .name{
    font-size: $fontD;
    color: $colorC;
    font-weight: 700;
  }
  .desc{
    color: $colorD;
  }
  .activity{
    color: $colorB;
  }
}
.attrlist{
  background-color: $colorA;
  margin: 0.2rem 0;
  .title{
    text-align: center;
  }
  .item{
    display: flex;
    border-top: 1px dotted #ccc ;
    padding: 0.1rem;
    .attr-name{
      flex: 1;
      color: $colorD;
    }
    .attr-value{
      flex: 3;
      margin-left: 1.12rem;
    }
  }
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 1.04rem;
  width: 100%;
  z-index: 99;
  border-top: 1px solid $colorD;
  .btn-cart {
    width: 100%;
    height: 1.04rem;
    line-height: 1.04rem;
    border: none;
    outline: none;
    background-color: $colorB;
    color: $colorA;
    text-align: center;
  }
}
</style>
