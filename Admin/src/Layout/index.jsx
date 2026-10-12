import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import AsidePro from "../Components/AsidePro";
import ErrorBoundary from "../Components/ErrorBoundary";
import { logout } from "../Store/Slices/authSlice";

export default function Layout() {
  const token = useSelector((state) => state.auth.token);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Automatically close mobile drawer when navigating to a new route
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [location.pathname]);

  // Handle escape key to close drawer & lock body scroll when open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && mobileDrawerOpen) {
        setMobileDrawerOpen(false);
      }
    };

    if (mobileDrawerOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileDrawerOpen]);

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth");
  };

  // Bottom Navigation quick routes
  const bottomNavItems = [
    {
      label: "داشبورد",
      path: "/",
      icon: <DashboardIcon fontSize="small" />,
      isActive: location.pathname === "/",
    },
    {
      label: "دوره‌ها",
      path: "/virtual-courses",
      icon: <SchoolIcon fontSize="small" />,
      isActive:
        location.pathname.startsWith("/virtual-courses") ||
        location.pathname.startsWith("/in-person-courses"),
    },
    {
      label: "ثبت‌نام‌ها",
      path: "/enrollment",
      icon: <ReceiptLongIcon fontSize="small" />,
      isActive: location.pathname.startsWith("/enrollment"),
    },
    {
      label: "کاربران",
      path: "/user",
      icon: <GroupOutlinedIcon fontSize="small" />,
      isActive: location.pathname.startsWith("/user"),
    },
    {
      label: "منو کامل",
      isMenuTrigger: true,
      icon: <MenuIcon fontSize="small" />,
      isActive: mobileDrawerOpen,
    },
  ];

  return (
    <div dir="rtl" className="flex h-screen w-full overflow-hidden bg-background">
      {/* 1. Desktop Persistent Sidebar (Visible only on lg and above) */}
      <AsidePro className="hidden lg:flex" />

      {/* 2. Mobile Slide-Over Navigation Drawer */}
      {mobileDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 lg:hidden flex"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Slide-out Drawer Panel */}
          <div className="relative z-50 h-full w-[285px] max-w-[85vw] bg-surface shadow-2xl flex flex-col border-l border-border/80 animate-slideInRight">
            <AsidePro
              onItemClick={() => setMobileDrawerOpen(false)}
              showCloseButton={true}
              onClose={() => setMobileDrawerOpen(false)}
              className="w-full h-full border-none shadow-none"
            />
          </div>
        </div>
      )}

      {/* 3. Main Workspace Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Mobile Top App Bar (Visible only on screens below lg) */}
        <header className="lg:hidden sticky top-0 z-30 bg-surface/95 backdrop-blur-md border-b border-border/80 px-3.5 sm:px-4 py-2.5 flex items-center justify-between shadow-xs shrink-0 select-none">
          {/* Right: Hamburger button & Brand */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="p-2 -ms-1 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-hover active:bg-primary-soft transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label="باز کردن منو"
            >
              <MenuIcon fontSize="medium" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shadow-xs p-1">
                <img
                  src="/Logo-Type-white.png"
                  alt="لوگو کالج رکاد"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-secondary text-sm leading-tight">
                  کالج رکاد
                </span>
                <span className="text-[10px] text-text-muted font-medium">
                  پنل مدیریت
                </span>
              </div>
            </div>
          </div>

          {/* Left: Quick Actions */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => navigate("/seo")}
              className={`p-2 rounded-xl text-text-muted hover:text-primary hover:bg-primary-soft transition-colors cursor-pointer ${
                location.pathname.startsWith("/seo") ? "text-primary bg-primary-soft" : ""
              }`}
              title="تنظیمات سئو سایت"
              aria-label="تنظیمات سئو سایت"
            >
              <SettingsOutlinedIcon fontSize="small" />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-xl text-text-muted hover:text-error hover:bg-error-light transition-colors cursor-pointer"
              title="خروج از حساب"
              aria-label="خروج"
            >
              <LogoutIcon fontSize="small" className="rotate-180" />
            </button>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main id="main-content" className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>

        {/* 4. Google Material 3 Mobile Bottom Navigation Bar (Visible only on screens below lg) */}
        <nav
          aria-label="ناوبری سریع موبایل"
          className="lg:hidden shrink-0 z-30 bg-surface/95 backdrop-blur-md border-t border-border/80 flex items-center justify-around h-16 shadow-lg px-1 select-none"
        >
          {bottomNavItems.map((item, idx) => {
            const handleClick = () => {
              if (item.isMenuTrigger) {
                setMobileDrawerOpen(true);
              } else {
                navigate(item.path);
              }
            };

            return (
              <button
                key={idx}
                type="button"
                onClick={handleClick}
                className={`flex-1 flex flex-col items-center justify-center gap-1 h-full py-1.5 cursor-pointer transition-all duration-200 ${
                  item.isActive
                    ? "text-primary font-black"
                    : "text-text-muted hover:text-text-secondary font-medium"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-6.5 rounded-full transition-all duration-200 ${
                    item.isActive ? "bg-primary-soft text-primary" : "text-inherit"
                  }`}
                >
                  {item.icon}
                </div>
                <span className="text-[10px] sm:text-[11px] tracking-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
