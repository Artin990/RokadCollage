import axiosInstance from "../../../Utils/axiosInstance";

export const fetchComments = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set("limit", params.limit);
  if (params.page) queryParams.set("page", params.page);
  if (params.sort) queryParams.set("sort", params.sort);
  if (params.q) queryParams.set("q", params.q);

  const qs = queryParams.toString();
  return axiosInstance.get(qs ? `comment?${qs}` : "comment");
};

export const fetchCommentById = async (id) => {
  return axiosInstance.get(`comment/${id}`);
};

export const createComment = async (payload) => {
  return axiosInstance.post("comment", payload);
};

export const updateComment = async (id, payload) => {
  return axiosInstance.patch(`comment/${id}`, payload);
};

export const deleteComment = async (id) => {
  return axiosInstance.delete(`comment/${id}`);
};

export const fetchCommentCourses = async () => {
  try {
    const [inPersonRes, virtualRes] = await Promise.all([
      axiosInstance.get("in-person-courses?limit=100&fields=title,category").catch(() => []),
      axiosInstance.get("virtual-courses?limit=100&fields=title,category").catch(() => []),
    ]);

    const extractList = (res, defaultModel) => {
      const raw = Array.isArray(res)
        ? res
        : res?.data
        ? Array.isArray(res.data)
          ? res.data
          : res.data?.data || []
        : [];
      return raw.map((item) => ({
        ...item,
        courseModel: defaultModel,
        displayType: defaultModel === "VirtualCourse" ? "مجازی" : "حضوری",
      }));
    };

    const inPerson = extractList(inPersonRes, "InPersonCourse");
    const virtual = extractList(virtualRes, "VirtualCourse");
    return [...inPerson, ...virtual];
  } catch (err) {
    return [];
  }
};
