import React, { useState, useEffect } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import CheckIcon from "@mui/icons-material/Check";
import { fetchEnrollmentById } from "../api/enrollmentApi";
import Notify from "../../../Utils/notify";
import Loading from "../../../Components/Loading";
import { Button, Modal } from "../../../Components/UI";

/**
 * On-demand SpotPlayer License Key display & copy modal.
 * Uses standardized Modal component.
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
        const res = await fetchEnrollmentById(enrollmentId);
        if (isMounted && res) {
          const doc = res.data ? (Array.isArray(res.data) ? res.data[0] : res.data) : res;
          setEnrollment(doc);
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-md"
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary-light text-primary flex items-center justify-center">
            <VpnKeyIcon fontSize="small" />
          </div>
          <div>
            <h3 className="font-bold text-secondary text-sm md:text-base">کلید لایسنس اسپات‌پلیر</h3>
            <p className="text-2xs text-text-muted mt-0.5">دانشجو: {studentName}</p>
          </div>
        </div>
      }
      footer={
        <Button variant="ghost" size="sm" onClick={onClose}>
          بستن
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        {loading ? (
          <Loading
            container
            minHeight="min-h-[215px]"
            size={8}
            text="در حال دریافت لایسنس اسپات‌پلیر..."
          />
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
    </Modal>
  );
}
