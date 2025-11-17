<template>
  <div id="app">
    <header id="header">
      <div class="header-content">
        <h1>WHU课程收集与评价查询系统</h1>
        <!-- 添加 Statistic 组件展示统计数据 -->
        <div class="statistics-container">
          <el-row :gutter="20" type="flex" justify="center">
            <el-col :xs="24" :sm="12" :md="6">
              <el-card class="statistic-card" shadow="hover">
                <el-statistic class="statistic-item" title="最近添加的评价" :value="visitCount">
                  <template #prefix>
                    <el-icon><Calendar /></el-icon>
                  </template>
                </el-statistic>
              </el-card>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6">
              <el-card class="statistic-card" shadow="hover">
                <el-statistic class="statistic-item" title="课程评价总数" :value="evaluationCount">
                  <template #prefix>
                    <el-icon><Document /></el-icon>
                  </template>
                </el-statistic>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
    </header>
    <main>
      <el-row type="flex" justify="center">
        <el-col :xs="24" :sm="22" :md="20" :lg="18" :xl="16">
          <div class="button-container">
            <!-- 学生功能按钮 -->
            <div class="student-buttons" v-if="!courseEvaluationFilled && !surveyCompleted">
              <el-button 
                type="primary" 
                size="large" 
                @click="currentPage = 'add'" 
                class="action-button"
              >
                <el-icon><Plus /></el-icon>
                添加课程评价
              </el-button>
              <el-button 
                type="success" 
                size="large" 
                @click="currentPage = 'freshmen'"
                class="action-button"
              >
                <el-icon><User /></el-icon>
                新生专区
              </el-button>
            <!-- 课程推广按钮 - 仅在未获得cookie时显示 -->
              <el-button 
              type="danger" 
              size="large" 
              @click="currentPage = 'promotion'"
              class="action-button"
              v-if="!courseEvaluationFilled && !surveyCompleted"
            >
              <el-icon><Promotion /></el-icon>
              课程推广
            </el-button>
            </div>
            <!-- 学生功能按钮 - 需要cookie -->
            <template v-if="courseEvaluationFilled || surveyCompleted">
              <div class="student-buttons">
                <el-button 
                type="primary" 
                size="large" 
                @click="currentPage = 'search'"
                class="action-button"
              >
                <el-icon><Search /></el-icon>
                查询课程评价
              </el-button>
              <el-button 
                type="warning" 
                size="large" 
                @click="currentPage = 'add'"
                class="action-button"
              >
                <el-icon><Edit /></el-icon>
                补充课程评价
              </el-button>
              <el-button 
                type="info" 
                size="large" 
                @click="currentPage = 'airag'"
                class="action-button"
              >
                <el-icon><Connection /></el-icon>
                AI辅助推荐
              </el-button>
              <el-button 
                type="success" 
                size="large" 
                @click="currentPage = 'promoted-courses'"
                class="action-button"
              >
                <el-icon><List /></el-icon>
                已推广课程
              </el-button>
              </div>
            </template>
          </div>

          <div class="content-container">
            <AddCourse v-if="currentPage === 'add'" @courseAdded="courseAdded"></AddCourse>
            <FreshmenZone v-if="currentPage === 'freshmen'" @surveyCompleted="handleSurveyCompleted"></FreshmenZone>
            <AIRAG v-if="currentPage === 'airag'"></AIRAG>
            <CoursePromotion v-if="currentPage === 'promotion'"></CoursePromotion>
            <PromotedCourses v-if="currentPage === 'promoted-courses'"></PromotedCourses>
            <div v-if="currentPage === 'search'" class="search-container">
              <SearchForm @search="handleSearch"></SearchForm>
              <div v-if="results && results.length">
                <SearchResults :results="results"></SearchResults>
              </div>
              <div v-else>
                <el-empty description="未找到查询结果"></el-empty>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </main>
    <footer>
      <div class="footer-content">
        <p class="disclaimer">声明：本网站数据来源于大众同学对各类课程的评价，不保证真实性、可靠性、准确性，并不承担由此产生的任何责任。</p>
        <p class="copyright">&copy; CopyRight by JeredGong. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
/**
 * App.vue - 应用根组件
 * 
 * 主要功能：
 * 1. 管理页面导航和路由状态
 * 2. 处理用户权限验证（Cookie 和设备指纹）
 * 3. 统一管理 API 请求
 * 4. 展示统计数据
 * 5. 协调各子组件之间的通信
 */

import { defineAsyncComponent } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import SearchForm from './components/SearchForm.vue';
import { Calendar, Document, Plus, User, Search, Edit, Connection, Promotion, List } from '@element-plus/icons-vue';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

// API 地址配置
const apiBaseUrl = process.env.VUE_APP_API_BASE_URL; // 从环境变量读取 API 基础地址
const apiUrl = `/search`;          // 课程搜索接口
const statisticUrl = `/statistic`; // 统计数据接口

