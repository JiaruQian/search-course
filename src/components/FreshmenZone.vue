<template>
  <el-container class="freshmen-zone">
    <el-main>
      <el-steps :active="activeStep" align-center finish-status="success" class="steps-container">
        <el-step title="网站介绍"></el-step>
        <el-step title="填写问卷"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-row justify="center" v-if="activeStep === 0">
        <el-col :span="12" :xs="20" :sm="18" :md="14" :lg="12" :xl="10">
          <el-card class="intro-section card-modern">
            <h3>这个网站的功能的什么？</h3>
            <p>网站收集了同学们对各类课程的评价。在这里，你可以查询各类课程的评价，并贡献自己对某门课程的评价。</p>
          </el-card>
          <el-card class="intro-section card-modern">
            <h3>如何查询课程评价？</h3>
            <p>您需要认真、负责地填写任意一门您已修课程的评价，然后就可以查询网站的所有课程评价数据。</p>
          </el-card>

          <el-card class="intro-section card-modern">
            <h3>什么是新生专区</h3>
            <p>考虑到新生并未修习过大学课程，您只需要完成调查问卷后，就可以查询网站的所有课程评价数据。</p>
          </el-card>

          <el-button type="primary" @click="nextStep" round size="large" class="next-button">
            下一步
            <i class="el-icon-arrow-right"></i>
          </el-button>
        </el-col>
      </el-row>

      <el-row justify="center" v-if="activeStep === 1">
        <el-col :span="12" :xs="20" :sm="18" :md="14" :lg="12" :xl="10">
          <el-card class="survey-section card-modern">
            <h3>调查问卷</h3>

            <el-form
              :model="surveyData"
              :rules="rules"
              ref="surveyForm"
              @submit.prevent="submitSurvey"
              label-position="top"
              class="survey-form"
            >
              <el-form-item label="您是否已经了解过大学的选课体系" prop="curricula" required>
                <el-select v-model="surveyData.curricula" placeholder="请选择">
                  <el-option label="是" :value="true"></el-option>
                  <el-option label="否" :value="false"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="您认为老师的教学水准和给分好坏哪个更重要" prop="accept" required>
                <el-select v-model="surveyData.accept" placeholder="请选择">
                  <el-option label="教学水准更重要" :value="'教学'"></el-option>
                  <el-option label="给分好坏更重要" :value="'给分'"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="你对大学课程的期待如何" prop="expectation" required>
                <el-rate v-model="surveyData.expectation" :allow-half="true" clearable :max="10"/>
              </el-form-item>
              <el-form-item label="您希望学生社区能为选课带来怎样的帮助">
                <el-input
                  type="textarea"
                  v-model="surveyData.suggestions"
                  rows="4"
                  placeholder="请输入您的建议..."
                ></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="submitSurvey" round size="large" class="submit-button">
                  提交问卷
                  <i class="el-icon-check"></i>
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>

      <el-row justify="center" v-if="activeStep === 2">
        <el-col :span="12" :xs="20" :sm="18" :md="14" :lg="12" :xl="10">
          <el-card class="completion-section card-modern">
            <h3>问卷提交成功！</h3>
            <p>感谢您的参与，您的反馈对我们非常重要。您现在可以转到查课界面。</p>

            <el-button type="primary" @click="goToCourseSearch" round size="large" class="search-button">
              转到查课界面
              <i class="el-icon-search"></i>
            </el-button>
          </el-card>
          <el-card class="completion-section card-modern">
  <h3>关于大学课程</h3>
  <p>
    一般来说，大一的新生所修习最多的是公共基础课程，这其中包括
    "高等数学"、"线性代数"等理工科学生的数学基础课程，
    又包括"素质体育"、"大学英语"、"思想道德与法治"、"军事理论与训练"等全校必修课程。
  </p>
  <p>更多的课程信息介绍可以参考以下链接：</p>

  <el-row :gutter="20">
    <el-col :span="12">
      <a href="http://mp.weixin.qq.com/s?__biz=MzIxNTA4MTIzMw==&mid=2247507410&idx=1&sn=67afe67d69a28279df03fcc08980f7ff&chksm=96fff8213ea26f81f9a44b7c6226735accd4d26cbf917036fea3d200f5d3501c2376d5515577&mpshare=1&scene=23&srcid=0902gkQuW5nqZfTpTqHv521A&sharer_shareinfo=536941fc51b1bf681c3eca9bb898e050&sharer_shareinfo_first=536941fc51b1bf681c3eca9bb898e050#rd" target="_blank" class="custom-link">小淘的新生指南02 | WHU课程介绍</a>
    </el-col>
    <el-col :span="12">
      <a href="http://mp.weixin.qq.com/s?__biz=MzIxNTA4MTIzMw==&mid=2247507587&idx=1&sn=da52d1aed17d2a78725abce9551522c3&chksm=9650a98f0625b910396e1bf613aac151f678e373f7079b275c8d8065dc7434e6049eaf96315d&mpshare=1&scene=23&srcid=09021T4G5Z9EOf1KdYtwn1Ih&sharer_shareinfo=8cc429f2bbd0d54dd6390643d137fd2f&sharer_shareinfo_first=8cc429f2bbd0d54dd6390643d137fd2f#rd" target="_blank" class="custom-link">小淘的新生指南03 | WHU选课系统</a>
    </el-col>
  </el-row>
