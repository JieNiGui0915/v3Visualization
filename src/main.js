import {createApp} from 'vue'
import pinia from '@/store/index'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import "weui";

import App from './App.vue';
import router from './router/index.js';

import './assets/styles/index.less';

const app = createApp(App)
// 注册element Icons组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(pinia)
app.use(router)
app.use(ElementPlus, {size: 'default', zIndex: 3000, locale: zhCn});
app.mount('#app')
