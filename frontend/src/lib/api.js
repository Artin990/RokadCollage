function getApiBaseUrl() {
  if (typeof window === "undefined") {
    return process.env.INTERNAL_API_URL || process.env.API_URL || "http://backend:5000/api";
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
}

/**
 * Universal API fetch wrapper with cookie credentials and unified JSON handling
 */
export async function apiRequest(endpoint, options = {}) {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("rokad_token");
    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
    credentials: "include", // send/receive HttpOnly JWT cookies
  };

  if (config.body && typeof config.body === "object" && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  // If using FormData, let the browser set Content-Type multipart boundary
  if (config.body instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  try {
    const res = await fetch(url, config);
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = data?.message || data?.error || `خطا در برقراری ارتباط (${res.status})`;
      const err = new Error(errorMsg);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (err) {
    if (!err.status || err.status >= 500) {
      console.error(`API Error on [${options.method || "GET"} ${endpoint}]:`, err.message);
    } else {
      console.warn(`API client error [${err.status} on ${options.method || "GET"} ${endpoint}]:`, err.message);
    }
    throw err;
  }
}
