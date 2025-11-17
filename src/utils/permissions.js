/**
 * 与用户权限相关的工具方法
 * 集中管理 Cookie 与本地存储的 key，确保各组件使用一致
 */
import Cookies from 'js-cookie';

export const COURSE_COOKIE = 'courseEvaluationFilled';
export const SURVEY_COOKIE = 'surveyCompleted';
export const FINGERPRINT_COOKIE = 'fingerprint';
export const AI_USAGE_COOKIE = 'ai_uses_left';
export const DEVICE_FINGERPRINT_KEY = 'deviceFingerprint';

export const hasCompletedCourseEvaluation = () => Cookies.get(COURSE_COOKIE) === 'true';

export const hasCompletedSurvey = () => Cookies.get(SURVEY_COOKIE) === 'true';

export const markCourseEvaluationCompleted = (days = 200) =>
  Cookies.set(COURSE_COOKIE, 'true', { expires: days });

export const markSurveyCompleted = (days = 200) =>
  Cookies.set(SURVEY_COOKIE, 'true', { expires: days });

export const getNextThursdayDate = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilThursday = (4 - dayOfWeek + 7) % 7 || 7;
  const nextThursday = new Date(now);
  nextThursday.setDate(now.getDate() + daysUntilThursday);
  nextThursday.setHours(0, 0, 0, 0);
  return nextThursday;
};

export const setCookieUntilNextThursday = (name, value) => {
  Cookies.set(name, value, { expires: getNextThursdayDate(), sameSite: 'strict' });
};

export const persistFingerprint = fingerprint => {
  if (fingerprint) {
    localStorage.setItem(DEVICE_FINGERPRINT_KEY, fingerprint);
    setCookieUntilNextThursday(FINGERPRINT_COOKIE, fingerprint);
  }
};

export const setWeeklyAIQuota = (quota = 10) => {
  setCookieUntilNextThursday(AI_USAGE_COOKIE, String(quota));
};

export const decrementAIQuota = () => {
  const remaining = parseInt(Cookies.get(AI_USAGE_COOKIE) || '0', 10);
  if (remaining <= 0) {
    return false;
  }
  setWeeklyAIQuota(remaining - 1);
  return true;
};

export const getAIQuota = () =>
  parseInt(Cookies.get(AI_USAGE_COOKIE) || '0', 10);
