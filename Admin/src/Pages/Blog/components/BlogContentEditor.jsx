import React, { useState, lazy, Suspense } from "react";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Loading from "../../../Components/Loading";
import BlogPreview from "./BlogPreview";
import { MAX_BLOG_CONTENT_LENGTH } from "../constants/blogConstants";

// Lazy-load CodeMirror editor to keep initial bundle light
const HtmlCodeEditor = lazy(() => import("./HtmlCodeEditor"));

/**
 * Tabbed editor container for Blog HTML content and sandboxed preview.
 * Keeps editor mounted to preserve undo history and cursor position.
 */
export default function BlogContentEditor({
  value,
  onChange,
  error,
  previewHook,
  previewMetadata = {},
}) {
  const [activeTab, setActiveTab] = useState("editor"); // 'editor' | 'preview'

  const {
    status,
    html,
    error: previewError,
    fetchPreview,
    lastPreviewedContent,
  } = previewHook;

  // Trigger preview fetch when switching to the preview tab if content changed
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    if (tabKey === "preview") {
      const currentContent = value || "";
      if (currentContent !== lastPreviewedContent || status === "idle") {
        fetchPreview(currentContent);
      }
    }
  };

  const contentLength = (value || "").length;
  const isOverLimit = contentLength > MAX_BLOG_CONTENT_LENGTH;

  return (
    <div className="flex flex-col gap-4">
      {/* Tab Navigation Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-border">
        <div
          role="tablist"
          aria-label="ویرایشگر محتوای مقاله"
          className="flex items-center gap-2 bg-surface-muted p-1 rounded-xl border border-border w-fit"
        >
          <button
            type="button"
            role="tab"
            id="blog-editor-tab"
            aria-selected={activeTab === "editor"}
            aria-controls="blog-editor-panel"
            onClick={() => handleTabChange("editor")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "editor"
                ? "bg-white text-secondary shadow-xs"
                : "text-text-secondary hover:text-secondary"
            }`}
          >
            <CodeOutlinedIcon style={{ fontSize: 18 }} />
            ویرایش HTML
          </button>

          <button
            type="button"
            role="tab"
            id="blog-preview-tab"
            aria-selected={activeTab === "preview"}
            aria-controls="blog-preview-panel"
            onClick={() => handleTabChange("preview")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "preview"
                ? "bg-white text-secondary shadow-xs"
                : "text-text-secondary hover:text-secondary"
            }`}
          >
            <VisibilityOutlinedIcon style={{ fontSize: 18 }} />
            پیش‌نمایش
          </button>
        </div>

        {/* Counter and status info */}
        <div className="flex items-center gap-3 text-xs">
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

      {/* Tab Panels */}
      {/* Panel 1: CodeMirror HTML Editor (Kept mounted with display: none / hidden) */}
      <div
        role="tabpanel"
        id="blog-editor-panel"
        aria-labelledby="blog-editor-tab"
        className={activeTab === "editor" ? "block" : "hidden"}
      >
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

        {error && (
          <p className="text-xs text-danger font-medium mt-2 animate-fadeIn">
            {error}
          </p>
        )}
      </div>

      {/* Panel 2: Live Sandboxed Preview */}
      <div
        role="tabpanel"
        id="blog-preview-panel"
        aria-labelledby="blog-preview-tab"
        className={activeTab === "preview" ? "block" : "hidden"}
      >
        <BlogPreview
          status={status}
          html={html}
          error={previewError}
          onRetry={() => fetchPreview(value || "")}
          metadata={previewMetadata}
        />
      </div>
    </div>
  );
}
