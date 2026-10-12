import React, { useMemo } from "react";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import DesktopWindowsOutlinedIcon from "@mui/icons-material/DesktopWindowsOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";

import { getImageUrl } from "../../../Utils/getImageUrl";
import { formatJalaliDate, toPersianDigits } from "../../../Utils/jalaliDate";
import Notify from "../../../Utils/notify";
import { Badge, SegmentedControl } from "../../../Components/UI";
import "../styles/articleContent.css";

/**
 * Maps blog categories to cohesive badge color variants
 */
export const getBlogCategoryVariant = (category) => {
  switch (category) {
    case "فرانتاند":
      return "blue";
    case "بکاند":
      return "indigo";
    case "گرافیک":
      return "purple";
    case "مسیر شغلی":
      return "amber";
    case "MBA":
      return "primary";
    case "زبان":
      return "success";
    default:
      return "neutral";
  }
};

/**
 * Calculates estimated reading time in minutes from HTML string
 */
export const estimateReadingTime = (htmlContent) => {
  if (!htmlContent) return 1;
  const stripped = htmlContent.replace(/<[^>]+>/g, " ").trim();
  const wordCount = stripped ? stripped.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(wordCount / 180));
};

/**
 * Parses headings from HTML content to construct Table of Contents
 */
const parseArticleHeadings = (htmlContent) => {
  if (!htmlContent) return [];
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const elements = doc.querySelectorAll("h2, h3");
    return Array.from(elements)
      .map((el, idx) => ({
        id: el.id || `toc-heading-${idx}`,
        text: el.textContent?.trim() || "",
        level: el.tagName.toLowerCase() === "h2" ? 2 : 3,
      }))
      .filter((item) => item.text.length > 0);
  } catch {
    return [];
  }
};

/**
 * Sanitizes HTML content by stripping script, iframe, object, embed tags and on* event handlers
 */
const sanitizeHtml = (html) => {
  if (!html) return "";
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    // Remove dangerous executable elements
    const dangerousTags = doc.querySelectorAll("script, iframe, object, embed, base");
    dangerousTags.forEach((el) => el.remove());
    // Remove inline event handlers (onclick, onerror, onload, etc.) and javascript: URIs
    const allElements = doc.querySelectorAll("*");
    allElements.forEach((el) => {
      Array.from(el.attributes).forEach((attr) => {
        const attrName = attr.name.toLowerCase();
        const attrVal = attr.value.toLowerCase().trim();
        if (attrName.startsWith("on") || attrVal.startsWith("javascript:")) {
          el.removeAttribute(attr.name);
        }
      });
    });
    return doc.body.innerHTML;
  } catch {
    return html;
  }
};

/**
 * Injects DOM IDs into h2/h3 tags so TOC clicks smoothly scroll
 */
const prepareContentWithHeadingIds = (htmlContent) => {
  if (!htmlContent) return "";
  const sanitized = sanitizeHtml(htmlContent);
  let counter = 0;
  return sanitized.replace(/<(h[23])([^>]*)>(.*?)<\/\1>/gi, (match, tag, attrs, text) => {
    if (/id=["'][^"']+["']/i.test(attrs)) {
      return match;
    }
    const id = `toc-heading-${counter++}`;
    return `<${tag} id="${id}" ${attrs}>${text}</${tag}>`;
  });
};

/**
 * ClientBlogArticleView
 * Clean, professional, and elegant article reader UI/UX.
 * Truly differentiates between Desktop and Mobile reading modes.
 */
