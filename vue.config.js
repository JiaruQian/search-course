const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,

  // 设置打包路径（用于部署到非根目录，比如 Nginx /static 路径）
  publicPath: '/',

  // 开发服务器配置（仅在 npm run serve 时生效）
  devServer: {
    port: 8080, // 可自定义本地开发端口
    proxy: {
      '/api': {
        target: 'http://localhost:8082', // 本地后端服务地址
        changeOrigin: true,
        pathRewrite: { '^/api': '' } // 若后端接口没有 `/api` 前缀，建议保留
      }
    }
  }
});
