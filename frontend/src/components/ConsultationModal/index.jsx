"use client";

import { useEffect, useCallback } from "react";
import "./consultation.css";

export default function ConsultationModal({ isOpen, onClose }) {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    // Only close if clicking directly on the backdrop itself, never on the card or iframe
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      className="cmod-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      dir="rtl"
    >
      <div className="cmod-card cmod-iframe-card">
        {/* Topbar: Keeps the close button separate, on top and never overlapped by the embed */}
        <div className="cmod-topbar">
          <div className="cmod-badge">
            <span className="cmod-dot" />
            <span>مشاوره تخصصی رکاد</span>
          </div>

          <button
            type="button"
            className="cmod-close"
            onClick={handleClose}
            aria-label="بستن پنجره"
            title="بستن (Esc)"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="cmod-close-icon"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Form embed iframe: takes full remaining card space directly */}
        <div className="cmod-iframe-wrap">
          <iframe
            src="https://porskad.vercel.app/embed/fr_c1bb2f16754a"
            width="100%"
            height="100%"
            frameBorder="0"
            allow="camera; microphone; autoplay; clipboard-write; fullscreen"
            className="cmod-iframe"
            title="فرم مشاوره کالج رکاد"
            scrolling="yes"
            tabIndex={0}
          />
        </div>
      </div>
    </div>
  );
}
