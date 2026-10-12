import React, { lazy, Suspense } from "react";
import Loading from "../../../Components/Loading";
import { MAX_BLOG_CONTENT_LENGTH } from "../constants/blogConstants";

// Lazy-load CodeMirror editor to keep initial bundle light
const HtmlCodeEditor = lazy(() => import("./HtmlCodeEditor"));

/**
 * Clean, lightweight editor container for Blog HTML content.
 * Kept focused purely on code editing without duplicate tabs or redundant preview.
 */
export default function BlogContentEditor({ value, onChange, error }) {
  const contentLength = (value || "").length;
  const isOverLimit = contentLength > MAX_BLOG_CONTENT_LENGTH;

  return (
    <div className="flex flex-col gap-3">
      {/* CodeMirror HTML Editor */}
      <Suspense
        fallback={
          <div className="min-h-[450px] rounded-xl border border-border flex flex-col items-center justify-center p-8 bg-surface-muted/30">
            <Loading size={10} />
            <span className="text-xs text-text-secondary mt-3">
              در حال بارگذاری ویرایشگر کد...
            </span>
          </div>
        }
      >
        <HtmlCodeEditor
          value={value}
          onChange={onChange}
          placeholder="کد HTML مقاله را اینجا وارد یا پیست کنید (مثال: <h2>عنوان</h2><p>متن پاراگراف</p>)..."
        />
      </Suspense>

      {/* Counter & Error Info */}
      <div className="flex items-center justify-between text-xs pt-1">
        <div>
          {error && (
            <p className="text-xs text-danger font-medium animate-fadeIn">
              {error}
            </p>
          )}
        </div>

        <span
          className={`font-medium ${
            isOverLimit ? "text-danger font-bold" : "text-text-muted"
          }`}
        >
          حجم محتوا: {contentLength.toLocaleString("fa-IR")} از{" "}
          {MAX_BLOG_CONTENT_LENGTH.toLocaleString("fa-IR")} کاراکتر
        </span>
      </div>
    </div>
  );
}
