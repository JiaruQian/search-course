<template>
  <div class="add-course">
    <div class="header-text">
      <h2 v-if="!courseEvaluationFilled">添加课程评价</h2>
      <h2 v-if="courseEvaluationFilled">补充课程评价</h2>
      <div class="subtext-box" v-if="!courseEvaluationFilled">
        <p class="subtext">
          您必须先完成课程评价后，才能查询课程评价。为了维护良好生态，请您务必认真填写评价！
        </p>
      </div>
      <div class="warning-box">
        <p class="warning-text">
          删除Cookies后可能需要重新填写课程评价
        </p>
      </div>
    </div>
    <form @submit.prevent="addCourse">
      <div class="form-group">
        <label for="course_name">课程名称:</label>
        <input type="text" v-model="course_name" id="course_name" class="form-control" required>
      </div>
      <div class="form-group">
        <label for="course_attribute">课程属性:</label>
        <select v-model="course_attribute" id="course_attribute" class="form-control" required>
          <option disabled value="">请选择课程属性</option>
          <option value="体育课">体育课</option>
          <option value="通识选修课（公选课）">通识选修课（公选课）</option>
          <option value="公共课">公共课（高数、线代、大物和思政课等）</option>
          <option value="专业课程">专业课程</option>
          <option value="通识必修课（导引）">通识必修课（导引）</option>
        </select>
      </div>
      <div class="form-group" v-if="course_attribute === '通识选修课（公选课）'">
        <label for="elective_field">公选课领域:</label>
        <select v-model="elective_field" id="elective_field" class="form-control" required>
          <option disabled value="">请选择公选课领域</option>
          <option value="中华文化与世界文明">中华文化与世界文明</option>
          <option value="科学精神与生命关怀">科学精神与生命关怀</option>
          <option value="社会科学与现代科学">社会科学与现代科学</option>
          <option value="艺术体验与审美欣赏">艺术体验与审美欣赏</option>
        </select>
      </div>
      <div class="form-group">
        <label for="instructor">授课老师:</label>
        <input type="text" v-model="instructor" id="instructor" class="form-control" required>
      </div>
      <div class="form-group">
        <label for="content">课程内容与评价:</label>
        <textarea v-model="content" id="content" class="form-control" required></textarea>
      </div>
      <div class="form-group">
        <label for="attendance">考勤与平时作业:</label>
        <textarea v-model="attendance" id="attendance" class="form-control" required></textarea>
      </div>
      <div class="form-group">
        <label for="assessment">期末考核方式:</label>
        <textarea v-model="assessment" id="assessment" class="form-control" required></textarea>
      </div>
      <div class="form-group">
        <label for="grade">课程成绩(选填):</label>
        <input type="number" v-model="grade" id="grade" class="form-control">
      </div>
      <div class="button-container">
        <button type="submit" class="btn btn-primary">提交评价</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';
// 添加API URL配置
const apiBaseUrl = process.env.VUE_APP_API_BASE_URL; // 保持与App.vue中相同的地址
axios.defaults.baseURL = apiBaseUrl;
export default {
  data() {
    return {
      course_name: '',
      course_attribute: '',
      elective_field: '',
      instructor: '',
      content: '',
      attendance: '',
      assessment: '',
      grade: '',
      courseEvaluationFilled: Cookies.get('courseEvaluationFilled') === 'true'
    };
  },
  methods: {
    async addCourse() {
      const courseData = {
        course_name: this.course_name,
        course_attribute: this.course_attribute,
        elective_field: this.course_attribute === '通识选修课（公选课）' ? this.elective_field : '',
        instructor: this.instructor,
        content: this.content,
        attendance: this.attendance,
        assessment: this.assessment,
        grade: this.grade === '' ? 'Unknown' : this.grade
      };

      // 检查课程成绩是否在0-100范围内或为'Unknown'
      if (courseData.grade !== 'Unknown' && (!Number.isInteger(Number(courseData.grade)) || courseData.grade < 0 || courseData.grade > 100)) {
        alert('课程成绩必须是0-100范围内的整数或者为空');
        return;
      }
      
      try {
        console.log('正在提交课程评价...');
        console.log('提交数据:', courseData);
        // 提交数据到后端API
        const response = await axios.post(`/add_course`, courseData);
        console.log('添加课程响应:', response);
        this.onQuestionnaireCompleted().then(() => {
          alert('课程评价提交成功');
        }).catch((error) => {
          console.error('设置指纹失败:', error);
        });
        Cookies.set('courseEvaluationFilled', 'true', { expires: 200 });
        this.courseEvaluationFilled = true;
        this.$emit('courseAdded');
      } catch (error) {
        console.error('添加课程失败:', error);
        if (error.response) {
          // 服务器响应了，但状态码不在 2xx 范围
          console.error('错误状态码:', error.response.status);
          console.error('错误数据:', error.response.data);
        } else if (error.request) {
          // 请求已发送但没有收到响应
          console.error('请求已发送但没有收到响应');
        } else {
          // 设置请求时发生了一些事情，触发了错误
          console.error('错误信息:', error.message);
        }
        alert('课程评价提交失败: ' + (error.response?.data?.message || error.message || '未知错误'));
      }
    },
    getNextThursdayDate(){
        const now = new Date()
        const dayOfWeek = now.getDay() // 0=Sunday, ..., 6=Saturday
        const daysUntilThursday = (4 - dayOfWeek + 7) % 7 || 7 // 下一个周四
        const nextThursday = new Date(now)
        nextThursday.setDate(now.getDate() + daysUntilThursday)
        nextThursday.setHours(0, 0, 0, 0)
        return nextThursday
    },
    setCookie(name, value, expires) {
        document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()}; SameSite=Strict`
    },
  async  onQuestionnaireCompleted() {
        // 从LocalStorage获取指纹
        let fingerprint = localStorage.getItem('fingerprint');
        const expires = this.getNextThursdayDate()

        // 设置指纹和使用次数 cookie
        this.setCookie('fingerprint', fingerprint, expires)
        this.setCookie('ai_uses_left', '10', expires)
  }
  }
};
</script>

<style>
.add-course {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 15px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.header-text {
  text-align: center;
  margin-bottom: 20px;
}
.header-text h2 {
  margin-bottom: 10px;
}
.subtext-box, .warning-box {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
}
.subtext-box {
  background-color: #e7f3fe;
  border-color: #b3d4fc;
}
.warning-box {
  background-color: #fff3cd;
  border-color: #ffeeba;
}
.header-text .subtext {
  font-size: 14px;
  color: #555;
  margin: 0;
}
.header-text .warning-text {
  font-size: 12px;
  color: #a00;
  margin: 0;
}
.form-group {
  margin-bottom: 15px;
}
.form-control {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 10px;
  transition: border-color 0.3s ease-in-out;
}
.form-control:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}
.button-container {
  text-align: center;
  margin-top: 20px;
}
.btn {
  display: inline-block;
  padding: 10px 20px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}
.btn:hover {
  background-color: #0056b3;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .add-course {
    padding: 15px;
  }
  .form-control {
    padding: 8px;
    font-size: 14px;
  }
  .btn {
    padding: 8px 16px;
    font-size: 14px;
  }
  .header-text h2 {
    font-size: 18px;
  }
  .header-text .subtext,
  .header-text .warning-text {
    font-size: 12px;
  }
}
</style>
