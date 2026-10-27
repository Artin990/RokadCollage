"use client";

import React from "react";
import Link from "next/link";
import { Home, BookOpen, Compass } from "lucide-react";
import PatternLayer from "@/components/PatternLayer";

export default function NotFoundContent() {
  return (
    <div
      className="relative min-h-[78vh] flex items-center justify-center px-4 py-12 sm:py-16 overflow-hidden bg-white"
      dir="rtl"
    >
      <PatternLayer rotate={0} />

      {/* استیکرهای دکوراتیو شناور پس‌زمینه */}
      <div className="hidden sm:block absolute top-14 right-16 z-10 pointer-events-none transform -rotate-6 transition-transform hover:rotate-0">
        <span className="bg-[#59bbaf] text-white font-black text-xs px-3.5 py-1.5 border-2 border-[#1f1e1d] rounded-[12px_0_12px_0] shadow-[3px_3px_0_#1f1e1d]">
          مسیر اشتباه ✦
        </span>
      </div>

      <div className="hidden sm:block absolute bottom-14 left-16 z-10 pointer-events-none transform rotate-6 transition-transform hover:rotate-0">
        <span className="bg-[#21295a] text-white font-black text-xs px-3.5 py-1.5 border-2 border-[#1f1e1d] rounded-[12px_0_12px_0] shadow-[3px_3px_0_#1f1e1d]">
          کالج رکاد
        </span>
      </div>

      {/* کارت نئوبروتالیست خطای ۴۰۴ */}
      <div className="relative max-w-[460px] w-full z-10">
        {/* سایهٔ آفست کارت */}
        <div className="absolute inset-0 translate-x-3 translate-y-3 bg-[#1f1e1d] rounded-[24px_0_24px_0] pointer-events-none" />

        {/* بدنهٔ اصلی کارت */}
        <div className="relative bg-white border-[2.5px] border-[#1f1e1d] rounded-[24px_0_24px_0] p-6 sm:p-9 text-center overflow-hidden">
          
          {/* نوار سربرگ پنجرهٔ رترو */}
          <div className="flex items-center justify-between pb-3.5 mb-6 border-b-2 border-dashed border-[#1f1e1d]/15">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e63946] border border-[#1f1e1d]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#f8a41d] border border-[#1f1e1d]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#59bbaf] border border-[#1f1e1d]" />
            </div>
            <span className="text-[11px] font-black text-[#62605b] tracking-wider">
              کالج رکاد · خطا
            </span>
            <div className="w-8" />
          </div>

          {/* نشان کوچک بالا */}
          <div className="mb-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#fff4e5] text-[#e08a0d] border-2 border-[#1f1e1d] rounded-full text-xs font-black shadow-[2px_2px_0_#1f1e1d]">
              ✦ خطای ناوبری
            </span>
          </div>

          {/* تایپوگرافی متناسب و شاخص ۴۰۴ */}
          <div className="relative my-4 inline-block select-none">
            <span className="text-7xl sm:text-8xl font-[950] tracking-tight text-[#1f1e1d] leading-none inline-block">
              ۴۰۴
            </span>
            <span className="absolute -top-2.5 -right-3.5 bg-[#f8a41d] text-[#1f1e1d] font-black text-[10px] px-2 py-0.5 border-2 border-[#1f1e1d] rounded-[6px_0_6px_0] shadow-[2px_2px_0_#1f1e1d] transform rotate-6">
              گم شدی!
            </span>
          </div>

          {/* تیتر */}
          <h1 className="text-xl sm:text-2xl font-[950] text-[#1f1e1d] mb-2 mt-1">
            صفحه پیدا نشد
          </h1>

          {/* متن خلاصه و استاندارد */}
          <p className="text-[#62605b] text-xs sm:text-sm font-semibold max-w-[320px] mx-auto mb-7 leading-relaxed">
            این نشانی وجود ندارد یا به آدرس دیگری منتقل شده است.
          </p>

          {/* دکمه‌های ناوبری با تناسب دقیق */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 bg-[#f8a41d] hover:bg-[#e69315] text-[#1f1e1d] font-black text-xs sm:text-sm border-2 border-[#1f1e1d] rounded-[10px_0_10px_0] shadow-[2.5px_2.5px_0_#1f1e1d] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3.5px_3.5px_0_#1f1e1d] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1.5px_1.5px_0_#1f1e1d] transition-all"
            >
              <Home size={15} strokeWidth={2.5} />
              <span>صفحه اصلی</span>
            </Link>

            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 bg-white hover:bg-stone-50 text-[#1f1e1d] font-black text-xs sm:text-sm border-2 border-[#1f1e1d] rounded-[10px_0_10px_0] shadow-[2.5px_2.5px_0_#1f1e1d] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3.5px_3.5px_0_#1f1e1d] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1.5px_1.5px_0_#1f1e1d] transition-all"
            >
              <BookOpen size={15} strokeWidth={2.5} />
              <span>دوره‌ها</span>
            </Link>

            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 bg-white hover:bg-stone-50 text-[#1f1e1d] font-black text-xs sm:text-sm border-2 border-[#1f1e1d] rounded-[10px_0_10px_0] shadow-[2.5px_2.5px_0_#1f1e1d] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3.5px_3.5px_0_#1f1e1d] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1.5px_1.5px_0_#1f1e1d] transition-all"
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
