import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { logout } from "../../Store/Slices/authSlice";
import { AsideMenuPro } from "./AsideMenuPro";

export default function AsidePro({
  onItemClick = null,
  showCloseButton = false,
  onClose = null,
  className = "",
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth");
  };

  return (
    <aside
      dir="rtl"
      className={`shrink-0 w-full lg:w-[270px] h-full lg:h-screen lg:sticky top-0 bg-surface border-l border-border/80 p-3.5 xl:p-4 flex flex-col shadow-xs z-50 overflow-hidden select-none ${className}`}
    >
      {/* 1. Brand Header (Pinned at Top) */}
      <div className="shrink-0 w-full flex items-center justify-between mb-2.5 xl:mb-3 border-b border-border/70 pb-2.5 xl:pb-3 px-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/25 shrink-0 p-1.5">
            <img
              src="/Logo-Type-white.png"
              alt="لوگو کالج رکاد"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-secondary text-base leading-tight">کالج رکاد</span>
            <span className="text-[11px] text-text-muted font-medium">پنل مدیریت آموزشگاه</span>
          </div>
        </div>

        {/* Close button for Mobile Drawer */}
        {showCloseButton && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-hover active:bg-primary-soft/40 transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label="بستن منو"
          >
            <CloseIcon fontSize="small" />
          </button>
        )}
      </div>

      {/* 2. Middle Menus Section (Pinned header, isolated inner submenu scrolling) */}
      <div className="flex-1 min-h-0 w-full flex flex-col overflow-hidden mb-1.5">
        <AsideMenuPro titleMenu="مدیریت کالج" onItemClick={onItemClick} />
      </div>

      {/* 3. Google Workspace Unified Admin Profile Card (Pinned at Bottom, Calm & Cohesive UX) */}
      <div className="shrink-0 pt-2.5 xl:pt-3 border-t border-border/70 mt-auto bg-surface">
        <div className="p-3 rounded-2xl bg-bg-light/80 hover:bg-bg-light border border-border/70 shadow-2xs transition-all duration-200 flex flex-col gap-2.5">
          {/* Identity & Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                  م
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-surface animate-pulse" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-text-primary truncate">مدیر سیستم</span>
                <span className="text-[10px] text-text-muted truncate font-medium">کالج آموزشی رکاد</span>
              </div>
            </div>

            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
              آنلاین
            </span>
          </div>

          {/* Quick Utilities: SEO Settings & Logout */}
          <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-border/60">
            <button
              type="button"
              onClick={() => {
                navigate("/seo");
                if (onItemClick) onItemClick();
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer select-none active:scale-[0.98] ${
                location.pathname.startsWith("/seo")
                  ? "bg-primary text-on-primary shadow-xs shadow-primary/30"
                  : "text-text-secondary hover:text-primary hover:bg-primary-soft/80"
              }`}
              title="تنظیمات سئو و متادیتا"
            >
              <SettingsOutlinedIcon sx={{ fontSize: 16 }} />
              <span>تنظیمات سئو</span>
              {location.pathname.startsWith("/seo") && (
                <span className="w-1.5 h-1.5 rounded-full bg-on-primary/90 shrink-0 animate-pulse ms-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold text-text-muted hover:text-error hover:bg-error-light/80 active:scale-[0.98] transition-all duration-200 cursor-pointer select-none"
              title="خروج از حساب کاربری"
            >
              <LogoutIcon sx={{ fontSize: 16 }} className="rotate-180" />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
