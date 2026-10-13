"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Code,
  Briefcase,
  Globe,
  Sparkles,
  Monitor,
  MapPin,
  Clock,
  Key,
  Copy,
  Check,
  Calendar,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

/**
 * دپارتمان‌ها و کانفیگ آیکون و تم
 */
const DEPT_CONFIG = {
  it: {
    name: "دپارتمان فناوری اطلاعات",
    icon: Code,
    pattern: "/assets/StatCard/blue.png",
    themeClass: "mc-theme-it",
  },
  business: {
    name: "دپارتمان کسب‌وکار",
    icon: Briefcase,
    pattern: "/assets/StatCard/yellow.png",
    themeClass: "mc-theme-business",
  },
  languages: {
    name: "دپارتمان زبان‌های خارجی",
    icon: Globe,
    pattern: "/assets/StatCard/pink.png",
    themeClass: "mc-theme-languages",
  },
  default: {
    name: "کالج رکاد",
    icon: Sparkles,
    pattern: "/assets/StatCard/yellow.png",
    themeClass: "mc-theme-default",
  },
};

/**
 * تشخیص دپارتمان بر اساس مشخصات دوره
 */
function resolveDept(course = {}) {
  const cat = (course.category || course.dept || course.department || "").toLowerCase();
  const title = (course.title || "").toLowerCase();

  if (
    cat.includes("it") ||
    cat.includes("فناوری") ||
    cat.includes("وب") ||
    title.includes("وردپرس") ||
    title.includes("سئو") ||
    title.includes("ui/ux") ||
    title.includes("پایتون") ||
    title.includes("فرانت") ||
    title.includes("فیگما")
  ) {
    return DEPT_CONFIG.it;
  }

  if (
    cat.includes("business") ||
    cat.includes("کسب") ||
    cat.includes("مارکتینگ") ||
    cat.includes("مدیریت") ||
    title.includes("دیجیتال مارکتینگ") ||
    title.includes("فروش")
  ) {
    return DEPT_CONFIG.business;
  }

  if (cat.includes("lang") || cat.includes("زبان") || title.includes("انگلیسی")) {
    return DEPT_CONFIG.languages;
  }

  return DEPT_CONFIG.default;
}

export default function MyCourseCard({ item, onOpenLicense }) {
  const [copied, setCopied] = useState(false);

  const course = item.course || {};
  const isVirtual =
    item.courseModel === "VirtualCourse" ||
    course.type === "مجازی" ||
    Boolean(item.spotplayer?.key) ||
    !item.session;

  const isCompleted = item.status === "completed" || item.progress === 100;
  const dept = resolveDept(course);
  const DeptIcon = dept.icon;

  const courseSlug = course.slug || course._id;
  const courseHref = courseSlug ? `/courses/${courseSlug}` : "/courses";
  const licenseKey = item.spotplayer?.key;

  const handleCopyKey = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!licenseKey) return;
    try {
      navigator.clipboard.writeText(licenseKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  };

  return (
    <article className="mc-card">
      {/* بخش ویژوال با پترن و آیکون دپارتمان (مشابه ch-flag-visual) */}
      <div className={`mc-card-visual ${dept.themeClass}`}>
        <img src={dept.pattern} alt="" className="mc-card-pattern" aria-hidden="true" />

        {/* برچسب دپارتمان در گوشه بالا */}
        <span className="mc-dept-chip">{dept.name}</span>

        {/* باکس آیکون نئوبروتالیست مرکزی */}
        <div className="mc-icon-wrap">
          <DeptIcon size={42} style={{ color: "var(--ink, #1F1E1D)" }} strokeWidth={2.2} />
        </div>

        {/* بج نوع برگزاری / وضعیت */}
        <span
          className={`mc-badge-pill ${
            isCompleted
              ? "mc-badge-completed"
              : isVirtual
              ? "mc-badge-virtual"
              : "mc-badge-inperson"
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 size={12} strokeWidth={2.5} />
              <span>تکمیل‌شده</span>
            </>
          ) : isVirtual ? (
            <>
              <Monitor size={12} strokeWidth={2.5} />
              <span>مجازی (اسپات‌پلیر)</span>
            </>
          ) : (
            <>
              <MapPin size={12} strokeWidth={2.5} />
              <span>کارگاه حضوری</span>
            </>
          )}
        </span>
      </div>

      {/* بدنه و مشخصات دوره */}
      <div className="mc-card-body">
        {/* ردیف متادیتا */}
        <div className="mc-card-meta-row">
          <span>
            مدرس: <strong>{course.instructor || "اساتید کالج رکاد"}</strong>
          </span>
          {item.createdAt && (
            <span>
              {new Date(item.createdAt).toLocaleDateString("fa-IR", {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>

        {/* عنوان دوره */}
        <h3 className="mc-card-title">
          <Link href={courseHref}>{course.title || "عنوان دوره تخصصی"}</Link>
        </h3>

        {/* پیل‌های مشخصات */}
        <div className="mc-pills-row">
          {course.duration && (
            <span className="mc-pill">
              <Clock size={12} />
              <span>{course.duration}</span>
            </span>
          )}

          {!isVirtual && item.session && (
            <span className="mc-pill">
              <Calendar size={12} />
              <span>{item.session.scheduleDays || "جلسات کلاسی"}</span>
            </span>
          )}

          {isVirtual && (
            <span className="mc-pill">
              <Sparkles size={12} />
              <span>دسترسی دائم</span>
            </span>
          )}
        </div>

        {/* نوار دسترسی لایسنس اسپات‌پلیر در صورت مجازی بودن */}
        {isVirtual && licenseKey && (
          <div className="mc-spotplayer-box">
            <div className="mc-spotplayer-box-info">
              <Key size={14} className="text-amber-600 flex-shrink-0" />
              <span className="font-mono text-[11px] truncate select-all">{licenseKey}</span>
            </div>
            <button
              type="button"
              className="mc-copy-key-btn"
              onClick={handleCopyKey}
              title="کپی کلید لایسنس"
            >
              {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
              <span>{copied ? "کپی شد" : "کپی"}</span>
            </button>
          </div>
        )}

        {/* اکشن‌های فوتر کارت (حداکثر ۱ تا ۲ کلمه، فعل اول) */}
        <div className="mc-card-actions">
          <Link href={courseHref} className="mc-btn-primary">
            <span>ورود به دوره</span>
            <ExternalLink size={14} />
          </Link>

          {isVirtual && (
            <button
              type="button"
              className="mc-btn-license"
              onClick={() => onOpenLicense(course._id || course.slug, course.title)}
            >
              <Key size={14} />
              <span>لایسنس</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
