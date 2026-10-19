import React from "react";
import PatternLayer from "@/components/PatternLayer";
import "@/legacy-pages/CourseSingle/course.css";
import "@/legacy-pages/CourseSingle/courseInPerson.css";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Phone,
  ShieldCheck,
  FileText,
  UserCheck,
  Train,
  Car,
  ExternalLink,
} from "lucide-react";

export default function SkeletonCourseInPerson({ hasSprints: propHasSprints }) {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const isBootcamp = pathname.includes("bootcamp");
  const hasSprints = propHasSprints !== undefined ? propHasSprints : isBootcamp;

  return (
    <main className="cs-page cs-inperson-wrapper" id="course" aria-busy="true">
      <PatternLayer rotate={0} />

      {/* Topbar Skeleton */}
      <div className="container" style={{ pointerEvents: "none" }}>
        <div className="cs-topbar">
          <div className="cs-back">
            <ArrowLeft size={14} style={{ transform: "rotate(180deg)" }} />
            <span>همهٔ دوره‌ها</span>
          </div>

          <nav className="cs-crumbs" aria-label="مسیر دوره">
            <span>دوره‌ها</span>
            <span className="sep">›</span>
            <div className="rk-skeleton-line" style={{ width: 80, height: 14 }} />
            <span className="sep">›</span>
            <div className="rk-skeleton-line" style={{ width: 150, height: 14 }} />
          </nav>

          <div className="cs-inperson-top-actions">
            <div className="cs-inperson-top-badge">
              <MapPin size={12} strokeWidth={2.5} />
              <span>کارگاه حضوری</span>
            </div>

            <div
              className="cs-inperson-top-save-btn rk-skeleton-shimmer"
              style={{ pointerEvents: "none", border: "1.5px solid var(--ink, #18181B)" }}
            />
          </div>
        </div>
      </div>

      {/* Hero Card */}
      <div className="container" style={{ pointerEvents: "none" }}>
        <div className="cs-ip-hero-card">
          <div className="cs-ip-hero-grid">
            {/* Media column */}
            <div
              className="cs-ip-hero-media rk-skeleton-shimmer"
              style={{
                background: "linear-gradient(135deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.08) 100%)",
                position: "relative",
              }}
            >
              <span className="cs-ip-hero-tag">
                <MapPin size={12} strokeWidth={2.5} />
                <span>کمپوس آزادی</span>
              </span>
            </div>

            {/* Content column */}
            <div className="cs-ip-hero-content">
              <div className="cs-ip-hero-header-info">
                <div className="cs-ip-hero-topline">
                  <span className="cs-ip-dept-tag">دوره حضوری</span>
                </div>

                <div className="cs-ip-hero-title" style={{ margin: 0 }}>
                  <div className="rk-skeleton-line" style={{ width: "85%", height: 26, marginBottom: 8 }} />
                  <div className="rk-skeleton-line" style={{ width: "55%", height: 26 }} />
                </div>

                <div className="cs-ip-hero-pills">
                  <span className="ip-pill">
                    <Calendar size={13} strokeWidth={2.2} />
                    <div className="rk-skeleton-line" style={{ width: 75, height: 13 }} />
                  </span>
                  <span className="ip-pill">
                    <Clock size={13} strokeWidth={2.2} />
                    <div className="rk-skeleton-line" style={{ width: 70, height: 13 }} />
                  </span>
                </div>
              </div>

              <div className="cs-ip-hero-actions-bar">
                <div className="cs-ip-price-col">
                  <div className="cs-ip-price-row">
                    <div className="rk-skeleton-line" style={{ width: 120, height: 26 }} />
                    <span className="cur">تومان</span>
                  </div>
                  <div className="cs-ip-seat-alert">
                    <span className="seat-dot" />
                    <div className="rk-skeleton-line" style={{ width: 120, height: 13 }} />
                  </div>
                </div>

                <div className="cs-ip-btns-row">
                  <div
                    className="cs-ip-btn-main rk-skeleton-shimmer"
                    style={{
                      background: "#E2DBD0",
                      border: "1.5px solid var(--ink, #18181B)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div className="rk-skeleton-line" style={{ width: 85, height: 14, background: "rgba(0,0,0,0.15)" }} />
                  </div>
                  <div
                    className="cs-ip-btn-sub rk-skeleton-shimmer"
                    style={{
                      background: "#fff",
                      border: "1.5px solid var(--ink, #18181B)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <Phone size={14} />
                    <span>درخواست مشاوره</span>
                  </div>
                </div>
              </div>

              <div className="cs-ip-guarantee-strip">
                <ShieldCheck size={14} strokeWidth={2.4} />
                <span>گارانتی بازگشت ۱۰۰٪ شهریه تا پایان جلسه اول بدون قید و شرط</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections Stack */}
      <div className="container" style={{ pointerEvents: "none" }}>
        <div className="cs-ip-sections-stack">
          {/* Section 01: About Workshop */}
          <section className="cs-ip-section-card" id="about-workshop">
            <div className="cs-ip-sec-header">
              <div className="cs-ip-sec-header-right">
                <span className="cs-ip-sec-num">۰۱</span>
                <div className="cs-ip-sec-icon-box">
                  <FileText size={18} />
                </div>
                <div className="cs-ip-sec-titles">
                  <h2 className="cs-ip-sec-title">درباره این کارگاه حضوری</h2>
                  <span className="cs-ip-sec-sub">مشخصات، اهداف و رویکرد اجرایی دوره</span>
                </div>
              </div>
              <span className="cs-ip-sec-badge">معرفی کارگاه</span>
            </div>

            <div className="cs-ip-sec-body">
              <div className="cs-inperson-desc-panel">
                <div className="cs-desc-intro-card">
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div className="rk-skeleton-line" style={{ width: "90%", height: 15 }} />
                    <div className="rk-skeleton-line" style={{ width: "70%", height: 15 }} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 02: Curriculum / Sprints (only for bootcamps) */}
          {hasSprints && (
            <section className="cs-ip-section-card" id="workshop-sprints">
              <div className="cs-ip-sec-header">
                <div className="cs-ip-sec-header-right">
                  <span className="cs-ip-sec-num">۰۲</span>
                  <div className="cs-ip-sec-icon-box">
                    <Calendar size={18} />
                  </div>
                  <div className="cs-ip-sec-titles">
                    <h2 className="cs-ip-sec-title">سرفصل‌ها و اسپرینت‌های عملی</h2>
                    <span className="cs-ip-sec-sub">برنامه آموزشی هفته‌به‌هفته کارگاه</span>
                  </div>
                </div>
                <span className="cs-ip-sec-badge highlight">سرفصل‌های کارگاه</span>
              </div>

              <div className="cs-ip-sec-body">
                <div className="cs-chapters" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="cs-ch" style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 36, height: 36, background: "var(--college-light, #FFF7ED)", border: "1px solid var(--ink, #18181B)", borderRadius: 10 }} />
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                        <div className="rk-skeleton-line" style={{ width: "40%", height: 16 }} />
                        <div className="rk-skeleton-line" style={{ width: "25%", height: 12 }} />
                      </div>
                      <div className="rk-skeleton-line" style={{ width: 100, height: 14 }} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Section 03: Campus & Venue */}
          <section className="cs-ip-section-card" id="campus-location">
            <div className="cs-ip-sec-header">
              <div className="cs-ip-sec-header-right">
                <span className="cs-ip-sec-num">۰۳</span>
                <div className="cs-ip-sec-icon-box">
                  <MapPin size={18} />
                </div>
                <div className="cs-ip-sec-titles">
                  <h2 className="cs-ip-sec-title">زمان‌بندی و موقعیت</h2>
                  <span className="cs-ip-sec-sub">روزهای برگزاری کارگاه، آدرس دقیق و راه‌های دسترسی</span>
                </div>
              </div>
              <span className="cs-ip-sec-badge">محل و زمان کارگاه</span>
            </div>

            <div className="cs-ip-sec-body">
              <div className="cs-inperson-location-panel">
                <div className="cs-inperson-location-grid">
                  <div className="cs-inperson-address-card">
                    <div className="address-meta">
                      <strong>کمپوس مرکزی کالج رکاد</strong>
                      <p>تهران، میدان آزادی، بلوار اکبری، کالج رکاد</p>
                    </div>
                    <div className="transit-items">
                      <div className="transit-it">
                        <Train size={16} />
                        <span>۲ دقیقه پیاده‌روی از ایستگاه مترو میدان آزادی</span>
                      </div>
                      <div className="transit-it">
                        <Car size={16} />
                        <span>دارای پارکینگ اختصاصی برای هنرجویان</span>
                      </div>
                    </div>
                  </div>

                  <div className="cs-inperson-schedule-card">
                    <div className="cs-ip-sch-head">
                      <div className="cs-ip-sch-icon">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <strong>برنامهٔ زمانی و روزهای کلاس</strong>
                        <span>جلسات هفتگی کارگاه در کمپوس</span>
                      </div>
                    </div>
                    <div className="cs-ip-sch-rows">
                      <div className="cs-ip-sch-row">
                        <span className="sch-label">روزهای برگزاری:</span>
                        <div className="rk-skeleton-line" style={{ width: 90, height: 18 }} />
                      </div>
                      <div className="cs-ip-sch-row">
                        <span className="sch-label">ساعت کارگاه:</span>
                        <div className="rk-skeleton-line" style={{ width: 85, height: 16 }} />
                      </div>
                      <div className="cs-ip-sch-row">
                        <span className="sch-label">سالن اختصاصی:</span>
                        <div className="rk-skeleton-line" style={{ width: 100, height: 16 }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="cs-inperson-map-actions">
                  <div className="map-link-btn" style={{ opacity: 0.85 }}>
                    <span>مسیریابی با نشان</span>
                    <ExternalLink size={13} />
                  </div>
                  <div className="map-link-btn" style={{ opacity: 0.85 }}>
                    <span>مسیریابی با بلد</span>
                    <ExternalLink size={13} />
                  </div>
                  <div className="map-link-btn" style={{ opacity: 0.85 }}>
                    <span>گوگل‌مپ</span>
                    <ExternalLink size={13} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 04: Instructor */}
          <section className="cs-ip-section-card" id="workshop-instructor">
            <div className="cs-ip-sec-header">
              <div className="cs-ip-sec-header-right">
                <span className="cs-ip-sec-num">۰۴</span>
                <div className="cs-ip-sec-icon-box">
                  <UserCheck size={18} />
                </div>
                <div className="cs-ip-sec-titles">
                  <h2 className="cs-ip-sec-title">مدرس و سرپرست کارگاه</h2>
                  <span className="cs-ip-sec-sub">راهبری مستقیم پروژه، حل تمرین و انتقال تجربه</span>
                </div>
              </div>
              <span className="cs-ip-sec-badge">راهبر کارگاه</span>
            </div>

            <div className="cs-ip-sec-body">
              <div className="cs-inperson-teacher-panel">
                <div className="cs-inperson-teacher-card">
                  <div className="teacher-av" style={{ background: "var(--college, #F8A41D)" }}>
                    رک
                  </div>
                  <div className="teacher-info" style={{ flex: 1 }}>
                    <div className="rk-skeleton-line" style={{ width: 140, height: 18, marginBottom: 6 }} />
                    <div className="rk-skeleton-line" style={{ width: 110, height: 14, marginBottom: 8 }} />
                    <div className="rk-skeleton-line" style={{ width: "85%", height: 13 }} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