// 配置 axios 默认设置
axios.defaults.baseURL = apiBaseUrl;
// 注意：CORS 头部应由服务器端设置，客户端无需设置
axios.defaults.headers.post['Content-Type'] = 'application/json';

// 使用异步组件加载，提升首屏加载性能
const AddCourse = defineAsyncComponent(() =>
  import('./components/AddCourse.vue')        // 添加课程评价组件
);
const SearchResults = defineAsyncComponent(() =>
  import('./components/SearchResults.vue')    // 搜索结果展示组件
);
const FreshmenZone = defineAsyncComponent(() =>
  import('./components/FreshmenZone.vue')     // 新生专区组件
);
const AIRAG = defineAsyncComponent(() =>
  import('./components/AIRAG.vue')            // AI 辅助推荐组件
);
const CoursePromotion = defineAsyncComponent(() =>
  import('./components/CoursePromotion.vue')  // 课程推广组件
);
const PromotedCourses = defineAsyncComponent(() =>
  import('./components/PromotedCourses.vue')  // 已推广课程列表组件
);

export default {
  components: {
    AddCourse,
    SearchForm,
    SearchResults,
    FreshmenZone,
    AIRAG,
    CoursePromotion,
    PromotedCourses,
    Calendar,
    Document,
    Plus,
    User,
    Search,
    Edit,
    Connection,
    Promotion,
    List
  },
  data() {
    return {
      results: [],
      currentPage: 'add', // 默认显示添加课程评价界面
      surveyCompleted: false,
      courseEvaluationFilled: false,
      visitCount: 0,
      evaluationCount: 0,
      // 添加模拟数据
      mockResults: [
        {
          '课程名称': '高等数学',
          '课程属性': '公共课',
          '公选课领域': '',
          '授课老师': '张教授',
          '课程内容与评价': '课程内容充实，讲解清晰，作业量适中。',
          '考勤与平时作业': '每周点名，作业每周一次。',
          '期末考核方式': '期末考试70%，平时成绩30%',
          '课程成绩': 85
        },
        {
          '课程名称': '中国传统文化',
          '课程属性': '通识选修课（公选课）',
          '公选课领域': '中华文化与世界文明',
          '授课老师': '李教授',
          '课程内容与评价': '课程生动有趣，老师讲课很有感染力。',
          '考勤与平时作业': '偶尔点名，需要写一篇论文。',
          '期末考核方式': '论文60%，平时表现40%',
          '课程成绩': 90
        },
        {
          '课程名称': '线性代数',
          '课程属性': '公共课',
          '公选课领域': '',
          '授课老师': '王教授',
          '课程内容与评价': '理论性强，需要课后多练习。',
          '考勤与平时作业': '每周点名，作业每周两次。',
          '期末考核方式': '期末考试80%，平时成绩20%',
          '课程成绩': 88
        }
      ]
    };
  },
  /**
   * 组件创建时的钩子函数
   * 1. 检查用户权限状态（是否已提交评价或完成问卷）
   * 2. 获取统计数据
   * 3. 生成并保存设备指纹
   */
  created() {
    // 从 Cookie 中读取权限状态
    this.courseEvaluationFilled = Cookies.get('courseEvaluationFilled') === 'true';
    this.surveyCompleted = Cookies.get('surveyCompleted') === 'true';
    
    // 如果已获得权限，直接显示搜索页面
    if (this.courseEvaluationFilled || this.surveyCompleted) {
      this.currentPage = 'search';
    }
    
    // 从后端 API 获取统计数据
    this.fetchStatistics();
    
    // 获取设备指纹并存入 localStorage
    // 用于防止恶意刷评价和限制 AI 推荐使用次数
    FingerprintJS.load().then(fp => {
      fp.get().then(result => {
        const fingerprint = result.visitorId;
        localStorage.setItem('deviceFingerprint', fingerprint);
      }).catch(error => {
        console.error('获取设备指纹失败:', error);
      });
    }).catch(error => {
      console.error('加载FingerprintJS失败:', error);
    });
  },
  mounted() {
    this.$nextTick(() => {
    const header = document.getElementById('header');
    if (header) {
      header.style.background = `url(${require('@/assets/R.jpg')}) no-repeat center center`;
      header.style.backgroundSize = "cover";
    } else {
      console.error('Element with ID "header" not found');
    }
  });
  },
  methods: {
    /**
     * 课程评价提交成功的回调函数
     * 设置权限标志并跳转到搜索页面
     */
    courseAdded() {
      this.courseEvaluationFilled = true;
      // 设置 Cookie，有效期 120 天
      Cookies.set('courseEvaluationFilled', 'true', { expires: 120 });
      this.currentPage = 'search';
    },
    
    /**
     * 处理课程搜索请求
     * @param {Object} searchParams - 搜索参数对象 {course_name, instructor}
     */
    async handleSearch(searchParams) {
      try {
        const response = await axios.get(apiUrl, { params: searchParams });
        
        if (response.data && Array.isArray(response.data)) {
          this.results = response.data;
        } else {
          console.warn('搜索响应不是数组格式:', response.data);
          this.results = [];
        }
      } catch (error) {
        console.error('搜索课程时出错:', error);
        if (error.response) {
          // 服务器响应了，但状态码不在 2xx 范围
          console.error('错误状态码:', error.response.status);
          console.error('错误数据:', error.response.data);
        } else if (error.request) {
          // 请求已发送，但没有收到响应
          console.error('请求已发送但没有收到响应');
        } else {
          // 设置请求时发生了一些事情，触发了错误
          console.error('错误信息:', error.message);
        }
        
        // 搜索失败时使用mock数据作为后备，如果无mock数据匹配则使用空数组
        if (this.mockResults && this.mockResults.length) {
          console.log('使用模拟数据作为后备');
          this.results = this.mockResults.filter(course => {
            const nameMatch = !searchParams.course_name || course['课程名称'].includes(searchParams.course_name);
            const instructorMatch = !searchParams.instructor || course['授课老师'].includes(searchParams.instructor);
            return nameMatch && instructorMatch;
          });
        } else {
          this.results = [];
        }
      }
    },
    /**
     * 从后端获取统计数据
     * 包括最近添加的评价数和课程评价总数
     */
    async fetchStatistics() {
      try {
        console.log('正在获取统计数据...');
        const response = await axios.get(statisticUrl);
        console.log('统计数据响应:', response);
        const data = response.data;
        this.visitCount = data.visitCount;           // 最近添加的评价数
        this.evaluationCount = data.evaluationCount; // 课程评价总数
        console.log('统计数据获取成功:', this.visitCount, this.evaluationCount);
      } catch (error) {
        console.error('统计数据获取失败:', error);
        if (error.response) {
          // 服务器响应了，但状态码不在 2xx 范围
          console.error('响应状态:', error.response.status);
          console.error('响应数据:', error.response.data);
        } else if (error.request) {
          // 请求已发送，但没有收到响应
          console.error('请求已发送，但没有收到响应');
        } else {
          // 设置请求时发生错误
          console.error('错误信息:', error.message);
        }
        // 使用默认值
        this.visitCount = 0;
        this.evaluationCount = 0;
      }
    },
    
    /**
     * 新生问卷完成的回调函数
     * 设置权限标志并跳转到搜索页面
     */
    handleSurveyCompleted() {
      this.surveyCompleted = true;
      // 设置 Cookie，有效期 90 天
      Cookies.set('surveyCompleted', 'true', { expires: 90 });
      this.currentPage = 'search';
    }
  }
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f7fa;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  background: linear-gradient(135deg, #409EFF 0%, #67C23A 100%);
  color: white;
  padding: 40px 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.header-content {
  position: relative;
  z-index: 1;
}

header h1 {
  margin: 0 0 30px 0;
  font-size: 2.5em;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.statistics-container {
  margin-top: 30px;
}

.statistic-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: none;
  transition: transform 0.3s ease;
}

.statistic-card:hover {
  transform: translateY(-5px);
}

.statistic-item {
  color: white;
}

.el-statistic__title {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1em;
}

.el-statistic__content {
  color: white;
  font-size: 2em;
}

main {
  flex: 1;
  padding: 40px 20px;
}

.button-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  margin-bottom: 30px;
}

.action-button {
  min-width: 180px;
  height: 50px;
  font-size: 16px;
  transition: all 0.3s ease;
  margin-left: 12px;  /* 设置每个按钮的右边距 */
}

.action-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.content-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-top: 20px;
}

.search-container {
  padding: 20px;
}

footer {
  background: linear-gradient(135deg, #409EFF 0%, #67C23A 100%);
  color: white;
  padding: 20px;
  text-align: center;
}

.footer-content {
  max-width: 800px;
  margin: 0 auto;
}

.disclaimer {
  font-size: 0.9em;
  margin-bottom: 10px;
  opacity: 0.9;
}

.copyright {
  font-size: 0.8em;
  opacity: 0.8;
}
.student-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
/* 响应式设计 */
@media (max-width: 768px) {
  header {
    padding: 20px 10px;
  }

  header h1 {
    font-size: 1.8em;
  }

  .button-container {
    flex-direction: column;
  }

  .action-button {
    width: 100%;
  }

  .content-container {
    padding: 15px;
  }

  .statistic-card {
    margin-bottom: 15px;
  }
}

/* 添加一些动画效果 */
.el-button {
  position: relative;
  overflow: hidden;
}

.el-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;
}

.el-button:active::after {
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  100% {
    transform: scale(20, 20);
    opacity: 0;
  }
}
</style>