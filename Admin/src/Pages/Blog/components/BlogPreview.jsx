import React, { useState, useMemo } from "react";
import DesktopWindowsOutlinedIcon from "@mui/icons-material/DesktopWindowsOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import articleContentCss from "../styles/articleContent.css?raw";
import Loading from "../../../Components/Loading";
import { Badge, Button } from "../../../Components/UI";
import { PREVIEW_VIEWPORT_WIDTHS } from "../constants/blogConstants";

/**
 * Sandboxed article preview component.
 * Renders server-sanitized HTML inside an isolated <iframe> with viewport switching.
 */
export default function BlogPreview({
  status,
  html,
  error,
  onRetry,
  metadata = {},
}) {
  const [viewportMode, setViewportMode] = useState("desktop");

  const { title, category, description, imagePreview } = metadata;

  // Construct complete isolated HTML document for srcDoc
  const documentSrc = useMemo(() => {
    if (!html) return "";

    const fontStyles = `
      @font-face {
        font-family: 'Vazirmatn';
        src: url('/fonts/Vazirmatn-Regular.woff2') format('woff2');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Vazirmatn';
        src: url('/fonts/Vazirmatn-Medium.woff2') format('woff2');
        font-weight: 500;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Vazirmatn';
        src: url('/fonts/Vazirmatn-Bold.woff2') format('woff2');
        font-weight: 700;
        font-style: normal;
        font-display: swap;
      }
      body {
        margin: 0;
        padding: 1.75rem;
        background-color: #ffffff;
        color: #1E293B;
        font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        -webkit-font-smoothing: antialiased;
      }
    `;

    return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>پیش‌نمایش مقاله</title>
  <style>
    ${fontStyles}
    ${articleContentCss}
  </style>
</head>
<body>
  <article class="article-content" dir="rtl">
    ${html}
  </article>
</body>
</html>`;
  }, [html]);

  const iframeWidth =
    viewportMode === "mobile"
      ? PREVIEW_VIEWPORT_WIDTHS.MOBILE
      : PREVIEW_VIEWPORT_WIDTHS.DESKTOP;

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header Mockup (React rendered) */}
      <div className="bg-surface rounded-2xl border border-border p-5 md:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-4 border-b border-border/80">
          <div>
            <span className="text-xs font-semibold text-text-muted">
              سربرگ نمایشی مقاله
            </span>
            <span className="text-[11px] text-text-muted/80 block mt-0.5">
              (سربرگ تقریبی است؛ محتوای داخل کادر پیش‌نمایش دقیق و پاکسازی‌شده است)
            </span>
          </div>

          {/* Viewport switch controls */}
          <div className="flex items-center gap-1 bg-surface-muted p-1 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setViewportMode("desktop")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewportMode === "desktop"
                  ? "bg-white text-secondary shadow-xs font-bold"
                  : "text-text-secondary hover:text-secondary"
              }`}
            >
              <DesktopWindowsOutlinedIcon style={{ fontSize: 16 }} />
              دسکتاپ
            </button>
            <button
              type="button"
              onClick={() => setViewportMode("mobile")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewportMode === "mobile"
                  ? "bg-white text-secondary shadow-xs font-bold"
                  : "text-text-secondary hover:text-secondary"
              }`}
            >
              <PhoneIphoneOutlinedIcon style={{ fontSize: 16 }} />
              موبایل (۳۹۰px)
            </button>
          </div>
        </div>

        {/* Article Meta Header */}
        <div className="mt-4 flex flex-col md:flex-row gap-5 items-start">
          {imagePreview && (
            <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-surface-muted shrink-0 border border-border">
              <img
                src={imagePreview}
                alt={title || "کاور مقاله"}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex-1 space-y-2">
            {category && (
              <Badge variant="amber" size="sm">
                {category}
              </Badge>
            )}
            <h1 className="text-xl md:text-2xl font-bold text-secondary">
              {title || "عنوان مقاله در اینجا نمایش داده می‌شود"}
            </h1>
            <p className="text-text-secondary text-sm leading-relaxed">
              {description || "توضیحات کوتاه مقاله در اینجا قرار می‌گیرد..."}
            </p>
          </div>
        </div>
      </div>

      {/* Main Preview Screen */}
      <div className="flex justify-center w-full">
        <div
          style={{ width: iframeWidth, transition: "width 0.25s ease" }}
          className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden"
        >
          {/* Loading state */}
          {status === "loading" && (
            <div className="min-h-[460px] flex flex-col items-center justify-center p-8 text-center bg-surface-muted/50">
              <Loading size={12} />
              <p className="text-sm text-text-secondary mt-4 font-medium">
                در حال پاکسازی محتوا و آماده‌سازی پیش‌نمایش در سرور...
              </p>
            </div>
          )}

          {/* Error state */}
          {status === "error" && (
            <div className="min-h-[460px] flex flex-col items-center justify-center p-8 text-center bg-danger-light/30">
              <div className="w-12 h-12 rounded-full bg-danger-light flex items-center justify-center text-danger mb-3">
                <ErrorOutlineIcon />
              </div>
              <h4 className="text-base font-bold text-secondary mb-1">
                خطا در دریافت پیش‌نمایش
              </h4>
              <p className="text-xs text-text-secondary max-w-md mb-5 leading-relaxed">
                {error || "سرور در پاکسازی یا تولید پیش‌نمایش با مشکل مواجه شد."}
              </p>
              {onRetry && (
                <Button
                  variant="outline"
                  size="sm"
                  icon={<RefreshIcon fontSize="small" />}
                  onClick={onRetry}
                >
                  تلاش مجدد
                </Button>
              )}
            </div>
          )}

          {/* Empty state */}
          {(status === "idle" || (!html && status !== "loading" && status !== "error")) && (
            <div className="min-h-[460px] flex flex-col items-center justify-center p-8 text-center bg-surface-muted/30">
              <p className="text-sm text-text-muted">
                ابتدا کد HTML را در تب «ویرایش HTML» وارد کنید تا پیش‌نمایش زنده مقاله نمایش داده شود.
              </p>
            </div>
          )}

          {/* Success state - Isolated iframe */}
          {status === "success" && html && (
            <iframe
              srcDoc={documentSrc}
              title="پیش‌نمایش محتوای مقاله"
              sandbox="allow-same-origin"
              referrerPolicy="no-referrer"
              className="w-full min-h-[520px] h-[72vh] border-0 block bg-white"
            />
          )}
        </div>
      </div>
    </div>
  );
}
