<template>
  <div id="app">
    <header id="header">
      <h1>WHU课程收集与评价查询系统</h1>
       <!-- 添加 Statistic 组件展示统计数据 -->
       <div class="statistics-container">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-statistic class="statistic-item" title="最近添加的评价" :value="visitCount"></el-statistic>
          </el-col>
          <el-col :span="12">
            <el-statistic class="statistic-item" title="课程评价总数" :value="evaluationCount"></el-statistic>
          </el-col>
        </el-row>
      </div>
    </header>
    <main>
      <div class="button-container">
        <!-- 仅在没有 surveyCompleted Cookies 时显示新生专区按钮 -->
        <button class="btn" @click="currentPage = 'add'" v-if="!courseEvaluationFilled & !surveyCompleted">添加课程评价</button>
        <button class="btn" v-if="!surveyCompleted && !courseEvaluationFilled" @click="currentPage = 'freshmen'">
          新生专区
        </button>
        <template v-if="courseEvaluationFilled || surveyCompleted">
          <button class="btn" @click="currentPage = 'search'">查询课程评价</button>
          <button class="btn" @click="currentPage = 'add'">补充课程评价</button>
        </template>
      </div>
      <AddCourse v-if="currentPage === 'add'" @courseAdded="courseAdded"></AddCourse>
      <FreshmenZone v-if="currentPage === 'freshmen'" @surveyCompleted="handleSurveyCompleted"></FreshmenZone>
      <div v-if="currentPage === 'search'">
        <SearchForm @search="handleSearch"></SearchForm>
        <div v-if="results.length">
          <SearchResults :results="results"></SearchResults>
        </div>
        <div v-else>
          <p>未找到查询结果</p>
        </div>
      </div>
    </main>
    <footer>
      <p> 声明：本网站数据来源于大众同学对各类课程的评价，不保证真实性、可靠性、准确性，并不承担由此产生的任何责任。</p>
      <p>&copy; CopyRight by JeredGong. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';
// import AddCourse from './components/AddCourse.vue';
import SearchForm from './components/SearchForm.vue';
// import SearchResults from './components/SearchResults.vue';
// import FreshmenZone from './components/FreshmenZone.vue';
import { ElMessage } from 'element-plus';
axios.defaults.baseURL = '/api';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization';
const AddCourse = defineAsyncComponent(() =>
  import('./components/AddCourse.vue')
);
const SearchResults = defineAsyncComponent(() =>
  import('./components/SearchResults.vue')
);
const FreshmenZone = defineAsyncComponent(() =>
  import('./components/FreshmenZone.vue')
);
const apiUrl = process.env.NODE_ENV === 'development'
  ? 'http://127.0.0.1:5000/search'
  : 'http://103.20.220.93:5000/search';
  const Statistic = process.env.NODE_ENV === 'development'
  ? 'http://127.0.0.1:5000/statistic'
  : 'http://103.20.220.93:5000/statistic';
export default {
  components: {
    AddCourse,
    SearchForm,
    SearchResults,
    FreshmenZone
  },
  data() {
    return {
      results: [],
      currentPage: 'add', // 默认显示添加课程评价界面
      surveyCompleted: false,
      courseEvaluationFilled: false,
      visitCount: 0,
      evaluationCount: 0
    };
  },
  created() {
    this.courseEvaluationFilled = Cookies.get('courseEvaluationFilled') === 'true';
    this.surveyCompleted = Cookies.get('surveyCompleted') === 'true';
    if (this.courseEvaluationFilled || this.surveyCompleted) {
      this.currentPage = 'search';
    }
    this.fetchStatistics();
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
      try {
        if (process.env.NODE_ENV === 'development') {
          console.log('Sending search request with params:', searchParams);
        }
        const response = await axios.get(apiUrl, {
          params: searchParams
        });
        if (process.env.NODE_ENV === 'development') {
          console.log('Received response:', response.data);
        }

        let responseData = response.data;

        if (typeof responseData === 'string') {
          try {
            responseData = JSON.parse(responseData);
          } catch (e) {
            if (process.env.NODE_ENV === 'development') {
              console.error('Error parsing response data as JSON:', e);
            }
            return;
          }
        }

        if (Array.isArray(responseData)) {
          const results = responseData.map(item => {
            return {
              ...item,
              '课程成绩': item['课程成绩'] === null || isNaN(item['课程成绩']) ? '' : item['课程成绩']
            };
          });
          if (process.env.NODE_ENV === 'development') {
            console.log('Processed results:', results);
          }
          this.results = results;
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.error('Unexpected response format:', typeof responseData, responseData);
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching data:', error);
        }
      }
    },
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
  background-color: #eef;
}

header {
  background: #f0f0f0;
  background-size: cover;
  color: white;
  padding: 20px;
  text-align: center;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

main {
  padding: 20px;
  min-height: calc(100vh - 160px);
  box-sizing: border-box;
  background-color: #f9f9f9;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 20px;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  margin: 5px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out, transform 0.3s ease-in-out;
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.2);
}

.btn:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

footer {
  background-color: #007bff;
  color: white;
  text-align: center;
  padding: 10px;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.2);
}

.statistics-container {
  margin-top: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #e1ecff, #b6d1ff); /* 深蓝色渐变背景 */
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(46, 21, 21, 0.3); /* 加强阴影 */
}

.el-statistic {
  text-align: center;
  font-size: 24px;
  color: #ffffff; /* 白色文字 */
}

.el-statistic__title {
  color: #ffeb3b; /* 亮黄色标题 */
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* 强烈的文字阴影 */
}

.el-statistic__content {
  font-size: 32px; /* 更大字号的内容 */
  color: #ffffff; /* 白色内容文字 */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* 强烈的文字阴影 */
  transition: all 0.3s ease-in-out;
}

.el-row {
  margin: 0;
}

.el-col {
  padding: 0;
}
/* 响应式设计 */
@media (max-width: 768px) {
  main {
    padding: 15px;
    margin: 10px;
    border-radius: 15px;
  }
  .button-container {
    flex-direction: column;
  }
  .btn {
    width: 100%;
    margin: 10px 0;
  }
  header {
    padding: 15px;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
  }
  footer {
    padding: 15px;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
  }
  .statistics-container {
    padding: 15px;
    border-radius: 15px;
  }
  .el-statistic {
    font-size: 20px;
  }
  .el-statistic__content {
    font-size: 28px; /* 在移动设备上缩小一点内容字体 */
  }
}
</style>