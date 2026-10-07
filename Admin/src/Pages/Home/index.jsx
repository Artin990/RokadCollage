import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../Store/Slices/authSlice";
import SchoolIcon from "@mui/icons-material/School";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CommentIcon from "@mui/icons-material/Comment";
import ArticleIcon from "@mui/icons-material/Article";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SettingsIcon from "@mui/icons-material/Settings";
import { Button } from "../../Components/UI";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth");
  };

  const menuItems = [
    {
      id: 1,
      title: "دوره‌های حضوری",
      subtitle: "In-Person Workshops",
      desc: "تعریف کارگاه‌های حضوری، مدیریت کدهای کلاس، ظرفیت و موقعیت مکانی",
      path: "/in-person-courses",
      icon: <SchoolIcon style={{ fontSize: "2.4rem" }} />,
      bgClass: "bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600",
      shadowClass: "shadow-orange-500/20",
    },
    {
      id: 2,
      title: "دوره‌های مجازی",
      subtitle: "Virtual / SpotPlayer Courses",
      desc: "مدیریت دوره‌های آنلاین، جلسات و صدور لایسنس اسپات‌پلیر",
      path: "/virtual-courses",
      icon: <OndemandVideoIcon style={{ fontSize: "2.4rem" }} />,
      bgClass: "bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600",
      shadowClass: "shadow-purple-500/20",
    },
    {
      id: 3,
      title: "مدیریت ثبت‌نام‌ها",
      subtitle: "Enrollments & Licenses",
      desc: "مشاهده فراگیران، کدهای کلاس و پیگیری و صدور مجدد لایسنس‌ها",
      path: "/enrollment",
      icon: <ReceiptLongIcon style={{ fontSize: "2.4rem" }} />,
      bgClass: "bg-gradient-to-br from-blue-500 via-indigo-500 to-indigo-600",
      shadowClass: "shadow-indigo-500/20",
    },
    {
      id: 4,
      title: "کیف‌پول‌ها و تراکنش‌ها",
      subtitle: "Wallets & Transactions",
      desc: "گزارش موجودی کاربران، شارژهای درگاه زرین‌پال و تسویه‌حساب‌ها",
      path: "/wallet",
      icon: <AccountBalanceWalletIcon style={{ fontSize: "2.4rem" }} />,
      bgClass: "bg-gradient-to-br from-emerald-500 via-teal-500 to-teal-600",
      shadowClass: "shadow-teal-500/20",
    },
    {
      id: 5,
      title: "مدیریت کاربران",
      subtitle: "User Accounts & Roles",
      desc: "مشاهده، جستجو، ایجاد و تعیین سطوح دسترسی کاربران و مدیران",
      path: "/user",
      icon: <GroupOutlinedIcon style={{ fontSize: "2.4rem" }} />,
      bgClass: "bg-gradient-to-br from-sky-500 via-blue-600 to-blue-700",
      shadowClass: "shadow-blue-500/20",
    },
    {
      id: 6,
      title: "مدیریت معلمان",
      subtitle: "Teachers & Mentors",
      desc: "مدیریت پروفایل، تخصص و تصاویر اساتید و مدرسان آموزشگاه",
      path: "/teacher",
      icon: <PersonOutlineIcon style={{ fontSize: "2.4rem" }} />,
      bgClass: "bg-gradient-to-br from-rose-500 via-pink-600 to-rose-700",
      shadowClass: "shadow-rose-500/20",
    },
    {
      id: 7,
      title: "مدیریت نظرات",
      subtitle: "Student Reviews",
      desc: "بررسی، تایید و ویرایش نظرات و تجربیات دانشجویان در دوره‌ها",
      path: "/comment",
      icon: <CommentIcon style={{ fontSize: "2.4rem" }} />,
      bgClass: "bg-gradient-to-br from-teal-500 via-emerald-600 to-emerald-700",
      shadowClass: "shadow-emerald-500/20",
    },
    {
      id: 8,
      title: "وبلاگ و مقالات",
      subtitle: "Blog & Educational Articles",
      desc: "انتشار و ویرایش مقالات، دسته‌بندی‌ها و تصاویر شاخص وبلاگ",
      path: "/blog",
      icon: <ArticleIcon style={{ fontSize: "2.4rem" }} />,
      bgClass: "bg-gradient-to-br from-cyan-600 via-teal-600 to-teal-700",
      shadowClass: "shadow-teal-500/20",
    },
  ];

  return (
    <div
      dir="rtl"
      className="flex flex-col items-center justify-start min-h-[90vh] p-6 md:p-8 bg-background relative"
    >
      {/* Top Action Bar */}
      <div className="w-full flex justify-between md:justify-end items-center gap-3 mb-6 md:mb-0 md:absolute md:top-8 md:left-8">
        <Button
          variant="primary-subtle"
          size="sm"
          onClick={() => navigate("/seo")}
          icon={<SettingsIcon fontSize="small" />}
        >
          تنظیمات سئو
        </Button>

        <Button
          variant="danger-outline"
          size="sm"
          onClick={handleLogout}
          icon={<LogoutIcon fontSize="small" className="rotate-180" />}
        >
          خروج از حساب
        </Button>
      </div>

      {/* Header Section */}
      <div className="text-center mb-8 space-y-2.5 mt-4 md:mt-2">
        <div className="inline-flex items-center gap-2 bg-primary-light text-text-accent px-4 py-1.5 rounded-full text-xs font-bold border border-primary-border mb-1">
          <span>🎓 پنل مدیریت کالج آموزشی رکاد</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-secondary tracking-tight">
          به داشبورد مدیریت خوش آمدید
        </h1>
        <p className="text-text-secondary text-xs md:text-sm max-w-lg mx-auto">
          جهت مدیریت دوره‌ها، ثبت‌نام‌ها، کاربران، کیف‌پول‌ها و محتوا، یکی از بخش‌های زیر را انتخاب کنید
        </p>
      </div>

      {/* Navigation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => navigate(item.path)}
            className={`
              ${item.bgClass}
              text-white
              rounded-2xl
              p-5
              flex flex-col justify-between
              transition-all duration-300 ease-out
              transform hover:-translate-y-1.5 hover:scale-[1.01]
              shadow-md hover:shadow-xl
              ${item.shadowClass}
              group cursor-pointer select-none text-right min-h-[190px]
            `}
          >
            <div className="flex items-start justify-between w-full">
              <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-colors shrink-0 flex items-center justify-center">
                {item.icon}
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 duration-300 bg-white/20 p-1.5 rounded-lg">
                <ArrowBackIcon fontSize="small" />
              </div>
            </div>

            <div className="flex flex-col items-start mt-4">
              <span className="text-base md:text-lg font-black">{item.title}</span>
              <span className="text-white/80 text-[11px] font-medium mt-0.5">
                {item.subtitle}
              </span>
              <p className="text-white/90 text-xs leading-relaxed mt-1.5 text-right line-clamp-2">
                {item.desc}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
