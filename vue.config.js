module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "@/assets/scss/base.scss";'
      }
    }
  },
  lintOnSave: false,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://yanxuan.xiecheng.live:7001',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  chainWebpack: config => {
    config.plugins.delete('prefetch')
  }
  // publicPath: '/yx', // 子目录
  // outputDir: 'dest', // 打包项目名称
  // indexPath: 'index2.html', // 指定输出index.html的输出路径(名字)
  // productionSourceMap: false // 去掉打包的map文件，避免源码
}

// www.yanxuan.com/yx
