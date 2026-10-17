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
  Calendar,
  CheckCircle2,
  ExternalLink,
  Bookmark,
} from "lucide-react";
import { toggleWishlist } from "@/data/panelStore.js";
import { isWishlisted, isEnrolledIn, isCourseInPerson } from "@/data/selectors.js";

/**
 * دپارتمان‌ها و کانفیگ آیکون و تم
 */
const DEPT_CONFIG = {
  it: {
    name: "فناوری اطلاعات",
    icon: Code,
    pattern: "/assets/StatCard/yellow.png",
    themeClass: "mc-theme-college",
  },
  business: {
    name: "کسب‌وکار",
    icon: Briefcase,
    pattern: "/assets/StatCard/yellow.png",
    themeClass: "mc-theme-college",
  },
  languages: {
    name: "زبان‌های خارجی",
    icon: Globe,
    pattern: "/assets/StatCard/yellow.png",
    themeClass: "mc-theme-college",
  },
  default: {
    name: "کالج رکاد",
    icon: Sparkles,
    pattern: "/assets/StatCard/yellow.png",
    themeClass: "mc-theme-college",
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

export default function MyCourseCard({ item, onOpenLicense, store }) {
  const course = item.course || {};
  const courseSlug = course.slug || course._id || course.id;
  const courseId = course._id || course.id;

  // تشخیص دقیق وضعیت خریداری بر اساس آیتم و استور ثبت‌نام‌ها
  const isPurchased =
    item.isPurchased === true ||
    item.purchaseStatus === "purchased" ||
    isEnrolledIn(courseSlug, store) ||
    (courseId && isEnrolledIn(courseId, store));

  // تشخیص دقیق حضوری یا غیرحضوری بودن
  const isInPerson = isCourseInPerson(course, item);
  const isVirtual = !isInPerson;

  const isCompleted = isPurchased && (item.status === "completed" || item.progress === 100);
  const dept = resolveDept(course);
  const DeptIcon = dept.icon;

  const courseHref = courseSlug ? `/courses/${courseSlug}` : "/courses";
  const isSaved = isWishlisted(courseSlug, store) || item.purchaseStatus === "saved";

  const instructorName =
    Array.isArray(course.teachers) && course.teachers.length > 0
      ? course.teachers
          .map((t) => (typeof t === "object" ? t.name || t.fullName : t))
          .filter(Boolean)
          .join("، ")
      : course.instructor || "اساتید کالج رکاد";

  return (
    <article className="mc-card">
      {/* بخش ویژوال با پترن و آیکون دپارتمان */}
      <div className={`mc-card-visual ${dept.themeClass}`}>
        <img src={course.img || dept.pattern} alt="" className="mc-card-pattern" aria-hidden="true" />

        {/* دکمه نشان کردن در گوشه بالا */}
        <button
          type="button"
          className={`mc-card-save-btn ${isSaved ? "is-saved" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(courseSlug);
          }}
          aria-label={isSaved ? "حذف از نشان‌شده‌ها" : "نشان کردن دوره"}
          title={isSaved ? "حذف از نشان‌شده‌ها" : "نشان کردن دوره"}
        >
          <Bookmark size={14} fill={isSaved ? "currentColor" : "none"} strokeWidth={2.4} />
        </button>

        {/* برچسب دسته‌بندی پویا */}
        <span className="mc-dept-chip">{course.category || dept.name}</span>

        {/* باکس آیکون نئوبروتالیست مرکزی */}
        <div className="mc-icon-wrap">
          <DeptIcon size={32} style={{ color: "var(--ink, #1F1E1D)" }} strokeWidth={2.2} />
        </div>

        {/* بج نوع برگزاری / وضعیت */}
        <span
          className={`mc-badge-pill ${
            isCompleted
              ? "mc-badge-completed"
              : isInPerson
              ? "mc-badge-inperson"
              : "mc-badge-virtual"
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 size={12} strokeWidth={2.5} />
              <span>تکمیل‌شده</span>
            </>
          ) : isInPerson ? (
            <>
              <MapPin size={12} strokeWidth={2.5} />
              <span>کارگاه حضوری</span>
            </>
          ) : (
            <>
              <Monitor size={12} strokeWidth={2.5} />
              <span>غیر حضوری</span>
            </>
          )}
        </span>
      </div>

      {/* بدنه و مشخصات دوره */}
      <div className="mc-card-body">
        {/* ردیف متادیتا */}
        <div className="mc-card-meta-row">
          <span>
            مدرس: <strong>{instructorName}</strong>
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

        {/* نمایش وضعیت یا شهریه دوره: اگر خریداری شده باشد در علاقه‌مندی‌ها بج خریداری‌شده می‌زند */}
        {isPurchased ? (
          item.purchaseStatus === "saved" && (
            <div className="mc-card-price-row is-purchased">
              <span className="mc-price-label">وضعیت:</span>
              <span className="mc-purchased-badge">
                <CheckCircle2 size={13} strokeWidth={2.5} />
                <span>خریداری‌شده</span>
              </span>
            </div>
          )
        ) : (
          <div className="mc-card-price-row">
            <span className="mc-price-label">شهریه دوره:</span>
            <b className="mc-price-val">
              {course.price ? `${Number(course.price).toLocaleString("fa-IR")} تومان` : "رایگان"}
            </b>
          </div>
        )}

        {/* پیل‌های مشخصات */}
        <div className="mc-pills-row">
          {course.duration && (
            <span className="mc-pill">
              <Clock size={12} />
              <span>{course.duration}</span>
            </span>
          )}

          {isInPerson && (
            <span className="mc-pill">
              <Calendar size={12} />
              <span>{item.session?.scheduleDays || "کارگاه حضوری"}</span>
            </span>
          )}

          {!isInPerson && (
            <span className="mc-pill">
              <Sparkles size={12} />
              <span>دسترسی دائم</span>
            </span>
          )}
        </div>

        {/* اکشن‌های فوتر کارت (حداکثر ۱ تا ۲ کلمه، فعل اول) */}
        <div className="mc-card-actions">
          {isPurchased ? (
            <>
              <Link href={courseHref} className="mc-btn-primary">
                <span>ورود به دوره</span>
                <ExternalLink size={14} />
              </Link>

              {isVirtual && Boolean(item.spotplayer?.key || item.spotplayer?.licenseId) && (
                <button
                  type="button"
                  className="mc-btn-license"
                  onClick={() => onOpenLicense(course._id || course.slug, course.title)}
                >
                  <Key size={14} />
                  <span>لایسنس</span>
                </button>
              )}
            </>
          ) : (
            <Link href={courseHref} className="mc-btn-primary mc-btn-enroll">
              <span>مشاهده و ثبت‌نام</span>
              <ExternalLink size={14} />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export function SkeletonMyCourseCard() {
  return (
    <article className="mc-card" aria-hidden="true" style={{ pointerEvents: "none" }}>
      <div
        className="mc-card-visual rk-skeleton-shimmer"
        style={{ background: "linear-gradient(135deg, rgba(248, 164, 29, 0.12) 0%, rgba(248, 164, 29, 0.22) 100%)" }}
      >
        <div className="mc-dept-chip" style={{ width: 68, height: 22, padding: 0 }} />
        <div
          className="mc-icon-wrap"
          style={{ background: "#ffffff", border: "2px solid var(--ink)", boxShadow: "2px 2px 0 var(--ink)" }}
        >
          <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(0,0,0,0.06)" }} />
        </div>
        <div className="mc-badge-pill" style={{ width: 80, height: 24, padding: 0 }} />
      </div>

      <div className="mc-card-body" style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="rk-skeleton-line" style={{ width: 65, height: 13 }} />
          <div className="rk-skeleton-line" style={{ width: 50, height: 13 }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBlock: 4 }}>
          <div className="rk-skeleton-line" style={{ width: "90%", height: 20 }} />
          <div className="rk-skeleton-line" style={{ width: "60%", height: 20 }} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBlock: 4 }}>
          <div className="rk-skeleton-shimmer" style={{ width: 24, height: 24, borderRadius: "50%" }} />
          <div className="rk-skeleton-line" style={{ width: 80, height: 13 }} />
        </div>

        <div style={{ marginTop: "auto", paddingTop: 10 }}>
          <div className="rk-skeleton-line" style={{ width: "100%", height: 38, borderRadius: "10px 0 10px 0" }} />
        </div>
      </div>
    </article>
  );
}

