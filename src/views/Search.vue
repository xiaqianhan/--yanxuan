<template>
  <div class="container">
    <!-- 头部 -->
    <div class="header">
        <div class="search-ipt">
            <i class="iconfont icon-icon-test"></i>
            <!-- .trim：能够去除输入内容前后中的空格
                 @keyup.enter：当前用户敲回车
            -->
            <input type="text" placeholder="请输入商品名称"
            v-model.trim="keyword" @input="onInput" @keyup.enter="onEnter"/>
            <i class="iconfont icon-shanchu" @click="close"></i>
        </div>
        <span class="cancel" @click="cancal">取消</span>
    </div>

    <!-- 搜索联想 -->
    <!-- 搜索联想isShowSuggest显示则历史记录不显示 -->
    <ul class="suggest" v-show="isShowSuggest">
        <li @click="select(item)" class="suggest-item" v-for="(item, index) in suggestList" :key="index">
            {{item}}
        </li>
    </ul>

    <!-- 历史记录 -->
    <div class="search-history" v-show="!isShowSuggest && !isShowResult">
      <div class="history-title">
        <span>历史记录</span>
        <i class="iconfont icon-shanchu1" @click="deHistory"></i>
      </div>
      <ul class="history">
        <!-- <li></li> -->
        <li @click="select(item)" class="history-item" v-for="(item, index) in history" :key="index">
            {{item}}
        </li>
      </ul>
    </div>

    <!-- 商品列表 -->
    <div class="result" v-show="isShowResult">
        <product v-for="(item, index) in resultList" :key="index" :item="item"/>
    </div>

    <!-- 加载页面 -->
    <loading v-show="isLoading"/>
  </div>
</template>

<script>
import { API_SEARCH_COMPLETE, API_SEARCH } from '@/api.config.js'
import Product from '../components/Product.vue'
import Loading from '../components/Loading.vue'

export default {
  data () {
    return {
      keyword: '', // 关键字
      suggestList: [], // 搜索联想
      resultList: [], // 搜索结果
      isLoading: false,
      history: [] // 搜索的历史信息
    }
  },
  computed: {
    isShowSuggest () {
      //  有数据则显示
      return this.suggestList.length
    },
    isShowResult () {
      return this.resultList.length
    }
  },
  components: { Product, Loading },
  methods: {
    // 输入获取联想数据
    onInput () {
      // 防抖处理
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(async () => {
        const suggestList = await this.$axios.post(API_SEARCH_COMPLETE, {
          keywordPrefix: this.keyword
        })
        // console.log(suggestList)
        this.suggestList = suggestList
      }, 200)
    },
    // 回车
    onEnter () {
    //   console.log('onEnter')
      this.getSearchResult(this.keyword) // 调用方法获取关键字
    },
    async getSearchResult (productName) {
      if (productName === '') {
        return
      }
      this.isLoading = true
      this.suggestList = []
      const { directlyList } = await this.$axios.get(API_SEARCH, {
        // 如果是post方法，参数直接写大括号内，如果是get的话需要再写一个params
        params: {
          keyword: productName
        }
      })
      //   console.log(directlyList)
      this.resultList = directlyList || []
      this.saveHistory(productName) // 保存搜索记录
      this.isLoading = false
    },
    // 选择联想数据跳转相关数据展示，productName为选择数据
    select (productName) {
      this.keyword = productName
      this.getSearchResult(productName)
    },
    // 点击×数据清空，展示最初页面
    close () {
      this.keyword = ''
      this.suggestList = []
      this.resultList = []
    },
    // 点击取消回到首页
    cancal () {
      this.$router.push('/')
    },
    // 读取历史信息
    loadHistory () {
      // 如果存在则赋值给history，不存在给空数组
      this.history = JSON.parse(localStorage.getItem('searchHistory')) || []
    },
    // 保存搜索历史信息
    saveHistory (productName) {
      // 在读取前判断是否有productName
      if (this.history.includes(productName)) {
        // 删除对应的一个索引
        this.history.splice(this.history.indexOf(productName), 1)
      }
      // unshift：在数组前面插入数据
      this.history.unshift(productName)
      localStorage.setItem('searchHistory', JSON.stringify(this.history))
    },
    // 删除历史记录
    deHistory () {
      localStorage.removeItem('searchHistory')
      this.history = []
    }
  },
  mounted () {
    this.loadHistory()
  }
}
</script>

<style lang="scss" scoped>
.container{
    background-color: $colorA;
    padding: 0 0.2rem;
}
.header{
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0.2rem;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    background-color: $colorA;
    .search-ipt{
        flex: 1;
        background-color: $colorE;
        padding: 0 0.2rem;
        display: flex;
        .iconfont{
            font-size: $fontB;
            color: $colorC;
        }
        input{
            border: none;
            outline: none;// 去掉外面一圈
            background-color: $colorE;
            flex: 1;
            font-size: $fontB;
            margin: 0 0.2rem;
        }
    }
    .cancel{
        margin-left: 0.3rem;
    }
}
.search-history {
  margin-top: 0.8rem;
  .history-title {
    font-size: $fontB;
    color: $colorD;
    .iconfont {
      color: $colorC;
      margin-left: 0.3rem;
    }
  }
  .history{
      overflow: hidden;
      &-item{
          border: 1px solid $colorD;
          border-radius: 0.08rem;
          float: left;
          padding: 0 0.15rem;
          margin: 0.12rem;
          color: $colorC;
      }
  }
}
.search-history{
    margin-top: 0.8rem;
    .history-title{
        font-size: $fontB;
        color: $colorD;
        .iconfont{
            color: $colorC;
            margin-left: 0.3rem;
        }
    }
}
.suggest{
    padding: 0.3rem;
    margin-top: 0.3rem;
    background-color: $colorA;
    &-item{
        padding: 0.2rem 0;
        border-bottom: 1px solid $colorF;
    }
}
.result{
    display: flex;
    flex-wrap: wrap;
    justify-content: $colorA;
    margin-top: 0.8rem;
    padding: 0 0.2rem;
    // box-sizing: border-box;
}
</style>
