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
        className="w-full max-w-lg bg-white border-2 border-stone-900 rounded-[22px_0_22px_0] shadow-[6px_6px_0_#292827] p-6 sm:p-7 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 left-5 text-stone-500 hover:text-stone-900 transition-colors"
          aria-label="بستن"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-10 h-10 rounded-[10px_0_10px_0] bg-amber-100 text-stone-900 border border-stone-900 shadow-[2px_2px_0_#000] grid place-items-center">
            <KeyRound size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-stone-900">لایسنس اسپات‌پلیر دوره</h3>
            <p className="text-xs font-bold text-stone-500">{courseTitle || "دوره تخصصی کالج رکاد"}</p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <RotateCw className="w-8 h-8 text-stone-700 animate-spin" />
            <span className="text-xs font-bold text-stone-600">در حال دریافت کلید لایسنس...</span>
          </div>
        ) : licenseKey ? (
          <div className="space-y-5 mt-5">
            <div className="bg-stone-50 border-2 border-stone-900 rounded-[14px_0_14px_0] p-4 sm:p-5 space-y-3.5">
              <div className="flex justify-between items-center text-xs font-bold text-stone-600">
                <span>کلید لایسنس اختصاصی شما:</span>
                <span className="text-emerald-700 flex items-center gap-1 font-black">
                  <ShieldCheck size={14} /> فعال و معتبر
                </span>
              </div>
              <div className="flex items-center gap-2.5 bg-white border-2 border-stone-900 rounded-lg p-2.5">
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
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-900 text-white font-bold text-xs rounded hover:bg-stone-800 transition-all flex-shrink-0 cursor-pointer"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copied ? "کپی شد" : "کپی"}</span>
                </button>
              </div>
            </div>

            {/* دانلود نرم‌افزار اسپات‌پلیر */}
            <div className="border-2 border-stone-900 rounded-[14px_0_14px_0] p-4 sm:p-5 bg-amber-50/70 space-y-3">
              <span className="block text-xs font-black text-stone-800">
                دانلود نرم‌افزار پخش‌کننده اسپات‌پلیر:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {SPOTPLAYER_APPS.map((app) => (
                  <a
                    key={app.os}
                    href={app.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-white border border-stone-900 rounded text-xs font-bold text-stone-900 hover:bg-amber-100 transition-colors shadow-xs"
                  >
                    <Download size={13} />
                    <span>{app.name}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <a
                href="https://app.spotplayer.ir"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 bg-stone-900 text-white font-black text-xs sm:text-sm rounded-[8px_0_8px_0] shadow-[2.5px_2.5px_0_#000] flex items-center justify-center gap-1.5 hover:bg-stone-800 transition-all"
              >
                <span>ورود به وب‌پلیر</span>
                <ExternalLink size={14} />
              </a>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-stone-100 text-stone-800 font-bold text-xs sm:text-sm border border-stone-900 rounded-[8px_0_8px_0] hover:bg-stone-200 transition-all"
              >
                بستن
              </button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-3">
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
                className="px-4 py-2 bg-stone-900 text-white font-bold text-xs rounded-[8px_0_8px_0] shadow"
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
