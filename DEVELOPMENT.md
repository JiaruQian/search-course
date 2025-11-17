# 开发文档 📖

本文档为开发者提供详细的项目结构说明、组件设计思路和扩展指南。

## 📐 架构设计

### 整体架构

```
┌─────────────────────────────────────────┐
│           用户界面层 (UI Layer)           │
│  ┌─────────────────────────────────┐   │
│  │   App.vue (根组件)                │   │
│  │   - 路由管理                       │   │
│  │   - 权限控制                       │   │
│  │   - 全局状态                       │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│         组件层 (Component Layer)         │
│  ┌──────────┬──────────┬──────────┐   │
│  │AddCourse │SearchForm│ AIRAG    │   │
│  │          │          │          │   │
│  ├──────────┼──────────┼──────────┤   │
│  │Freshmen  │Promotion │Promoted  │   │
│  │Zone      │          │Courses   │   │
│  └──────────┴──────────┴──────────┘   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│          服务层 (Service Layer)          │
│  ┌─────────────────────────────────┐   │
│  │   Axios HTTP Client              │   │
│  │   - API 请求封装                  │   │
│  │   - 错误处理                      │   │
│  │   - 请求拦截                      │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│         数据层 (Data Layer)              │
│  ┌──────────┬──────────┬──────────┐   │
│  │Cookie    │LocalSto- │FingerprintJS   │
│  │Storage   │rage      │          │   │
│  └──────────┴──────────┴──────────┘   │
└─────────────────────────────────────────┘
```

## 🔑 核心概念

### 1. 权限控制机制

系统使用双重验证机制确保用户必须贡献内容后才能查询：

#### Cookie 权限标志
- `courseEvaluationFilled`: 是否已填写课程评价
- `surveyCompleted`: 是否已完成新生问卷

#### 设备指纹识别
- 使用 FingerprintJS 生成唯一设备 ID
- 防止用户清除 Cookie 后重复获取权限
- 限制 AI 推荐功能的使用频率

```javascript
// 权限检查流程
created() {
  // 1. 读取 Cookie 状态
  this.courseEvaluationFilled = Cookies.get('courseEvaluationFilled') === 'true';
  this.surveyCompleted = Cookies.get('surveyCompleted') === 'true';
  
  // 2. 生成设备指纹
  FingerprintJS.load().then(fp => {
    fp.get().then(result => {
      localStorage.setItem('deviceFingerprint', result.visitorId);
    });
  });
  
  // 3. 根据权限状态切换页面
  if (this.courseEvaluationFilled || this.surveyCompleted) {
    this.currentPage = 'search';
  }
}
```

### 2. AI 推荐系统 (RAG)

使用检索增强生成（Retrieval-Augmented Generation）技术：

#### 工作流程
1. **用户输入**: 课程类别 + 个性化需求描述
2. **检索阶段**: 后端从评价数据库中检索相关课程
3. **生成阶段**: LLM 基于检索结果生成推荐理由
4. **展示结果**: 前端展示推荐课程及 AI 思考过程

#### 使用限制
- 每周重置使用次数（周四）
- 通过设备指纹防止滥用
- 长超时（120秒）处理 AI 计算

```javascript
// AI 推荐请求
const response = await axios.post('/rag', {
  userQuestion: this.formData.userQuestion,
  catagory: this.formData.category
}, {
  headers: {
    'X-Device-Fingerprint': deviceFingerprint
  },
  timeout: 120000
});
```

### 3. 组件通信模式

#### 父子组件通信
```javascript
// 子组件 emit 事件
this.$emit('courseAdded');
this.$emit('search', { course_name, instructor });
this.$emit('surveyCompleted');

// 父组件监听事件
<AddCourse @courseAdded="courseAdded"></AddCourse>
<SearchForm @search="handleSearch"></SearchForm>
```

#### 异步组件加载
```javascript
// 提升首屏加载性能
const AddCourse = defineAsyncComponent(() =>
  import('./components/AddCourse.vue')
);
```

## 🎨 UI/UX 设计原则

### 响应式设计

#### 断点设置
- xs: < 768px（移动端）
- sm: ≥ 768px（平板）
- md: ≥ 992px（小屏桌面）
- lg: ≥ 1200px（桌面）
- xl: ≥ 1920px（大屏）

#### 适配策略
```vue
<!-- Element Plus 栅格系统 -->
<el-col :xs="24" :sm="22" :md="20" :lg="18" :xl="16">
  <!-- 内容 -->
</el-col>
```

```css
/* 媒体查询 */
@media (max-width: 768px) {
  .search-form {
    padding: 15px;
  }
}
```

### 交互反馈

#### 加载状态
```javascript
// 按钮加载状态
<el-button :loading="loading" @click="submit">
  提交
</el-button>

// 页面加载状态
<div v-loading="loading">
  <!-- 内容 -->
</div>
```

#### 消息提示
```javascript
// 成功提示
this.$notify({
  title: '成功',
  message: '操作成功',
  type: 'success'
});

// 错误提示
this.$notify({
  title: '错误',
  message: '操作失败',
  type: 'error'
});
```

