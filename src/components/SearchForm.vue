<template>
  <div class="search-form">
    <h2>查询课程评价</h2>
    <form @submit.prevent="searchCourses">
      <div class="form-group">
        <label for="course_name">课程名称:</label>
        <input type="text" v-model="course_name" id="course_name" class="form-control">
      </div>
      <div class="form-group">
        <label for="instructor">授课老师:</label>
        <input type="text" v-model="instructor" id="instructor" class="form-control">
      </div>
      <button type="submit" class="btn btn-primary">查询</button>
    </form>
  </div>
</template>

<script>
/**
 * SearchForm.vue - 课程搜索表单组件
 * 
 * 功能：
 * 1. 提供课程名称和授课教师两个搜索条件
 * 2. 将搜索参数通过 emit 传递给父组件
 */

export default {
  data() {
    return {
      course_name: '',  // 课程名称搜索条件
      instructor: ''    // 授课教师搜索条件
    };
  },
  methods: {
    /**
     * 执行搜索操作
     * 通过 emit 事件将搜索参数传递给父组件
     */
    searchCourses() {
      this.$emit('search', { 
        course_name: this.course_name, 
        instructor: this.instructor 
      });
    }
  }
};
</script>

<style>
.search-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 15px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease-in-out;
}
.search-form:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
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
.btn {
  display: inline-block;
  padding: 10px 20px;
  margin-top: 10px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}
.btn:hover {
  background-color: #387ac0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-form {
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
}
</style>
