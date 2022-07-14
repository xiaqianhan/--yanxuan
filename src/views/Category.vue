<template>
<!-- 种类 -->
  <div>
    <div class="cate">
      <ul class="cate-nav">
        <!--
          :class="{actived: actived === index}"：表示当有值的时候选中
          select(index):表示当前点击的分类 -->
        <li class="cate-nav-item" v-for="(cate, index) in categoryList"
         :key="cate.id" :class="{actived: actived === index}" @click="select(index)">
          {{cate.name}}
        </li>
      </ul>
      <ul class="cate-list">
        <div class="cate-list-item" v-for="sub in categoryGroupList" :key="sub.id">
          <div class="title">{{sub.name}}</div>
          <ul class="sub-item">
            <li class="sub-item-detail" v-for="item in sub.categoryList"
             :key="item.id" @click="getSubList(item.id)">
              <img :src="item.prettyBannerUrl" alt="" class="banner">
              <div class="name">{{item.name}}</div>
            </li>
          </ul>
        </div>
      </ul>
    </div>

    <!-- 底部菜单 -->
    <nav-footer />

    <!-- 加载页面s -->
    <loading v-show="isLoading"/>
  </div>

</template>

<script>
import NavFooter from '../components/NavFooter'
import { API_CATE, API_CATE_SUB } from '@/api.config.js'
import Loading from '../components/Loading'

export default {
  data () {
    return {
      categoryList: [],
      actived: 0, // 当前选中的分类
      categoryGroupList: [],
      isLoading: false
    }
  },
  // 当监听数据数据的属性发生变化并影响到其他属性的时候使用watch，
  // 如果其他属性的变化影响某一个属性的话使用computed，即一个属性变化不会影响到其他属性
  watch: {
    actived () {
      // 传入的是分类数组中被激活元素的id
      this.getSubCategory(this.categoryList[this.actived].id)
    }
  },
  components: { NavFooter, Loading },
  methods: {
    async getCategory () {
      this.isLoading = true
      const { categoryList } = await this.$axios.get(API_CATE)
      // console.log(categoryList)
      this.categoryList = categoryList
      this.getSubCategory(categoryList[0].id)// 首次进入默认选中展示第一个分类
      this.isLoading = false
    },
    // 选中改变位置
    select (index) {
      this.actived = index
    },
    // 获取子分类,categoryId为传入的是哪一个分类
    async getSubCategory (categoryId) {
      // category: { categoryGroupList }：获取的是子分类的具体分组
      const { category: { categoryGroupList } } = await this.$axios.post(API_CATE_SUB, {
        categoryId: categoryId
      })
      // console.log(categoryGroupList)
      this.categoryGroupList = categoryGroupList
    },
    // 分类详情
    getSubList (subId) {
      this.$router.push(
        `/cateDetail/${this.categoryList[this.actived].id}/${subId}`
      )
    }
  },
  created () {
    this.getCategory()
  }
}
</script>

<style lang="scss" scoped>
.cate{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0.91rem;
  background-color: $colorA;
  display: flex;
  &-nav{
    width: 1.4rem;
    padding: 0.2rem 0;
    margin-right:0.2rem ;
    &-item{
      height: 0.6rem;
      padding: 0 0.1rem;
      line-height: 0.6rem;
      margin-top:0.4rem;
      color: $colorC;
    }
    .actived{
      position: relative;
      &::before{//伪元素选择器插入一个元素
        content: ''; // 插入内容
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 0.08rem;
        background-color: #ab2b2b;
      }
    }
  }
  &-list{
    flex: 1;
    overflow: scroll;
    padding: 0.2rem;
    border-left:1px solid $colorE ;
    &-item{
      margin-bottom: 0.3rem;
      .title{
        color: $colorC;
        font-weight: 700;
        border-bottom:1px solid $colorE ;
      }
      .sub-item{
        display: flex;
        flex-wrap: wrap;//超出部分换行
        &-detail{
          width: 1.4rem;
          margin: 0.4rem 0.4rem 0 0;
          text-align: center;
          .banner{
            width: 1.2rem;
            height: 1.2rem;
            .name{
              font-size: $fontA;
            }
          }
        }
      }
    }
  }
}
</style>