</el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
// import axios from 'axios';
import Cookies from 'js-cookie';

export default {
  name: 'FreshmenZone',
  data() {
    return {
      activeStep: 0,
      surveyData: {
        curricula: null,
        accept: null, 
        suggestions: '',
        expectation: 0
      },
      rules: {
        curricula: [
          { required: true, message: '请进行选择', trigger: 'change' }
        ],
        accept: [
          { required: true, message: '请进行选择', trigger: 'change' }
        ],
        expectation: [
          { type: 'number', required: true, message: '请对您的期待进行评分', trigger: 'change' },
          { validator: (rule, value, callback) => {
              if (value < 1 || value > 10) {
                callback(new Error('评分范围为1到10'));
              } else {
                callback();
              }
            }, trigger: 'change'
          }
        ]
      }
    };
  },
  methods: {
    nextStep() {
      this.activeStep += 1;
    },
    async submitSurvey() {
      this.$refs.surveyForm.validate(async (valid) => {
        if (valid) {
          try {
            // 模拟API延迟
            await new Promise(resolve => setTimeout(resolve, 500));
            Cookies.set('surveyCompleted', 'true', { expires: 200 });
            this.nextStep();
          } catch (error) {
            console.error('提交问卷时出错:', error);
            this.$message.error('提交问卷时出错，请稍后再试。');
          }
        } else {
          console.log('表单验证失败');
          return false;
        }
      });
    },
    goToCourseSearch() {
      window.location.href = '/';
    }
  }
};
</script>

<style scoped>
.freshmen-zone {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.steps-container {
  margin-bottom: 30px;
}

.el-step__title.is-process {
  color: #3498db;
}

.el-step__title.is-finish {
  color: #2ecc71;
}

.intro-section, .survey-section, .completion-section {
  margin-bottom: 20px;
  background-color: #ffffff;
}

.card-modern {
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  padding: 20px;
  transition: all 0.3s ease;
}

.card-modern:hover {
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
  transform: translateY(-3px);
}

.survey-form {
  margin-top: 23px;
}

.next-button, .submit-button, .search-button {
  width: 100%;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.next-button {
  background-color: #3498db;
  border-color: #3498db;
}

.next-button:hover {
  background-color: #2980b9;
  border-color: #2980b9;
}

.submit-button {
  background-color: #e67e22;
  border-color: #e67e22;
}

.submit-button:hover {
  background-color: #d35400;
  border-color: #d35400;
}

.search-button {
  background-color: #2ecc71;
  border-color: #2ecc71;
}

.search-button:hover {
  background-color: #27ae60;
  border-color: #27ae60;
}

h3 {
  margin-top: 0;
  color: #333;
  font-weight: bold;
  text-align: center;
}

.el-card {
  padding: 20px;
}

.rating-form {
  max-width: 300px;
  margin: 0 auto;
}

.el-rate__text {
  margin-left: 10px;
  font-size: 14px;
  color: #e67e22; /* 修改评分文字颜色以匹配按钮样式 */
}

.el-rate .el-rate__icon {
  font-size: 24px; /* 调整星星的大小 */
  color: #e67e22; /* 星星的颜色 */
}

.el-rate .el-rate__icon.is-half {
  color: #f39c12; /* 半星的颜色略浅 */
}
</style>
