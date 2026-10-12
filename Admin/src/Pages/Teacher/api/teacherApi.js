import axiosInstance from "../../../Utils/axiosInstance";

export const fetchTeachers = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", params.page);
  if (params.limit) queryParams.set("limit", params.limit);
  if (params.sort) queryParams.set("sort", params.sort);
  if (params.q) queryParams.set("q", params.q);

  const qs = queryParams.toString();
  return axiosInstance.get(qs ? `teacher?${qs}` : "teacher");
};

export const fetchTeacherById = async (id) => {
  return axiosInstance.get(`teacher/${id}`);
};

export const createTeacher = async (payload) => {
  return axiosInstance.post("teacher", payload);
};

export const updateTeacher = async (id, payload) => {
  return axiosInstance.patch(`teacher/${id}`, payload);
};

export const deleteTeacher = async (id) => {
  return axiosInstance.delete(`teacher/${id}`);
};

export const uploadTeacherPhoto = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await axiosInstance.post("upload", formData);
  if (!res || !res.success) {
    throw new Error(res?.message || "آپلود تصویر استاد با خطا مواجه شد");
  }
  return res.data?.fileName || res.data?.url || res.data;
};
