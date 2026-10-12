import React, { useState, useEffect, useMemo } from "react";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import Notify from "../../Utils/notify";
import { PageHeader, Tabs, Toolbar, LoadingState, TableSkeleton } from "../../Components/UI";
import WalletsTable from "./components/WalletsTable";
import TransactionsTable from "./components/TransactionsTable";
import UserProfileModal from "../../Components/UserProfileModal";
import { fetchAllWallets, fetchAllTransactions } from "./api/walletApi";
import { fetchUsers } from "../User/api/userApi";

/**
 * Wallet Management Page
 * Displays unified user wallet balances and transaction histories.
 */
export default function WalletPage() {
  const [activeTab, setActiveTab] = useState("wallets");
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserForProfile, setSelectedUserForProfile] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Fetch users list to correlate wallet records with user profiles
      const usersRes = await fetchUsers({ limit: 100 }).catch(() => null);
      const fetchedUsers = Array.isArray(usersRes)
        ? usersRes
        : usersRes?.data || [];

      const map = {};
      fetchedUsers.forEach((u) => {
        if (u?._id) map[String(u._id)] = u;
      });
      setUsersMap(map);

      // 2. Fetch specific tab data
      if (activeTab === "wallets") {
        const walletsRes = await fetchAllWallets();
        const rawWallets = Array.isArray(walletsRes)
          ? walletsRes
          : walletsRes?.data || [];

        // Map existing wallets by user id
        const userWalletMap = new Map();
        rawWallets.forEach((w) => {
          const uId =
            w.ownerId?._id ||
            w.ownerId ||
            w.userId?._id ||
            w.userId ||
            w.user?._id ||
            w.user;
          if (uId) {
            userWalletMap.set(String(uId), w);
          }
        });

        // Combine: all existing wallets + registered users who don't have a wallet yet
        const combined = [...rawWallets];
        fetchedUsers.forEach((u) => {
          if (!userWalletMap.has(String(u._id))) {
            combined.push({
              _id: `user-wallet-${u._id}`,
              ownerId: u,
              balance: 0,
              isVirtual: true,
              createdAt: u.createdAt,
            });
          }
        });

        setWallets(combined);
      } else {
        const txRes = await fetchAllTransactions();
        const rawTx = Array.isArray(txRes) ? txRes : txRes?.data || [];
        setTransactions(rawTx);
      }
    } catch (err) {
      Notify.error(err.message || "خطا در دریافت اطلاعات مالی");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    loadData();
    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  const filteredWallets = useMemo(() => {
    if (!searchQuery.trim()) return wallets;
    const q = searchQuery.trim().toLowerCase();
    return wallets.filter((w) => {
      const u =
        (w.ownerId && typeof w.ownerId === "object" ? w.ownerId : null) ||
        (w.userId && typeof w.userId === "object" ? w.userId : null) ||
        usersMap[String(w.ownerId)] ||
        usersMap[String(w.userId)] ||
        usersMap[String(w.user)];
      const name = (u?.fullName || u?.name || "").toLowerCase();
      const phone = (u?.phoneNumber || u?.phone || "").toLowerCase();
      return name.includes(q) || phone.includes(q);
    });
  }, [wallets, searchQuery, usersMap]);

  const filteredTransactions = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (timeB !== timeA) return timeB - timeA;
      return String(b._id || "").localeCompare(String(a._id || ""));
    });

    if (!searchQuery.trim()) return sorted;
    const q = searchQuery.trim().toLowerCase();
    return sorted.filter((tx) => {
      const u =
        (tx.userId && typeof tx.userId === "object" ? tx.userId : null) ||
        (tx.user && typeof tx.user === "object" ? tx.user : null) ||
        usersMap[String(tx.userId)] ||
        usersMap[String(tx.user)];
      const name = (u?.fullName || u?.name || "").toLowerCase();
      const phone = (u?.phoneNumber || u?.phone || "").toLowerCase();
      const desc = (tx.description || "").toLowerCase();
      return name.includes(q) || phone.includes(q) || desc.includes(q);
    });
  }, [transactions, searchQuery, usersMap]);

  const tabs = [
    {
      id: "wallets",
      key: "wallets",
      label: "موجودی کیف‌پول‌ها",
      icon: <AccountBalanceWalletOutlinedIcon fontSize="small" />,
    },
    {
      id: "transactions",
      key: "transactions",
      label: "تاریخچه تراکنش‌ها",
      icon: <ReceiptLongOutlinedIcon fontSize="small" />,
    },
  ];

  return (
    <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col">
      <PageHeader
        title="مدیریت کیف‌پول‌ها و تراکنش‌ها"
        subtitle="مشاهده موجودی حساب کاربران و تاریخچه تراکنش‌های مالی"
      />

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(tabKey) => {
          setActiveTab(tabKey);
          setSearchQuery("");
        }}
        className="mb-6"
      />

      <Toolbar
        className="mb-6"
        searchPlaceholder={
          activeTab === "wallets"
            ? "جستجوی کاربر یا شماره تماس..."
            : "جستجوی تراکنش‌ها یا کاربر..."
        }
        searchValue={searchQuery}
        onSearch={setSearchQuery}
        onRefresh={loadData}
        isRefreshing={loading}
      />

      <div className="flex flex-col flex-1">
        {loading ? (
          <TableSkeleton rows={8} cols={7} />
        ) : activeTab === "wallets" ? (
          <WalletsTable
            wallets={filteredWallets}
            usersMap={usersMap}
            onSelectUser={(u) => setSelectedUserForProfile(u)}
          />
        ) : (
          <TransactionsTable
            transactions={filteredTransactions}
            usersMap={usersMap}
            onSelectUser={(u) => setSelectedUserForProfile(u)}
          />
        )}
      </div>

      {/* User Profile Modal when clicking any user from wallets or transactions */}
      {selectedUserForProfile && (
        <UserProfileModal
          isOpen={Boolean(selectedUserForProfile)}
          onClose={() => setSelectedUserForProfile(null)}
          userId={selectedUserForProfile._id}
          user={selectedUserForProfile}
        />
      )}
    </div>
  );
}
