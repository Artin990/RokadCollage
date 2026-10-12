import { apiRequest } from "@/lib/api";

/**
 * خرید و ثبت‌نام در دوره با موجودی کیف پول یا ثبت‌نام مستقیم
 * @param {Object} payload { courseId, sessionId, couponCode }
 */
export async function purchaseCourse({ courseId, sessionId, couponCode }) {
  const res = await apiRequest("/enrollment/purchase", {
    method: "POST",
    body: JSON.stringify({ courseId, sessionId, couponCode }),
  });
  return res?.data || res;
}

/**
 * دریافت دوره‌های ثبت‌نام شده کاربر جاری (همراه با لایسنس اسپات پلیر)
 */
export async function getMyEnrollments() {
  const res = await apiRequest("/enrollment/my");
  return res?.data || res || [];
}

/**
 * تلاش مجدد برای صدور لایسنس اسپات پلیر
 * @param {string} enrollmentId شناسه ثبت‌نام
 */
export async function retrySpotPlayerLicense(enrollmentId) {
  const res = await apiRequest(`/enrollment/${enrollmentId}/retry-license`, {
    method: "POST",
  });
  return res?.data || res;
}
