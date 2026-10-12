import React, { useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { Button } from "../Button";
import { LABELS } from "../../../Constants/vocab";

/**
 * Reusable Accessible Modal Component
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer = null,
  maxWidth = "max-w-lg",
  className = "",
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose?.();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      dir="rtl"
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${maxWidth} max-h-[88vh] sm:max-h-[85vh] flex flex-col bg-surface rounded-2xl sm:rounded-3xl border border-border/80 shadow-2xl overflow-hidden text-right animate-scaleIn ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed at top */}
        <div className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-3.5 border-b border-border/80 bg-surface">
          <div className="text-sm md:text-base font-extrabold text-secondary truncate pe-2">
            {title}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={LABELS.CLOSE}
            className="text-text-muted hover:text-text-primary p-1.5 rounded-xl hover:bg-surface-hover transition-colors cursor-pointer shrink-0"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {/* Body - Fully scrollable internally with unified horizontal padding */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 py-4 sm:py-5 min-h-0 custom-scrollbar">
          {children}
        </div>

        {/* Footer - Fixed at bottom & always visible with matching horizontal padding */}
        {footer && (
          <div className="shrink-0 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 px-4 sm:px-6 py-3 sm:py-3.5 bg-bg-light/95 border-t border-border/80">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Standard ConfirmDialog (e.g. for Delete or Irreversible actions)
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "آیا مطمئن هستید؟",
  description = "این عملیات غیرقابل بازگشت است. آیا از انجام آن اطمینان دارید؟",
  confirmLabel = LABELS.DELETE,
  cancelLabel = LABELS.CANCEL,
  variant = "danger",
  loading = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={loading ? () => {} : onClose}
      maxWidth="max-w-md"
      title={title}
      footer={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            size="sm"
            onClick={onConfirm}
            loading={loading}
            className="w-full sm:w-auto"
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center ${
            variant === "danger"
              ? "bg-error-light text-error border border-error-border"
              : "bg-warning-light text-warning border border-warning-border"
          }`}
        >
          <WarningAmberRoundedIcon />
        </div>
        <div className="flex flex-col gap-1 text-right">
          <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Modal>
  );
}

export default Modal;
