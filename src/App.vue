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
            <!-- 仅在没有 surveyCompleted Cookies 时显示新生专区按钮 -->
            <el-button 
              type="primary" 
              size="large" 
              @click="currentPage = 'add'" 
              v-if="!courseEvaluationFilled & !surveyCompleted"
              class="action-button"
            >
              <el-icon><Plus /></el-icon>
              添加课程评价
            </el-button>
            <el-button 
              type="success" 
              size="large" 
              v-if="!surveyCompleted && !courseEvaluationFilled" 
              @click="currentPage = 'freshmen'"
              class="action-button"
            >
              <el-icon><User /></el-icon>
              新生专区
            </el-button>
            <template v-if="courseEvaluationFilled || surveyCompleted">
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
            </template>
          </div>

          <div class="content-container">
            <AddCourse v-if="currentPage === 'add'" @courseAdded="courseAdded"></AddCourse>
            <FreshmenZone v-if="currentPage === 'freshmen'" @surveyCompleted="handleSurveyCompleted"></FreshmenZone>
            <AIRAG v-if="currentPage === 'airag'"></AIRAG>
            <div v-if="currentPage === 'search'" class="search-container">
              <SearchForm @search="handleSearch"></SearchForm>
              <div v-if="results.length">
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
import { defineAsyncComponent } from 'vue';
// import axios from 'axios';
import Cookies from 'js-cookie';
// import AddCourse from './components/AddCourse.vue';
import SearchForm from './components/SearchForm.vue';
// import SearchResults from './components/SearchResults.vue';
// import FreshmenZone from './components/FreshmenZone.vue';
// import { ElMessage } from 'element-plus';
// axios.defaults.baseURL = '/api';
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
// axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization';
import { Calendar, Document, Plus, User, Search, Edit, Connection } from '@element-plus/icons-vue';
// const apiUrl = process.env.NODE_ENV === 'development'
//   ? 'http://127.0.0.1:5000/search'
//   : 'http://103.20.220.93:5000/search';
// const Statistic = process.env.NODE_ENV === 'development'
//   ? 'http://127.0.0.1:5000/statistic'
//   : 'http://103.20.220.93:5000/statistic';
const AddCourse = defineAsyncComponent(() =>
  import('./components/AddCourse.vue')
);
const SearchResults = defineAsyncComponent(() =>
  import('./components/SearchResults.vue')
);
const FreshmenZone = defineAsyncComponent(() =>
  import('./components/FreshmenZone.vue')
);
const AIRAG = defineAsyncComponent(() =>
  import('./components/AIRAG.vue')
);
// const apiUrl = process.env.NODE_ENV === 'development'
//   ? 'http://127.0.0.1:5000/search'
//   : 'http://103.20.220.93:5000/search';
// const Statistic = process.env.NODE_ENV === 'development'
//   ? 'http://127.0.0.1:5000/statistic'
//   : 'http://103.20.220.93:5000/statistic';
export default {
  components: {
    AddCourse,
    SearchForm,
    SearchResults,
    FreshmenZone,
    AIRAG,
    Calendar,
    Document,
    Plus,
    User,
    Search,
    Edit,
    Connection
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
  created() {
    this.courseEvaluationFilled = Cookies.get('courseEvaluationFilled') === 'true';
    this.surveyCompleted = Cookies.get('surveyCompleted') === 'true';
    if (this.courseEvaluationFilled || this.surveyCompleted) {
      this.currentPage = 'search';
    }
    // 使用模拟数据
    this.visitCount = 156;
    this.evaluationCount = 89;
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
    courseAdded() {
      this.courseEvaluationFilled = true;
      Cookies.set('courseEvaluationFilled', 'true', { expires: 120 });
      this.currentPage = 'search';
    },
    async handleSearch(searchParams) {
      // 模拟搜索功能
      const { course_name, instructor } = searchParams;
      this.results = this.mockResults.filter(course => {
        const nameMatch = !course_name || course['课程名称'].includes(course_name);
        const instructorMatch = !instructor || course['授课老师'].includes(instructor);
        return nameMatch && instructorMatch;
      });
    },
    // 注释掉原有的API调用
    /*
    async fetchStatistics() {
      try {
        const response = await axios.get(Statistic);
        const data = response.data;
        this.visitCount = data.visitCount;
        this.evaluationCount = data.evaluationCount;
      } catch (error) {
        ElMessage.error('统计数据获取失败');
      }
    },
    */
    handleSurveyCompleted() {
      this.surveyCompleted = true;
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