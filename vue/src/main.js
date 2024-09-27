import errorPng from "./assets/img/error.png";
import loadingGif from "./assets/img/loading.gif";
import { createApp } from 'vue'
import './style.css'
import routers from './router/index.js'; // 路由
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
//引入vue-lazyload
import VueLazyload from 'vue-lazyload'
import App from './App.vue'
const app = createApp(App)
// 挂载element-plus
app.use(ElementPlus)
// 挂载 Pinia
app.use(createPinia())
//使用vue-lazyload
app.use(VueLazyload, {
    //图片加载失败时显示的图片
    error: errorPng,
    //图片正在加载时显示的图片
    loading: loadingGif
})
app.use(routers)

app.mount('#app')
