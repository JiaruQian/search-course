/**
 * Vue CLI 配置文件
 * 
 * 主要配置项：
 * 1. 构建配置（transpileDependencies, publicPath）
 * 2. 开发服务器配置（端口、代理）
 * 3. 生产环境优化
 */

const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  // 需要被 Babel 转译的依赖包
  transpileDependencies: true,

  // 设置打包路径（用于部署到非根目录，比如 Nginx /static 路径）
  // 如果部署在根目录，保持为 '/'
  // 如果部署在子目录，例如 '/app/'，则设置为 '/app/'
  publicPath: '/',

  // 开发服务器配置（仅在 npm run serve 时生效）
  devServer: {
    port: 8080, // 本地开发服务器端口
    
    // 配置代理，解决开发环境的跨域问题
    proxy: {
      '/api': {
        target: 'http://localhost:8082', // 后端 API 服务地址
        changeOrigin: true,               // 改变请求头中的 host
        pathRewrite: { '^/api': '' }      // 重写路径，去掉 /api 前缀
        // 例如：前端请求 /api/search -> 后端实际收到 /search
      }
    }
  }
});
