import React from "react";
import { CheckCircle2, Star as LucideStar } from "lucide-react";

export function CourseTopbar({ course }) {
  return (
    <div className="cs-topbar container">
      <a href="#courses-index" className="cs-back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        همهٔ دوره‌ها
      </a>
      <nav className="cs-crumbs">
        <a href="#courses-index">دوره‌ها</a>
        <span className="sep">›</span>
        <a href={`#courses-index/${course.department}`}>{course.departmentFa}</a>
        <span className="sep">›</span>
        <b>{course.title}</b>
      </nav>
      <span className="cs-students">
        {course.students} دانشجو
        <span className="avs" aria-hidden="true">
          <span className="av" />
          <span className="av" />
          <span className="av" />
        </span>
      </span>
    </div>
  );
}

export function CourseSidebar({
  course,
  isEnrolled,
  isWishlisted,
  enrollToast,
  onStartPurchase,
  onWishlistToggle,
  onOpenVideo,
}) {
  return (
    <aside className="cs-side">
      <div className="cs-card">
        <div
          className="cs-thumb cs-thumb-side"
          onClick={onOpenVideo}
          style={{ cursor: "pointer" }}
          title="کلیک برای پخش ویدیو با پلیر پیشرفته"
        >
          <span className="play">
            <span>
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            </span>
          </span>
        </div>

        <div className="cs-price">
          <span className="old">{course.oldPrice}</span>
          <b>{course.price}</b>
          <span className="cur">تومان</span>
        </div>
        <span className="cs-discount">{course.discount}</span>

        {enrollToast && (
          <div style={{ background: "var(--teal-light)", border: "1.5px solid var(--ink)", padding: "8px 10px", borderRadius: "6px 0 6px 0", fontSize: "12.5px", fontWeight: 800, color: "var(--teal-dark)", margin: "8px 0" }}>
            ثبت‌نام انجام شد! در حال انتقال به پنل…
          </div>
        )}

        {isEnrolled ? (
          <button
            type="button"
            className="cs-btn"
            style={{ background: "var(--teal-dark)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
            onClick={() => { window.location.hash = "panel/courses"; }}
          >
            <CheckCircle2 size={16} />
            <span>ثبت‌نام شده (ورود به کلاس)</span>
          </button>
        ) : (
          <button type="button" className="cs-btn" onClick={onStartPurchase}>
            {course.price === "رایگان" || course.free ? "ثبت‌نام رایگان (شروع دوره)" : "خرید و ثبت‌نام در دوره"}
          </button>
        )}

        <button
          type="button"
          className="cs-sub-btn"
          onClick={onWishlistToggle}
          style={{ color: isWishlisted ? "var(--accent)" : "inherit", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}
        >
          <LucideStar size={15} fill={isWishlisted ? "currentColor" : "none"} />
          <span>{isWishlisted ? "در لیست علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}</span>
        </button>

        <div className="cs-divider" />

        <div className="cs-facts">
          <div className="f">
            <div className="k">مدت زمان</div>
            <div className="v">{course.duration || "۳۲ ساعت"}</div>
          </div>
          <div className="f">
            <div className="k">دسته‌بندی</div>
            <div className="v">{course.category || "فناوری اطلاعات"}</div>
          </div>
          <div className="f">
            <div className="k">سطح دوره</div>
            <div className="v">مقدماتی تا پیشرفته</div>
          </div>
          <div className="f">
            <div className="k">نوع دوره</div>
            <div className="v">{course.type || "آنلاین با اسپات پلیر"}</div>
          </div>
          <div className="f">
            <div className="k">دسترسی</div>
            <div className="v">مادام‌العمر</div>
          </div>
          <div className="f">
            <div className="k">زبان</div>
            <div className="v">فارسی</div>
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
