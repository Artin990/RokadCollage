"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Copy,
  Check,
  Download,
  ExternalLink,
  RotateCw,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { getCourseLicense, retrySpotPlayerLicense } from "@/services/enrollmentService";

const SPOTPLAYER_APPS = [
  { name: "ویندوز", os: "Windows", url: "https://dl.spotplayer.ir/spotplayer.exe" },
  { name: "اندروید", os: "Android", url: "https://dl.spotplayer.ir/spotplayer.apk" },
  { name: "مک", os: "macOS", url: "https://dl.spotplayer.ir/spotplayer.dmg" },
  { name: "وب‌پلیر", os: "Web", url: "https://app.spotplayer.ir" },
];

export default function SpotPlayerLicenseModal({ isOpen, onClose, courseId, courseTitle }) {
  const [loading, setLoading] = useState(true);
  const [licenseData, setLicenseData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (!isOpen || !courseId) return;

    let isMounted = true;
    setLoading(true);

    getCourseLicense(courseId)
      .then((res) => {
        if (!isMounted) return;
        setLicenseData(res?.spotplayer || res?.data?.spotplayer || null);
      })
      .catch((err) => {
        console.error("Failed to load license:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      isMounted = false;
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, courseId, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  const licenseKey = licenseData?.key;
  const isFailed = licenseData?.status === "failed";

  const handleCopy = () => {
    if (!licenseKey) return;
    try {
      navigator.clipboard.writeText(licenseKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {}
  };

  const handleRetry = async () => {
    if (retrying || !licenseData?._id) return;
    setRetrying(true);
    try {
      const res = await retrySpotPlayerLicense(licenseData._id);
      if (res?.data?.spotplayer) {
        setLicenseData(res.data.spotplayer);
      }
    } catch (err) {
      console.error("Retry license failed:", err);
    } finally {
      setRetrying(false);
    }
  };

  const modal = (
    <div
      className="fixed inset-0 z-[99999] bg-[rgba(14,21,58,0.65)] backdrop-blur-md grid place-items-center p-4"
      style={{ fontFamily: "var(--font-iransans), 'IRANSansX', system-ui, -apple-system, sans-serif" }}
      onClick={onClose}
      dir="rtl"
    >
      <div
        className="w-full max-w-xl bg-white border-2 border-stone-900 rounded-[22px_0_22px_0] shadow-[6px_6px_0_#292827] p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 left-5 sm:top-6 sm:left-6 w-9 h-9 rounded-lg border-2 border-transparent hover:border-stone-900 hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-all flex items-center justify-center cursor-pointer"
          aria-label="بستن"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* هدر مدال با فاصله‌گذاری و تفکیک واضح */}
        <div className="flex items-center gap-3.5 pb-4 border-b-2 border-stone-200">
          <div className="w-12 h-12 rounded-[12px_0_12px_0] bg-amber-100 text-stone-900 border-2 border-stone-900 shadow-[3px_3px_0_#000] grid place-items-center flex-shrink-0">
            <KeyRound size={22} />
          </div>
          <div className="pl-8">
            <h3 className="text-xl font-black text-stone-900 leading-snug">لایسنس اسپات‌پلیر دوره</h3>
            <p className="text-xs sm:text-sm font-bold text-stone-500 mt-0.5">{courseTitle || "دوره تخصصی کالج رکاد"}</p>
          </div>
        </div>

        {loading ? (
          <div className="py-14 flex flex-col items-center justify-center gap-3">
            <RotateCw className="w-8 h-8 text-stone-700 animate-spin" />
            <span className="text-xs sm:text-sm font-bold text-stone-600">در حال دریافت کلید لایسنس...</span>
          </div>
        ) : licenseKey ? (
          <div className="space-y-6 mt-6">
            {/* کادر لایسنس */}
            <div className="bg-stone-50 border-2 border-stone-900 rounded-[16px_0_16px_0] shadow-[3px_3px_0_#292827] p-5 sm:p-6 space-y-4">
              <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-stone-700">
                <span>کلید لایسنس اختصاصی شما:</span>
                <span className="text-emerald-700 flex items-center gap-1.5 font-black">
                  <ShieldCheck size={16} /> فعال و معتبر
                </span>
              </div>
              <div className="flex items-center gap-3 bg-white border-2 border-stone-900 rounded-xl p-3 shadow-xs">
                <input
                  type="text"
                  readOnly
                  value={licenseKey}
                  dir="ltr"
                  className="flex-1 font-mono text-xs sm:text-sm bg-transparent outline-none select-all text-stone-900 font-bold overflow-hidden text-ellipsis"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-white font-black text-xs sm:text-sm rounded-lg hover:bg-stone-800 transition-all flex-shrink-0 cursor-pointer"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? "کپی شد" : "کپی"}</span>
                </button>
              </div>
            </div>

            {/* دانلود نرم‌افزار اسپات‌پلیر */}
            <div className="border-2 border-stone-900 rounded-[16px_0_16px_0] shadow-[3px_3px_0_#292827] p-5 sm:p-6 bg-[#fffaf0] space-y-4">
              <span className="block text-xs sm:text-sm font-black text-stone-900">
                دانلود نرم‌افزار پخش‌کننده اسپات‌پلیر:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SPOTPLAYER_APPS.map((app) => (
                  <a
                    key={app.os}
                    href={app.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white border-2 border-stone-900 rounded-xl text-xs font-black text-stone-900 hover:bg-amber-100 transition-all shadow-[2px_2px_0_#292827] active:translate-x-0.5 active:translate-y-0.5"
                  >
                    <Download size={14} />
                    <span>{app.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* دکمه‌های اکشن فوتر */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <a
                href="https://app.spotplayer.ir"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:flex-1 py-3 px-5 bg-stone-900 text-white font-black text-xs sm:text-sm rounded-[10px_0_10px_0] shadow-[3px_3px_0_#000] flex items-center justify-center gap-2 hover:bg-stone-800 transition-all"
              >
                <span>ورود به وب‌پلیر</span>
                <ExternalLink size={15} />
              </a>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-900 font-black text-xs sm:text-sm border-2 border-stone-900 rounded-[10px_0_10px_0] shadow-[2.5px_2.5px_0_#292827] transition-all cursor-pointer"
              >
                بستن
              </button>
            </div>
          </div>
        ) : (
          <div className="py-10 text-center space-y-4">
            <p className="text-sm font-bold text-stone-700">
              {isFailed
                ? "صدور لایسنس با خطا مواجه شد. می‌توانید درخواست صدور مجدد ارسال کنید."
                : "لایسنس در حال پردازش و صدور است."}
            </p>
            {isFailed && (
              <button
                type="button"
                onClick={handleRetry}
                disabled={retrying}
                className="px-5 py-2.5 bg-stone-900 text-white font-bold text-xs sm:text-sm rounded-[8px_0_8px_0] shadow-[2px_2px_0_#000] cursor-pointer"
              >
                {retrying ? "در حال صدور مجدد..." : "تلاش مجدد"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
