import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

import { viteStaticCopy } from "vite-plugin-static-copy";
const base = "/welcome-to-my-website";
const cesiumSource ="node_modules/cesium/Build/Cesium";
const cesiumBaseUrl = "cesiumStatic";


// https://vite.dev/config/
export default defineConfig({
  base,
  define: { CESIUM_BASE_URL: JSON.stringify(`${base}/${cesiumBaseUrl}`), },
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    viteStaticCopy({
      targets: [
        {src:`${cesiumSource}/ThirdParty`, dest: cesiumBaseUrl },
        { src: `${cesiumSource}/Workers`, dest: cesiumBaseUrl },
        { src: `${cesiumSource}/Assets`, dest: cesiumBaseUrl },
        { src: `${cesiumSource}/Widgets`, dest: cesiumBaseUrl },
        ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  envPrefix:'VITE_',
  server: {
    proxy: {
      // 代理所有以 /geoserver 开头的请求
      '/geoserver': {
        target: 'http://localhost:8088', // GeoServer 的实际地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/geoserver/, '/geoserver') // 保持路径不变
      },
      '/api':{
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }

})




