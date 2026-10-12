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
 * LoadingState: Smooth loading view with stable min-height to prevent layout shift (CLS).
 */
export function LoadingState({
  text = "در حال دریافت اطلاعات...",
  className = "",
  size = 9,
  minHeight = "min-h-[320px]",
  card = true,
}) {
  return (
    <div
      className={`w-full ${minHeight} flex flex-col items-center justify-center gap-3.5 text-center ${
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
 * TableSkeleton: Shimmering table rows to prevent layout shift in data tables
 */
export function TableSkeleton({ rows = 5, cols = 5, className = "" }) {
  return (
    <div className={`bg-surface rounded-2xl border border-border/80 shadow-2xs overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-bg-subtle/90 border-b border-border/80">
              {Array.from({ length: cols }).map((_, i) => (
                <th key={i} className="py-3.5 px-4">
                  <div className="h-4 bg-border/60 rounded-md animate-pulse w-3/4" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {Array.from({ length: rows }).map((_, rIdx) => (
              <tr key={rIdx} className="hover:bg-bg-subtle/20">
                {Array.from({ length: cols }).map((_, cIdx) => (
                  <td key={cIdx} className="py-3.5 px-4">
                    <div
                      className={`h-3.5 bg-border/50 rounded-md animate-pulse ${
                        cIdx === 0 ? "w-8" : cIdx === 1 ? "w-4/5" : "w-1/2"
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
 * CardGridSkeleton: Shimmering cards grid placeholder
 */
export function CardGridSkeleton({ count = 6, cols = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" }) {
  return (
    <div className={`grid ${cols} gap-6 items-stretch`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-surface rounded-2xl border border-border/80 p-5 flex flex-col justify-between min-h-[220px] shadow-2xs animate-pulse"
        >
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="h-5 w-20 bg-border/60 rounded-lg" />
              <div className="h-5 w-12 bg-border/40 rounded-lg" />
            </div>
            <div className="h-4 bg-border/70 rounded-md w-3/4 mt-2" />
            <div className="h-3 bg-border/40 rounded-md w-full" />
            <div className="h-3 bg-border/40 rounded-md w-2/3" />
          </div>
          <div className="pt-4 border-t border-border/50 flex justify-between items-center mt-4">
            <div className="h-6 w-24 bg-border/50 rounded-lg" />
            <div className="h-8 w-24 bg-border/60 rounded-xl" />
          </div>
        </div>
      ))}
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
      <TableSkeleton rows={7} cols={6} />
    </div>
  );
}

export default { EmptyState, LoadingState, TableSkeleton, CardGridSkeleton, ErrorState, PageSkeleton };
