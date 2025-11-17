/**
 * 应用程序入口文件
 * 负责初始化 Vue 应用、注册全局组件和指令
 */

import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

/**
 * 定义懒加载背景图片指令
 * 使用 IntersectionObserver API 实现图片懒加载，提升页面性能
 * 
 * 使用方法：v-lazy-bg="imageUrl"
 */
const lazyBackground = {
  mounted(el, binding) {
    // 创建 Intersection Observer 实例
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        // 当元素进入视口时
        if (entry.isIntersecting) {
          // 设置背景图片
          el.style.backgroundImage = `url(${binding.value})`;
          el.style.backgroundPosition = 'center center';
          el.style.backgroundRepeat = 'no-repeat';
          el.style.backgroundSize = 'cover';
          // 加载完成后停止观察，避免重复触发
          observer.unobserve(el);
        }
      });
    });
    // 开始观察元素
    observer.observe(el);
  }
};

// 创建 Vue 应用实例
const app = createApp(App);

// 注册 Element Plus 组件库
app.use(ElementPlus);

// 注册所有 Element Plus 图标为全局组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 注册自定义懒加载指令
app.directive('lazy-bg', lazyBackground);

// 挂载应用到 DOM
app.mount('#app');
