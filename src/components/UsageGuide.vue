<template>
  <el-card class="usage-guide-card" shadow="hover">
    <div class="guide-header">
      <div>
        <h3>使用向导</h3>
        <p class="subtitle">按照下方步骤操作，可快速解锁所有功能</p>
      </div>
      <el-tag :type="statusTagType" size="large">
        {{ statusText }}
      </el-tag>
    </div>

    <el-timeline>
      <el-timeline-item
        v-for="(step, index) in steps"
        :key="index"
        :type="step.type"
        :timestamp="step.tip"
      >
        <h4>{{ step.title }}</h4>
        <p>{{ step.description }}</p>
      </el-timeline-item>
    </el-timeline>

    <el-divider>快捷操作</el-divider>
    <el-space wrap>
      <el-button
        v-for="action in quickActions"
        :key="action.page"
        :type="action.type"
        @click="handleActionClick(action)"
        round
      >
        {{ action.label }}
      </el-button>
    </el-space>

    <el-divider>扩展阅读</el-divider>
    <div class="resource-links">
      <el-link
        v-for="link in resourceLinks"
        :key="link.href"
        :href="link.href"
        target="_blank"
        type="primary"
      >
        {{ link.label }}
      </el-link>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'UsageGuide',
  props: {
    courseEvaluationFilled: {
      type: Boolean,
      default: false
    },
    surveyCompleted: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      steps: [
        {
          title: '贡献课程评价 / 完成新生问卷',
          description: '提交一门真实课程的详细评价，或在新生专区完成问卷，即可获得查询权限。',
          type: 'success',
          tip: '约 5-10 分钟'
        },
        {
          title: '使用 AI 辅助推荐',
          description: '在 AI 辅助推荐模块输入需求，系统会结合真实评价给出 3 门课程建议，每周有 10 次机会。',
          type: 'warning',
          tip: '智能推荐'
        },
        {
          title: '浏览推广课程',
          description: '查看老师和同学整理的课程推广信息，快速洞察课程亮点与适宜人群。',
          type: 'info',
          tip: '拓展选择'
        }
      ],
      quickActions: [
        { label: '快速添加评价', page: 'add', type: 'primary' },
        { label: '去新生专区', page: 'freshmen', type: 'success' },
        { label: 'AI 推荐', page: 'airag', type: 'warning' },
        { label: '查看推广课程', page: 'promoted-courses', type: 'info' }
      ],
      resourceLinks: [
        { label: '武汉大学本科生院', href: 'https://ugs.whu.edu.cn/' },
        { label: '选课经验分享（知乎）', href: 'https://www.zhihu.com/topic/19555918/hot' },
        { label: '新生指南 | WHU课程介绍', href: 'http://mp.weixin.qq.com/s?__biz=MzIxNTA4MTIzMw==&mid=2247507410&idx=1&sn=67afe67d69a28279df03fcc08980f7ff&chksm=96fff8213ea26f81f9a44b7c6226735accd4d26cbf917036fea3d200f5d3501c2376d5515577&mpshare=1&scene=23&srcid=0902gkQuW5nqZfTpTqHv521A&sharer_shareinfo=536941fc51b1bf681c3eca9bb898e050&sharer_shareinfo_first=536941fc51b1bf681c3eca9bb898e050#rd' }
      ]
    };
  },
  computed: {
    hasAccess() {
      return this.courseEvaluationFilled || this.surveyCompleted;
    },
    statusText() {
      return this.hasAccess ? '已解锁查询权限' : '待完成验证';
    },
    statusTagType() {
      return this.hasAccess ? 'success' : 'warning';
    }
  },
  methods: {
    handleActionClick(action) {
      this.$emit('navigate', action.page);
    }
  }
};
</script>

<style scoped>
.usage-guide-card {
  margin-bottom: 30px;
  border-radius: 16px;
  border: none;
  background: linear-gradient(135deg, #f8fbff 0%, #eef9f1 100%);
}
.guide-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.subtitle {
  margin: 0;
  color: #6c757d;
}
.resource-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
@media (max-width: 768px) {
  .guide-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
