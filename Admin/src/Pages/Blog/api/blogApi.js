import axiosInstance from "../../../Utils/axiosInstance";

/**
 * Fetch paginated list of blog articles (content excluded by default).
 * @param {Object} params - Query parameters (page, limit, q, category, sort)
 * @returns {Promise<Object>}
 */
export const fetchBlogs = async (params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.set("page", params.page);
  if (params.limit) queryParams.set("limit", params.limit);
  if (params.sort) queryParams.set("sort", params.sort);
  if (params.q) queryParams.set("q", params.q);
  if (params.category) queryParams.set("category", params.category);

  const queryString = queryParams.toString();
  const url = queryString ? `blog?${queryString}` : "blog";
  return axiosInstance.get(url);
};

/**
 * Fetch a single blog article by ID (includes sanitized HTML content).
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const fetchBlogById = async (id) => {
  return axiosInstance.get(`blog/${id}`);
};

/**
 * Upload cover image file to public CDN/storage.
 * @param {File} file
 * @returns {Promise<string>} Uploaded filename
 */
export const uploadBlogCover = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post("upload", formData);
  if (!response || !response.success) {
    throw new Error(response?.message || "آپلود تصویر کاور با خطا مواجه شد");
  }
  return response.data;
};

/**
 * Create a new blog article.
 * @param {Object} payload - { category, title, description, content, img }
 * @returns {Promise<Object>}
 */
export const createBlog = async (payload) => {
  return axiosInstance.post("blog", payload);
};

/**
 * Update an existing blog article.
 * @param {string} id
 * @param {Object} payload - { category, title, description, content, img }
 * @returns {Promise<Object>}
 */
export const updateBlog = async (id, payload) => {
  return axiosInstance.patch(`blog/${id}`, payload);
};

/**
 * Delete a blog article.
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const deleteBlog = async (id) => {
  return axiosInstance.delete(`blog/${id}`);
};
