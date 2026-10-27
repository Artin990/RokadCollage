"use client";

import React, { useState, useEffect } from "react";
import { Filter, X, Check } from "lucide-react";
import { toFa } from "./BlogIcons.jsx";
import { ROTS } from "../data/blogIndexData.js";
import { getBlogs } from "@/services/blogService.js";

const DEFAULT_CATEGORIES = [
  { id: "all", label: "همه", color: "var(--ink)", bg: "#fff" },
  { id: "فرانتاند", label: "فرانت‌اند", color: "var(--teal)", bg: "var(--teal-light)" },
  { id: "بکاند", label: "بک‌اند", color: "var(--navy)", bg: "var(--bg-lavender)" },
  { id: "گرافیک", label: "گرافیک و دیزاین", color: "var(--accent)", bg: "var(--bg-blush)" },
  { id: "مسیر شغلی", label: "مسیر شغلی", color: "var(--college-dark)", bg: "var(--college-light)" },
  { id: "MBA", label: "مدیریت و کسب‌وکار", color: "var(--navy)", bg: "var(--bg-lavender)" },
  { id: "زبان", label: "زبان تخصصی", color: "var(--teal-dark)", bg: "var(--bg-mint)" },
];

export default function BlogCategories({ active, setActive }) {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES.map((c) => ({ ...c, count: 0 })));
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getBlogs({ limit: 100 })
      .then((res) => {
        if (!isMounted) return;
        const list = Array.isArray(res) ? res : res?.data || [];
        const counts = {};
        list.forEach((b) => {
          if (b.category) {
            counts[b.category] = (counts[b.category] || 0) + 1;
          }
        });

        setCategories(
          DEFAULT_CATEGORIES.map((c) => ({
            ...c,
            count: c.id === "all" ? list.length : counts[c.id] || 0,
          }))
        );
      })
      .catch((err) => console.error("Failed to fetch blog counts:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  const activeCategoryObj = categories.find((c) => c.id === active) || categories[0];

  return (
    <section className="bi-cats">
      <div className="container">
        {/* Mobile View: Filter Bar with Modal trigger */}
        <div className="sm:hidden flex items-center justify-between gap-3 p-3 bg-stone-50 border-2 border-[#1f1e1d] rounded-[14px_0_14px_0] shadow-[2.5px_2.5px_0_#1f1e1d]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-500">دسته‌بندی:</span>
            <span className="text-xs font-black text-[#1f1e1d] bg-white px-2.5 py-0.5 border border-[#1f1e1d] rounded-md shadow-xs">
              {activeCategoryObj?.label}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f8a41d] text-[#1f1e1d] font-black text-xs border border-[#1f1e1d] rounded-[8px_0_8px_0] shadow-[1.5px_1.5px_0_#1f1e1d]"
          >
            <Filter size={13} />
            <span>فیلترها</span>
          </button>
        </div>

        {/* Desktop View: Chip Row */}
        <div className="hidden sm:flex bi-chip-row">
          {categories.map((c, i) => {
            const isActive = active === c.id;
            const rot = ROTS[i % ROTS.length] || "0deg";
            return (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                style={{
                  background: isActive ? c.color : c.bg,
                  color: isActive ? "#fff" : c.color,
                  borderColor: isActive ? "var(--ink)" : "rgba(41,40,39,.15)",
                  transform: isActive ? "rotate(0deg) scale(1.05)" : `rotate(${rot})`,
                  boxShadow: isActive ? "3px 3px 0 var(--ink)" : "none",
                  zIndex: isActive ? 2 : 1,
                }}
              >
                {c.label}
                <span
                  className="bi-chip-count"
                  style={{
                    background: isActive ? "rgba(255,255,255,.25)" : "#fff",
                    color: isActive ? "#fff" : c.color,
                  }}
                >
                  {toFa(c.count)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4"
          onClick={() => setModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-sm bg-white border-t-2 sm:border-2 border-[#1f1e1d] rounded-[24px_24px_0_0] sm:rounded-[20px_0_20px_0] p-5 shadow-[4px_4px_0_#1f1e1d] text-right"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
              <div className="flex items-center gap-2 font-black text-sm text-[#1f1e1d]">
                <Filter size={16} />
                <span>فیلتر دسته‌بندی مقالات</span>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-7 h-7 rounded-full border border-stone-800 flex items-center justify-center hover:bg-stone-100"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-1.5 max-h-[60vh] overflow-y-auto py-1">
              {categories.map((c) => {
                const isSelected = active === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setActive(c.id);
                      setModalOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-[#f8a41d]/15 border-[#1f1e1d] text-[#1f1e1d]"
                        : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isSelected ? <Check size={14} className="text-[#1f1e1d]" /> : <span className="w-3.5" />}
                      <span>{c.label}</span>
                    </div>
                    <span className="text-[11px] font-black text-stone-400 bg-white px-2 py-0.5 rounded border border-stone-200">
                      {toFa(c.count)}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-full py-2 bg-[#1f1e1d] text-white font-black text-xs rounded-[8px_0_8px_0] shadow-[2px_2px_0_#1f1e1d]"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