## 🔧 开发指南

### 添加新组件

1. **创建组件文件**
```vue
<!-- src/components/NewComponent.vue -->
<template>
  <div class="new-component">
    <!-- 组件内容 -->
  </div>
</template>

<script>
/**
 * NewComponent.vue - 新组件
 * 
 * 功能：
 * 1. 功能描述
 */

export default {
  name: 'NewComponent',
  data() {
    return {
      // 数据
    };
  },
  methods: {
    // 方法
  }
};
</script>

<style scoped>
/* 样式 */
</style>
```

2. **在 App.vue 中注册**
```javascript
const NewComponent = defineAsyncComponent(() =>
  import('./components/NewComponent.vue')
);

export default {
  components: {
    NewComponent
  }
}
```

3. **添加路由逻辑**
```vue
<NewComponent v-if="currentPage === 'new'"></NewComponent>
```

### 添加新的 API 接口

1. **定义接口地址**
```javascript
// 在组件中或单独的 API 文件中
const newApiUrl = '/new-endpoint';
```

2. **发起请求**
```javascript
async fetchData() {
  try {
    const response = await axios.get(newApiUrl, {
      params: { /* 参数 */ }
    });
    
    // 处理响应
    this.data = response.data;
  } catch (error) {
    console.error('请求失败:', error);
    // 错误处理
  }
}
```

3. **配置代理（开发环境）**
```javascript
// vue.config.js
proxy: {
  '/api': {
    target: 'http://localhost:8082',
    changeOrigin: true,
    pathRewrite: { '^/api': '' }
  }
}
```

### 状态管理最佳实践

#### 本地状态
```javascript
// 组件内部使用的状态
data() {
  return {
    localState: ''
  };
}
```

#### Cookie 状态
```javascript
// 需要持久化的权限状态
Cookies.set('stateName', 'value', { expires: 90 });
const state = Cookies.get('stateName');
```

#### LocalStorage 状态
```javascript
// 设备相关的状态
localStorage.setItem('deviceFingerprint', fingerprint);
const fingerprint = localStorage.getItem('deviceFingerprint');
```

## 🚀 性能优化

### 1. 代码分割

使用异步组件实现代码分割：
```javascript
const HeavyComponent = defineAsyncComponent(() =>
  import('./components/HeavyComponent.vue')
);
```

### 2. 图片懒加载

使用自定义指令：
```vue
<div v-lazy-bg="imageUrl"></div>
```

### 3. 请求优化

- 避免重复请求
- 使用请求缓存
- 设置合理的超时时间

```javascript
// 防抖函数
const debounce = (fn, delay) => {
  let timer = null;
  return function() {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, arguments), delay);
  };
};
```

## 🐛 调试技巧

### Vue Devtools

安装 Vue Devtools 浏览器扩展，可以：
- 查看组件树
- 检查组件状态
- 追踪事件
- 性能分析

### Console 调试

```javascript
// 在关键位置添加日志
console.log('API 请求参数:', params);
console.log('API 响应数据:', response.data);
console.error('错误信息:', error);
```

### 网络请求调试

- 打开浏览器开发者工具 Network 标签
- 查看请求状态码、响应时间、响应内容
- 检查请求头和响应头

## 📝 代码规范

### 命名规范

```javascript
// 组件名：大驼峰
AddCourse.vue
SearchForm.vue

// 变量/函数：小驼峰
const userName = '';
function fetchData() {}

// 常量：大写下划线
const API_BASE_URL = '';

// CSS 类名：短横线
.search-form {}
.button-container {}
```

### 注释规范

```javascript
/**
 * 函数说明
 * @param {Type} paramName - 参数说明
 * @returns {Type} 返回值说明
 */
function myFunction(paramName) {
  // 实现
}
```

### Vue 组件结构

```vue
<template>
  <!-- 模板 -->
</template>

<script>
// 导入
import Component from './Component.vue';

// 组件定义
export default {
  name: 'ComponentName',
  components: {},
  props: [],
  data() {},
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
};
</script>

<style scoped>
/* 样式 */
</style>
```

## 🔐 安全建议

### 1. XSS 防护
- Vue 自动转义模板中的变量
- 使用 `v-html` 时要特别小心
- 对用户输入进行验证和过滤

### 2. CSRF 防护
- Cookie 设置 SameSite 属性
- 重要操作添加 Token 验证

### 3. 敏感信息
- API 密钥放在环境变量中
- 不要在前端存储敏感信息
- 使用 HTTPS 传输数据

## 📚 扩展阅读

- [Vue.js 官方文档](https://vuejs.org/)
- [Element Plus 文档](https://element-plus.org/)
- [Axios 文档](https://axios-http.com/)
- [FingerprintJS 文档](https://fingerprintjs.com/docs/)

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交代码并编写测试
4. 提交 Pull Request
5. 等待代码审查

---

**维护者**: CopyRight by JeredGong

