"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, UserCog } from "lucide-react";
import PatternLayer from "@/components/PatternLayer";
import UserMyCourses from "./components/UserMyCourses";
import UserProfileSettings from "./components/UserProfileSettings";
import { isUserLoggedIn } from "@/data/panelStore";

function PanelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "courses";

  const [activeTab, setActiveTab] = useState(initialTab === "profile" ? "profile" : "courses");

  useEffect(() => {
    // Check auth
    const token = typeof window !== "undefined" ? localStorage.getItem("rokad_token") : null;
    if (!token && !isUserLoggedIn()) {
      try {
        sessionStorage.setItem("rokad_auth_redirect", "panel");
      } catch (_) {}
      router.push("/auth");
      return;
    }

    // Sync URL tab
    const tabParam = searchParams.get("tab");
    if (tabParam === "profile" || tabParam === "courses") {
      setActiveTab(tabParam);
    }
  }, [router, searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    router.replace(`/panel?tab=${tab}`, { scroll: false });
  };

  return (
    <div className="relative min-h-[calc(100vh-160px)] py-10 sm:py-14 bg-[#fdfbf7]" dir="rtl">
      <PatternLayer rotate={0} />

      <div className="container relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        {/* هدر صفحه و سوئیچ تب‌ها */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              {activeTab === "courses" ? "دوره‌های من" : "تنظیمات پروفایل"}
            </h1>
          </div>

          {/* تب‌ها */}
          <div className="inline-flex p-1.5 bg-stone-100 border-2 border-stone-900 rounded-[14px_0_14px_0] shadow-[3px_3px_0_#292827] self-start sm:self-auto">
            <button
              type="button"
              onClick={() => handleTabChange("courses")}
              className={`flex items-center gap-2 px-5 py-2 rounded-[10px_0_10px_0] font-black text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === "courses"
                  ? "bg-[#f8a41d] text-stone-950 border-2 border-stone-900 shadow-[2px_2px_0_#292827]"
                  : "text-stone-700 hover:text-stone-950 border-2 border-transparent"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>دوره‌های من</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("profile")}
              className={`flex items-center gap-2 px-5 py-2 rounded-[10px_0_10px_0] font-black text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "bg-[#f8a41d] text-stone-950 border-2 border-stone-900 shadow-[2px_2px_0_#292827]"
                  : "text-stone-700 hover:text-stone-950 border-2 border-transparent"
              }`}
            >
              <UserCog className="w-4 h-4" />
              <span>تنظیمات پروفایل</span>
            </button>
          </div>
        </div>

        {/* محتوای تب انتخاب‌شده */}
        {activeTab === "courses" ? <UserMyCourses /> : <UserProfileSettings />}
      </div>
    </div>
  );
}

export default function PanelPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center font-bold text-stone-500">
          در حال بارگذاری...
        </div>
      }
    >
      <PanelContent />
    </Suspense>
  );
}
