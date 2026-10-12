import React from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { toPersianDigits } from "../../../Utils/jalaliDate";

/**
 * Standard Accessible Pagination Component
 */
export function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = "",
}) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  return (
    <nav
      aria-label="صفحه‌بندی"
      className={`flex items-center justify-center gap-1.5 py-4 ${className}`}
    >
      {/* Previous button */}
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="صفحه قبل"
        className="h-9 w-9 rounded-xl flex items-center justify-center text-text-secondary border border-border bg-surface hover:bg-surface-hover hover:border-border-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer active:scale-95"
      >
        <ChevronRightIcon fontSize="small" />
      </button>

      {/* Number buttons */}
      {getPageNumbers().map((page, index) => {
        if (page === "...") {
          return (
            <span
              key={`dots-${index}`}
              className="w-9 h-9 flex items-center justify-center text-text-muted select-none text-xs"
            >
              ...
            </span>
          );
        }

        const isActive = page === currentPage;

        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={isActive ? "page" : undefined}
            className={`
              h-9 min-w-[36px] px-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center justify-center select-none active:scale-95
              ${
                isActive
                  ? "bg-primary text-on-primary font-black shadow-xs shadow-primary/30"
                  : "bg-surface text-text-secondary border border-border hover:bg-surface-hover hover:border-border-hover hover:text-text-primary"
              }
            `}
          >
            {toPersianDigits(page)}
          </button>
        );
      })}

      {/* Next button */}
      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="صفحه بعد"
        className="h-9 w-9 rounded-xl flex items-center justify-center text-text-secondary border border-border bg-surface hover:bg-surface-hover hover:border-border-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer active:scale-95"
      >
        <ChevronLeftIcon fontSize="small" />
      </button>
    </nav>
  );
}

export default Pagination;
