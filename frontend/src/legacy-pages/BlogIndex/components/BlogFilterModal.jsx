"use client";

import React, { useEffect, useRef } from "react";
import { toFa } from "./BlogIcons.jsx";
import { DEFAULT_CATEGORIES } from "./BlogCategories.jsx";

export const SORTS = [
  { id: "newest", label: "جدیدترین" },
  { id: "oldest", label: "قدیمی‌ترین" },
  { id: "popular", label: "پرخواننده‌ترین" },
];

export default function BlogFilterModal({
  isOpen,
  onClose,
  activeCategory,
  setActiveCategory,
  sortBy,
  setSortBy,
  categoryCounts = {},
  totalCount = 0,
}) {
  const filterRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
    let prevOverflow = "";
    if (isMobile) {
      prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }

    const onDoc = (e) => {
      if (typeof window !== "undefined" && window.innerWidth > 768) {
        if (
          filterRef.current &&
          !filterRef.current.contains(e.target) &&
          !e.target.closest(".dp-filter-btn")
        ) {
          onClose();
        }
      }
    };
    document.addEventListener("mousedown", onDoc);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDoc);
      if (isMobile) {
        document.body.style.overflow = prevOverflow;
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeCount = (activeCategory !== "all" ? 1 : 0) + (sortBy !== "newest" ? 1 : 0);

  const resetFilters = () => {
    setActiveCategory("all");
    setSortBy("newest");
  };

  return (
    <div
      className="dp-filter-scrim"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="فیلترها"
    >
      <div className="dp-filter-modal" ref={filterRef} onClick={(e) => e.stopPropagation()}>
        <div className="dp-sheet-handle" aria-hidden="true" />

        {/* سربرگ مودال */}
        <div className="dp-filter-head">
          <div className="dp-filter-head-title">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="7" y1="12" x2="17" y2="12" />
              <line x1="10" y1="17" x2="14" y2="17" />
            </svg>
            <span>فیلترهای مقاله‌ها</span>
            {activeCount > 0 && <span className="dp-filter-count">{toFa(activeCount)}</span>}
          </div>
          <div className="dp-filter-actions">
            {activeCount > 0 && (
              <button type="button" className="dp-reset" onClick={resetFilters}>
                پاک کردن همه
              </button>
            )}
            <button type="button" className="dp-filter-close" onClick={onClose} aria-label="بستن">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* بدنه فیلترها */}
        <div className="dp-filter-body">
          {/* بخش مرتب‌سازی */}
          <div className="dp-fgroup">
            <div className="dp-fgroup-title">مرتب‌سازی</div>
            <div className="dp-segment">
              {SORTS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={sortBy === s.id ? "on" : ""}
                  onClick={() => setSortBy(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* بخش دسته‌بندی */}
          <div className="dp-fgroup">
            <div className="dp-fgroup-title">دسته‌بندی</div>
            <div className="dp-check-list">
              {DEFAULT_CATEGORIES.map((c) => {
                const isChecked = activeCategory === c.id;
                const count = c.id === "all" ? totalCount : categoryCounts[c.id] || 0;
                return (
                  <label
                    key={c.id}
                    className="dp-check-item"
                    onClick={() => setActiveCategory(c.id)}
                  >
                    <input
                      type="radio"
                      name="blog-cat"
                      checked={isChecked}
                      onChange={() => setActiveCategory(c.id)}
                    />
                    <span className="dp-check-box" />
                    <span className="dp-check-label">{c.label}</span>
                    <span className="dp-check-count">{toFa(count)}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* فوتر موبایل با دکمه اعمال فیلتر */}
        <div className="dp-filter-footer sm:hidden p-3 border-t-2 border-dashed border-stone-200 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-[#f8a41d] hover:bg-[#e69315] text-[#1f1e1d] font-black text-sm border-2 border-[#1f1e1d] rounded-xl shadow-[3px_3px_0_#1f1e1d] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_#1f1e1d] transition-all"
          >
            اعمال فیلتر
          </button>
        </div>
      </div>
    </div>
  );
}
