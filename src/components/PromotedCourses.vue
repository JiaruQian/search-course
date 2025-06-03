<template>
  <div class="promoted-courses">
    <div class="header-text">
      <h2>已推广课程</h2>
      <div class="subtext-box">
        <p class="subtext">
          这里展示了所有已推广的课程信息，您可以通过关键词搜索感兴趣的课程。
        </p>
      </div>
    </div>

    <!-- 搜索框 -->
    <div class="search-section">
      <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
        <el-input
          v-model="courseName"
          placeholder="课程名称"
          class="search-input search-input-short"
          clearable
        />
        <el-input
          v-model="instructor"
          placeholder="教师姓名"
          class="search-input search-input-short"
          clearable
        />
        <el-button type="primary" @click="handleSearch">
          搜索
        </el-button>
        <el-button @click="handleClearSearch">
          显示全部
        </el-button>
      </div>
    </div>

    <!-- 课程列表 -->
    <div class="course-list" v-loading="loading">
      <el-empty v-if="!loading && filteredCourses.length === 0" description="暂无课程信息"></el-empty>
      
      <el-card v-for="course in filteredCourses" :key="course.course_name" class="course-card">
        <template #header>
          <div class="course-header">
            <h3>{{ course.course_name }}</h3>
            <el-tag :type="getCourseTypeTag(course.course_attribute)">{{ course.course_attribute }}</el-tag>
          </div>
        </template>
        
        <div class="course-content">
          <div class="course-info">
            <p><strong>授课教师：</strong>{{ course.instructor }}</p>
            <p><strong>学分：</strong>{{ course.credit }}</p>
            <p v-if="course.elective_field"><strong>公选课领域：</strong>{{ course.elective_field }}</p>
          </div>
          
          <el-collapse>
            <el-collapse-item title="课程内容介绍" name="1">
              <p>{{ course.content }}</p>
            </el-collapse-item>
            <el-collapse-item title="考勤与平时作业要求" name="2">
              <p>{{ course.attendance }}</p>
            </el-collapse-item>
            <el-collapse-item title="期末考核方式" name="3">
              <p>{{ course.assessment }}</p>
            </el-collapse-item>
            <el-collapse-item title="课程亮点" name="4">
              <p>{{ course.highlights }}</p>
            </el-collapse-item>
            <el-collapse-item title="适合的学生群体" name="5">
              <p>{{ course.suitable_students }}</p>
            </el-collapse-item>
          </el-collapse>

          <div class="course-resources" v-if="course.resources && course.resources.length">
            <p><strong>教学资源：</strong></p>
            <el-tag
              v-for="resource in course.resources"
              :key="resource"
              class="resource-tag"
              size="small"
            >
              {{ resource }}
            </el-tag>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PromotedCourses',
  data() {
    return {
      courses: [],
      courseName: '',
      instructor: '',
      loading: false
    };
  },
  computed: {
    filteredCourses() {
      // 由于搜索现在通过API处理，直接返回课程列表
      return this.courses;
    }
  },
  methods: {
    async fetchCourses(params = {}) {
      this.loading = true;
      try {
        // 构建查询参数
        const queryParams = {};
        if (params.course_name) {
          queryParams.course_name = params.course_name;
        }
        if (params.instructor) {
          queryParams.instructor = params.instructor;
        }

        const response = await axios.get('/course_promotion', {
          params: queryParams
        });
        
        if (response.status === 200 && response.data.success) {
          this.courses = response.data.data;
          this.$notify({
            title: '成功',
            message: response.data.message || '获取课程列表成功',
            type: 'success',
            duration: 3000
          });
        } else {
          throw new Error(response.data.message || '获取课程列表失败');
        }
      } catch (error) {
        console.error('获取课程列表失败:', error);
        
        // 检查是否是网络错误或服务器错误
        if (error.response && error.response.status >= 400) {
          this.$notify({
            title: '错误',
            message: error.response.data?.message || '服务器错误',
            type: 'error',
            duration: 3000
          });
        } else {
          // 使用模拟数据作为fallback
          this.courses = [
            {
              course_name: "高等数学",
              course_attribute: "公共课",
              elective_field: "",
              instructor: "张教授",
              credit: "4",
              content: "本课程主要讲授微积分的基本概念、理论和方法，包括函数、极限、连续、导数、积分等内容。通过本课程的学习，学生将掌握微积分的基本理论和应用方法。",
              attendance: "每周点名，缺勤不得超过3次。平时作业每周一次，占总成绩的20%。",
              assessment: "期末考试占60%，平时成绩占40%（包括作业、出勤和课堂表现）。",
              highlights: "课程内容系统完整，讲解深入浅出，注重实际应用。提供丰富的习题和练习，帮助学生巩固所学知识。",
              suitable_students: "适合理工科专业的学生，特别是需要扎实数学基础的专业。",
              resources: ["教材", "PPT", "习题集", "在线视频"]
            },
            {
              course_name: "中国传统文化",
              course_attribute: "通识选修课（公选课）",
              elective_field: "中华文化与世界文明",
              instructor: "李教授",
              credit: "2",
              content: "本课程系统介绍中国传统文化的基本内容、发展历程和现代价值，包括哲学思想、文学艺术、科技成就等方面。",
              attendance: "不定期点名，需要完成一篇课程论文。",
              assessment: "课程论文占60%，平时表现占40%。",
              highlights: "课程内容丰富多样，结合现代视角解读传统文化，注重培养学生的文化素养。",
              suitable_students: "适合所有专业的学生，特别是对中华文化感兴趣的同学。",
              resources: ["教材", "参考资料", "视频资源"]
            },
            {
              course_name: "数据结构与算法",
              course_attribute: "专业课程",
              elective_field: "",
              instructor: "王教授",
              credit: "3",
              content: "本课程介绍基本的数据结构和算法设计方法，包括线性表、树、图等数据结构，以及排序、查找等基本算法。",
              attendance: "每周实验课，需要完成实验报告。平时作业每周一次。",
              assessment: "期末考试占50%，实验成绩占30%，平时作业占20%。",
              highlights: "课程理论与实践相结合，提供大量编程练习，帮助学生掌握算法设计思想。",
              suitable_students: "适合计算机相关专业的学生，需要具备基本的编程基础。",
              resources: ["教材", "PPT", "实验指导书", "在线编程平台"]
            }
          ];
          this.$notify({
            title: '提示',
            message: '无法连接到服务器，当前显示的是模拟数据',
            type: 'warning',
            duration: 3000
          });
        }
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      // 使用搜索参数重新获取课程列表
      const searchParams = {};
      if (this.courseName.trim()) {
        searchParams.course_name = this.courseName.trim();
      }
      if (this.instructor.trim()) {
        searchParams.instructor = this.instructor.trim();
      }
      
      this.fetchCourses(searchParams);
    },
    handleClearSearch() {
      this.courseName = '';
      this.instructor = '';
      this.fetchCourses();
    },
    getCourseTypeTag(type) {
      const typeMap = {
        '体育课': 'success',
        '通识选修课（公选课）': 'warning',
        '公共课': 'info',
        '专业课程': 'danger',
        '通识必修课（导引）': 'primary'
      };
      return typeMap[type] || 'info';
    }
  },
  mounted() {
    this.fetchCourses();
  }
};
</script>

