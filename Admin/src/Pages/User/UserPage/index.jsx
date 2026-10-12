import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import Notify from "../../../Utils/notify";
import confirm from "../../../Utils/confirm";
import Loading from "../../../Components/Loading";
import { Button, PageHeader, Toolbar } from "../../../Components/UI";
import UserProfileModal from "../../../Components/UserProfileModal";
import UserTable from "../components/UserTable";
import UserFormModal from "../components/UserFormModal";
import { fetchUsers, deleteUser } from "../api/userApi";
import useInfiniteScroll from "../../../Utils/useInfiniteScroll";

const ROLE_FILTER_CONFIG = [
  {
    field: "role",
    label: "سطح دسترسی",
    options: [
      { label: "دانش‌آموز (User)", value: "user" },
      { label: "مدیر (Admin)", value: "admin" },
      { label: "مدیر ارشد (Super Admin)", value: "superAdmin" },
    ],
  },
];

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRole, setActiveRole] = useState("");

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [selectedProfileUser, setSelectedProfileUser] = useState(null);

  const LIMIT = 15;

  const loadUsers = async (pageNumber, query, role) => {
    if (pageNumber === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await fetchUsers({
        page: pageNumber,
        limit: LIMIT,
        sort: "-_id",
        q: query || undefined,
        role: role || undefined,
      });

      if (res && res.success !== false) {
        const fetched = Array.isArray(res) ? res : res.data || [];
        setHasMore(fetched.length >= LIMIT);

        if (pageNumber === 1) {
          setUsers(fetched);
        } else {
          setUsers((prev) => {
            const unique = fetched.filter(
              (item) => !prev.some((existing) => existing._id === item._id)
            );
            return [...prev, ...unique];
          });
        }
      } else {
        Notify.error(res?.message || "خطا در دریافت لیست کاربران");
      }
    } catch (err) {
      Notify.error(err.message || "خطا در برقراری ارتباط با سرور");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadUsers(page, searchQuery, activeRole);
  }, [page, searchQuery, activeRole]);

  useInfiniteScroll({
    onReachBottom: () => setPage((prevPage) => prevPage + 1),
    hasMore,
    isLoading: loading || loadingMore,
  });

  const handleSearch = (q) => {
    setSearchQuery(q);
    setPage(1);
  };

  const handleFilterChange = (filters) => {
    setActiveRole(filters.role || "");
    setPage(1);
  };

  const handleOpenCreate = () => {
    setSelectedUserForEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setSelectedUserForEdit(user);
    setIsFormModalOpen(true);
  };

  const handleDeleteUser = async (user) => {
    const isConfirmed = await confirm(
      `آیا از حذف کاربر «${user.fullName || user.phoneNumber}» اطمینان دارید؟`,
      "حذف حساب کاربری برگشت‌ناپذیر است.",
      "بله، حذف کن"
    );

    if (!isConfirmed) return;

    try {
      const res = await deleteUser(user._id);
      if (res && res.success !== false) {
        setUsers((prev) => prev.filter((u) => u._id !== user._id));
        Notify.success("کاربر با موفقیت حذف شد");
      } else {
        throw new Error(res?.message || "حذف کاربر ناموفق بود");
      }
    } catch (err) {
      Notify.error(err.message || "خطا در حذف کاربر");
    }
  };

  const handleFormSuccess = () => {
    setPage(1);
    loadUsers(1, searchQuery, activeRole);
  };

  return (
    <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col">
      <PageHeader
        title="مدیریت کاربران"
        subtitle="مشاهده، جستجو، ثبت و ویرایش مشخصات کاربران و سطوح دسترسی"
        action={
          <Button
            variant="primary"
            size="md"
            icon={<AddIcon fontSize="small" />}
            onClick={handleOpenCreate}
          >
            افزودن کاربر
          </Button>
        }
      />

      <Toolbar
        className="mb-6"
        searchPlaceholder="جستجوی کاربر (نام، شماره تماس)..."
        onSearch={handleSearch}
        filterConfig={ROLE_FILTER_CONFIG}
        onFilterChange={handleFilterChange}
        onRefresh={() => loadUsers(1, searchQuery, activeRole)}
        isRefreshing={loading && page === 1}
      />

      <div className="flex flex-col flex-1">
        <UserTable
          users={users}
          loading={loading}
          onSelectProfile={(u) => setSelectedProfileUser(u)}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteUser}
        />

        {loadingMore && (
          <div className="flex justify-center items-center py-6">
            <Loading size={8} />
          </div>
        )}
      </div>

      {/* Form Modal for Create/Edit */}
      <UserFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        user={selectedUserForEdit}
        onSuccess={handleFormSuccess}
      />

      {/* Profile Detail Modal */}
      {selectedProfileUser && (
        <UserProfileModal
          isOpen={Boolean(selectedProfileUser)}
          onClose={() => setSelectedProfileUser(null)}
          user={selectedProfileUser}
          userId={selectedProfileUser._id}
        />
      )}
    </div>
  );
}
