import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        host: '0.0.0.0',
        port: 80, // 设置服务器端口号，默认为 3000
        open: false, // 是否在启动服务器时自动打开浏览器，默认为 true
        proxy: {
            // 设置代理，用于跨域请求
            '/api': {
                target: 'http://localhost:8080', // 代理目标地址
                ws: true,
                changeOrigin: true, // 是否改变请求头中的 Origin 字段，默认为 true
                rewrite: (path) => path.replace(/^\/api\/v1/, '')
            }
        },
    }
})