export default function ClientBlogArticleView({
  blog,
  title: propTitle,
  category: propCategory,
  description: propDescription,
  content: propContent,
  img: propImg,
  createdAt: propCreatedAt,
  viewportMode = "desktop",
  onViewportChange,
  showViewportControls = false,
  isLiveDraft = false,
}) {
  const isMobileMode = viewportMode === "mobile";

  const activeTitle = blog?.title || propTitle || "عنوان مقاله در اینجا نمایش داده می‌شود";
  const activeCategory = blog?.category || propCategory || "وبلاگ";
  const activeDescription = blog?.description || propDescription || "";
  const rawContent = blog?.content || propContent || "";
  const activeImage = blog?.img || propImg;
  const activeCreatedAt = blog?.createdAt || propCreatedAt || new Date();

  // Determine cover image URL
  const coverUrl = useMemo(() => {
    if (!activeImage) return null;
    if (typeof activeImage === "string") {
      if (
        activeImage.startsWith("blob:") ||
        activeImage.startsWith("data:") ||
        activeImage.startsWith("http://") ||
        activeImage.startsWith("https://")
      ) {
        return activeImage;
      }
      return getImageUrl(activeImage);
    }
    return null;
  }, [activeImage]);

  // Headings & enriched content
  const headings = useMemo(() => parseArticleHeadings(rawContent), [rawContent]);
  const processedContentHtml = useMemo(
    () => prepareContentWithHeadingIds(rawContent),
    [rawContent]
  );

  const readingTime = useMemo(() => estimateReadingTime(rawContent), [rawContent]);

  const formattedDate = useMemo(() => {
    return formatJalaliDate(activeCreatedAt, { withTime: false }) || "امروز";
  }, [activeCreatedAt]);

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      Notify.success("لینک مقاله در کلیپ‌بورد کپی شد.");
    } catch {
      Notify.info("لینک مقاله را از آدرس‌بار مرورگر کپی نمایید.");
    }
  };

  const handleScrollToHeading = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Pure Article Content Layout adapted to mobile vs desktop viewport mode
  const renderArticleBody = (isMobile) => (
    <div className="w-full text-text-primary">
      {/* Visual Mode Indicator Header */}
      <div className="flex items-center justify-between pb-3 mb-4 sm:mb-5 border-b border-border/70 text-[11px] sm:text-xs font-bold select-none">
        {isMobile ? (
          <span className="flex items-center gap-1.5 text-primary">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            نمای مطالعه بهینه در گوشی هوشمند (۳۹۰px)
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-secondary">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            نمای مطالعه عریض در دسکتاپ (۱۰۲۴px+)
          </span>
        )}
        <span className={`px-2 py-0.5 rounded-md text-2xs font-extrabold ${
          isMobile ? "bg-primary-soft text-primary-text" : "bg-bg-light text-text-secondary"
        }`}>
          {isMobile ? "نسخه موبایل" : "نسخه دسکتاپ"}
        </span>
      </div>

      {/* 1. Article Meta & Header */}
      <header className={isMobile ? "mb-4" : "mb-6"}>
        <div className="flex items-center flex-wrap gap-2 mb-3 text-xs">
          <Badge variant={getBlogCategoryVariant(activeCategory)} size={isMobile ? "sm" : "md"}>
            {activeCategory}
          </Badge>

          <div className="flex items-center gap-1 text-text-muted bg-background-subtle px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-2xs sm:text-xs">
            <AccessTimeOutlinedIcon style={{ fontSize: isMobile ? 13 : 15 }} />
            <span>{toPersianDigits(readingTime)} دقیقه مطالعه</span>
          </div>

          <div className="flex items-center gap-1 text-text-muted bg-background-subtle px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-2xs sm:text-xs">
            <CalendarTodayOutlinedIcon style={{ fontSize: isMobile ? 12 : 14 }} />
            <span>{toPersianDigits(formattedDate)}</span>
          </div>

          {isLiveDraft && (
            <span className="text-2xs font-extrabold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 border border-amber-500/30">
              پیش‌نویس زنده
            </span>
          )}
        </div>

        {/* Title */}
        <h1
          className={`font-black text-text-primary leading-snug tracking-tight mb-3 ${
            isMobile
              ? "text-lg sm:text-xl md:text-2xl"
              : "text-2xl sm:text-3xl md:text-4xl"
          }`}
        >
          {activeTitle}
        </h1>

        {/* Lead Excerpt */}
        {activeDescription && (
          <p
            className={`text-text-secondary leading-relaxed bg-primary/5 border-primary rounded-xl sm:rounded-2xl my-4 ${
              isMobile
                ? "text-xs sm:text-sm p-3 border-r-3"
                : "text-sm sm:text-base md:text-lg p-4 sm:p-5 border-r-4 my-5"
            }`}
          >
            {activeDescription}
          </p>
        )}
      </header>

      {/* 2. Featured Cover Image */}
      {coverUrl && (
        <div
          className={`w-full overflow-hidden border border-border/80 shadow-xs my-4 bg-background-subtle ${
            isMobile
              ? "rounded-xl max-h-[220px] aspect-video"
              : "rounded-2xl max-h-[460px] aspect-21/9 my-6"
          }`}
        >
          <img
            src={coverUrl}
            alt={activeTitle}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* 3. Table of Contents (Only rendered when headings exist) */}
      {headings.length > 0 && (
        <div
          className={`bg-background-subtle border border-border/80 ${
            isMobile
              ? "my-5 p-3.5 sm:p-4 rounded-xl"
              : "my-8 p-5 sm:p-6 rounded-2xl"
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-border/60">
            <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-text-primary">
              <FormatListNumberedIcon style={{ fontSize: isMobile ? 16 : 18 }} className="text-primary" />
              <span>فهرست سرفصل‌های این مقاله</span>
            </div>
            <span className="text-2xs font-semibold text-text-muted bg-card px-2 py-0.5 rounded-md border border-border/50">
              {toPersianDigits(headings.length)} بخش
            </span>
          </div>
          <ul className={`space-y-1.5 ${isMobile ? "text-2xs sm:text-xs" : "text-xs sm:text-sm space-y-2"}`}>
            {headings.map((h, i) => (
              <li key={h.id || i}>
                <button
                  type="button"
                  onClick={() => handleScrollToHeading(h.id)}
                  className={`text-right w-full hover:text-primary transition-colors flex items-start gap-1.5 cursor-pointer ${
                    h.level === 3
                      ? "pr-3 text-text-muted font-medium"
                      : "text-text-secondary font-semibold"
                  }`}
                >
                  <span className="text-primary text-2xs mt-0.5">●</span>
                  <span className="hover:underline">{h.text}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 4. Article HTML Body */}
      <article
        className={`article-content ${isMobile ? "text-sm leading-relaxed" : ""}`}
        dir="rtl"
        dangerouslySetInnerHTML={{
          __html:
            processedContentHtml ||
            `<div class="p-6 rounded-2xl bg-background-subtle border border-border text-center text-text-muted text-xs sm:text-sm">
              هنوز محتوایی برای این مقاله ثبت نشده است.
            </div>`,
        }}
      />

      {/* 5. Minimal Footer Meta & Copy Link */}
      <footer className="mt-8 pt-5 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-2xs sm:text-xs text-text-muted font-medium">دسته‌بندی:</span>
          <span className="text-2xs sm:text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-background-subtle text-text-secondary border border-border/60">
            #{activeCategory}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopyLink}
          className="self-start sm:self-auto px-3 py-1 rounded-xl border border-border hover:bg-background-subtle text-text-secondary text-2xs sm:text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ContentCopyIcon style={{ fontSize: 13 }} />
          <span>کپی لینک مقاله</span>
        </button>
      </footer>
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center py-2 transition-all">
      {/* Optional Top Viewport Switcher */}
      {showViewportControls && onViewportChange && (
        <div className="w-full max-w-4xl flex items-center justify-between pb-3 mb-4 border-b border-border">
          <span className="text-xs font-bold text-text-secondary">
            {isMobileMode ? "پیش‌نمایش نسخه موبایل (۳۹۰px)" : "پیش‌نمایش نسخه دسکتاپ"}
          </span>
          <SegmentedControl
            options={[
              {
                id: "desktop",
                label: "دسکتاپ",
                icon: <DesktopWindowsOutlinedIcon style={{ fontSize: 16 }} />,
              },
              {
                id: "mobile",
                label: "موبایل",
                icon: <PhoneIphoneOutlinedIcon style={{ fontSize: 16 }} />,
              },
            ]}
            value={viewportMode}
            onChange={onViewportChange}
          />
        </div>
      )}

      {/* Article Container based on Viewport Mode */}
      {isMobileMode ? (
        <div className="w-full max-w-[390px] bg-card rounded-3xl border-2 border-border/90 shadow-lg p-4 sm:p-5 transition-all duration-300">
          {renderArticleBody(true)}
        </div>
      ) : (
        <div className="w-full max-w-5xl flex flex-col items-center">
          {/* Google Chrome Desktop Simulator Frame */}
          <div className="w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-card shadow-sm transition-all duration-300">
            {/* Chrome-style Browser Titlebar & Omnibox */}
            <div className="bg-surface-hover/80 px-4 py-2.5 border-b border-border/70 flex items-center justify-between gap-3 text-xs select-none">
              <div className="flex items-center gap-2">
                {/* Traffic lights */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="hidden sm:inline-block font-semibold text-text-secondary text-[11px] truncate max-w-[200px]">
                  {activeTitle}
                </span>
              </div>

              {/* URL Bar */}
              <div
                className="flex-1 max-w-md mx-auto bg-surface px-3 py-1 rounded-xl border border-border/60 text-[11px] text-text-muted flex items-center gap-1.5 truncate font-mono"
                dir="ltr"
              >
                <span className="text-emerald-600 font-bold">🔒</span>
                <span className="truncate">rokad.ir/blog/{blog?._id || "preview"}</span>
              </div>

              {/* Viewport Badge */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary-soft text-primary whitespace-nowrap">
                  نمای کامپیوتر (۱۰۲۴px)
                </span>
              </div>
            </div>

            {/* Horizontal scrollable desktop viewport canvas */}
            <div className="w-full overflow-x-auto p-4 sm:p-8 md:p-12 bg-background-subtle/30">
              <div className="min-w-[768px] lg:min-w-0 max-w-4xl mx-auto bg-card rounded-2xl border border-border/70 p-5 sm:p-8 md:p-10 shadow-2xs">
                {renderArticleBody(false)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
