import axiosInstance from "../../../../Utils/axiosInstance";
import { prepareSharedCoursePayload } from "../../api/courseSharedApi";

export const VIRTUAL_ENDPOINT = "virtual-courses";

export async function fetchVirtualCourses(page = 1, query = "", filters = {}, limit = 12) {
  let p = page;
  let q = query;
  let f = filters;
  let l = limit;

  // Support single options object: fetchVirtualCourses({ page, query, filters, limit })
  if (typeof page === "object" && page !== null) {
    p = page.page || 1;
    q = page.query || page.q || "";
    f = page.filters || {};
    l = page.limit || 12;
  }

  let filterParams = "";
  if (f && f.category) filterParams += `&category=${encodeURIComponent(f.category)}`;

  const response = await axiosInstance.get(
    `${VIRTUAL_ENDPOINT}?limit=${l}&page=${p}&sort=-_id${
      q ? `&q=${encodeURIComponent(q)}` : ""
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
