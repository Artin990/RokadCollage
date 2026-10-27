"use client";

import React from "react";
import Link from "next/link";
import { Home, BookOpen, Compass } from "lucide-react";
import PatternLayer from "@/components/PatternLayer";

export default function NotFoundContent() {
  return (
    <div
      className="relative min-h-[75vh] flex items-center justify-center px-4 py-12 sm:py-16 overflow-hidden bg-white"
      dir="rtl"
    >
      <PatternLayer rotate={0} />

      {/* Floating decorative stickers */}
      <div className="hidden sm:flex absolute top-12 right-12 z-10 pointer-events-none transform -rotate-6">
        <span className="bg-[#f8a41d] text-[#1f1e1d] font-black text-xs px-3.5 py-1 border-2 border-[#1f1e1d] rounded-[10px_0_10px_0] shadow-[2.5px_2.5px_0_#1f1e1d]">
          ✦ خطای ۴۰۴
        </span>
      </div>

      <div className="hidden sm:flex absolute bottom-12 left-12 z-10 pointer-events-none transform rotate-6">
        <span className="bg-[#59bbaf] text-white font-extrabold text-xs px-3 py-1 border-2 border-[#1f1e1d] rounded-[10px_0_10px_0] shadow-[2.5px_2.5px_0_#1f1e1d]">
          صفحه نامعتبر
        </span>
      </div>

      {/* Neo-brutalist Card */}
      <div className="relative max-w-[440px] w-full">
        {/* Card shadow */}
        <div className="absolute inset-0 translate-x-2.5 translate-y-2.5 sm:translate-x-3 sm:translate-y-3 bg-[#1f1e1d] rounded-[24px_0_24px_0] pointer-events-none" />

        {/* Card body */}
        <div className="relative z-10 bg-white border-2 border-[#1f1e1d] rounded-[24px_0_24px_0] p-6 sm:p-8 text-center overflow-hidden">
          {/* Retro window header strip */}
          <div className="flex items-center justify-between pb-3.5 mb-5 border-b-2 border-dashed border-[#1f1e1d]/20">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e63946] border border-[#1f1e1d]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#f8a41d] border border-[#1f1e1d]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#59bbaf] border border-[#1f1e1d]" />
            </div>
            <span className="text-[11px] font-black text-[#62605b] tracking-wider">
              کالج رکاد · ۴۰۴
            </span>
            <div className="w-8" />
          </div>

          {/* 404 Visual Display */}
          <div className="my-4 select-none flex items-center justify-center gap-3">
            <span className="text-6xl sm:text-7xl font-black text-[#1f1e1d] leading-none">
              ۴
            </span>
            <div className="relative inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 bg-[#f8a41d] border-2 border-[#1f1e1d] rounded-[16px_0_16px_0] shadow-[3px_3px_0_#1f1e1d] transform -rotate-3 hover:rotate-3 transition-transform">
              <span className="text-3xl sm:text-4xl text-[#1f1e1d] font-black">
                ۰
              </span>
              <span className="absolute -top-2 -right-2 bg-[#21295a] text-white text-[9px] font-black px-1.5 py-0.5 border border-[#1f1e1d] rounded-[5px_0_5px_0]">
                ✦
              </span>
            </div>
            <span className="text-6xl sm:text-7xl font-black text-[#1f1e1d] leading-none">
              ۴
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-xl sm:text-2xl font-black text-[#1f1e1d] mt-2 mb-2">
            صفحه پیدا نشد
          </h1>

          {/* Explanatory text */}
          <p className="text-[#62605b] text-xs sm:text-sm font-semibold mb-6 leading-relaxed">
            آدرس مورد نظر یافت نشد یا به نشانی دیگری منتقل شده است.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#f8a41d] hover:bg-[#e08a0d] text-[#1f1e1d] font-black text-xs sm:text-sm border-2 border-[#1f1e1d] rounded-[10px_0_10px_0] shadow-[2.5px_2.5px_0_#1f1e1d] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3.5px_3.5px_0_#1f1e1d] transition-all"
            >
              <Home size={15} strokeWidth={2.5} />
              <span>صفحه اصلی</span>
            </Link>

            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-[#fff4e5] text-[#1f1e1d] font-black text-xs sm:text-sm border-2 border-[#1f1e1d] rounded-[10px_0_10px_0] shadow-[2.5px_2.5px_0_#1f1e1d] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3.5px_3.5px_0_#1f1e1d] transition-all"
            >
              <BookOpen size={15} strokeWidth={2.5} />
              <span>دوره‌ها</span>
            </Link>

            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#fff4e5] text-[#1f1e1d] font-black text-xs sm:text-sm border-2 border-[#1f1e1d] rounded-[10px_0_10px_0] shadow-[2.5px_2.5px_0_#1f1e1d] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3.5px_3.5px_0_#1f1e1d] transition-all"
            >
              <Compass size={15} strokeWidth={2.5} />
              <span>مجله</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
