import React from "react";
import Link from "next/link";
import { CheckCircle2, Star as LucideStar } from "lucide-react";
import { getCourseImageUrl } from "@/utils/getImageUrl.js";

export function CourseTopbar({ course }) {
  const DEPT_MAP = {
    "فناوری اطلاعات": "it",
    it: "it",
    "کسب و کار": "business",
    "کسب‌وکار": "business",
    business: "business",
    "زبان‌های خارجی": "languages",
    languages: "languages",
    "مشاوره": "counseling",
    counseling: "counseling",
  };
  const deptId = DEPT_MAP[course?.category] || DEPT_MAP[course?.department] || (course?.department ? course.department : null);
  const deptHref = deptId ? `/dept/${deptId}` : "/courses";
  return (
    <div className="container">
      <div className="cs-topbar">
        <Link href="/courses" className="cs-back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, transform: "rotate(180deg)" }}>
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          همهٔ دوره‌ها
        </Link>
        <nav className="cs-crumbs">
          <Link href="/courses">دوره‌ها</Link>
          <span className="sep">›</span>
          <Link href={deptHref}>{course.category || course.departmentFa || "آنلاین"}</Link>
          <span className="sep">›</span>
          <b title={course.title}>{course.title}</b>
        </nav>
        <span className="cs-students">
          {course.students || "۹۵"} دانشجو
          <span className="avs" aria-hidden="true">
            <span className="av" />
            <span className="av" />
            <span className="av" />
          </span>
        </span>
      </div>
    </div>
  );
}

export function CourseSidebar({
  course,
  isEnrolled,
  isWishlisted,
  enrollToast,
  onStartPurchase,
  onOpenLicense,
  onWishlistToggle,
  onOpenVideo,
}) {
  const numPrice = course.finalPrice !== undefined ? course.finalPrice : course.price;
  const isFree = !numPrice || numPrice === 0 || numPrice === "رایگان";
  const displayPrice = isFree
    ? "رایگان"
    : (typeof numPrice === "number"
      ? Number(numPrice).toLocaleString("fa-IR")
      : String(numPrice).replace(/تومان/g, "").trim());

  const hasDiscount = Boolean(course.isDiscountActive && course.price && course.finalPrice && course.finalPrice < course.price);
  const oldPriceDisplay = hasDiscount
    ? Number(course.price).toLocaleString("fa-IR")
    : (course.oldPrice ? String(course.oldPrice).replace(/تومان/g, "").trim() : null);

  return (
    <aside className="cs-side">
      <div className="cs-card">
        <div
          className="cs-thumb cs-thumb-side"
          onClick={onOpenVideo}
          style={{ cursor: "pointer", position: "relative", overflow: "hidden" }}
          title="کلیک برای پخش ویدیو با پلیر پیشرفته"
        >
          <img
            src={getCourseImageUrl(course.img, course.pattern || course.previewPoster || "/assets/StatCard/blue.png")}
            alt={course.title}
            className="cs-thumb-side-img"
          />
          <div className="cs-thumb-side-overlay" />
          <span className="cs-thumb-side-badge">
            <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M8 5v14l11-7z" /></svg>
            <span>پیش‌نمایش ویدیو</span>
          </span>
          <span className="play">
            <span>
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            </span>
          </span>
        </div>

        <div className="cs-price">
          {oldPriceDisplay && <span className="old">{oldPriceDisplay}</span>}
          <b>{displayPrice}</b>
          {!isFree && <span className="cur">تومان</span>}
        </div>
        {course.discount && <span className="cs-discount">{course.discount}</span>}

        {enrollToast && (
          <div style={{ background: "var(--teal-light)", border: "1.5px solid var(--ink)", padding: "8px 10px", borderRadius: "6px 0 6px 0", fontSize: "12.5px", fontWeight: 800, color: "var(--teal-dark)", margin: "8px 0" }}>
            ثبت‌نام انجام شد!
          </div>
        )}

        {isEnrolled ? (
          <button
            type="button"
            onClick={onOpenLicense}
            className="cs-btn"
            style={{ background: "var(--teal-dark)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer" }}
          >
            <CheckCircle2 size={16} />
            <span>مشاهده لایسنس دوره</span>
          </button>
        ) : (
          <button type="button" className="cs-btn" onClick={onStartPurchase}>
            {isFree ? "ثبت‌نام دوره" : "خرید دوره"}
          </button>
        )}

        <button
          type="button"
          className="cs-sub-btn"
          onClick={onWishlistToggle}
          style={{ color: isWishlisted ? "var(--accent)" : "inherit", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}
        >
          <LucideStar size={15} fill={isWishlisted ? "currentColor" : "none"} />
          <span>{isWishlisted ? "نشان شده" : "نشان کردن"}</span>
        </button>

        <div className="cs-divider" />

        <div className="cs-facts">
          <div className="f">
            <div className="k">مدت زمان</div>
            <div className="v">{course.duration || "۳۲ ساعت"}</div>
          </div>
          <div className="f">
            <div className="k">تعداد سرفصل</div>
            <div className="v">{course.sprints?.length ? `${course.sprints.length} سرفصل` : "پروژه‌محور"}</div>
          </div>
          <div className="f">
            <div className="k">سطح</div>
            <div className="v">مقدماتی تا پیشرفته</div>
          </div>
          <div className="f">
            <div className="k">گواهی</div>
            <div className="v">دارد (معتبر)</div>
          </div>
          <div className="f">
            <div className="k">دسترسی</div>
            <div className="v">مادام‌العمر</div>
          </div>
          <div className="f">
            <div className="k">نوع دوره</div>
            <div className="v">{course.spotplayerCourseId ? "اسپات پلیر" : "آنلاین"}</div>
          </div>
        </div>
      </div>

      <div className="cs-instr">
        <span className="av">
          {((Array.isArray(course.teachers) && course.teachers[0]?.name) || course.teacher?.name || "استاد").slice(0, 2)}
        </span>
        <span className="who">
          <b>{(Array.isArray(course.teachers) && course.teachers[0]?.name) || course.teacher?.name || "استاد کالج رکاد"}</b>
          <small>{(Array.isArray(course.teachers) && course.teachers[0]?.role) || course.teacher?.role || "مدرس رسمی دوره"}</small>
        </span>
      </div>
    </aside>
  );
}
