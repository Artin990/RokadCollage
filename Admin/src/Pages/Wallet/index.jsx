import React, { useState, useEffect } from "react";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import Loading from "../../Components/Loading";
import Notify from "../../Utils/notify";
import { PageHeader } from "../../Components/UI";
import { fetchAllWallets, fetchAllTransactions } from "./api/walletApi";
import WalletsTable from "./components/WalletsTable";
import TransactionsTable from "./components/TransactionsTable";

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState("wallets");
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (activeTab === "wallets") {
          const res = await fetchAllWallets();
          const list = Array.isArray(res) ? res : res?.data || [];
          setWallets(list);
        } else {
          const res = await fetchAllTransactions();
          const list = Array.isArray(res) ? res : res?.data || [];
          setTransactions(list);
        }
      } catch (err) {
        Notify.error(err.message || "خطا در دریافت اطلاعات مالی");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTab]);

  return (
    <div dir="rtl" className="p-6 md:p-8 w-full bg-background min-h-screen">
      <PageHeader
        title="مدیریت کیف‌پول‌ها و تراکنش‌ها"
        subtitle="مشاهده موجودی حساب کاربران و تاریخچه تراکنش‌های مالی"
      />

      <div className="flex items-center gap-2 mb-6 bg-surface-muted p-1 rounded-xl border border-border w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("wallets")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
            activeTab === "wallets"
              ? "bg-white text-secondary shadow-xs font-bold"
              : "text-text-secondary hover:text-secondary"
          }`}
        >
          <AccountBalanceWalletOutlinedIcon style={{ fontSize: 18 }} />
          موجودی کیف‌پول‌ها
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("transactions")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
            activeTab === "transactions"
              ? "bg-white text-secondary shadow-xs font-bold"
              : "text-text-secondary hover:text-secondary"
          }`}
        >
          <ReceiptLongOutlinedIcon style={{ fontSize: 18 }} />
          تاریخچه تراکنش‌ها
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loading size={12} />
        </div>
      ) : activeTab === "wallets" ? (
        <WalletsTable wallets={wallets} />
      ) : (
        <TransactionsTable transactions={transactions} />
      )}
    </div>
  );
}
