import React from "react";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import { BeatLoader } from "react-spinners";
import { Button } from "../Button";
import { LABELS } from "../../../Constants/vocab";

/**
 * EmptyState: Standard empty placeholder across all tables and lists
 */
export function EmptyState({
  title = "موردی یافت نشد",
  description = "در حال حاضر هیچ داده‌ای برای نمایش وجود ندارد.",
  icon = null,
  action = null,
  className = "",
  minHeight = "min-h-[260px]",
}) {
  return (
    <div
      className={`w-full py-12 px-4 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-border/80 bg-bg-light/40 ${minHeight} ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center text-text-muted mb-3 shadow-2xs">
        {icon || <InboxOutlinedIcon style={{ fontSize: "1.75rem" }} />}
      </div>
      <h3 className="text-sm md:text-base font-extrabold text-secondary mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-xs md:text-sm text-text-secondary max-w-sm mb-4">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}

/**
 * LoadingState: Smooth loading view with 100% width/height alignment to prevent layout shift (Zero CLS).
 */
export function LoadingState({
  text = "در حال دریافت اطلاعات...",
  className = "",
  size = 9,
  minHeight = "min-h-[380px]",
  card = true,
}) {
  return (
    <div
      className={`w-full flex-1 ${minHeight} flex flex-col items-center justify-center gap-3.5 text-center ${
        card ? "bg-surface rounded-2xl border border-border/80 shadow-2xs p-8" : "py-12"
      } ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-primary-soft/80 flex items-center justify-center text-primary shadow-2xs border border-primary-border/60">
        <BeatLoader size={size} color="var(--color-primary, #F8A41D)" />
      </div>
      {text && (
        <span className="text-xs md:text-sm text-text-secondary font-bold">
          {text}
        </span>
      )}
    </div>
  );
}

/**
 * TableSkeleton: Shimmering table rows with 100% width and identical proportions to TableContainer
 */
export function TableSkeleton({ rows = 8, cols = 6, className = "" }) {
  return (
    <div className={`w-full overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-2xs ${className}`}>
      <div className="overflow-x-auto w-full overscroll-contain custom-scrollbar">
        <table className="w-full text-right border-collapse select-none">
          <thead>
            <tr className="bg-bg-subtle/90 border-b border-border/80">
              {Array.from({ length: cols }).map((_, i) => (
                <th key={i} className="py-3.5 px-4">
                  <div
                    className={`h-4 bg-border/60 rounded-md animate-pulse ${
                      i === 0 ? "w-8" : i === cols - 1 ? "w-16 mx-auto" : "w-3/5"
                    }`}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {Array.from({ length: rows }).map((_, rIdx) => (
              <tr key={rIdx} className="hover:bg-bg-subtle/20 transition-colors">
                {Array.from({ length: cols }).map((_, cIdx) => (
                  <td key={cIdx} className="py-4 px-4 align-middle">
                    <div
                      className={`h-4 bg-border/50 rounded-md animate-pulse ${
                        cIdx === 0
                          ? "w-7"
                          : cIdx === 1
                          ? "w-4/5"
                          : cIdx === cols - 1
                          ? "w-20 mx-auto"
                          : cIdx % 2 === 0
                          ? "w-1/2"
                          : "w-2/3"
                      }`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * CardGridSkeleton: Shimmering cards grid placeholder matching 100% of real card dimensions and responsive breakpoints
 */
export function CardGridSkeleton({
  count = 8,
  cols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  gap = "gap-4 sm:gap-6",
  variant = "card", // "card" | "comment" | "accordion"
  className = "",
}) {
  return (
    <div className={`grid ${cols} ${gap} items-stretch w-full ${className}`}>
      {Array.from({ length: count }).map((_, i) => {
        // 1. Accordion style (for enrollment lists)
        if (variant === "accordion") {
          return (
            <div
              key={i}
              className="bg-surface rounded-2xl border border-border/80 p-4 sm:p-5 flex items-center justify-between shadow-2xs animate-pulse h-20 w-full"
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-border/60 shrink-0" />
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                  <div className="h-4 bg-border/70 rounded-md w-1/3" />
                  <div className="h-3 bg-border/40 rounded-md w-1/5" />
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="h-7 w-20 bg-border/50 rounded-lg hidden sm:block" />
                <div className="h-8 w-8 bg-border/40 rounded-xl" />
              </div>
            </div>
          );
        }

        // 2. Testimonial comment style (for CommentPage)
        if (variant === "comment") {
          return (
            <div
              key={i}
              className="bg-surface rounded-2xl border border-border/80 p-5 flex flex-col justify-between shadow-2xs animate-pulse min-h-[260px] w-full"
            >
              <div className="flex flex-col gap-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-border/60 shrink-0" />
                    <div className="flex flex-col gap-1.5">
                      <div className="h-4 w-24 bg-border/70 rounded-md" />
                      <div className="h-3 w-16 bg-border/40 rounded-md" />
                    </div>
                  </div>
                  <div className="h-5 w-20 bg-border/40 rounded-lg" />
                </div>
                <div className="space-y-2 mt-2">
                  <div className="h-3.5 bg-border/50 rounded-md w-full" />
                  <div className="h-3.5 bg-border/50 rounded-md w-5/6" />
                  <div className="h-3.5 bg-border/40 rounded-md w-3/4" />
                </div>
              </div>
              <div className="pt-4 border-t border-border/50 flex justify-between items-center mt-4">
                <div className="h-4 w-20 bg-border/40 rounded-md" />
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-border/50 rounded-xl" />
                  <div className="h-8 w-8 bg-border/50 rounded-xl" />
                </div>
              </div>
            </div>
          );
        }

        // 3. Standard full card style (for Courses, Blogs, Teachers - matching real ~380px cards)
        return (
          <div
            key={i}
            className="bg-surface rounded-2xl border border-border/80 p-5 flex flex-col justify-between min-h-[380px] shadow-2xs animate-pulse w-full"
          >
            <div>
              {/* Category & Status Badges */}
              <div className="flex justify-between items-center mb-4">
                <div className="h-6 w-20 bg-border/60 rounded-lg" />
                <div className="h-6 w-14 bg-border/40 rounded-lg" />
              </div>

              {/* Main Media / Image Area */}
              <div className="w-full h-40 bg-border/40 rounded-xl mb-4 overflow-hidden" />

              {/* Title & Description Lines */}
              <div className="h-5 bg-border/70 rounded-md w-3/4 mb-2.5" />
              <div className="h-3.5 bg-border/40 rounded-md w-full mb-1.5" />
              <div className="h-3.5 bg-border/40 rounded-md w-2/3" />
            </div>

            {/* Bottom Meta & Action Toolbar */}
            <div className="pt-4 border-t border-border/50 flex justify-between items-center mt-5">
              <div className="h-6 w-24 bg-border/50 rounded-lg" />
              <div className="h-8.5 w-24 bg-border/60 rounded-xl" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * CommentListSkeleton: Streamlined vertical list placeholder matching 100% of YouTube-style CourseCommentCard
 */
export function CommentListSkeleton({ count = 5, className = "" }) {
  return (
    <div className={`flex flex-col gap-4 w-full ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-surface rounded-2xl border border-border/80 p-4 sm:p-5 shadow-2xs animate-pulse flex flex-col gap-3.5 w-full"
        >
          {/* Header Stream: Avatar, Name, Badge, Date */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-border/60 shrink-0" />
              <div className="flex items-center gap-2">
                <div className="h-4 w-28 bg-border/70 rounded-md" />
                <div className="h-5 w-16 bg-border/40 rounded-lg hidden sm:block" />
              </div>
            </div>
            <div className="h-4 w-20 bg-border/40 rounded-md" />
          </div>

          {/* Comment Body Lines */}
          <div className="space-y-2 pe-2 ps-13">
            <div className="h-3.5 bg-border/50 rounded-md w-full" />
            <div className="h-3.5 bg-border/50 rounded-md w-4/5" />
          </div>

          {/* Action Toolbar Placeholder */}
          <div className="pt-2 ps-13 flex items-center gap-4">
            <div className="h-7 w-14 bg-border/40 rounded-lg" />
            <div className="h-7 w-12 bg-border/40 rounded-lg" />
            <div className="h-7 w-20 bg-border/50 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * DashboardSkeleton: Full 100% layout skeleton for Home/Dashboard (Zero CLS)
 */
export function DashboardSkeleton({ className = "" }) {
  return (
    <div className={`flex flex-col gap-8 w-full animate-fadeIn ${className}`}>
      {/* 1. Key Stats Grid (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface rounded-2xl border border-border/80 p-5 flex items-center justify-between shadow-2xs animate-pulse h-28"
          >
            <div className="flex flex-col gap-2">
              <div className="h-3.5 w-24 bg-border/50 rounded-md" />
              <div className="h-7 w-16 bg-border/70 rounded-lg" />
              <div className="h-3 w-20 bg-border/30 rounded-md" />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-border/40 shrink-0" />
          </div>
        ))}
      </div>

      {/* 2. Charts / Analytics Grid (2 large cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <div className="bg-surface rounded-2xl border border-border/80 p-6 shadow-2xs animate-pulse h-80 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div className="h-5 w-36 bg-border/60 rounded-md" />
            <div className="h-6 w-20 bg-border/40 rounded-lg" />
          </div>
          <div className="h-44 w-full bg-border/30 rounded-xl mt-4" />
        </div>
        <div className="bg-surface rounded-2xl border border-border/80 p-6 shadow-2xs animate-pulse h-80 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div className="h-5 w-36 bg-border/60 rounded-md" />
            <div className="h-6 w-20 bg-border/40 rounded-lg" />
          </div>
          <div className="h-44 w-full bg-border/30 rounded-xl mt-4" />
        </div>
      </div>

      {/* 3. Recent Activity Table */}
      <div className="w-full">
        <div className="h-6 w-36 bg-border/60 rounded-md mb-4 animate-pulse" />
        <TableSkeleton rows={5} cols={6} />
      </div>
    </div>
  );
}

/**
 * FormSkeleton: Multi-section layout placeholder for Edit, Create and Detail views
 */
export function FormSkeleton({ className = "" }) {
  return (
    <div className={`flex flex-col gap-6 w-full animate-fadeIn ${className}`}>
      {/* Top Banner / Hero Card */}
      <div className="w-full bg-surface rounded-2xl border border-border/80 p-6 shadow-2xs animate-pulse flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="w-16 h-16 rounded-2xl bg-border/50 shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-5 w-44 bg-border/70 rounded-md" />
            <div className="h-3.5 w-60 bg-border/40 rounded-md" />
          </div>
        </div>
        <div className="h-10 w-32 bg-border/50 rounded-xl shrink-0 self-end sm:self-auto" />
      </div>

      {/* Form Content Grid: 2 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface rounded-2xl border border-border/80 p-6 shadow-2xs animate-pulse space-y-4">
            <div className="h-5 w-36 bg-border/60 rounded-md mb-6" />
            <div className="h-11 w-full bg-border/40 rounded-xl" />
            <div className="h-11 w-full bg-border/40 rounded-xl" />
            <div className="h-32 w-full bg-border/30 rounded-xl" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface rounded-2xl border border-border/80 p-6 shadow-2xs animate-pulse space-y-4">
            <div className="h-5 w-28 bg-border/60 rounded-md mb-4" />
            <div className="h-44 w-full bg-border/40 rounded-xl" />
            <div className="h-10 w-full bg-border/60 rounded-xl mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * ErrorState: Standard error view with retry action
 */
export function ErrorState({
  title = "خطا در دریافت اطلاعات",
  description = "ارتباط با سرور برقرار نشد یا مشکلی رخ داده است.",
  onRetry = null,
  retryLabel = LABELS.RETRY,
  className = "",
  minHeight = "min-h-[260px]",
}) {
  return (
    <div
      className={`w-full py-12 px-4 flex flex-col items-center justify-center text-center rounded-2xl border border-error/20 bg-error-light/30 ${minHeight} ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-error-light border border-error-border flex items-center justify-center text-error mb-3 shadow-2xs">
        <ErrorOutlineIcon style={{ fontSize: "1.75rem" }} />
      </div>
      <h3 className="text-sm md:text-base font-extrabold text-secondary mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-xs md:text-sm text-text-secondary max-w-sm mb-4">
          {description}
        </p>
      )}
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          icon={<RefreshIcon fontSize="small" />}
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
}

/**
 * PageSkeleton: Full-page layout skeleton for seamless, unified route transitions (Zero CLS & Zero Spinner Flash).
 */
export function PageSkeleton({ className = "" }) {
  return (
    <div dir="rtl" className={`p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col animate-fadeIn ${className}`}>
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="space-y-2">
          <div className="h-7 w-44 sm:w-56 bg-border/60 rounded-xl animate-pulse" />
          <div className="h-4 w-60 sm:w-80 bg-border/40 rounded-lg animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-border/50 rounded-xl animate-pulse self-start sm:self-auto" />
      </div>

      {/* Toolbar / Search Filter Skeleton */}
      <div className="w-full h-14 bg-surface rounded-2xl border border-border/80 p-3 mb-6 flex items-center justify-between gap-3 shadow-2xs">
        <div className="h-8 w-48 sm:w-64 bg-border/40 rounded-xl animate-pulse" />
        <div className="flex items-center gap-2">
          <div className="h-8 w-28 bg-border/40 rounded-xl animate-pulse hidden sm:block" />
          <div className="h-8 w-8 bg-border/50 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Content Table Skeleton */}
      <TableSkeleton rows={8} cols={6} />
    </div>
  );
}

export default {
  EmptyState,
  LoadingState,
  TableSkeleton,
  CardGridSkeleton,
  CommentListSkeleton,
  DashboardSkeleton,
  FormSkeleton,
  ErrorState,
  PageSkeleton,
};
