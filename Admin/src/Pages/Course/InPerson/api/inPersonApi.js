import axiosInstance from "../../../../Utils/axiosInstance";
import { prepareSharedCoursePayload } from "../../shared/courseSharedApi";

export const IN_PERSON_ENDPOINT = "in-person-courses";

export async function fetchInPersonCourses(page = 1, query = "", filters = {}, limit = 12) {
  let filterParams = "";
  if (filters.category) filterParams += `&category=${encodeURIComponent(filters.category)}`;

  const response = await axiosInstance.get(
    `${IN_PERSON_ENDPOINT}?limit=${limit}&page=${page}&sort=-_id${
      query ? `&q=${encodeURIComponent(query)}` : ""
    }${filterParams}`
  );
  return response;
}

export async function fetchInPersonCourseById(id) {
  const response = await axiosInstance.get(`${IN_PERSON_ENDPOINT}/${id}`);
  return response;
}

export async function createInPersonCourse(payload) {
  const response = await axiosInstance.post(IN_PERSON_ENDPOINT, payload);
  return response;
}

export async function updateInPersonCourse(id, payload) {
  const response = await axiosInstance.patch(`${IN_PERSON_ENDPOINT}/${id}`, payload);
  return response;
}

export async function deleteInPersonCourse(id) {
  const response = await axiosInstance.delete(`${IN_PERSON_ENDPOINT}/${id}`);
  return response;
}

export async function toggleInPersonDiscountCode(courseId, codeId) {
  const response = await axiosInstance.patch(
    `${IN_PERSON_ENDPOINT}/${courseId}/discount-codes/${codeId}/toggle`
  );
  return response;
}

export async function prepareInPersonPayload(values, isUpdate = false) {
  const sharedPayload = await prepareSharedCoursePayload(values, axiosInstance, isUpdate);

  const payload = {
    ...sharedPayload,
    location: {
      address: values.location?.address || "",
      googleMapEmbedUrl: values.location?.googleMapEmbedUrl || "",
      neshanEmbedUrl: values.location?.neshanEmbedUrl || "",
      baladEmbedUrl: values.location?.baladEmbedUrl || "",
      mapEmbedUrl: values.location?.mapEmbedUrl || "",
    },
  };

  // Only attach initial sessions on create; session manager handles editing them
  if (!isUpdate && values.sessions && values.sessions.length > 0) {
    payload.sessions = values.sessions;
  }

  return payload;
}
