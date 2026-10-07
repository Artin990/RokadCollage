import axiosInstance from "../../../../Utils/axiosInstance";
import { prepareSharedCoursePayload } from "../../shared/courseSharedApi";

export const VIRTUAL_ENDPOINT = "virtual-courses";

export async function fetchVirtualCourses(page = 1, query = "", filters = {}, limit = 12) {
  let filterParams = "";
  if (filters.category) filterParams += `&category=${encodeURIComponent(filters.category)}`;

  const response = await axiosInstance.get(
    `${VIRTUAL_ENDPOINT}?limit=${limit}&page=${page}&sort=-_id${
      query ? `&q=${encodeURIComponent(query)}` : ""
    }${filterParams}`
  );
  return response;
}

export async function fetchVirtualCourseById(id) {
  const response = await axiosInstance.get(`${VIRTUAL_ENDPOINT}/${id}`);
  return response;
}

export async function createVirtualCourse(payload) {
  const response = await axiosInstance.post(VIRTUAL_ENDPOINT, payload);
  return response;
}

export async function updateVirtualCourse(id, payload) {
  const response = await axiosInstance.patch(`${VIRTUAL_ENDPOINT}/${id}`, payload);
  return response;
}

export async function deleteVirtualCourse(id) {
  const response = await axiosInstance.delete(`${VIRTUAL_ENDPOINT}/${id}`);
  return response;
}

export async function toggleVirtualDiscountCode(courseId, codeId) {
  const response = await axiosInstance.patch(
    `${VIRTUAL_ENDPOINT}/${courseId}/discount-codes/${codeId}/toggle`
  );
  return response;
}

export async function prepareVirtualPayload(values, isUpdate = false) {
  const sharedPayload = await prepareSharedCoursePayload(values, axiosInstance, isUpdate);

  return {
    ...sharedPayload,
    spotplayerCourseId: values.spotplayerCourseId ? values.spotplayerCourseId.trim() : "",
  };
}
