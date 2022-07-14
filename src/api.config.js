// API接口管理
// 首页
export const API_HOME = '/home'
export const API_HOME_TOTAL_NUM = '/getTotalNums'
export const API_HOME_RCMD = '/getRcmd'

// 搜索
export const API_SEARCH_COMPLETE = '/searchAutoComplete'
export const API_SEARCH = '/searchByKeyword'

// 商品
export const API_PRODUCT_DETAIL = '/getDetail'

// 分类
export const API_CATE = '/getCategory' // 左边主分类
export const API_CATE_SUB = '/getSubCategory' // 右边子分类
export const API_CATE_DETAIL = '/getList2Item' // 点中子分类的分类详情

// 用户
export const API_USER_CODE = '/getCode' // 验证码
export const API_USER_LOGIN = '/login' // 登录
export const API_USER_REGIST = '/regist' // 注册
export const API_USER_LOGOUT = '/logout' // 退出登录
export const API_USER_VERIFY = '/verifyUser' // 验证是否登录s

// // 购物车
export const API_CART_ADD = '/addCart' // 添加购物车
export const API_CART_NUM = '/getCartNum' // 获取商品数量
export const API_CART_DETAIL = '/getCartDetail'
export const API_CART_UPDATE = '/updateCart' // 购物车更新
export const API_CART_CHECK = '/checkAllCart' // 购物车全选数据更新
export const API_CART_DEL = '/delCart' // 删除商品

// // 订单
export const API_ORDER_CREATE = '/createOrder' // 创建订单
export const API_ORDER_DETAIL = '/getOrderDetail' // 订单详情
export const API_ORDER_GET = '/getOrders' // 我的订单信息
