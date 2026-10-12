import React, { useState, useEffect, useCallback } from "react";
import CloseIcon from "@mui/icons-material/Close";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import { fetchUserById } from "../../Pages/User/api/userApi";
import { fetchEnrolledStudents, cancelEnrollment } from "../../Pages/Enrollment/api/enrollmentApi";
import { fetchUserWallet } from "../../Pages/Wallet/api/walletApi";
import confirm from "../../Utils/confirm";
import Notify from "../../Utils/notify";
import Loading from "../Loading";
import { Badge, Button, Modal } from "../UI";
import { formatJalaliDate, toPersianDigits } from "../../Utils/jalaliDate";
import UserEnrollmentList from "./UserEnrollmentList";
import UserFormModal from "../../Pages/User/components/UserFormModal";

/**
 * Reusable User Profile Modal
 * - Displays complete user details (Full Name, Phone Number, Role, Birth Date, CreatedAt)
 * - Fetches and displays real-time wallet balance and transaction totals
 * - Fetches and displays enrolled courses and class session history
 * - Supports quick edit callback when triggered from user management or built-in UserFormModal
 * - Allows cancelling an enrollment with automated wallet refund if user purchased it
 */
export default function UserProfileModal({
  isOpen,
  onClose,
  userId,
  user: initialUser,
  onEdit,
}) {
  const [user, setUser] = useState(initialUser || null);
  const [enrollments, setEnrollments] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [cancellingEnrollmentId, setCancellingEnrollmentId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
    }
  }, [initialUser]);

  const effectiveUserId = userId || initialUser?._id;

  // Fetch user details
  const fetchUserData = useCallback(async () => {
    if (!effectiveUserId) return;
    setLoading(true);
    try {
      const res = await fetchUserById(effectiveUserId);
      if (res) {
        const doc = res.data ? (Array.isArray(res.data) ? res.data[0] : res.data) : res;
        setUser(doc);
      }
    } catch (err) {
      // Handled silently
    } finally {
      setLoading(false);
    }
  }, [effectiveUserId]);

  // Fetch user enrollment history
  const fetchUserEnrollments = useCallback(async () => {
    if (!effectiveUserId) return;
    setLoadingEnrollments(true);
    try {
      const res = await fetchEnrolledStudents(`user=${effectiveUserId}&sort=-createdAt`);
      if (res) {
        const list = Array.isArray(res)
          ? res
          : Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
        setEnrollments(list);
      }
    } catch (err) {
      // Handled silently
    } finally {
      setLoadingEnrollments(false);
    }
  }, [effectiveUserId]);

  // Fetch user wallet balance
  const fetchUserWalletData = useCallback(async () => {
    if (!effectiveUserId) return;
    setLoadingWallet(true);
    try {
      const res = await fetchUserWallet(effectiveUserId);
      if (res) {
        const doc = res.data
          ? Array.isArray(res.data)
            ? res.data[0]
            : res.data
          : Array.isArray(res)
          ? res[0]
          : res;
        setWallet(doc);
      }
    } catch (err) {
      // Handled silently
    } finally {
      setLoadingWallet(false);
    }
  }, [effectiveUserId]);

  useEffect(() => {
    if (!isOpen || !effectiveUserId) return;

    fetchUserData();
    fetchUserEnrollments();
    fetchUserWalletData();
  }, [isOpen, effectiveUserId, fetchUserData, fetchUserEnrollments, fetchUserWalletData]);

  const handleCancelEnrollment = async (enr) => {
    const price = Number(enr.pricePaid) || 0;
    const courseTitle = enr.course?.title || "دوره مورد نظر";
    const confirmText =
      price > 0
        ? `آیا از لغو ثبت‌نام در «${courseTitle}» اطمینان دارید؟ با لغو، مبلغ ${toPersianDigits(
            price.toLocaleString("fa-IR")
          )} تومان به کیف پول کاربر بازگردانده شده و ۱ ظرفیت به کلاس اضافه می‌شود.`
        : `آیا از لغو ثبت‌نام در «${courseTitle}» اطمینان دارید؟ این ثبت‌نام به صورت دستی بوده و با لغو، ۱ ظرفیت به کلاس بازمی‌گردد.`;

    const isConfirmed = await confirm(
      "لغو ثبت‌نام دوره",
      confirmText,
      "بله، لغو ثبت‌نام کن",
      "warning",
      "#ef4444"
    );

    if (!isConfirmed) return;

    setCancellingEnrollmentId(enr._id);
    try {
      const res = await cancelEnrollment(enr._id);
      if (res && res.success !== false) {
        Notify.success(
          price > 0
            ? `ثبت‌نام با موفقیت لغو شد و مبلغ ${toPersianDigits(
                price.toLocaleString("fa-IR")
              )} تومان به کیف پول کاربر بازگشت.`
            : "ثبت‌نام با موفقیت لغو شد و دوره از سوابق کاربر حذف گردید."
        );
        fetchUserEnrollments();
        fetchUserWalletData();
      } else {
        Notify.error(res?.message || "خطا در لغو ثبت‌نام");
      }
    } catch (err) {
      Notify.error(err.response?.data?.message || err.message || "خطا در لغو ثبت‌نام");
    } finally {
      setCancellingEnrollmentId(null);
    }
  };

  if (!isOpen) return null;

  const roleBadgeConfig = {
    superAdmin: { label: "مدیر ارشد", variant: "warning" },
    admin: { label: "مدیر آموزشگاه", variant: "primary" },
    user: { label: "دانش‌آموز / کاربر عادی", variant: "neutral" },
  };

  const currentRole = user?.role || "user";
  const roleInfo = roleBadgeConfig[currentRole] || roleBadgeConfig.user;

  // Calculate total amount spent
  const totalSpent = enrollments.reduce((sum, item) => sum + (Number(item.pricePaid) || 0), 0);
  const walletBalance = Number(wallet?.balance) || 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="پروفایل و مشخصات کاربر"
      maxWidth="max-w-xl"
      footer={
        <>
          <Button
            variant="secondary"
            size="sm"
            className="w-full sm:w-auto"
            onClick={onClose}
          >
            بستن
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<EditOutlinedIcon fontSize="small" />}
            className="w-full sm:w-auto"
            disabled={!user}
            onClick={() => {
              if (onEdit) {
                onClose();
                onEdit(user);
              } else {
                setIsEditing(true);
              }
            }}
          >
            ویرایش اطلاعات
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4 sm:gap-6 min-h-[380px] sm:min-h-[440px]">
        {loading && !user ? (
          <Loading
            container
            minHeight="min-h-[340px] sm:min-h-[400px]"
            size={8}
            text="در حال دریافت اطلاعات کاربر..."
          />
        ) : (
          <>
            {/* User Hero Card */}
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-bg-light/60 border border-border/70">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-primary text-secondary flex items-center justify-center text-xl sm:text-2xl font-black shadow-md shadow-primary/20 shrink-0">
                {user?.fullName?.trim() ? user.fullName.trim()[0] : "ک"}
              </div>

              <div className="flex-1 flex flex-col items-start gap-1 sm:gap-2 text-right min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm sm:text-base font-extrabold text-secondary truncate">
                    {user?.fullName || "کاربر بدون نام"}
                  </h4>
                  <Badge variant={roleInfo.variant} size="sm">
                    {roleInfo.label}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 text-[11px] sm:text-xs text-text-secondary">
                  <div className="flex items-center gap-1.5 font-mono text-secondary font-bold">
                    <PhoneIphoneIcon style={{ fontSize: "0.9rem" }} className="text-text-muted" />
                    <span dir="ltr">{user?.phoneNumber ? toPersianDigits(user.phoneNumber) : "—"}</span>
                  </div>

                  {user?.birthDate && (
                    <div className="flex items-center gap-1 text-text-muted">
                      <CakeOutlinedIcon style={{ fontSize: "0.9rem" }} />
                      <span>تاریخ تولد: {toPersianDigits(user.birthDate)}</span>
                    </div>
                  )}

                  {user?.createdAt && (
                    <div className="hidden sm:flex items-center gap-1 text-[11px] text-text-muted">
                      <CalendarTodayOutlinedIcon style={{ fontSize: "0.85rem" }} />
                      <span>تاریخ عضویت: {formatJalaliDate(user.createdAt, { withTime: true })}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Overview: 3 compact columns on all viewports */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {/* Wallet Balance Card */}
              <div className="p-2 sm:p-3 rounded-2xl bg-surface border border-border/80 flex flex-col gap-1 shadow-2xs">
                <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-text-muted font-semibold truncate">
                  <AccountBalanceWalletOutlinedIcon style={{ fontSize: "0.9rem" }} className="text-emerald-600 shrink-0" />
                  <span className="truncate">موجودی کیف پول</span>
                </div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xs sm:text-base font-black text-emerald-600 truncate">
                    {loadingWallet
                      ? "..."
                      : toPersianDigits(walletBalance.toLocaleString("fa-IR"))}
                  </span>
                  <span className="text-[10px] text-text-muted font-medium shrink-0">تومان</span>
                </div>
              </div>

              {/* Enrollments Count Card */}
              <div className="p-2 sm:p-3 rounded-2xl bg-surface border border-border/80 flex flex-col gap-1 shadow-2xs">
                <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-text-muted font-semibold truncate">
                  <SchoolOutlinedIcon style={{ fontSize: "0.9rem" }} className="text-primary shrink-0" />
                  <span className="truncate">تعداد دوره‌ها</span>
                </div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xs sm:text-base font-black text-secondary">
                    {toPersianDigits(enrollments.length)}
                  </span>
                  <span className="text-[10px] text-text-muted font-medium shrink-0">دوره</span>
                </div>
              </div>

              {/* Total Paid Card */}
              <div className="p-2 sm:p-3 rounded-2xl bg-surface border border-border/80 flex flex-col gap-1 shadow-2xs">
                <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-text-muted font-semibold truncate">
                  <PaidOutlinedIcon style={{ fontSize: "0.9rem" }} className="text-amber-600 shrink-0" />
                  <span className="truncate">مجموع پرداختی</span>
                </div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xs sm:text-base font-black text-secondary truncate">
                    {totalSpent === 0 ? "۰" : toPersianDigits(totalSpent.toLocaleString("fa-IR"))}
                  </span>
                  <span className="text-[10px] text-text-muted font-medium shrink-0">تومان</span>
                </div>
              </div>
            </div>

            {/* Enrolled Courses Section */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SchoolOutlinedIcon fontSize="small" className="text-primary" />
                  <h5 className="text-xs md:text-sm font-bold text-secondary">
                    دوره‌های ثبت‌نام‌شده توسط این کاربر
                  </h5>
                </div>
                <span className="text-[11px] text-text-muted">
                  {toPersianDigits(enrollments.length)} رکورد
                </span>
              </div>

              <UserEnrollmentList
                enrollments={enrollments}
                loading={loadingEnrollments}
                onCancelEnrollment={handleCancelEnrollment}
                cancellingId={cancellingEnrollmentId}
              />
            </div>
          </>
        )}
      </div>

      {/* Internal User Edit Modal */}
      {isEditing && (
        <UserFormModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          user={user}
          onSuccess={(updatedUser) => {
            setIsEditing(false);
            if (updatedUser) setUser(updatedUser);
            fetchUserData();
          }}
        />
      )}
    </Modal>
  );
}
