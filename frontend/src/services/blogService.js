import { apiRequest } from "@/lib/api";

/**
 * دریافت لیست مقالات وبلاگ (صفحه‌بندی، دسته‌بندی و جستجو)
 */
export async function getBlogs(params = {}) {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page);
  if (params.limit) query.append("limit", params.limit);
  if (params.category && params.category !== "all") query.append("category", params.category);
  if (params.search) query.append("search", params.search);

  const qs = query.toString();
  const endpoint = `/blogs${qs ? `?${qs}` : ""}`;
  const res = await apiRequest(endpoint);
  return res?.data || res || [];
}

/**
 * دریافت یک مقاله بر اساس شناسه یا اسلاگ
 */
export async function getBlogById(id) {
  const res = await apiRequest(`/blogs/${id}`);
  return res?.data || res;
}
