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
                    <el-option label="体育课" :value="1"></el-option>
                    <el-option label="通识选修课（公选课）" :value="2"></el-option>
                    <el-option label="公共课" :value="3"></el-option>
                    <el-option label="专业课程" :value="4"></el-option>
                    <el-option label="通识必修课（导引）" :value="5"></el-option>
                    <el-option label="任意" :value="0"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="个人需求描述" prop="userQuestion">
              <el-input
                type="textarea"
                v-model="formData.userQuestion"
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
          
            <!-- ✅ 1. 推荐课程展示 -->
            <el-row :gutter="20" v-if="recommendations.length > 0">
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

            <!-- ✅ 2. LLM Response Text 直接展示 -->
            <div v-if="llm_response_text" style="margin-top: 20px;">
            <el-card v-if="llm_response_text">
                <h3>LLM 思考过程：</h3>
                <div v-html="llm_response_html" style="white-space: normal;"></div>
            </el-card>
            </div>

            <!-- ✅ 3. 折叠区域：原始 LLM 输出和 RAG 检索结果 -->
            <div style="margin-top: 20px;">
            <el-collapse>
                <el-collapse-item title="🔍 调试信息（LLM 原始输出 + RAG 检索结果）" name="1">
                <el-card>
                    <h4>LLM 原始输出：</h4>
                    <pre style="white-space: pre-wrap;">{{ llm_output }}</pre>
                    <h4>RAG 检索结果：</h4>
                    <pre style="white-space: pre-wrap;">{{ JSON.stringify(rag_results, null, 2) }}</pre>
                </el-card>
                </el-collapse-item>
            </el-collapse>
            </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import MarkdownIt from 'markdown-it';
import { ArrowRight, Back } from '@element-plus/icons-vue'
import axios from 'axios'
const apiBaseUrl = process.env.VUE_APP_API_BASE_URL; 
axios.defaults.baseURL = apiBaseUrl;
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
        userQuestion: 0,
      },
      rules: {
        category: [
          { required: false, message: '请选择课程类别', trigger: 'change'}
        ],
        userQuestion: [
          { required: true, message: '请输入个人需求描述', trigger: 'blur' },
          { min: 0, max: 50, message: '描述长度在0到50个字符之间', trigger: 'blur' }
        ]
      },
      loading: false,
      recommendations: [],
      llm_output: "",
      llm_response_text: "",
      rag_results: [],
      md: new MarkdownIt(),
    };
  },
  computed: {
    llm_response_html() {
      return this.md.render(this.llm_response_text || '');
    }
  },
  methods: {
    async submitForm() {
      try {
        await this.$refs.formRef.validate();
        this.loading = true;

        try {
          // 构造请求数据，注意字段名匹配后端期望
          const requestData = {
            userQuestion: this.formData.userQuestion,
            catagory: this.formData.category  // 注意：后端期望的字段名是 catagory
          };

          // 调用8088端口的AI推荐API（独立于其他8082端口的功能）
          // 从localStorage获取设备指纹
          let deviceFingerprint = localStorage.getItem('deviceFingerprint');
          if (!deviceFingerprint) {
            // 如果没有设备指纹，报错
            throw new Error('你的设备风险高，无法使用AI推荐功能');
          }
          const response = await axios.post('/rag', requestData, {
            headers: {
              'Content-Type': 'application/json',
              'X-Device-Fingerprint': deviceFingerprint
            },
            timeout: 120000  // 120秒超时，因为AI处理可能需要更长时间
          });
          this.recommendations = response.data.data.recommendations;
        } catch (error) {
          console.error('获取AI推荐失败:', error);
          if (error.response) {
            console.error('错误状态码:', error.response.status);
            console.error('错误数据:', error.response.data);
          } else if (error.request) {
            console.error('请求已发送但没有收到响应');
          } else {
            console.error('错误信息:', error.message);
          }
          
          // 如果API调用失败，使用备用数据
          this.recommendations = [
            {
              course: '公共关系学',
              reason: '多个评价显示给分很好(95分), 开卷考试简单, 老师有趣且考勤灵活'
            },
            {
              course: '治水与社会发展',
              reason: '多个评价一致称赞给分好(90+), 老师优秀, 论文结课要求宽松'
            },
            {
              course: '电影艺术与大众文化',
              reason: '给分好(95分), 上课轻松有趣, 可看电影, 论文结课方式灵活'
            }
          ];
        }
        console.log('AI推荐结果:', this.recommendations);
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
    },
    getCookie(name) {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
      return match ? decodeURIComponent(match[2]) : null
    },
    decrementAIUsage() {
    const uses = parseInt(this.getCookie('ai_uses_left') || '0', 10)
    if (uses <= 0) {
      alert('本周使用次数已用完，请下周四后再试')
      return false
    }

    const newUses = uses - 1
    const expires = this.getNextThursdayDate()
    this.setCookie('ai_uses_left', newUses.toString(), expires)
    return true
  },
  getNextThursdayDate(){
        const now = new Date()
        const dayOfWeek = now.getDay() // 0=Sunday, ..., 6=Saturday
        const daysUntilThursday = (4 - dayOfWeek + 7) % 7 || 7 // 下一个周四
        const nextThursday = new Date(now)
        nextThursday.setDate(now.getDate() + daysUntilThursday)
        nextThursday.setHours(0, 0, 0, 0)
        return nextThursday
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