"use client";

import React from "react";
import { Filter, X, Check } from "lucide-react";
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
      aria-label="فیلترهای مقالات"
    >
      <div className="dp-filter-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dp-sheet-handle" aria-hidden="true" />
        
        {/* هدر مودال */}
        <div className="dp-filter-head">
          <div className="dp-filter-head-title">
            <Filter size={18} />
            <span>فیلترها</span>
            {activeCount > 0 && <span className="dp-filter-count">{toFa(activeCount)}</span>}
          </div>
          <div className="dp-filter-actions">
            {activeCount > 0 && (
              <button type="button" className="dp-reset text-xs font-bold text-stone-500 hover:text-stone-900" onClick={resetFilters}>
                پاک کردن
              </button>
            )}
            <button type="button" className="dp-filter-close" onClick={onClose} aria-label="بستن">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* بدنه فیلترها */}
        <div className="dp-filter-body">
          {/* بخش مرتب‌سازی */}
          <div className="dp-fgroup">
            <div className="dp-fgroup-title text-xs font-extrabold text-stone-700 mb-2">مرتب‌سازی</div>
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
            <div className="dp-fgroup-title text-xs font-extrabold text-stone-700 mb-2">دسته‌بندی</div>
            <div className="flex flex-col gap-1.5">
              {DEFAULT_CATEGORIES.map((c) => {
                const isSelected = activeCategory === c.id;
                const count = c.id === "all" ? totalCount : categoryCounts[c.id] || 0;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveCategory(c.id)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border-2 text-xs font-bold transition-all ${
                      isSelected
                        ? "border-[#1f1e1d] bg-[#f8a41d]/15 text-[#1f1e1d] shadow-[2px_2px_0_#1f1e1d]"
                        : "border-stone-200 bg-white text-stone-700 hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border ${
                          isSelected ? "bg-[#1f1e1d] border-[#1f1e1d] text-white" : "border-stone-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check size={11} strokeWidth={3} />}
                      </div>
                      <span>{c.label}</span>
                    </div>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-extrabold ${
                        isSelected ? "bg-[#1f1e1d] text-white" : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {toFa(count)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* فوتر مودال با دکمه اعمال */}
        <div className="p-3 border-t-2 border-dashed border-stone-200 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-[#f8a41d] hover:bg-[#e69315] text-[#1f1e1d] font-black text-sm border-2 border-[#1f1e1d] rounded-xl shadow-[3px_3px_0_#1f1e1d] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_#1f1e1d] transition-all"
          >
            اعمال
          </button>
        </div>
      </div>
    </div>
  );
}
