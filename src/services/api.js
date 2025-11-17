/**
 * 统一管理所有 API 请求
 * 使用 axios 实例集中配置 baseURL / headers / 拦截器，避免在各个组件中重复配置
 */
import axios from 'axios';

const apiBaseUrl = process.env.VUE_APP_API_BASE_URL;

const client = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 120000
});

client.interceptors.response.use(
  response => response,
  error => {
    const normalizedError = error.response?.data?.message || error.message || '未知错误';
    console.error('[API ERROR]', normalizedError, error.response || '');
    return Promise.reject(error);
  }
);

export const fetchStatistics = () => client.get('/statistic').then(res => res.data);

export const searchCourses = params =>
  client.get('/search', { params }).then(res => res.data);

export const submitCourseEvaluation = data =>
  client.post('/add_course', data).then(res => res.data);

export const submitSurvey = data =>
  client.post('/submit_survey', data).then(res => res.data);

export const submitCoursePromotion = data =>
  client.post('/course_promotion', data).then(res => res.data);

export const fetchCoursePromotions = params =>
  client.get('/course_promotion', { params }).then(res => res.data);

export const requestAIRAGRecommendation = (data, fingerprint) =>
  client.post('/rag', data, {
    headers: {
      'X-Device-Fingerprint': fingerprint
    }
  }).then(res => res.data);

export default client;
