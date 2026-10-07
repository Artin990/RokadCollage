import axiosInstance from "../../../Utils/axiosInstance";

export const fetchAllWallets = async () => {
  return axiosInstance.get("wallet/all");
};

export const fetchAllTransactions = async () => {
  return axiosInstance.get("wallet/transactions/all");
};
