"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Key,
  Copy,
  Check,
  Download,
  ExternalLink,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCw,
} from "lucide-react";
import { getMyEnrollments, retrySpotPlayerLicense } from "@/services/enrollmentService";
import { getPanelStore } from "@/data/panelStore";

const SPOTPLAYER_APPS = [
  { name: "ویندوز", os: "Windows", url: "https://dl.spotplayer.ir/spotplayer.exe" },
  { name: "اندروید", os: "Android", url: "https://dl.spotplayer.ir/spotplayer.apk" },
  { name: "مک", os: "macOS", url: "https://dl.spotplayer.ir/spotplayer.dmg" },
  { name: "وب‌پلیر", os: "Web", url: "https://app.spotplayer.ir" },
];

export default function UserMyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const [retryingId, setRetryingId] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getMyEnrollments();
        const list = Array.isArray(data) ? data : (data?.data || []);
        
        // Also merge local store courses if backend returned empty (e.g. offline dev fallback)
        if (list.length === 0) {
          const store = getPanelStore();
          if (store?.myCourses?.length > 0) {
            const fallbackList = store.myCourses.map((mc) => ({
              _id: mc.id || mc._id,
              course: {
                _id: mc.id || mc._id,
                title: mc.title,
                slug: mc.slug,
                type: "مجازی",
                duration: mc.sessions || "۲۰ ساعت",
                img: mc.pattern || "/assets/StatCard/blue.png",
              },
              spotplayer: {
                key: "0001testps7e9xn2s88okxumc4qgiROKAD",
                downloadUrl: "https://dl.spotplayer.ir/player_access/",
                status: "issued",
              },
            }));
            setEnrollments(fallbackList);
            return;
          }
        }
        setEnrollments(list);
      } catch (err) {
        console.error("Failed to load enrollments:", err);
        // Fallback to local store
        const store = getPanelStore();
        if (store?.myCourses?.length > 0) {
          const fallbackList = store.myCourses.map((mc) => ({
            _id: mc.id || mc._id,
            course: {
              _id: mc.id || mc._id,
              title: mc.title,
              slug: mc.slug,
              type: "مجازی",
              duration: mc.sessions || "۲۰ ساعت",
              img: mc.pattern || "/assets/StatCard/blue.png",
            },
          }));
          setEnrollments(fallbackList);
        } else {
          setError(err?.message || "خطا در دریافت لیست دوره‌ها");
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCopyKey = (key, id) => {
    if (!key) return;
    try {
      navigator.clipboard.writeText(key);
      setCopiedKey(id);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch (_) {}
  };

  const handleRetryLicense = async (enrollmentId) => {
    try {
      setRetryingId(enrollmentId);
      await retrySpotPlayerLicense(enrollmentId);
      const data = await getMyEnrollments();
      const list = Array.isArray(data) ? data : (data?.data || []);
      setEnrollments(list);
    } catch (err) {
      console.error("Retry license failed:", err);
    } finally {
      setRetryingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-stone-500 font-bold">
        <RotateCw className="w-7 h-7 animate-spin text-[#f8a41d]" />
        <span>در حال بارگذاری دوره‌های شما...</span>
      </div>
    );
  }

  if (enrollments.length === 0) {
    return (
      <div className="bg-white border-2 border-stone-900 rounded-[20px_0_20px_0] shadow-[5px_5px_0_#292827] p-8 sm:p-12 text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-[14px_0_14px_0] bg-amber-50 text-amber-600 border-2 border-stone-900 shadow-[3px_3px_0_#292827] flex items-center justify-center">
          <BookOpen className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-stone-900">هنوز در دوره‌ای ثبت‌نام نکرده‌اید</h3>
        <p className="text-sm font-semibold text-stone-600 max-w-md">
          دوره‌های حضوری و غیرحضوری کالج رکاد با تمرکز بر ورود مستقیم به بازار کار طراحی شده‌اند.
        </p>
        <Link
          href="/courses"
          className="mt-2 px-6 py-3 bg-[#f8a41d] hover:bg-[#e69415] text-stone-950 font-black text-sm border-2 border-stone-900 rounded-[10px_0_10px_0] shadow-[3.5px_3.5px_0_#292827] transition-transform active:translate-x-0.5 active:translate-y-0.5"
        >
          مشاهده دوره‌ها
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* پیام خطا در صورت وجود */}
      {error && (
        <div className="bg-rose-50 border-2 border-stone-900 rounded-[12px_0_12px_0] p-4 text-rose-700 text-sm font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* لیست کارت‌های دوره‌ها */}
      <div className="grid grid-cols-1 gap-6">
        {enrollments.map((item) => {
          const course = item.course || {};
          const isVirtual = item.courseModel === "VirtualCourse" || course.type === "مجازی" || !item.session;
          const courseSlug = course.slug || course._id;
          const courseHref = courseSlug ? `/courses/${courseSlug}` : "/courses";
          const licenseKey = item.spotplayer?.key;

          return (
            <div
              key={item._id || course._id}
              className="bg-white border-2 border-stone-900 rounded-[20px_0_20px_0] shadow-[5px_5px_0_#292827] p-5 sm:p-6 transition-all hover:-translate-y-0.5"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                {/* اطلاعات کلی دوره */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[14px_0_14px_0] bg-stone-100 border-2 border-stone-900 shadow-[3px_3px_0_#292827] overflow-hidden flex-shrink-0">
                    <img
                      src={course.img || "/assets/StatCard/blue.png"}
                      alt={course.title || "دوره"}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-xs font-black px-2.5 py-0.5 rounded-full border border-stone-900 ${
                          isVirtual
                            ? "bg-teal-50 text-teal-800 border-teal-800"
                            : "bg-amber-100 text-amber-900 border-amber-900"
                        }`}
                      >
                        {isVirtual ? "مجازی (اسپات‌پلیر)" : "کارگاه حضوری"}
                      </span>

                      {item.pricePaid !== undefined && (
                        <span className="text-xs font-bold text-stone-500">
                          مبلغ: {Number(item.pricePaid).toLocaleString("fa-IR")} تومان
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-stone-900 leading-snug">
                      <Link href={courseHref} className="hover:text-[#f8a41d] transition-colors">
                        {course.title || "عنوان دوره"}
                      </Link>
                    </h3>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-bold text-stone-600 pt-0.5">
                      {course.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{course.duration}</span>
                        </span>
                      )}
                      {!isVirtual && item.session && (
                        <span className="flex items-center gap-1 text-emerald-800 font-extrabold">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>کلاس: {item.session.scheduleDays || "شنبه‌ها"} ({item.session.scheduleHours || "۱۶:۰۰ الی ۲۰:۰۰"})</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* دکمه اقدام ورود به دوره */}
                <div className="flex sm:flex-col gap-2 flex-shrink-0 self-end md:self-start w-full sm:w-auto">
                  <Link
                    href={courseHref}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-black text-xs sm:text-sm rounded-[9px_0_9px_0] shadow-[3px_3px_0_#000] transition-all"
                  >
                    <span>ورود به دوره</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* بخش لایسنس اسپات‌پلیر ویژه دوره‌های آنلاین */}
              {isVirtual && (
                <div className="mt-5 pt-4 border-t-2 border-dashed border-stone-200">
                  {licenseKey ? (
                    <div className="bg-[#fff9ed] border-2 border-stone-900 rounded-[14px_0_14px_0] p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-stone-900">
                          <Key className="w-4 h-4 text-amber-600" />
                          <span>کلید فعال‌سازی اسپات‌پلیر شما</span>
                        </div>
                        <span className="text-[11px] font-black text-amber-800 bg-amber-200 px-2 py-0.5 rounded-full">
                          فعال و آماده
                        </span>
                      </div>

                      {/* فیلد نمایش کلید و دکمه کپی */}
                      <div className="flex items-center gap-2 bg-white border border-stone-900 rounded-lg p-2">
                        <input
                          type="text"
                          readOnly
                          value={licenseKey}
                          dir="ltr"
                          className="flex-1 font-mono text-xs sm:text-sm bg-transparent outline-none select-all text-stone-900 font-bold overflow-hidden text-ellipsis"
                        />
                        <button
                          type="button"
                          onClick={() => handleCopyKey(licenseKey, item._id)}
                          className="flex items-center gap-1.5 px-3 py-1 bg-stone-900 text-white font-black text-xs rounded hover:bg-stone-800 transition-all flex-shrink-0"
                        >
                          {copiedKey === item._id ? <Check size={13} /> : <Copy size={13} />}
                          <span>{copiedKey === item._id ? "کپی شد" : "کپی کلید"}</span>
                        </button>
                      </div>

                      {/* لینک‌های دانلود اپلیکیشن */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                        <span className="font-bold text-stone-600">دانلود پلیر:</span>
                        {SPOTPLAYER_APPS.map((app) => (
                          <a
                            key={app.os}
                            href={app.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-stone-900 rounded text-xs font-bold text-stone-800 hover:bg-amber-100 transition-colors shadow-xs"
                          >
                            <Download className="w-3 h-3" />
                            <span>{app.name}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-stone-50 border border-stone-300 rounded-lg p-3 text-xs font-bold text-stone-700">
                      <span>کلید اسپات‌پلیر در حال آماده‌سازی است...</span>
                      <button
                        type="button"
                        onClick={() => handleRetryLicense(item._id)}
                        disabled={retryingId === item._id}
                        className="px-3 py-1 bg-[#f8a41d] hover:bg-[#e69415] text-stone-950 font-black rounded border border-stone-900 disabled:opacity-50"
                      >
                        {retryingId === item._id ? "درحال صدور..." : "دریافت مجدد"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
