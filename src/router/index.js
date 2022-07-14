import Vue from 'vue'
import VueRouter from 'vue-router'
import Demo from '../views/Demo.vue'
import Home from '../views/Home.vue'
// import Category from '../views/Category.vue'
// import Cart from '../views/Cart.vue'
// import Profile from '../views/Profile.vue'
// import Search from '../views/Search.vue'
// import Detail from '../views/Detail.vue'
// import CategoryDetail from '../views/CategoryDetail.vue'
// import Login from '../views/Login.vue'
// import Regist from '../views/Regist.vue'
import Order from '../views/Order'
import MyOrder from '../views/MyOrder'
// import { resolve } from 'core-js/fn/promise'

Vue.use(VueRouter)

const routes = [
  {
    path: '/demo',
    name: 'Demo',
    component: Demo
  },
  {
    path: '/', // 默认路由
    name: 'Home',
    component: Home,
    meta: {
      title: '首页'
    }
  },
  {
    path: '/category',
    name: 'Category',
    // component: Category,
    // 按需加载路由
    // component: resolve => require(['../views/Category.vue'], resolve), // 方法一
    // component: () => import('../views/Category.vue'), // 方法二
    component: () => import(/* webpackChunkName: "group-Category" */ '../views/Category.vue'), // 方法三：将路由分组到group-组中按组导入
    meta: {
      keepAlive: true, // 表示希望当前组件能够缓存下来
      title: '分类'
    }
  },
  {
    path: '/cart',
    name: 'Cart',
    // component: Cart,
    component: resolve => require(['../views/Cart.vue'], resolve),
    meta: {
      title: '购物车'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    // component: Profile,
    component: resolve => require(['../views/Profile.vue'], resolve),
    children: [
      {
        path: 'login',
        name: 'Login',
        // component: Login,
        component: resolve => require(['../views/Login.vue'], resolve),
        meta: {
          title: '登录'
        }
      },
      {
        path: 'regist',
        name: 'Regist',
        // component: Regist,
        component: resolve => require(['../views/Regist.vue'], resolve),
        meta: {
          title: '注册'
        }
      }
    ],
    meta: {
      title: '我的'
    }
  },
  {
    path: '/search',
    name: 'Search',
    // component: Search,
    component: resolve => require(['../views/Search.vue'], resolve),
    meta: {
      title: '搜索'
    }
  },
  {
    // 跳转时传入一个参数为id
    path: '/detail/:id',
    name: 'Detail',
    // component: Detail,
    component: resolve => require(['../views/Detail.vue'], resolve),
    meta: {
      title: '详情'
    }
  },
  {
    // 跳转时传入两个参数为cateId和subID
    path: '/cateDetail/:cateId/:subID',
    name: 'CategoryDetail',
    // component: CategoryDetail,
    component: resolve => require(['../views/CategoryDetail.vue'], resolve),
    meta: {
      title: '分类详情'
    }
  },
  {
    path: '/order/:orderNo',
    name: Order,
    component: Order,
    // component: () => import('../views/Order.vue'),
    meta: {
      title: '订单'
    }
  },
  {
    path: '/myOrder',
    name: MyOrder,
    component: MyOrder,
    // component: () => import('../views/MyOrder.vue'),
    meta: {
      title: '我的订单'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => { // 改变点击时title的动态变化
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
