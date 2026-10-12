import axiosInstance from "../../../Utils/axiosInstance";

export const fetchInPersonEnrollments = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", params.page);
  if (params.limit) queryParams.set("limit", params.limit);
  if (params.q) queryParams.set("q", params.q);
  if (params.category) queryParams.set("category", params.category);

  const qs = queryParams.toString();
  return axiosInstance.get(qs ? `in-person-courses?${qs}` : "in-person-courses");
};

export const fetchVirtualEnrollments = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", params.page);
  if (params.limit) queryParams.set("limit", params.limit);
  if (params.q) queryParams.set("q", params.q);
  if (params.category) queryParams.set("category", params.category);

  const qs = queryParams.toString();
  return axiosInstance.get(qs ? `virtual-courses?${qs}` : "virtual-courses");
};

export const fetchEnrollmentById = async (id) => {
  return axiosInstance.get(`enrollment/${id}`);
};

export const fetchEnrolledStudents = async (query = "") => {
  return axiosInstance.get(`enrollment/all?${query}`);
};

export const retrySpotPlayerLicense = async (enrollmentId) => {
  return axiosInstance.post(`enrollment/${enrollmentId}/retry-license`);
};

export const manualEnrollInPerson = async (courseId, sessionId, userId) => {
  return axiosInstance.post(
    `in-person-courses/${courseId}/sessions/${sessionId}/enrollments`,
    { userId }
  );
};

export const manualEnrollVirtual = async (courseId, userId) => {
  return axiosInstance.post(
    `virtual-courses/${courseId}/enrollments`,
    { userId }
  );
};

export const cancelEnrollment = async (enrollmentId) => {
  return axiosInstance.delete(`enrollment/${enrollmentId}`);
};
