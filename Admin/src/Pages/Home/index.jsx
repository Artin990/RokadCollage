import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../Store/Slices/authSlice";
import SchoolIcon from "@mui/icons-material/School";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import AddIcon from "@mui/icons-material/Add";
import ArticleIcon from "@mui/icons-material/Article";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import axiosInstance from "../../Utils/axiosInstance";
import {
  Card,
  Button,
  Badge,
  LoadingState,
  DashboardSkeleton,
  ErrorState,
  EmptyState,
  Table,
  TableHead,
  TableRow,
  TableHeadCell,
  TableCell,
  TableBody,
} from "../../Components/UI";
import { formatJalaliDate, toPersianDigits } from "../../Utils/jalaliDate";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({
    inPersonCount: 0,
    virtualCount: 0,
    usersCount: 0,
    enrollmentsCount: 0,
  });
  const [recentEnrollments, setRecentEnrollments] = useState([]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth");
  };

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch in parallel using existing backend endpoints
        const [inPersonRes, virtualRes, usersRes, enrollmentsRes] =
          await Promise.allSettled([
            axiosInstance.get("in-person-courses?limit=100"),
            axiosInstance.get("virtual-courses?limit=100"),
            axiosInstance.get("user?limit=100"),
            axiosInstance.get("enrollment/all?sort=-createdAt&limit=5"),
          ]);

        if (!isMounted) return;

        const inPersonData =
          inPersonRes.status === "fulfilled"
            ? Array.isArray(inPersonRes.value?.data)
              ? inPersonRes.value.data
              : Array.isArray(inPersonRes.value)
              ? inPersonRes.value
              : inPersonRes.value?.data?.data || []
            : [];

        const virtualData =
          virtualRes.status === "fulfilled"
            ? Array.isArray(virtualRes.value?.data)
              ? virtualRes.value.data
              : Array.isArray(virtualRes.value)
              ? virtualRes.value
              : virtualRes.value?.data?.data || []
            : [];

        const usersData =
          usersRes.status === "fulfilled"
            ? Array.isArray(usersRes.value?.data)
              ? usersRes.value.data
              : Array.isArray(usersRes.value)
              ? usersRes.value
              : usersRes.value?.data?.data || []
            : [];

        const enrollmentsData =
          enrollmentsRes.status === "fulfilled"
            ? Array.isArray(enrollmentsRes.value?.data)
              ? enrollmentsRes.value.data
              : Array.isArray(enrollmentsRes.value)
              ? enrollmentsRes.value
              : enrollmentsRes.value?.data?.data || []
            : [];

        setStats({
          inPersonCount: inPersonData.length,
          virtualCount: virtualData.length,
          usersCount: usersData.length,
          enrollmentsCount: enrollmentsData.length,
        });

        // Take latest 5 enrollments
        setRecentEnrollments(enrollmentsData.slice(0, 5));
      } catch (err) {
        if (isMounted) {
          setError("خطا در برقراری ارتباط با سرور و بارگذاری آمار داشبورد");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const todayJalali = formatJalaliDate(new Date(), { withTime: false });

  return (
    <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 sm:pb-6 mb-6 sm:mb-8 border-b border-border/80 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-text-muted mb-1.5">
            <CalendarTodayOutlinedIcon style={{ fontSize: 14 }} />
            <span>امروز: {todayJalali}</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-secondary tracking-tight">
            داشبورد مدیریت کالج رکاد
          </h1>
          <p className="text-xs md:text-sm text-text-secondary mt-1 leading-relaxed">
            خلاصه وضعیت سیستم آموزشی، دسترسی سریع و آخرین رویدادهای ثبت‌نام
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/seo")}
            icon={<SettingsIcon fontSize="small" />}
          >
            تنظیمات سئو
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            icon={<LogoutIcon fontSize="small" className="rotate-180" />}
            className="text-text-muted hover:text-error hover:bg-error-light"
          >
            خروج
          </Button>
        </div>
      </div>

      {loading ? (
        <DashboardSkeleton />
      ) : error ? (
        <ErrorState
          title="خطا در دریافت آمار"
          description={error}
          onRetry={fetchDashboardData}
        />
      ) : (
        <div className="flex flex-col gap-8">
          {/* 2. Key Stats Row (Max 4 cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stat 1: In-Person Courses */}
            <Card
              hoverable
              onClick={() => navigate("/in-person-courses")}
              className="p-5 flex items-center justify-between cursor-pointer group"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-text-secondary">
                  دوره‌های حضوری
                </span>
                <span className="text-2xl font-black text-secondary group-hover:text-primary transition-colors">
                  {toPersianDigits(stats.inPersonCount)}
                </span>
                <span className="text-2xs text-text-muted">کارگاه‌ها و دوره‌ها</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                <SchoolIcon fontSize="medium" />
              </div>
            </Card>

            {/* Stat 2: Virtual Courses */}
            <Card
              hoverable
              onClick={() => navigate("/virtual-courses")}
              className="p-5 flex items-center justify-between cursor-pointer group"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-text-secondary">
                  دوره‌های مجازی
                </span>
                <span className="text-2xl font-black text-secondary group-hover:text-primary transition-colors">
                  {toPersianDigits(stats.virtualCount)}
                </span>
                <span className="text-2xs text-text-muted">آنلاین و اسپات‌پلیر</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200/80 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                <OndemandVideoIcon fontSize="medium" />
              </div>
            </Card>

            {/* Stat 3: Total Users */}
            <Card
              hoverable
              onClick={() => navigate("/user")}
              className="p-5 flex items-center justify-between cursor-pointer group"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-text-secondary">
                  کاربران ثبت‌نامی
                </span>
                <span className="text-2xl font-black text-secondary group-hover:text-primary transition-colors">
                  {toPersianDigits(stats.usersCount)}
                </span>
                <span className="text-2xs text-text-muted">دانشجویان و مدیران</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200/80 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                <GroupOutlinedIcon fontSize="medium" />
              </div>
            </Card>

            {/* Stat 4: Total Enrollments */}
            <Card
              hoverable
              onClick={() => navigate("/enrollment")}
              className="p-5 flex items-center justify-between cursor-pointer group"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-text-secondary">
                  ثبت‌نام‌ها
                </span>
                <span className="text-2xl font-black text-secondary group-hover:text-primary transition-colors">
                  {toPersianDigits(stats.enrollmentsCount)}
                </span>
                <span className="text-2xs text-text-muted">ثبت در دوره‌ها</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                <ReceiptLongIcon fontSize="medium" />
              </div>
            </Card>
          </div>

          {/* 3. Quick Actions Section */}
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-extrabold text-secondary">
              دسترسی و اقدامات سریع
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate("/in-person-courses/create")}
                icon={<AddIcon fontSize="small" />}
                className="justify-center py-2.5 sm:py-3.5 px-2 sm:px-3 text-xs sm:text-sm text-center font-bold"
              >
                افزودن دوره حضوری
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate("/virtual-courses/create")}
                icon={<AddIcon fontSize="small" />}
                className="justify-center py-2.5 sm:py-3.5 px-2 sm:px-3 text-xs sm:text-sm text-center font-bold"
              >
                افزودن دوره مجازی
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate("/blog/create")}
                icon={<ArticleIcon fontSize="small" />}
                className="justify-center py-2.5 sm:py-3.5 px-2 sm:px-3 text-xs sm:text-sm text-center font-bold"
              >
                نوشتن مقاله جدید
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={() => navigate("/enrollment")}
                icon={<ReceiptLongIcon fontSize="small" />}
                className="justify-center py-2.5 sm:py-3.5 px-2 sm:px-3 text-xs sm:text-sm text-center font-bold"
              >
                مشاهده ثبت‌نام‌ها
              </Button>
            </div>
          </div>

          {/* 4. Recent Enrollments Block (Max 5 rows with link to full page) */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border/80">
              <div className="flex items-center gap-2">
                <ReceiptLongIcon fontSize="small" className="text-primary" />
                <h3 className="text-sm md:text-base font-extrabold text-secondary">
                  آخرین ثبت‌نام‌ها
                </h3>
              </div>
              <button
                type="button"
                onClick={() => navigate("/enrollment")}
                className="text-xs font-bold text-primary-text hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>مشاهده همه‌ی ثبت‌نام‌ها</span>
                <ArrowBackIcon style={{ fontSize: 14 }} />
              </button>
            </div>

            {recentEnrollments.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  title="هنوز ثبت‌نامی انجام نشده است"
                  description="به محض ثبت‌نام دانش‌آموزان در دوره‌ها، لیست آخرین فعالیت‌ها در اینجا نمایش داده می‌شود."
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHead>
                    <TableRow isHeader hover={false}>
                      <TableHeadCell align="center" className="w-12">#</TableHeadCell>
                      <TableHeadCell>کاربر فراگیر</TableHeadCell>
                      <TableHeadCell>دوره آموزشی</TableHeadCell>
                      <TableHeadCell>نوع دوره</TableHeadCell>
                      <TableHeadCell>مبلغ پرداختی</TableHeadCell>
                      <TableHeadCell>تاریخ ثبت‌نام</TableHeadCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentEnrollments.map((enr, index) => {
                      const price = Number(enr.pricePaid) || 0;
                      const isVirtual = !enr.session;
                      const userName =
                        enr.user?.fullName ||
                        enr.user?.phoneNumber ||
                        "کاربر ناشناس";
                      const courseTitle =
                        enr.course?.title || "دوره آموزشی";

                      return (
                        <TableRow key={enr._id || index}>
                          <TableCell align="center" className="text-text-muted font-medium text-xs">
                            {toPersianDigits(index + 1)}
                          </TableCell>
                          <TableCell className="font-semibold text-secondary">
                            {userName}
                          </TableCell>
                          <TableCell className="text-text-primary">
                            {courseTitle}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={isVirtual ? "purple" : "primary"}
                              size="sm"
                            >
                              {isVirtual ? "مجازی" : "حضوری"}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {price === 0 ? (
                              <span className="text-success font-bold">
                                رایگان
                              </span>
                            ) : (
                              <span>
                                {toPersianDigits(
                                  price.toLocaleString("fa-IR")
                                )}{" "}
                                تومان
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-text-muted text-xs">
                            {formatJalaliDate(enr.createdAt, {
                              withTime: true,
                            })}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
