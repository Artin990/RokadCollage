import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#FFFDF8] text-[#1F1E1D] font-sans" dir="rtl">
      <div className="max-w-md w-full bg-white border-[2.5px] border-[#1F1E1D] rounded-[22px_0_22px_0] p-8 shadow-[6px_6px_0_#1F1E1D] text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-[14px_0_14px_0] bg-[#FFF4E5] border-2 border-[#1F1E1D] flex items-center justify-center text-[#F8A41D] shadow-[3px_3px_0_#1F1E1D]">
          <Compass size={32} strokeWidth={2.2} />
        </div>

        <div className="inline-block bg-[#FFF4E5] border-2 border-[#1F1E1D] px-3.5 py-1 rounded-full text-xs font-black mb-3">
          خطای ۴۰۴
        </div>

        <h1 className="text-2xl font-black text-[#1F1E1D] mb-3">
          صفحه پیدا نشد
        </h1>

        <p className="text-sm font-bold text-[#62605B] mb-6 leading-relaxed">
          آدرس واردشده وجود ندارد یا به مسیر دیگری منتقل شده است.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#F8A41D] hover:bg-[#e69415] text-[#1F1E1D] font-black text-sm border-2 border-[#1F1E1D] rounded-[10px_0_10px_0] shadow-[3px_3px_0_#1F1E1D] transition-all"
          >
            <span>صفحه اصلی</span>
            <ArrowLeft size={16} />
          </Link>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-white hover:bg-stone-50 text-[#1F1E1D] font-bold text-sm border-2 border-[#1F1E1D] rounded-[10px_0_10px_0] shadow-[3px_3px_0_#1F1E1D] transition-all"
          >
            دوره‌ها
          </Link>
        </div>
      </div>
    </div>
  );
}
