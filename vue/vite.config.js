import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 配置开发服务器
  server: {
    // 设置服务器主机
    host: '0.0.0.0',
    // 设置服务器端口
    port: 5566,
    // 启用热模块替换
    hot: true,
    // 配置请求代理
    proxy: {
      // 当请求以 /drawSoftware 开头时，启用代理
      "/api": {
        // 代理的目标地址
        // 开发地址
        target: "http://127.0.0.1:3000",
        // 更改请求源，避免跨域问题
        changeOrigin: true,
        // 重写路径
        rewrite: path => path.replace(/^\/api/, '/api')
      }
    }
  }
})
