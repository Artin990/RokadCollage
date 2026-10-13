"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Download,
  ExternalLink,
  RotateCw,
} from "lucide-react";
import { verifyCheckout } from "@/services/enrollmentService";
import { loginUser, enrollInCourse } from "@/data/panelStore.js";

const SPOTPLAYER_APPS = [
  { name: "ویندوز", os: "Windows", url: "https://dl.spotplayer.ir/spotplayer.exe" },
  { name: "اندروید", os: "Android", url: "https://dl.spotplayer.ir/spotplayer.apk" },
  { name: "مک", os: "macOS", url: "https://dl.spotplayer.ir/spotplayer.dmg" },
  { name: "وب‌پلیر", os: "Web", url: "https://app.spotplayer.ir" },
];

export default function PaymentCallbackClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const authority = searchParams.get("Authority") || searchParams.get("authority");
  const status = searchParams.get("Status") || searchParams.get("status");
  const courseId = searchParams.get("courseId");

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const requestedRef = useRef(false);

  useEffect(() => {
    if (!authority) {
      setLoading(false);
      setError("شناسه پرداخت یافت نشد");
      return;
    }

    if (requestedRef.current) return;
    requestedRef.current = true;

    async function executeVerification() {
      try {
        setLoading(true);
        const res = await verifyCheckout({ authority, status, courseId });
        if (res?.success) {
          setResult(res.data);
          const enrolledCourse = res.data?.enrollment?.course;
          enrollInCourse({
            id: enrolledCourse?._id || courseId,
            _id: enrolledCourse?._id || courseId,
            slug: enrolledCourse?.slug,
            title: res.data?.courseTitle || enrolledCourse?.title,
          });
        } else {
          setError(res?.message || "پرداخت ناموفق بود یا توسط کاربر لغو شد");
        }
      } catch (err) {
        setError(err?.message || "خطا در تایید تراکنش بانکی");
      } finally {
        setLoading(false);
      }
    }

    executeVerification();
  }, [authority, status, courseId]);

  const copyLicenseKey = (key) => {
    if (!key) return;
    try {
      navigator.clipboard.writeText(key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      // fallback
    }
  };

  const licenseKey =
    result?.spotplayer?.key ||
    result?.enrollment?.spotplayer?.key ||
    result?.enrollment?.spotplayerKey;

  const downloadUrl =
    result?.spotplayer?.downloadUrl ||
    result?.enrollment?.spotplayer?.downloadUrl ||
    "https://app.spotplayer.ir";

  return (
    <div
      className="min-h-[70vh] py-16 px-4 flex items-center justify-center"
      style={{ fontFamily: "var(--font-iransans), 'IRANSansX', system-ui, -apple-system, sans-serif" }}
      dir="rtl"
    >
      <div className="w-full max-w-xl bg-white border-2 border-stone-900 rounded-[22px_0_22px_0] shadow-[6px_6px_0_#292827] p-6 sm:p-8">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
            <RotateCw className="w-10 h-10 text-stone-700 animate-spin" />
            <h2 className="text-xl font-black text-stone-900">در حال بررسی و اعتبارسنجی پرداخت</h2>
            <p className="text-sm font-semibold text-stone-600">
              لطفاً کمی صبر کنید، در حال استعلام وضعیت تراکنش از شاپرک هستیم...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-[16px_0_16px_0] bg-red-50 text-red-600 border-2 border-stone-900 shadow-[3px_3px_0_#292827] flex items-center justify-center">
              <XCircle className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-black text-stone-900">پرداخت ناموفق بود</h2>
            <p className="text-sm font-semibold text-stone-600 leading-relaxed max-w-md">
              {error}
            </p>
            {authority && (
              <div className="text-xs font-mono font-bold bg-stone-100 text-stone-700 px-3 py-1.5 rounded-lg border border-stone-300">
                کد پیگیری درخواست: {authority}
              </div>
            )}
            <div className="flex gap-3 w-full mt-4">
              <Link
                href={courseId ? `/courses/${courseId}` : "/courses"}
                className="flex-1 py-3 bg-stone-900 text-white font-black text-sm rounded-[10px_0_10px_0] shadow-[3px_3px_0_#000] text-center hover:bg-stone-800 transition-all"
              >
                تلاش مجدد
              </Link>
              <Link
                href="/"
                className="flex-1 py-3 bg-stone-100 text-stone-900 border-2 border-stone-900 font-bold text-sm rounded-[10px_0_10px_0] text-center hover:bg-stone-200 transition-all"
              >
                صفحه اصلی
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-7 sm:gap-8">
            <div className="w-16 h-16 rounded-[16px_0_16px_0] bg-emerald-50 text-emerald-600 border-2 border-stone-900 shadow-[3px_3px_0_#292827] flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900">پرداخت با موفقیت انجام شد</h2>
              <p className="text-sm font-semibold text-stone-600 mt-2">
                ثبت‌نام شما در دوره با موفقیت نهایی و دسترسی صادر گردید.
              </p>
            </div>

            {/* رسید تراکنش */}
            <div className="w-full bg-stone-50 border-2 border-stone-900 rounded-[16px_0_16px_0] p-5 sm:p-7 text-sm font-bold text-stone-800 space-y-4 text-right shadow-[3.5px_3.5px_0_#292827]">
              {result?.courseTitle && (
                <div className="flex justify-between items-center border-b border-stone-200 pb-3.5">
                  <span className="text-stone-500 font-bold">نام دوره:</span>
                  <span className="font-black text-stone-900 text-base">{result.courseTitle}</span>
                </div>
              )}
              {result?.refId && (
                <div className="flex justify-between items-center border-b border-stone-200 pb-3.5">
                  <span className="text-stone-500 font-bold">شماره پیگیری شاپرک:</span>
                  <span className="font-mono font-black text-stone-900 text-base">{result.refId}</span>
                </div>
              )}
              <div className="flex justify-between items-center border-b border-stone-200 pb-3.5">
                <span className="text-stone-500 font-bold">وضعیت تراکنش:</span>
                <span className="font-black text-emerald-700 bg-emerald-100 border border-emerald-800/20 px-3 py-1 rounded-full text-xs">
                  موفق (تایید نهایی)
                </span>
              </div>
              {result?.amount !== undefined && (
                <div className="flex justify-between items-center pt-1">
                  <span className="text-stone-500 font-bold">مبلغ پرداختی:</span>
                  <span className="font-black text-stone-900 text-base">
                    {Number(result.amount).toLocaleString("fa-IR")} تومان
                  </span>
                </div>
              )}
            </div>

            {/* بخش اختصاصی لایسنس اسپات‌پلیر */}
            {licenseKey && (
              <div className="w-full bg-amber-50 border-2 border-stone-900 rounded-[18px_0_18px_0] shadow-[4px_4px_0_#ffd44d] p-5 sm:p-7 text-right space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-base sm:text-lg text-stone-900 flex items-center gap-2">
                    <span>🔑 کلید فعال‌سازی اسپات‌پلیر</span>
                  </h3>
                  <span className="text-xs font-black text-amber-900 bg-amber-200 px-2.5 py-1 rounded-full border border-amber-400">
                    اختصاصی شما
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-white border-2 border-stone-900 rounded-lg p-3">
                  <input
                    type="text"
                    readOnly
                    value={licenseKey}
                    dir="ltr"
                    className="flex-1 font-mono text-xs sm:text-sm bg-transparent outline-none select-all text-stone-900 font-bold overflow-hidden text-ellipsis"
                  />
                  <button
                    type="button"
                    onClick={() => copyLicenseKey(licenseKey)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 text-white font-black text-xs rounded hover:bg-stone-800 transition-all flex-shrink-0 cursor-pointer"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? "کپی شد" : "کپی کلید"}</span>
                  </button>
                </div>

                {/* دانلود نرم‌افزار اسپات‌پلیر */}
                <div className="pt-4 border-t border-amber-200/90 space-y-3">
                  <div className="text-xs font-black text-stone-800">
                    دانلود پخش‌کننده اسپات‌پلیر:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {SPOTPLAYER_APPS.map((app) => (
                      <a
                        key={app.os}
                        href={app.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-white border border-stone-900 rounded text-xs font-black text-stone-800 hover:bg-amber-100 transition-colors shadow-xs"
                      >
                        <Download size={13} />
                        <span>{app.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* دکمه‌های اقدام نهایی */}
            <div className="flex flex-col sm:flex-row gap-3.5 w-full mt-4">
              <Link
                href={
                  result?.enrollment?.course?.slug
                    ? `/courses/${result.enrollment.course.slug}`
                    : (courseId ? `/courses/${courseId}` : "/courses")
                }
                className="flex-1 py-3.5 bg-stone-900 text-white font-black text-sm rounded-[10px_0_10px_0] shadow-[3.5px_3.5px_0_#000] text-center hover:bg-stone-800 transition-all"
              >
                ورود به دوره
              </Link>
              <Link
                href="/courses"
                className="flex-1 py-3.5 bg-stone-100 text-stone-900 border-2 border-stone-900 font-black text-sm rounded-[10px_0_10px_0] text-center hover:bg-stone-200 transition-all"
              >
                مشاهده سایر دوره‌ها
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
