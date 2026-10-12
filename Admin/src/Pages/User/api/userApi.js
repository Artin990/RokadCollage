import axiosInstance from "../../../Utils/axiosInstance";

export const fetchUsers = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", params.page);
  if (params.limit) queryParams.set("limit", params.limit);
  if (params.sort) queryParams.set("sort", params.sort);
  if (params.q) queryParams.set("q", params.q);
  if (params.role) queryParams.set("role", params.role);

  const qs = queryParams.toString();
  return axiosInstance.get(qs ? `user?${qs}` : "user");
};

export const fetchUserById = async (id) => {
  return axiosInstance.get(`user/${id}`);
};

export const createUser = async (payload) => {
  return axiosInstance.post("user", payload);
};

export const updateUser = async (id, payload) => {
  return axiosInstance.patch(`user/${id}`, payload);
};

export const deleteUser = async (id) => {
  return axiosInstance.delete(`user/${id}`);
};
