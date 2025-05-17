<template>
  <div class="course-promotion">
    <div class="header-text">
      <h2>课程推广</h2>
      <div class="subtext-box">
        <p class="subtext">
          作为课程推广者，您可以在此填写课程信息，帮助学生更好地了解课程内容和特点。
        </p>
      </div>
    </div>
    <form @submit.prevent="promoteCourse">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12">
          <div class="form-group">
            <label for="course_name">课程名称:</label>
            <el-input type="text" v-model="course_name" id="course_name" class="form-control" required>
              <template #prefix>
                <el-icon><Reading /></el-icon>
              </template>
            </el-input>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12">
          <div class="form-group">
            <label for="course_attribute">课程属性:</label>
            <el-select v-model="course_attribute" id="course_attribute" class="form-control" required placeholder="请选择课程属性">
              <el-option value="体育课" label="体育课"></el-option>
              <el-option value="通识选修课（公选课）" label="通识选修课（公选课）"></el-option>
              <el-option value="公共课" label="公共课（高数、线代、大物和思政课等）"></el-option>
              <el-option value="专业课程" label="专业课程"></el-option>
              <el-option value="通识必修课（导引）" label="通识必修课（导引）"></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      
      <div class="form-group" v-if="course_attribute === '通识选修课（公选课）'">
        <label for="elective_field">公选课领域:</label>
        <el-select v-model="elective_field" id="elective_field" class="form-control" required placeholder="请选择公选课领域">
          <el-option value="中华文化与世界文明" label="中华文化与世界文明"></el-option>
          <el-option value="科学精神与生命关怀" label="科学精神与生命关怀"></el-option>
          <el-option value="社会科学与现代科学" label="社会科学与现代科学"></el-option>
          <el-option value="艺术体验与审美欣赏" label="艺术体验与审美欣赏"></el-option>
        </el-select>
      </div>
      
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12">
          <div class="form-group">
            <label for="instructor">授课老师:</label>
            <el-input type="text" v-model="instructor" id="instructor" class="form-control" required>
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12">
          <div class="form-group">
            <label for="credit">学分:</label>
            <el-input-number v-model="credit" id="credit" :min="0.5" :max="10" :step="0.5" class="form-control" required></el-input-number>
          </div>
        </el-col>
      </el-row>
      
      <div class="form-group">
        <label for="content">课程内容介绍:</label>
        <el-input type="textarea" v-model="content" id="content" class="form-control" :rows="4" required></el-input>
      </div>
      
      <div class="form-group">
        <label for="attendance">考勤与平时作业要求:</label>
        <el-input type="textarea" v-model="attendance" id="attendance" class="form-control" :rows="3" required></el-input>
      </div>
      
      <div class="form-group">
        <label for="assessment">期末考核方式:</label>
        <el-input type="textarea" v-model="assessment" id="assessment" class="form-control" :rows="3" required></el-input>
      </div>
      
      <div class="form-group">
        <label for="highlights">课程亮点:</label>
        <el-input type="textarea" v-model="highlights" id="highlights" class="form-control" :rows="3" required></el-input>
      </div>
      
      <div class="form-group">
        <label for="suitable_students">适合的学生群体:</label>
        <el-input type="textarea" v-model="suitable_students" id="suitable_students" class="form-control" :rows="3" required></el-input>
      </div>
      
      <div class="form-group">
        <label>教学资源:</label>
        <el-checkbox-group v-model="resources">
          <el-checkbox label="教材"></el-checkbox>
          <el-checkbox label="PPT"></el-checkbox>
          <el-checkbox label="参考资料"></el-checkbox>
          <el-checkbox label="视频资源"></el-checkbox>
          <el-checkbox label="实验设备"></el-checkbox>
        </el-checkbox-group>
      </div>
      
      <div class="button-container">
        <el-button type="primary" native-type="submit" :loading="loading" class="submit-btn">
          提交课程推广
          <el-icon class="el-icon--right"><UploadFilled /></el-icon>
        </el-button>
      </div>
    </form>
  </div>
</template>

<script>
import { Reading, User, UploadFilled } from '@element-plus/icons-vue';
import axios from 'axios';

export default {
  name: 'CoursePromotion',
  components: {
    Reading,
    User,
    UploadFilled
  },
  data() {
    return {
      course_name: '',
      course_attribute: '',
      elective_field: '',
      instructor: '',
      credit: 2,
      content: '',
      attendance: '',
      assessment: '',
      highlights: '',
      suitable_students: '',
      resources: [],
      loading: false
    };
  },
  methods: {
    async promoteCourse() {
      // 表单验证
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;

      const courseData = {
        course_name: this.course_name,
        course_attribute: this.course_attribute,
        elective_field: this.course_attribute === '通识选修课（公选课）' ? this.elective_field : '',
        instructor: this.instructor,
        credit: this.credit,
        content: this.content,
        attendance: this.attendance,
        assessment: this.assessment,
        highlights: this.highlights,
        suitable_students: this.suitable_students,
        resources: this.resources
      };

      try {
        // 调用API提交课程推广信息
        await axios.post('/course_promotion', courseData);
        
        this.$notify({
          title: '成功',
          message: '课程推广信息已提交',
          type: 'success',
          duration: 3000
        });
        this.resetForm();
      } catch (error) {
        console.error('Error promoting course:', error);
        this.$notify({
          title: '错误',
          message: '提交失败，请稍后重试',
          type: 'error',
          duration: 3000
        });
      } finally {
        this.loading = false;
      }
    },
    validateForm() {
      if (!this.course_name || !this.course_attribute || !this.instructor || !this.content || 
          !this.attendance || !this.assessment || !this.highlights || !this.suitable_students) {
        this.$notify({
          title: '警告',
          message: '请填写所有必填字段',
          type: 'warning',
          duration: 3000
        });
        return false;
      }
      
      if (this.course_attribute === '通识选修课（公选课）' && !this.elective_field) {
        this.$notify({
          title: '警告',
          message: '请选择公选课领域',
          type: 'warning',
          duration: 3000
        });
        return false;
      }
      
      return true;
    },
    resetForm() {
      this.course_name = '';
      this.course_attribute = '';
      this.elective_field = '';
      this.instructor = '';
      this.credit = 2;
      this.content = '';
      this.attendance = '';
      this.assessment = '';
      this.highlights = '';
      this.suitable_students = '';
      this.resources = [];
    }
  }
};
</script>

<style scoped>
.course-promotion {
  max-width: 800px;
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

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
  color: #606266;
}

.form-control {
  width: 100%;
  margin-top: 5px;
}

.button-container {
  text-align: center;
  margin-top: 30px;
}

.submit-btn {
  min-width: 180px;
  height: 50px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .course-promotion {
    padding: 15px;
  }
  
  .header-text h2 {
    font-size: 24px;
  }
  
  .subtext {
    font-size: 14px;
  }
  
  .form-group label {
    font-size: 14px;
  }
}
</style> 