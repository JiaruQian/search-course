<template>
  <div class="airag-container">
    <h2>AI辅助推荐</h2>
    
    <!-- 添加进度条 -->
    <el-steps :active="activeStep" align-center finish-status="success" class="steps-container">
      <el-step title="填写信息"></el-step>
      <el-step title="AI推荐"></el-step>
    </el-steps>

    <el-row type="flex" justify="center">
      <el-col :xs="24" :sm="22" :md="20" :lg="18" :xl="16">
        <!-- 第一步：填写信息 -->
        <div v-if="activeStep === 0" class="form-container">
          <el-form :model="formData" :rules="rules" ref="formRef" label-position="top">
            <el-row :gutter="20">
              <el-col :xs="24" :sm="12">
                <el-form-item label="课程类别" prop="category">
                  <el-select v-model="formData.category" placeholder="请选择课程类别" style="width: 100%">
                    <el-option label="体育课" value=1></el-option>
                    <el-option label="通识选修课（公选课）" value=2></el-option>
                    <el-option label="公共课" value=3></el-option>
                    <el-option label="专业课程" value=4></el-option>
                    <el-option label="通识必修课（导引）" value=5></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="个人需求描述" prop="description">
              <el-input
                type="textarea"
                v-model="formData.description"
                placeholder="请简要描述您的需求（30字左右）"
                :maxlength="50"
                show-word-limit
              ></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitForm" :loading="loading" class="submit-btn">
                获取推荐
                <el-icon class="el-icon--right"><ArrowRight /></el-icon>
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 第二步：AI推荐结果 -->
        <div v-if="activeStep === 1" class="recommendations-container">
          <div class="recommendations-header">
            <h3>AI推荐结果</h3>
            <el-button type="primary" @click="backToForm" class="back-btn">
              <el-icon><Back /></el-icon>
              返回修改
            </el-button>
          </div>
          
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="8" v-for="(rec, index) in recommendations" :key="index">
              <el-card class="recommendation-card" :body-style="{ padding: '0px' }" shadow="hover">
                <div class="card-header">
                  <span class="course-name">{{ rec.course }}</span>
                  <el-tag size="small" :type="getTagType(index)">推荐度 {{ index + 1 }}</el-tag>
                </div>
                <div class="card-content">
                  <p class="reason">{{ rec.reason }}</p>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ArrowRight, Back } from '@element-plus/icons-vue'
import axios from 'axios'

export default {
  name: 'AIRAG',
  components: {
    ArrowRight,
    Back
  },
  data() {
    return {
      activeStep: 0,
      formData: {
        category: '',
        description: ''
      },
      rules: {
        category: [
          { required: false, message: '请选择课程类别', trigger: 'change', default: 0 }
        ],
        description: [
          { required: true, message: '请输入个人需求描述', trigger: 'blur' },
          { min: 0, max: 50, message: '描述长度在0到50个字符之间', trigger: 'blur' }
        ]
      },
      loading: false,
      recommendations: []
    };
  },
  methods: {
    async submitForm() {
      try {
        await this.$refs.formRef.validate();
        this.loading = true;

        try {
          // 调用后端AI推荐API
          const response = await axios.post('http://localhost:8000/rag', this.formData);
          this.recommendations = response.data;
        } catch (error) {
          console.error('获取AI推荐失败:', error);
          // 如果API调用失败，使用备用数据
          this.recommendations = [
            {
              course: '高等数学',
              reason: '根据您的需求，这门课程的教学方式灵活，给分较为宽松，适合您的学习风格。'
            },
            {
              course: '线性代数',
              reason: '课程内容循序渐进，考核方式合理，符合您的期望。'
            },
            {
              course: '中国传统文化',
              reason: '课程生动有趣，考核方式灵活，适合您的学习需求。'
            }
          ];
        }

        // 进入下一步
        this.activeStep = 1;

      } catch (error) {
        console.error('表单验证失败:', error);
      } finally {
        this.loading = false;
      }
    },
    backToForm() {
      this.activeStep = 0;
    },
    getTagType(index) {
      const types = ['success', 'warning', 'info'];
      return types[index] || 'info';
    }
  }
};
</script>

<style scoped>
.airag-container {
  padding: 20px;
  background-color: #fff;
  min-height: calc(100vh - 200px);
}

.steps-container {
  margin-bottom: 40px;
}

.form-container {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.submit-btn {
  width: 100%;
  margin-top: 20px;
  height: 40px;
  font-size: 16px;
}

.recommendations-container {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.recommendations-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 5px;
}

.recommendation-card {
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.recommendation-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
  background-color: #f8f9fa;
  padding: 15px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.course-name {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.card-content {
  padding: 15px;
}

.reason {
  color: #606266;
  line-height: 1.6;
  margin: 0;
}

h2 {
  text-align: center;
  color: #303133;
  margin-bottom: 30px;
  font-size: 28px;
}

h3 {
  color: #303133;
  margin: 0;
  font-size: 22px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .airag-container {
    padding: 10px;
  }
  
  .form-container,
  .recommendations-container {
    padding: 20px;
  }
  
  .course-name {
    font-size: 16px;
  }

  h2 {
    font-size: 24px;
    margin-bottom: 20px;
  }

  h3 {
    font-size: 20px;
  }

  .recommendations-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
}

/* 添加一些动画效果 */
.el-card {
  transition: all 0.3s ease;
}

.el-button {
  transition: all 0.3s ease;
}

.el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.el-input:hover .el-input__inner,
.el-select:hover .el-input__inner {
  border-color: #409eff;
}

.el-textarea:hover .el-textarea__inner {
  border-color: #409eff;
}

/* 进度条样式优化 */
:deep(.el-step__title) {
  font-size: 16px;
}

:deep(.el-step__head.is-process) {
  color: #409eff;
  border-color: #409eff;
}

:deep(.el-step__head.is-finish) {
  color: #67c23a;
  border-color: #67c23a;
}

:deep(.el-step__title.is-process) {
  color: #409eff;
}

:deep(.el-step__title.is-finish) {
  color: #67c23a;
}
</style> 