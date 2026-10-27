"use client";

import Link from "next/link";
import { Home, BookOpen, Compass, ArrowLeft } from "lucide-react";
import PatternLayer from "@/components/PatternLayer";

export default function NotFoundContent() {
  return (
    <div className="relative min-h-[75vh] flex items-center justify-center px-4 py-10 sm:py-14 overflow-hidden bg-white" dir="rtl">
      <PatternLayer rotate={0} />

      {/* Floating decorative stickers */}
      <div className="hidden sm:flex absolute top-10 right-10 z-10 pointer-events-none transform -rotate-6">
        <span className="bg-[#f8a41d] text-[#1f1e1d] font-black text-xs px-3 py-1 border-2 border-[#1f1e1d] rounded-[10px_0_10px_0] shadow-[2.5px_2.5px_0_#1f1e1d]">
          ✦ خطای ۴۰۴
        </span>
      </div>

      <div className="hidden sm:flex absolute bottom-10 left-10 z-10 pointer-events-none transform rotate-6">
        <span className="bg-[#59bbaf] text-white font-extrabold text-xs px-3 py-1 border-2 border-[#1f1e1d] rounded-[10px_0_10px_0] shadow-[2.5px_2.5px_0_#1f1e1d]">
          مسیر نامعتبر
        </span>
      </div>

      {/* Main Neo-brutalist Card */}
      <div className="relative max-w-[480px] w-full">
        {/* Card shadow */}
        <div className="absolute inset-0 translate-x-2.5 translate-y-2.5 sm:translate-x-3 sm:translate-y-3 bg-[#1f1e1d] rounded-[24px_0_24px_0] pointer-events-none" />

        {/* Card body */}
        <div className="relative z-10 bg-white border-[2.5px] border-[#1f1e1d] rounded-[24px_0_24px_0] p-5 sm:p-7 text-center overflow-hidden">
          {/* Retro window header strip */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-dashed border-[#1f1e1d]/20">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e63946] border border-[#1f1e1d]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#f8a41d] border border-[#1f1e1d]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#59bbaf] border border-[#1f1e1d]" />
            </div>
            <span className="text-[11px] font-black text-[#62605b] tracking-wider">
              کالج رکاد · ۴۰۴
            </span>
            <div className="w-10" />
          </div>

          {/* 404 Visual Composition */}
          <div className="relative my-2 sm:my-3 select-none">
            <div className="text-[64px] sm:text-[80px] font-black leading-none tracking-tight text-[#1f1e1d] flex items-center justify-center gap-2.5">
              <span>۴</span>
              <div className="relative inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-[#f8a41d] border-[2.5px] border-[#1f1e1d] rounded-[16px_0_16px_0] shadow-[3px_3px_0_#1f1e1d] transform -rotate-3 hover:rotate-3 transition-transform">
                <span className="text-3xl sm:text-4xl text-[#1f1e1d] font-black">۰</span>
                <span className="absolute -top-2 -right-2 bg-[#21295a] text-white text-[9px] font-black px-1.5 py-0.5 border border-[#1f1e1d] rounded-[5px_0_5px_0]">
                  ✦
                </span>
              </div>
              <span>۴</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-xl sm:text-2xl font-black text-[#1f1e1d] mb-1.5">
            صفحه پیدا نشد
          </h1>

          {/* Explanatory text */}
          <p className="text-[#62605b] text-xs sm:text-sm font-semibold mb-5">
            آدرس نامعتبر است یا صفحه حذف شده است.
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
