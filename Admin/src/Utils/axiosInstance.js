import axios from "axios";

/**
 * Google-Grade Axios Client
 * - Explicit 15s timeout
 * - Request cancellation resilience
 * - Automatic JWT bearer header injection
 * - Comprehensive Persian error message normalizer
 * - 401 Unauthorized automated token eviction & auth redirect
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/",
  timeout: 15000, // 15 seconds
  headers: {
    "Accept": "application/json",
  },
});

// Helper to normalize any API error into a friendly Persian message
export function normalizeApiError(error) {
  if (axios.isCancel(error)) {
    return "درخواست لغو شد.";
  }

  if (error.code === "ECONNABORTED" || (error.message && error.message.includes("timeout"))) {
    return "مهلت زمان برقراری ارتباط با سرور به پایان رسید (Timeout). لطفاً اتصال اینترنت خود را بررسی نمایید.";
  }

  if (error.message === "Network Error" || !error.response) {
    return "ارتباط با سرور برقرار نشد. لطفاً وضعیت اتصال اینترنت را بررسی کنید.";
  }

  const status = error.response.status;
  const data = error.response.data;

  // If backend returns a direct message string
  if (typeof data?.message === "string" && data.message.trim()) {
    return data.message;
  }

  // If backend returns a list of validation errors
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.map((e) => (typeof e === "string" ? e : e.message || e.msg)).filter(Boolean).join(" - ");
  }

  if (data?.errors && typeof data.errors === "object") {
    const msgs = Object.values(data.errors).flat().filter(Boolean);
    if (msgs.length > 0) return msgs.join(" - ");
  }

  // HTTP Status Fallbacks
  switch (status) {
    case 400:
      return "اطلاعات ارسال‌شده نامعتبر است.";
    case 401:
      return "نشست کاربری شما منقضی شده است. لطفاً مجدداً وارد شوید.";
    case 403:
      return "شما دسترسی لازم برای انجام این عملیات را ندارید.";
    case 404:
      return "اطلاعات یا آدرس مورد نظر در سرور یافت نشد.";
    case 409:
      return "این رکورد از قبل ثبت شده است یا تداخل دارد.";
    case 422:
      return "اعتبارسنجی مقادیر فرم با خطا مواجه شد.";
    case 429:
      return "تعداد درخواست‌های ارسالی بیش از حد مجاز است. لطفاً کمی صبر کنید.";
    case 500:
    case 502:
    case 503:
    case 504:
      return "خطایی در سمت سرور رخ داده است. لطفاً دقایقی دیگر مجدداً تلاش فرمایید.";
    default:
      return error.message || "خطا در پردازش درخواست.";
  }
}

// Request Interceptor: Attach JWT Bearer token and enforce 5MB file upload limit
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Client-side protection: Prevent uploading any file exceeding 5MB
    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      for (const value of config.data.values()) {
        if (value instanceof File && value.size > MAX_FILE_SIZE) {
          const error = new Error("حجم فایل ارسالی بیش از ۵ مگابایت است (حداکثر حجم مجاز: ۵ مگابایت)");
          return Promise.reject(error);
        }
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Unwrap response data and format uniform error messages with 401/403 guard
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const friendlyMessage = normalizeApiError(error);

    // Handle 401 Unauthorized: clear token and redirect to login
    if (status === 401) {
      localStorage.removeItem("token");
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth")) {
        window.location.href = "/auth";
      }
    }

    const customError = new Error(friendlyMessage);
    customError.status = status;
    customError.response = error.response;
    customError.data = error.response?.data;
    customError.isAxiosError = true;
    return Promise.reject(customError);
  }
);

export default axiosInstance;
