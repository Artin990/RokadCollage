import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SchoolIcon from "@mui/icons-material/School";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import CommentIcon from "@mui/icons-material/Comment";
import ArticleIcon from "@mui/icons-material/Article";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";

/**
 * Single navigation item button with touch-friendly ergonomics
 */
function AsideItemPro({ title, onClick, isActive = false, icon = null }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full flex-1 min-h-[36px] max-h-[44px] py-1 px-3 sm:px-3.5 rounded-xl cursor-pointer text-right transition-all duration-200 flex items-center justify-between active:scale-[0.98] select-none text-xs lg:text-[13px]
        ${
          isActive
            ? "bg-primary text-on-primary font-bold shadow-xs shadow-primary/30"
            : "text-text-secondary hover:bg-primary-soft hover:text-primary-text active:bg-primary/20 font-medium"
        }
      `}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {icon && <span className="shrink-0 flex items-center text-inherit">{icon}</span>}
        <span className="truncate">{title}</span>
      </div>
      {isActive && (
        <span className="w-1.5 h-1.5 rounded-full bg-on-primary/90 shrink-0 animate-pulse ms-2" />
      )}
    </button>
  );
}

/**
 * AsideMenuPro
 * Responsive navigation menu for Admin sidebar and mobile drawer
 */
export function AsideMenuPro({ titleMenu = "بخش‌های مدیریت", onItemClick = null }) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { title: "داشبورد اصلی", path: "/", icon: <DashboardIcon fontSize="small" /> },
    { title: "دوره‌های حضوری", path: "/in-person-courses", icon: <SchoolIcon fontSize="small" /> },
    { title: "دوره‌های مجازی", path: "/virtual-courses", icon: <OndemandVideoIcon fontSize="small" /> },
    { title: "دیدگاه‌های دوره‌ها", path: "/course-comments", icon: <ForumOutlinedIcon fontSize="small" /> },
    { title: "ثبت‌نام‌ها", path: "/enrollment", icon: <ReceiptLongIcon fontSize="small" /> },
    { title: "کیف‌پول‌ها و تراکنش‌ها", path: "/wallet", icon: <AccountBalanceWalletIcon fontSize="small" /> },
    { title: "کاربران", path: "/user", icon: <GroupOutlinedIcon fontSize="small" /> },
    { title: "معلمان", path: "/teacher", icon: <PersonOutlineIcon fontSize="small" /> },
    { title: "نظرات و رضایت‌ها", path: "/comment", icon: <CommentIcon fontSize="small" /> },
    { title: "بلاگ‌ها", path: "/blog", icon: <ArticleIcon fontSize="small" /> },
  ];

  const isCurrentActive = (itemPath) => {
    if (itemPath === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(itemPath);
  };

  const handleItemClick = (path) => {
    navigate(path);
    if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <div className="w-full h-full flex flex-col min-h-0 text-right">
      {/* 1. Pinned Tab Header (Never scrolls, permanently fixed in place) */}
      <div className="shrink-0 pb-1.5">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full cursor-pointer flex justify-between items-center px-3 py-2 rounded-xl transition-all duration-200 hover:bg-surface-hover active:bg-primary-soft/40 select-none group"
          aria-expanded={open}
        >
          <span className="font-bold text-secondary text-xs md:text-sm">
            {titleMenu}
          </span>
          <KeyboardArrowDownIcon
            className="transition-transform duration-300 text-text-secondary group-hover:text-primary"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
            fontSize="small"
          />
        </button>
      </div>

      {/* 2. Isolated Scrollable Items (Only submenu items scroll when they overflow) */}
      {open && (
        <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar overscroll-contain ps-2 sm:ps-3 border-s-2 border-primary/20 ms-2 flex flex-col gap-1 pe-0.5">
          {navigationItems.map((item) => (
            <AsideItemPro
              key={item.path}
              title={item.title}
              icon={item.icon}
              isActive={isCurrentActive(item.path)}
              onClick={() => handleItemClick(item.path)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AsideMenuPro;
