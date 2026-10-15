"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw, ArrowLeft } from "lucide-react";

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    console.error("Route error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#FFFDF8] text-[#1F1E1D] font-sans" dir="rtl">
      <div className="max-w-md w-full bg-white border-[2.5px] border-[#1F1E1D] rounded-[22px_0_22px_0] p-8 shadow-[6px_6px_0_#1F1E1D] text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-[14px_0_14px_0] bg-rose-50 border-2 border-[#1F1E1D] flex items-center justify-center text-rose-600 shadow-[3px_3px_0_#1F1E1D]">
          <AlertTriangle size={32} strokeWidth={2.2} />
        </div>

        <div className="inline-block bg-rose-100 border-2 border-[#1F1E1D] px-3.5 py-1 rounded-full text-xs font-black text-rose-800 mb-3">
          خطا در بارگذاری
        </div>

        <h1 className="text-2xl font-black text-[#1F1E1D] mb-3">
          مشکلی پیش آمده است
        </h1>

        <p className="text-sm font-bold text-[#62605B] mb-6 leading-relaxed">
          در برقراری ارتباط یا بارگذاری محتوا خطایی رخ داد.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#F8A41D] hover:bg-[#e69415] text-[#1F1E1D] font-black text-sm border-2 border-[#1F1E1D] rounded-[10px_0_10px_0] shadow-[3px_3px_0_#1F1E1D] transition-all cursor-pointer"
          >
            <RotateCw size={15} />
            <span>تلاش مجدد</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-stone-50 text-[#1F1E1D] font-bold text-sm border-2 border-[#1F1E1D] rounded-[10px_0_10px_0] shadow-[3px_3px_0_#1F1E1D] transition-all"
          >
            <span>صفحه اصلی</span>
            <ArrowLeft size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