<style scoped>
.promoted-courses {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.header-text {
  text-align: center;
  margin-bottom: 30px;
}

.header-text h2 {
  margin-bottom: 15px;
  font-size: 28px;
  color: #303133;
}

.subtext-box {
  background-color: #f0f9eb;
  border: 1px solid #e1f3d8;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
}

.subtext {
  font-size: 16px;
  color: #67c23a;
  margin: 0;
}

.search-section {
  margin-bottom: 30px;
}

.search-input {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  display: block;
}

.search-input-short {
  width: 200px;
  max-width: 200px;
  min-width: 120px;
  margin: 0;
  display: inline-block;
}

.course-list {
  display: grid;
  gap: 20px;
}

.course-card {
  transition: transform 0.3s ease;
}

.course-card:hover {
  transform: translateY(-5px);
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.course-header h3 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.course-content {
  padding: 10px 0;
}

.course-info {
  margin-bottom: 15px;
}

.course-info p {
  margin: 5px 0;
  color: #606266;
}

.course-resources {
  margin-top: 15px;
}

.resource-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .promoted-courses {
    padding: 15px;
  }
  
  .header-text h2 {
    font-size: 24px;
  }
  
  .subtext {
    font-size: 14px;
  }
  
  .course-header h3 {
    font-size: 18px;
  }
}
</style> 