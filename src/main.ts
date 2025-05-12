
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
// 引入element-plus
import ElementPlus from 'element-plus'
// 引入样式
import 'element-plus/dist/index.css'
// 引入图标，注册为全局组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)

app.use(createPinia())
app.use(router)
//添加全局样式
app.use(ElementPlus)
// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')
