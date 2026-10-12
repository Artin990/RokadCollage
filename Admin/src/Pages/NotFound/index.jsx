import React from "react";
import { useNavigate } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ExploreOffOutlinedIcon from "@mui/icons-material/ExploreOffOutlined";
import { Button } from "../../Components/UI";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      dir="rtl"
      className="min-h-full w-full flex-1 flex items-center justify-center p-4 sm:p-6 text-center select-none animate-fadeIn my-auto"
    >
      <div className="w-full max-w-md bg-surface rounded-3xl border border-border/80 shadow-xl p-6 sm:p-8 flex flex-col items-center gap-4">
        {/* Visual Icon Container */}
        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-primary-soft text-primary flex items-center justify-center shadow-xs border border-primary-border/60">
          <ExploreOffOutlinedIcon style={{ fontSize: "2.5rem" }} />
        </div>

        {/* 404 Headline */}
        <span className="text-5xl sm:text-6xl font-black text-secondary tracking-tight">۴۰۴</span>

        <div className="flex flex-col gap-1.5">
          <h1 className="text-lg sm:text-xl font-black text-secondary">
            صفحه مورد نظر یافت نشد
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-sm mx-auto font-medium">
            صفحه‌ای که به دنبال آن بودید تغییر نام یافته، منتقل شده یا در دسترس نیست.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate("/")}
            icon={<HomeOutlinedIcon fontSize="small" />}
            className="flex-1 w-full"
          >
            داشبورد اصلی
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate(-1)}
            icon={<ArrowForwardIcon fontSize="small" />}
            className="flex-1 w-full"
          >
            صفحه قبل
          </Button>
        </div>
      </div>
    </div>
  );
}
