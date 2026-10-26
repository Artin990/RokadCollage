"use client";

import Link from "next/link";
import { Home, BookOpen, Compass, ArrowLeft } from "lucide-react";
import PatternLayer from "@/components/PatternLayer";

export default function NotFoundContent() {
  return (
    <div className="relative min-h-[75vh] flex items-center justify-center px-4 py-16 overflow-hidden bg-[#fdfbf7]" dir="rtl">
      <PatternLayer rotate={0} />

      {/* Floating decorative stickers */}
      <div className="hidden sm:flex absolute top-12 right-12 z-10 pointer-events-none transform -rotate-6">
        <span className="bg-[#f8a41d] text-[#1f1e1d] font-black text-xs px-3.5 py-1 border-2 border-[#1f1e1d] rounded-[10px_0_10px_0] shadow-[2.5px_2.5px_0_#1f1e1d]">
          ✦ خطای ۴۰۴
        </span>
      </div>

      <div className="hidden sm:flex absolute bottom-12 left-12 z-10 pointer-events-none transform rotate-6">
        <span className="bg-[#59bbaf] text-white font-extrabold text-xs px-3 py-1 border-2 border-[#1f1e1d] rounded-[10px_0_10px_0] shadow-[2.5px_2.5px_0_#1f1e1d]">
          مسیر نامعتبر
        </span>
      </div>

      {/* Main Neo-brutalist Card */}
      <div className="relative max-w-lg w-full">
        {/* Card shadow */}
        <div className="absolute inset-0 translate-x-2.5 translate-y-2.5 sm:translate-x-3.5 sm:translate-y-3.5 bg-[#1f1e1d] rounded-[28px_0_28px_0] pointer-events-none" />

        {/* Card body */}
        <div className="relative z-10 bg-white border-[2.5px] border-[#1f1e1d] rounded-[28px_0_28px_0] p-6 sm:p-10 text-center overflow-hidden">
          {/* Retro window header strip */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-dashed border-[#1f1e1d]/20">
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
          <div className="relative my-4 select-none">
            <div className="text-[72px] sm:text-[96px] font-black leading-none tracking-tight text-[#1f1e1d] flex items-center justify-center gap-3">
              <span>۴</span>
              <div className="relative inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-[#f8a41d] border-[2.5px] border-[#1f1e1d] rounded-[20px_0_20px_0] shadow-[3.5px_3.5px_0_#1f1e1d] transform -rotate-3 hover:rotate-3 transition-transform">
                <span className="text-4xl sm:text-5xl text-[#1f1e1d] font-black">۰</span>
                <span className="absolute -top-2 -right-2 bg-[#21295a] text-white text-[9px] font-black px-1.5 py-0.5 border border-[#1f1e1d] rounded-[5px_0_5px_0]">
                  ✦
                </span>
              </div>
              <span>۴</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-black text-[#1f1e1d] mb-2">
            صفحه پیدا نشد
          </h1>

          {/* Explanatory text (1 line, 8 words) */}
          <p className="text-[#62605b] text-sm sm:text-base font-semibold mb-6">
            آدرس نامعتبر است یا صفحه حذف شده است.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#f8a41d] hover:bg-[#e08a0d] text-[#1f1e1d] font-black text-sm border-2 border-[#1f1e1d] rounded-[10px_0_10px_0] shadow-[3px_3px_0_#1f1e1d] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_#1f1e1d] transition-all"
            >
              <Home size={16} strokeWidth={2.5} />
              <span>صفحه اصلی</span>
            </Link>

            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-[#fff4e5] text-[#1f1e1d] font-black text-sm border-2 border-[#1f1e1d] rounded-[10px_0_10px_0] shadow-[3px_3px_0_#1f1e1d] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_#1f1e1d] transition-all"
            >
              <BookOpen size={16} strokeWidth={2.5} />
              <span>دوره‌ها</span>
            </Link>

            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-[#fff4e5] text-[#1f1e1d] font-black text-sm border-2 border-[#1f1e1d] rounded-[10px_0_10px_0] shadow-[3px_3px_0_#1f1e1d] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_#1f1e1d] transition-all"
            >
              <Compass size={16} strokeWidth={2.5} />
              <span>مجله</span>
            </Link>
          </div>

          {/* Quick links strip */}
          <div className="mt-8 pt-5 border-t border-dashed border-[#1f1e1d]/20 flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-[#62605b]">
            <Link
              href="/courses"
              className="px-2.5 py-1 bg-stone-100 hover:bg-[#fff4e5] text-[#1f1e1d] border border-[#1f1e1d] rounded-[8px_0_8px_0] transition-colors"
            >
              برنامه‌نویسی
            </Link>
            <Link
              href="/courses"
              className="px-2.5 py-1 bg-stone-100 hover:bg-[#fff4e5] text-[#1f1e1d] border border-[#1f1e1d] rounded-[8px_0_8px_0] transition-colors"
            >
              طراحی UI/UX
            </Link>
            <Link
              href="/courses"
              className="px-2.5 py-1 bg-stone-100 hover:bg-[#fff4e5] text-[#1f1e1d] border border-[#1f1e1d] rounded-[8px_0_8px_0] transition-colors"
            >
              سئو
            </Link>
            <Link
              href="/courses"
              className="px-2.5 py-1 bg-stone-100 hover:bg-[#fff4e5] text-[#1f1e1d] border border-[#1f1e1d] rounded-[8px_0_8px_0] transition-colors"
            >
              دیجیتال مارکتینگ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
