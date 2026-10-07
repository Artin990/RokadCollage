import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/",
});

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
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.message ||
      "خطا در برقراری ارتباط با سرور";

    // Handle 401 Unauthorized: clear token and redirect to login
    if (status === 401) {
      localStorage.removeItem("token");
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth")) {
        window.location.href = "/auth";
      }
    }

    const customError = new Error(message);
    customError.status = status;
    customError.response = error.response;
    customError.data = error.response?.data;
    return Promise.reject(customError);
  }
);

export default axiosInstance;
