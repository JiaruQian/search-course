<template>
  <div class="search-results" v-if="results.length">
    <h2>查询结果——共查询到 {{ results.length }} 条结果</h2>
    <div class="table-responsive">
      <table class="table" v-if="!isMobile">
        <thead>
          <tr>
            <th>课程名称</th>
            <th>课程属性</th>
            <th>公选课领域</th>
            <th>授课老师</th>
            <th>课程内容与评价</th>
            <th>考勤与平时作业</th>
            <th>期末考核方式</th>
            <th>课程成绩</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in paginatedResults" :key="index"
              :class="{'highlight-row': row['课程属性'] === '通识选修课（公选课）'}">
            <td class="heiti-font">{{ row['课程名称'] }}</td>
            <td class="heiti-font">{{ row['课程属性'] }}</td>
            <td class="heiti-font">{{ row['公选课领域'] }}</td>
            <td class="heiti-font">{{ row['授课老师'] }}</td>
            <td class="heiti-font">{{ row['课程内容与评价'] }}</td>
            <td class="heiti-font">{{ row['考勤与平时作业'] }}</td>
            <td class="heiti-font">{{ row['期末考核方式'] }}</td>
            <td class="times-bold-font">{{ row['课程成绩'] }}</td>
          </tr>
        </tbody>
      </table>

      <div v-else>
        <div v-for="(row, index) in paginatedResults" :key="index" class="card">
          <div class="card-header" :class="{'highlight-row': row['课程属性'] === '通识选修课（公选课）'}">
            <span class="heiti-font">课程名称: {{ row['课程名称'] }}</span>
          </div>
          <div class="card-body">
            <div class="card-row" v-if="row['课程属性']">
              <span class="card-title">课程属性:</span>
              <span class="card-content heiti-font">{{ row['课程属性'] }}</span>
            </div>
            <div class="card-row" v-if="row['公选课领域']">
              <span class="card-title">公选课领域:</span>
              <span class="card-content heiti-font">{{ row['公选课领域'] }}</span>
            </div>
            <div class="card-row">
              <span class="card-title">授课老师:</span>
              <span class="card-content heiti-font">{{ row['授课老师'] }}</span>
            </div>
            <div class="card-row">
              <span class="card-title">课程内容与评价:</span>
              <span class="card-content heiti-font">{{ row['课程内容与评价'] }}</span>
            </div>
            <div class="card-row">
              <span class="card-title">考勤与平时作业:</span>
              <span class="card-content heiti-font">{{ row['考勤与平时作业'] }}</span>
            </div>
            <div class="card-row">
              <span class="card-title">期末考核方式:</span>
              <span class="card-content heiti-font">{{ row['期末考核方式'] }}</span>
            </div>
            <div class="card-row">
              <span class="card-title">课程成绩:</span>
              <span class="card-content times-bold-font">{{ row['课程成绩'] }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1" class="pagination-button">上一页</button>
      <span class="pagination-info">第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-button">下一页</button>
      <input type="number" v-model.number="inputPage" @keyup.enter="jumpToPage" placeholder="页码" min="1" :max="totalPages" class="pagination-input" />
      <button @click="jumpToPage" class="pagination-button">跳转</button>
    </div>
  </div>
  <div v-else>
    <h2>未找到查询结果</h2>
  </div>
</template>




<script>
/**
 * SearchResults.vue - 搜索结果展示组件
 * 
 * 功能：
 * 1. 展示课程搜索结果
 * 2. 支持分页显示
 * 3. 响应式布局（桌面端表格，移动端卡片）
 * 4. 支持页面跳转
 */

export default {
  props: ['results'],  // 接收父组件传递的搜索结果数组
  data() {
    return {
      currentPage: 1,        // 当前页码
      itemsPerPage: 15,      // 每页显示条数
      inputPage: '',         // 用户输入的跳转页码
      isMobile: window.innerWidth <= 768  // 是否为移动端
    };
  },
  computed: {
    /**
     * 计算总页数
     */
    totalPages() {
      return Math.ceil(this.results.length / this.itemsPerPage);
    },
    
    /**
     * 计算当前页要显示的结果
     */
    paginatedResults() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.results.slice(start, start + this.itemsPerPage);
    }
  },
  methods: {
    /**
     * 下一页
     */
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    
    /**
     * 上一页
     */
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    
    /**
     * 跳转到指定页码
     */
    jumpToPage() {
      if (this.inputPage >= 1 && this.inputPage <= this.totalPages) {
        this.currentPage = this.inputPage;
      }
    },
    
    /**
     * 处理窗口大小变化
     * 用于响应式布局切换
     */
    handleResize() {
      this.isMobile = window.innerWidth <= 768;
    }
  },
  mounted() {
    // 监听窗口大小变化
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    // 组件卸载前移除事件监听
    window.removeEventListener('resize', this.handleResize);
  }
};
</script>


<style>
.search-results {
  margin-top: 20px;
}
.table-responsive {
  overflow-x: auto;
}
.table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
}
.table th, .table td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}
.table th {
  background-color: #007bff;
  color: white;
}
.table th:first-child {
  border-top-left-radius: 10px;
}
.table th:last-child {
  border-top-right-radius: 10px;
}
.table tr:nth-child(even) {
  background-color: #f9f9f9;
}
.table tr:hover {
  background-color: #f1f1f1;
}
.table tr:last-child td:first-child {
  border-bottom-left-radius: 10px;
}
.table tr:last-child td:last-child {
  border-bottom-right-radius: 10px;
}
.highlight-row {
  color: rgb(135, 135, 255);
  background-color: #e0f7fa;
}
.heiti-font {
  font-family: "Heiti SC", "黑体", sans-serif;
}
.times-bold-font {
  font-family: "Times New Roman", Times, serif;
  font-weight: bold;
}

.card {
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-bottom: 15px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
}
.card-header {
  background-color: #007bff;
  color: white;
  padding: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.card-body {
  padding: 10px;
}
.card-row {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
}
.card-title {
  font-weight: bold;
  width: 45%;
}
.card-content {
  width: 55%;
  text-align: right;
}
.highlight-row {
  background-color: #e0f7fa;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .table {
    display: none;
  }
  .card-row {
    flex-direction: column;
    align-items: flex-start;
  }
  .card-content {
    text-align: left;
    padding-left: 10px;
  }
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.pagination-button {
  padding: 10px 20px;
  margin: 5px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s, transform 0.3s;
}
.pagination-button:hover {
  background-color: #0056b3;
   transform: translateY(-2px);
}
.pagination-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.pagination-info {
  margin: 5px;
  font-size: 16px;
}
.pagination-input {
  width: 60px;
  padding: 5px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin: 5px;
}
</style>
