"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserCog } from "lucide-react";
import PatternLayer from "@/components/PatternLayer";
import UserProfileSettings from "../panel/components/UserProfileSettings";
import { isUserLoggedIn } from "@/data/panelStore";

export default function ProfilePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("rokad_token") : null;
    if (!token && !isUserLoggedIn()) {
      try {
        sessionStorage.setItem("rokad_auth_redirect", "profile");
      } catch (_) {}
      router.push("/auth");
    }
  }, [router]);

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-bold text-stone-500">
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-160px)] py-10 sm:py-14 bg-[#fdfbf7]" dir="rtl">
      <PatternLayer rotate={0} />

      <div className="container relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        {/* هدر صفحه پروفایل */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-xs font-bold text-stone-500 mb-3" aria-label="مسیر">
            <Link href="/" className="hover:text-stone-900 transition-colors">خانه</Link>
            <span className="text-[#f8a41d] font-black">›</span>
            <span className="text-stone-900 font-extrabold">تنظیمات پروفایل</span>
          </nav>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[14px_0_14px_0] bg-amber-50 text-amber-700 border-2 border-stone-900 shadow-[3px_3px_0_#292827] flex items-center justify-center">
              <UserCog className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                تنظیمات پروفایل
              </h1>
            </div>
          </div>
        </div>

        {/* فرم تنظیمات */}
        <UserProfileSettings />
      </div>
    </div>
  );
}
