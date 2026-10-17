export const MOCK_STATIC_ENROLLMENTS = [
  {
    "_id": "en-1",
    "id": 1,
    "course": {
      "_id": "c-1",
      "id": 1,
      "slug": "figma-ui-design",
      "title": "طراحی رابط کاربری با فیگما",
      "instructor": "نیلوفر رستمی",
      "duration": "۴۲ ساعت",
      "isOnline": true,
      "category": "فناوری اطلاعات"
    },
    "courseId": "c-1",
    "spotPlayerLicense": {
      "key": "SPOT-ROKAD-9921-X48A-8812",
      "url": "https://app.spotplayer.ir"
    },
    "progress": 45,
    "enrolledAt": "2025-07-20T12:00:00Z"
  },
  {
    "_id": "en-2",
    "id": 2,
    "course": {
      "_id": "c-2",
      "id": 2,
      "slug": "react-nextjs",
      "title": "برنامه‌نویسی وب با React و Next.js",
      "instructor": "مهندس آرش تهرانی",
      "duration": "۶۰ ساعت",
      "isOnline": false,
      "isBootcamp": true,
      "category": "فناوری اطلاعات"
    },
    "courseId": "c-2",
    "progress": 80,
    "enrolledAt": "2025-06-15T12:00:00Z"
  }
];
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
  const list = res?.data || res;
  return (Array.isArray(list) && list.length > 0) ? list : MOCK_STATIC_ENROLLMENTS;
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

/**
 * درخواست خرید دوره از طریق درگاه پرداخت آنلاین زرین‌پال یا ثبت‌نام مستقیم
 * @param {Object} payload { courseId, sessionId, couponCode }
 */
export async function checkoutCourse({ courseId, sessionId, couponCode, callbackUrl }) {
  const res = await apiRequest("/payment/checkout-request", {
    method: "POST",
    body: { courseId, sessionId, couponCode, callbackUrl },
  });
  return res;
}

/**
 * اعتبارسنجی تراکنش بازگشتی از زرین‌پال و صدور لایسنس اسپات‌پلیر
 * @param {Object} payload { authority, status, courseId }
 */
export async function verifyCheckout({ authority, status, courseId }) {
  const res = await apiRequest("/payment/checkout-verify", {
    method: "POST",
    body: { authority, status, courseId },
  });
  return res;
}

export async function getCourseLicense(courseId) {
  try {
    const res = await apiRequest(`/payment/license/${courseId}`);
    const isEnrolled = Boolean(
      res?.isEnrolled === true ||
      res?.data?.isEnrolled === true ||
      Boolean(res?.data && res?.data?._id)
    );
    const enrollmentData = res?.data?._id ? res.data : (res?.data || res);
    const spotplayerData = res?.spotplayer || res?.data?.spotplayer || null;

    return {
      success: res?.success ?? true,
      isEnrolled,
      data: enrollmentData,
      spotplayer: spotplayerData,
    };
  } catch (err) {
    return {
      success: false,
      isEnrolled: false,
      error: err?.message,
    };
  }
}
