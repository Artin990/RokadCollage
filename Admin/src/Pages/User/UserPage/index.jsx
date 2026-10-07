import React, { useState, useEffect } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import RefreshIcon from "@mui/icons-material/Refresh";
import axiosInstance from "../../../Utils/axiosInstance";
import Notify from "../../../Utils/notify";
import confirm from "../../../Utils/confirm";
import Loading from "../../../Components/Loading";
import { Button, PageHeader } from "../../../Components/UI";
import UserProfileModal from "../../../Components/UserProfileModal";
import UserFormModal from "../components/UserFormModal";
import UserTable from "../components/UserTable";
import UserToolbar from "../components/UserToolbar";

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({});

  // Modals state
  const [selectedUserForProfile, setSelectedUserForProfile] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const LIMIT = 15;
  const roleFilterConfig = [
    {
      field: "role",
      label: "سطح دسترسی و نقش",
      options: [
        { label: "دانش‌آموز / کاربر عادی", value: "user" },
        { label: "مدیر آموزشگاه", value: "admin" },
        { label: "مدیر ارشد", value: "superAdmin" },
      ],
    },
  ];

  const fetchUsers = async (pageNumber = 1, query = "", filters = {}, isRefresh = false) => {
    if (pageNumber === 1) {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      let filterParams = "";
      if (filters.role) {
        filterParams += `&role=${encodeURIComponent(filters.role)}`;
      }

      const endpoint = `user?limit=${LIMIT}&page=${pageNumber}&sort=-_id${
        query ? `&q=${encodeURIComponent(query)}` : ""
      }${filterParams}`;

      const res = await axiosInstance.get(endpoint);

      if (res && res.success !== false) {
        const fetchedList = Array.isArray(res) ? res : res.data || [];

        if (fetchedList.length < LIMIT) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        if (pageNumber === 1) {
          setUsers(fetchedList);
        } else {
          setUsers((prev) => {
            const unique = fetchedList.filter(
              (item) => !prev.some((existing) => existing._id === item._id)
            );
            return [...prev, ...unique];
          });
        }
      } else {
        Notify.error(res?.message || "خطا در دریافت لیست کاربران");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      Notify.error(error.response?.data?.message || error.message || "خطا در دریافت لیست کاربران");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, searchQuery, activeFilters);
  }, [page, searchQuery, activeFilters]);

  // Infinite scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = window.innerHeight;

      if (scrollTop + clientHeight >= scrollHeight - 120) {
        if (hasMore && !loading && !loadingMore) {
          setPage((prev) => prev + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, loadingMore]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
    setHasMore(true);
  };
  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    setPage(1);
    setHasMore(true);
  };
  const handleRefresh = () => {
    setPage(1);
    setHasMore(true);
    fetchUsers(1, searchQuery, activeFilters, true);
  };

  const handleDeleteUser = async (user) => {
    const isConfirmed = await confirm(
      `آیا از حذف کاربر «${user.fullName || user.phoneNumber}» اطمینان دارید؟`,
      "با حذف این کاربر، دسترسی وی به پنل و اطلاعات ورود لغو خواهد شد.",
      "بله، حذف کن"
    );

    if (!isConfirmed) return;
    try {
      const res = await axiosInstance.delete(`user/${user._id}`);
      if (res && res.success !== false) {
        setUsers((prev) => prev.filter((u) => u._id !== user._id));
        Notify.success("کاربر با موفقیت حذف شد.");
      } else {
        Notify.error(res?.message || "حذف کاربر با خطا مواجه شد");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      Notify.error(err.response?.data?.message || err.message || "خطا در حذف کاربر");
    }
  };

  const handleUserSaved = (updatedUser) => {
    setUsers((prev) => {
      const exists = prev.some((u) => u._id === updatedUser._id);
      if (exists) {
        return prev.map((u) => (u._id === updatedUser._id ? updatedUser : u));
      }
      return [updatedUser, ...prev];
    });
  };

  return (
    <div dir="rtl" className="p-6 md:p-8 w-full bg-background min-h-screen">
      {/* Page Header */}
      <PageHeader
        title="مدیریت کاربران"
        subtitle="مشاهده، جستجو، ایجاد و مدیریت حساب‌های کاربری و نقش‌های سیستم کالج رکاد"
        action={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="md"
              icon={<RefreshIcon className={refreshing ? "animate-spin" : ""} fontSize="small" />}
              onClick={handleRefresh}
              disabled={refreshing}
            >
              تازه‌سازی
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={<PersonAddIcon fontSize="small" />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              افزودن کاربر جدید
            </Button>
          </div>
        }
      >
        <UserToolbar
          roleFilterConfig={roleFilterConfig}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
        />
      </PageHeader>

      {/* Main Content Area */}
      {loading && page === 1 ? (
        <div className="flex justify-center mt-20">
          <Loading size={12} />
        </div>
      ) : (
        <>
          <UserTable
            users={users}
            loading={loading}
            onSelectProfile={setSelectedUserForProfile}
            onEdit={setUserToEdit}
            onDelete={handleDeleteUser}
          />

          {loadingMore && (
            <div className="flex justify-center mt-8 py-4">
              <Loading size={8} />
            </div>
          )}
        </>
      )}

      {/* User Profile Modal */}
      {selectedUserForProfile && (
        <UserProfileModal
          isOpen={Boolean(selectedUserForProfile)}
          onClose={() => setSelectedUserForProfile(null)}
          userId={selectedUserForProfile._id}
          user={selectedUserForProfile}
          onEdit={(user) => {
            setSelectedUserForProfile(null);
            setUserToEdit(user);
          }}
        />
      )}

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <UserFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleUserSaved}
        />
      )}

      {/* Edit User Modal */}
      {userToEdit && (
        <UserFormModal
          isOpen={Boolean(userToEdit)}
          onClose={() => setUserToEdit(null)}
          user={userToEdit}
          onSuccess={handleUserSaved}
        />
      )}
    </div>
  );
}
