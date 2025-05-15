import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 定义懒加载指令
const lazyBackground = {
  mounted(el, binding) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 进入视口后加载背景图片
          el.style.backgroundImage = `url(${binding.value})`;
          el.style.backgroundPosition = 'center center';
          el.style.backgroundRepeat = 'no-repeat';
          el.style.backgroundSize = 'cover';
          observer.unobserve(el);  // 加载后停止观察
        }
      });
    });
    observer.observe(el);
  }
};
const app = createApp(App);
app.use(ElementPlus);
app.mount('#app');
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.directive('lazy-bg', lazyBackground);
