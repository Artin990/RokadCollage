import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import axiosInstance from "../../Utils/axiosInstance";
import Loading from "../Loading";
import { Badge, Button } from "../UI";
import { formatJalaliDate, toPersianDigits } from "../../Utils/jalaliDate";
import UserEnrollmentList from "./UserEnrollmentList";

/**
 * Reusable User Profile Modal
 * - Displays complete user details (Full Name, Phone Number, Role, Birth Date, CreatedAt)
 * - Fetches and displays enrolled courses and class session history
 * - Supports quick edit callback when triggered from user management
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
  const [loading, setLoading] = useState(false);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);

  const effectiveUserId = userId || initialUser?._id;

  useEffect(() => {
    if (!isOpen || !effectiveUserId) return;

    let isMounted = true;

    // Fetch user details if needed or to ensure fresh data
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`user/${effectiveUserId}`);
        if (isMounted && res) {
          const doc = res.data ? (Array.isArray(res.data) ? res.data[0] : res.data) : res;
          setUser(doc);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Fetch user enrollment history
    const fetchUserEnrollments = async () => {
      setLoadingEnrollments(true);
      try {
        const res = await axiosInstance.get(`enrollment/all?user=${effectiveUserId}&sort=-createdAt`);
        if (isMounted && res) {
          const list = Array.isArray(res) ? res : res.data || [];
          setEnrollments(list);
        }
      } catch (err) {
        console.error("Error fetching user enrollments:", err);
      } finally {
        if (isMounted) setLoadingEnrollments(false);
      }
    };

    fetchUserData();
    fetchUserEnrollments();

    return () => {
      isMounted = false;
    };
  }, [isOpen, effectiveUserId]);

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

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-surface rounded-2xl border border-border/80 shadow-2xl overflow-hidden my-6 text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-surface">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary-light text-primary flex items-center justify-center">
              <PersonOutlineIcon fontSize="small" />
            </div>
            <h3 className="text-sm md:text-base font-extrabold text-secondary">
              پروفایل و مشخصات کاربر
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-text-primary p-1.5 rounded-xl hover:bg-surface-hover transition-colors cursor-pointer"
            title="بستن"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 flex flex-col gap-6 max-h-[75vh] overflow-y-auto hide-scrollbar">
          {loading && !user ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2">
              <Loading size={8} />
              <span className="text-xs text-text-muted">در حال دریافت اطلاعات کاربر...</span>
            </div>
          ) : (
            <>
              {/* User Hero Card */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-2xl bg-bg-light/60 border border-border/70">
                <div className="w-16 h-16 rounded-2xl bg-primary text-secondary flex items-center justify-center text-2xl font-black shadow-md shadow-primary/20 shrink-0">
                  {user?.fullName?.trim() ? user.fullName.trim()[0] : "ک"}
                </div>

                <div className="flex-1 flex flex-col items-center sm:items-start gap-2 text-center sm:text-right">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-base font-extrabold text-secondary">
                      {user?.fullName || "کاربر بدون نام"}
                    </h4>
                    <Badge variant={roleInfo.variant} size="sm">
                      {roleInfo.label}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-text-secondary">
                    <div className="flex items-center gap-1 font-mono text-secondary font-bold" dir="ltr">
                      <PhoneIphoneIcon style={{ fontSize: "0.95rem" }} className="text-text-muted" />
                      <span>{user?.phoneNumber ? toPersianDigits(user.phoneNumber) : "—"}</span>
                    </div>

                    {user?.birthDate && (
                      <div className="flex items-center gap-1 text-text-muted">
                        <CakeOutlinedIcon style={{ fontSize: "0.95rem" }} />
                        <span>تاریخ تولد: {toPersianDigits(user.birthDate)}</span>
                      </div>
                    )}
                  </div>

                  {user?.createdAt && (
                    <div className="flex items-center gap-1 text-[11px] text-text-muted">
                      <CalendarTodayOutlinedIcon style={{ fontSize: "0.85rem" }} />
                      <span>تاریخ عضویت: {formatJalaliDate(user.createdAt, { withTime: true })}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-surface border border-border/80 flex flex-col gap-1 shadow-2xs">
                  <span className="text-[11px] text-text-muted">تعداد ثبت‌نام‌ها</span>
                  <div className="flex items-center gap-1.5">
                    <SchoolOutlinedIcon className="text-primary" fontSize="small" />
                    <span className="text-base font-black text-secondary">
                      {toPersianDigits(enrollments.length)} دوره
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-surface border border-border/80 flex flex-col gap-1 shadow-2xs">
                  <span className="text-[11px] text-text-muted">مجموع پرداختی</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-black text-secondary">
                      {totalSpent === 0 ? "۰" : toPersianDigits(totalSpent.toLocaleString("fa-IR"))}
                    </span>
                    <span className="text-[11px] text-text-muted">تومان</span>
                  </div>
                </div>
              </div>

              {/* Enrolled Courses Section */}
              <div className="flex flex-col gap-3">
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

                <UserEnrollmentList enrollments={enrollments} loading={loadingEnrollments} />
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-bg-light/60 border-t border-border/80">
          <div>
            {onEdit && user && (
              <Button
                variant="outline"
                size="sm"
                icon={<EditOutlinedIcon fontSize="small" />}
                onClick={() => {
                  onClose();
                  onEdit(user);
                }}
              >
                ویرایش اطلاعات
              </Button>
            )}
          </div>
          <Button variant="secondary" size="sm" onClick={onClose}>
            بستن
          </Button>
        </div>
      </div>
    </div>
  );
}
