# WHU 课程评价查询系统 🎓

一个基于 Vue.js 的武汉大学课程评价收集与查询平台，旨在帮助学生更好地选择课程，并为课程推广提供便利。

![Vue.js](https://img.shields.io/badge/Vue.js-3.5.16-brightgreen)
![Element Plus](https://img.shields.io/badge/Element%20Plus-2.8.1-blue)
![Axios](https://img.shields.io/badge/Axios-1.9.0-red)

## 📋 项目简介

本系统提供了一个学生互助的课程评价平台，学生可以：
- 📝 提交自己对课程的真实评价
- 🔍 查询其他同学对课程的评价
- 🤖 使用 AI 辅助推荐功能获得个性化课程推荐
- 👨‍🎓 新生可通过问卷调查直接获取查询权限
- 📢 教师可以推广自己的课程
- 📚 查看所有已推广的课程信息

### 核心特性

✅ **权限控制系统** - 需要先贡献评价或完成问卷才能查询  
✅ **AI 智能推荐** - 基于 RAG 技术的课程推荐系统  
✅ **设备指纹识别** - 防止恶意刷评价  
✅ **响应式设计** - 完美支持移动端和桌面端  
✅ **分页展示** - 优雅的搜索结果展示  
✅ **Cookie 管理** - 持久化用户权限状态  

## 🚀 快速开始

### 环境要求

- Node.js >= 14.x
- npm >= 6.x

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run serve
```

开发服务器将在 `http://localhost:8080` 启动

### 生产环境构建

```bash
npm run build
```

构建产物将生成在 `dist/` 目录

### 代码检查与修复

```bash
npm run lint
```

## 📁 项目结构

```
search-course/
├── public/                      # 静态资源
│   ├── index.html              # HTML 模板
│   └── favicon.ico             # 网站图标
├── src/                        # 源代码
│   ├── assets/                 # 静态资源（图片等）
│   │   ├── logo.png
│   │   └── R.jpg               # 头部背景图
│   ├── components/             # Vue 组件
│   │   ├── AddCourse.vue       # 添加课程评价组件
│   │   ├── AIRAG.vue           # AI 辅助推荐组件
│   │   ├── CoursePromotion.vue # 课程推广组件
│   │   ├── FreshmenZone.vue    # 新生专区组件
│   │   ├── PromotedCourses.vue # 已推广课程展示组件
│   │   ├── SearchForm.vue      # 搜索表单组件
│   │   └── SearchResults.vue   # 搜索结果展示组件
│   ├── App.vue                 # 根组件
│   └── main.js                 # 应用入口
├── babel.config.js             # Babel 配置
├── vue.config.js               # Vue CLI 配置
├── jsconfig.json               # JavaScript 配置
├── package.json                # 项目依赖配置
└── README.md                   # 项目文档

```

## 🎯 核心功能

### 1. 课程评价系统

学生可以提交对已修课程的详细评价，包括：
- 课程名称与属性
- 授课教师
- 课程内容与评价
- 考勤与平时作业要求
- 期末考核方式
- 课程成绩（可选）

### 2. 课程查询系统

完成评价后，学生可以：
- 按课程名称查询
- 按授课教师查询
- 查看分页结果
- 支持移动端卡片式展示

### 3. AI 辅助推荐

基于 RAG（检索增强生成）技术：
- 根据课程类别筛选
- 个性化需求描述
- AI 智能匹配推荐
- 展示推荐理由

### 4. 新生专区

为尚未修课的新生提供：
- 网站功能介绍
- 选课系统介绍
- 问卷调查
- 直接获取查询权限

### 5. 课程推广

教师可以推广课程，提供：
- 详细的课程信息
- 课程亮点介绍
- 适合的学生群体
- 教学资源展示

### 6. 已推广课程

学生可以：
- 浏览所有推广课程
- 按课程名/教师搜索
- 查看详细课程信息

## 🔧 技术栈

### 前端框架与库

- **Vue.js 3.5.16** - 渐进式 JavaScript 框架
- **Element Plus 2.8.1** - Vue 3 组件库
- **Axios 1.9.0** - HTTP 客户端
- **Markdown-it 14.1.0** - Markdown 解析器
- **FingerprintJS 4.6.2** - 设备指纹识别
- **js-cookie 3.0.5** - Cookie 管理

### 开发工具

- **Vue CLI 5.0** - Vue 项目脚手架
- **Babel** - JavaScript 编译器
- **ESLint** - 代码检查工具
- **Sass** - CSS 预处理器

## 🔌 API 接口说明

### 基础配置

```javascript
// API 基础地址通过环境变量配置
const apiBaseUrl = process.env.VUE_APP_API_BASE_URL;
```

### 主要接口

| 接口路径 | 方法 | 说明 |
|---------|------|------|
| `/add_course` | POST | 添加课程评价 |
| `/search` | GET | 搜索课程评价 |
| `/statistic` | GET | 获取统计数据 |
| `/rag` | POST | AI 推荐接口 |
| `/submit_survey` | POST | 提交新生问卷 |
| `/course_promotion` | POST | 提交课程推广 |
| `/course_promotion` | GET | 获取推广课程列表 |

## 🍪 Cookie 说明

系统使用以下 Cookie 进行权限管理：

| Cookie 名称 | 说明 | 有效期 |
|------------|------|--------|
| `courseEvaluationFilled` | 是否已提交课程评价 | 200 天 |
| `surveyCompleted` | 是否已完成新生问卷 | 200 天 |
| `fingerprint` | 设备指纹 | 下周四 |
| `ai_uses_left` | AI 推荐剩余次数 | 下周四 |

## 🎨 UI 设计特点

### 响应式布局

- 使用 Element Plus 的栅格系统
- 移动端自适应卡片式布局
- 媒体查询优化不同屏幕尺寸

### 交互动画

- 按钮悬停效果
- 卡片阴影过渡
- 页面切换动画
- 加载状态提示

### 颜色主题

- 主色调：蓝色 (`#409EFF`)
- 成功色：绿色 (`#67C23A`)
- 警告色：橙色 (`#E67E22`)
- 危险色：红色 (`#F56C6C`)

## ⚙️ 配置说明

### 环境变量

创建 `.env` 文件配置 API 地址：

```env
# 开发环境
VUE_APP_API_BASE_URL=http://localhost:8082

# 生产环境
VUE_APP_API_BASE_URL=https://your-api-domain.com
```

### 代理配置

`vue.config.js` 中配置开发服务器代理：

```javascript
devServer: {
  port: 8080,
  proxy: {
    '/api': {
      target: 'http://localhost:8082',
      changeOrigin: true,
      pathRewrite: { '^/api': '' }
    }
  }
}
```

## 🛡️ 安全机制

### 设备指纹识别

使用 FingerprintJS 生成唯一设备标识，防止：
- 恶意刷评价
- 绕过权限限制
- 滥用 AI 推荐功能

### 权限验证

- 评价前必须填写完整信息
- 查询前必须完成评价或问卷
- AI 推荐限制使用次数

### 数据验证

- 前端表单验证
- 后端数据校验
- 错误提示友好

## 📊 统计功能

首页展示实时统计数据：
- 最近添加的评价数量
- 课程评价总数

## 🐛 常见问题

### Q: 删除 Cookie 后需要重新评价吗？

A: 是的，系统使用 Cookie 管理权限，清除 Cookie 后需要重新提交评价或问卷。

### Q: AI 推荐为什么有使用次数限制？

A: 为了防止滥用和保证服务质量，每周四重置使用次数。

### Q: 如何修改 API 地址？

A: 修改 `.env` 文件中的 `VUE_APP_API_BASE_URL` 配置项。

### Q: 移动端显示异常怎么办？

A: 项目已做响应式优化，如有问题请清除浏览器缓存后重试。

## 🔄 更新日志

### Version 0.1.0 (当前版本)
- ✅ 实现课程评价的添加与查询
- ✅ 集成 AI 辅助推荐功能
- ✅ 完成新生专区问卷系统
- ✅ 添加课程推广模块
- ✅ 实现设备指纹识别
- ✅ 优化移动端体验

## 📝 开发规范

### 代码风格

- 使用 ESLint 进行代码检查
- Vue 组件使用单文件组件格式
- 遵循 Vue 3 Composition API 最佳实践

### 命名规范

- 组件名：大驼峰命名（PascalCase）
- 变量/函数：小驼峰命名（camelCase）
- CSS 类名：短横线命名（kebab-case）

### 注释规范

- 关键函数添加注释说明
- 复杂逻辑添加行内注释
- API 调用添加接口说明

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 提交 Issue

- 描述问题的详细信息
- 提供复现步骤
- 附上截图（如果适用）

### Pull Request

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目仅供学习交流使用。

## 👥 作者

**CopyRight by JeredGong**

## 📞 联系方式

如有问题或建议，欢迎通过以下方式联系：

- 提交 GitHub Issue
- 发送邮件至项目维护者

## 🙏 致谢

感谢所有为本项目提供课程评价的同学们！

---

**声明**: 本网站数据来源于大众同学对各类课程的评价，不保证真实性、可靠性、准确性，并不承担由此产生的任何责任。
