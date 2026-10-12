import axiosInstance from "../../../Utils/axiosInstance";

export const fetchAllWallets = async () => {
  return axiosInstance.get("wallet/all");
};

export const fetchAllTransactions = async () => {
  return axiosInstance.get("wallet/transactions/all?sort=-createdAt,-_id");
};

export const fetchUserWallet = async (userId) => {
  if (!userId) return null;
  return axiosInstance.get(`wallet/user/${userId}`).catch(async () => {
    return axiosInstance.get(`wallet/all?ownerId=${userId}`);
  });
};
