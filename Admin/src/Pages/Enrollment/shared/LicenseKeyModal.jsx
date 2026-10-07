import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import CheckIcon from "@mui/icons-material/Check";
import axiosInstance from "../../../Utils/axiosInstance";
import Notify from "../../../Utils/notify";
import Loading from "../../../Components/Loading";
import { Button } from "../../../Components/UI";
import { toPersianDigits } from "../../../Utils/jalaliDate";

/**
 * On-demand SpotPlayer License Key display & copy modal.
 * Security: The license key is only requested via single enrollment GET /enrollment/:id
 * when the admin explicitly asks to view/copy it.
 */
export default function LicenseKeyModal({ isOpen, onClose, enrollmentId, studentName }) {
  const [loading, setLoading] = useState(true);
  const [enrollment, setEnrollment] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen || !enrollmentId) return;

    let isMounted = true;
    const fetchKey = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`enrollment/${enrollmentId}`);
        if (isMounted && res && res.data) {
          setEnrollment(res.data);
        }
      } catch (err) {
        Notify.error(err.message || "خطا در دریافت کلید لایسنس اسپات‌پلیر");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchKey();
    return () => {
      isMounted = false;
      setCopied(false);
    };
  }, [isOpen, enrollmentId]);

  if (!isOpen) return null;

  const licenseKey = enrollment?.spotplayer?.key || "";
  const licenseId = enrollment?.spotplayer?.licenseId || "";
  const downloadUrl = enrollment?.spotplayer?.downloadUrl || enrollment?.spotplayer?.url || "";

  const handleCopy = () => {
    if (!licenseKey) return;
    navigator.clipboard.writeText(licenseKey);
    setCopied(true);
    Notify.success("کلید لایسنس اسپات‌پلیر با موفقیت کپی شد");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl border border-border shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/80 bg-bg-light/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-light text-primary flex items-center justify-center">
              <VpnKeyIcon fontSize="small" />
            </div>
            <div>
              <h3 className="font-bold text-secondary text-base">کلید لایسنس اسپات‌پلیر</h3>
              <p className="text-xs text-text-muted mt-0.5">دانشجو: {studentName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-text-muted hover:text-secondary p-1.5 rounded-lg hover:bg-border/40 transition-colors"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          {loading ? (
            <div className="py-8 flex justify-center">
              <Loading size={8} />
            </div>
          ) : (
            <>
              {/* License Key Box */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-secondary">
                  کلید دسترسی (License Key):
                </label>
                <div className="flex items-center gap-2 bg-bg-light p-3 rounded-xl border border-border font-mono text-xs select-all break-all">
                  <span className="flex-1 text-secondary font-bold text-left" dir="ltr">
                    {licenseKey || "کلیدی یافت نشد"}
                  </span>
                  <Button
                    variant="outline"
                    size="xs"
                    icon={copied ? <CheckIcon fontSize="inherit" className="text-emerald-600" /> : <ContentCopyIcon fontSize="inherit" />}
                    onClick={handleCopy}
                    disabled={!licenseKey}
                  >
                    {copied ? "کپی شد" : "کپی"}
                  </Button>
                </div>
              </div>

              {/* License ID */}
              {licenseId && (
                <div className="flex items-center justify-between text-xs py-2 border-t border-border/60">
                  <span className="text-text-muted">شناسه لایسنس اسپات‌پلیر:</span>
                  <span className="font-mono font-bold text-secondary">{licenseId}</span>
                </div>
              )}

              {/* Player Download URL */}
              {downloadUrl && (
                <div className="flex flex-col gap-1 pt-2 border-t border-border/60 text-xs">
                  <span className="text-text-muted">لینک دانلود پلیر برای دانشجو:</span>
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-mono truncate text-left"
                    dir="ltr"
                  >
                    {downloadUrl}
                  </a>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/80 flex justify-end bg-bg-light/30">
          <Button variant="ghost" onClick={onClose}>
            بستن
          </Button>
        </div>
      </div>
    </div>
  );
}
