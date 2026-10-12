import axiosInstance from "../../../Utils/axiosInstance";

/**
 * Fetch top-level comments for a specific virtual course.
 * Supports filtering by type ('review' | 'qa' | 'all'), search, pagination, and sorting.
 */
export const fetchCourseComments = async (courseId, params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", params.page);
  if (params.limit) queryParams.set("limit", params.limit);
  if (params.type && params.type !== "all") queryParams.set("type", params.type);
  if (params.sort) queryParams.set("sort", params.sort);
  if (params.search) queryParams.set("search", params.search);

  const qs = queryParams.toString();
  const endpoint = qs
    ? `virtual-courses/${courseId}/comments?${qs}`
    : `virtual-courses/${courseId}/comments`;
  return axiosInstance.get(endpoint);
};

/**
 * Fetch all comments across courses for Admin Dashboard.
 */
export const fetchAdminAllComments = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", params.page);
  if (params.limit) queryParams.set("limit", params.limit);
  if (params.courseId) queryParams.set("courseId", params.courseId);
  if (params.type && params.type !== "all") queryParams.set("type", params.type);
  if (params.search) queryParams.set("search", params.search);

  const qs = queryParams.toString();
  return axiosInstance.get(qs ? `course-comments/admin/all?${qs}` : `course-comments/admin/all`);
};

/**
 * Fetch nested replies for a specific parent comment.
 */
export const fetchCommentReplies = async (commentId) => {
  return axiosInstance.get(`course-comments/${commentId}/replies`);
};

/**
 * Create a new top-level comment (Admin or Student).
 */
export const createCourseComment = async (courseId, payload) => {
  return axiosInstance.post(`virtual-courses/${courseId}/comments`, payload);
};

/**
 * Reply directly to an existing comment.
 */
export const replyToCourseComment = async (commentId, payload) => {
  return axiosInstance.post(`course-comments/${commentId}/reply`, payload);
};

/**
 * Toggle YouTube-style Academy Heart on comment (Admin only).
 */
export const toggleAdminHeart = async (commentId) => {
  return axiosInstance.patch(`course-comments/${commentId}/heart`);
};

/**
 * Toggle Pin on comment (Admin only).
 */
export const togglePinComment = async (commentId) => {
  return axiosInstance.patch(`course-comments/${commentId}/pin`);
};

/**
 * Delete a comment and its nested replies (Admin or Author).
 */
export const deleteCourseComment = async (commentId) => {
  return axiosInstance.delete(`course-comments/${commentId}`);
};
