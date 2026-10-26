import axiosInstance from "../../../../Utils/axiosInstance";
import { prepareSharedCoursePayload } from "../../api/courseSharedApi";

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
    courseType: values.courseType || "دوره حضوری",
    approximateSessions: values.approximateSessions || "",
    totalHours: values.totalHours || "",
    scheduleDays: values.scheduleDays || "",
    tuitionPerPerson: values.tuitionPerPerson ? Number(values.tuitionPerPerson) : (values.price ? Number(values.price) : 0),
    proposedTeacher: values.proposedTeacher || "",
    approximateStartDate: values.approximateStartDate || "",
    approximateEndDate: values.approximateEndDate || "",
    joujmanEvent: values.joujmanEvent || {
      title: "رویداد پایانی و ژوژمان",
      description: "در انتهای هر دوره، یک جلسه رسمی پروژه‌های نوجوانان با دعوت رسمی از والدین و ۲ الی ۳ نفر از اساتید متخصص در این حوزه برگزار می‌شود که باعث افزایش اعتماد اولیاء، ارزیابی دقیق فنی، سنجش برای جذب در استودیو رکاد و ایجاد حس افتخار و انگیزه در نوجوانان می‌شود.",
      isActive: true,
    },
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

export async function fetchCourseSessions(courseId) {
  return axiosInstance.get(`${IN_PERSON_ENDPOINT}/${courseId}/sessions`);
}

export async function createCourseSession(courseId, payload) {
  return axiosInstance.post(`${IN_PERSON_ENDPOINT}/${courseId}/sessions`, payload);
}

export async function updateCourseSession(courseId, sessionId, payload) {
  return axiosInstance.patch(`${IN_PERSON_ENDPOINT}/${courseId}/sessions/${sessionId}`, payload);
}

export async function deleteCourseSession(courseId, sessionId) {
  return axiosInstance.delete(`${IN_PERSON_ENDPOINT}/${courseId}/sessions/${sessionId}`);
}
