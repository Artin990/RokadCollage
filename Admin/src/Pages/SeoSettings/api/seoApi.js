import axiosInstance from "../../../Utils/axiosInstance";

export const fetchSeo = async () => {
  return axiosInstance.get("seo");
};

export const updateSeo = async (payload) => {
  return axiosInstance.patch("seo", payload);
};
