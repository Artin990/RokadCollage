import React from "react";
import PatternLayer from "@/components/PatternLayer";
import "@/legacy-pages/CourseSingle/course.css";
import "@/legacy-pages/CourseSingle/courseInPerson.css";

export default function SkeletonCourseInPerson() {
  return (
    <div className="cs-page cs-inperson-wrapper" aria-busy="true" style={{ position: "relative" }}>
      <PatternLayer rotate={0} />

      {/* Topbar Skeleton */}
      <div className="cs-topbar container" style={{ pointerEvents: "none" }}>
        <div className="cs-back">
          <div className="rk-skeleton-line" style={{ width: 14, height: 14, borderRadius: 3 }} />
          <div className="rk-skeleton-line" style={{ width: 75, height: 14 }} />
        </div>
        <div className="cs-crumbs">
          <div className="rk-skeleton-line" style={{ width: 45, height: 14 }} />
          <span className="sep">›</span>
          <div className="rk-skeleton-line" style={{ width: 65, height: 14 }} />
          <span className="sep">›</span>
          <div className="rk-skeleton-line" style={{ width: 140, height: 14 }} />
        </div>
        <div className="cs-inperson-top-actions">
          <div className="cs-inperson-top-badge">
            <div className="rk-skeleton-line" style={{ width: 65, height: 12 }} />
          </div>
          <div className="cs-inperson-top-save-btn rk-skeleton-shimmer" style={{ pointerEvents: "none" }} />
        </div>
      </div>

      <div className="container" style={{ pointerEvents: "none" }}>
        {/* Horizontal Hero Card */}
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
                <div className="rk-skeleton-line" style={{ width: 65, height: 12 }} />
              </span>
            </div>

            {/* Content column */}
            <div className="cs-ip-hero-content">
              <div className="cs-ip-hero-header-info">
                <div className="cs-ip-hero-topline">
                  <span className="cs-ip-dept-tag">
                    <div className="rk-skeleton-line" style={{ width: 75, height: 14 }} />
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBlock: 4 }}>
                  <div className="rk-skeleton-line" style={{ width: "85%", height: 28 }} />
                  <div className="rk-skeleton-line" style={{ width: "55%", height: 28 }} />
                </div>

                <div className="cs-ip-hero-pills">
                  <span className="ip-pill">
                    <div className="rk-skeleton-line" style={{ width: 110, height: 14 }} />
                  </span>
                  <span className="ip-pill">
                    <div className="rk-skeleton-line" style={{ width: 95, height: 14 }} />
                  </span>
                </div>
              </div>

              <div className="cs-ip-hero-actions-bar">
                <div className="cs-ip-price-col">
                  <div className="cs-ip-price-row">
                    <div className="rk-skeleton-line" style={{ width: 140, height: 28 }} />
                    <div className="rk-skeleton-line" style={{ width: 35, height: 14 }} />
                  </div>
                  <div className="cs-ip-seat-alert">
                    <span className="seat-dot" />
                    <div className="rk-skeleton-line" style={{ width: 110, height: 13 }} />
                  </div>
                </div>

                <div className="cs-ip-btns-row">
                  <div className="cs-ip-btn-main rk-skeleton-shimmer" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div className="rk-skeleton-line" style={{ width: 75, height: 14, background: "rgba(0,0,0,0.15)" }} />
                  </div>
                  <div className="cs-ip-btn-sub rk-skeleton-shimmer" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div className="rk-skeleton-line" style={{ width: 65, height: 14, background: "rgba(0,0,0,0.15)" }} />
                  </div>
                </div>
              </div>

              <div className="cs-ip-guarantee-strip">
                <div className="rk-skeleton-shimmer" style={{ width: 14, height: 14, borderRadius: "50%", flexShrink: 0 }} />
                <div className="rk-skeleton-line" style={{ width: "65%", height: 13 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections Stack */}
        <div className="cs-ip-sections-stack">
          {/* Section 01: About Workshop */}
          <section className="cs-ip-section-card">
            <div className="cs-ip-sec-header">
              <div className="cs-ip-sec-header-right">
                <span className="cs-ip-sec-num">۰۱</span>
                <div className="cs-ip-sec-icon-box" />
                <div className="cs-ip-sec-titles">
                  <div className="rk-skeleton-line" style={{ width: 160, height: 18, marginBottom: 4 }} />
                  <div className="rk-skeleton-line" style={{ width: 120, height: 12 }} />
                </div>
              </div>
              <span className="cs-ip-sec-badge">
                <div className="rk-skeleton-line" style={{ width: 60, height: 12 }} />
              </span>
            </div>

            <div className="cs-ip-sec-body">
              <div className="cs-inperson-desc-panel">
                <div className="cs-desc-intro-card">
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div className="rk-skeleton-line" style={{ width: "95%", height: 16 }} />
                    <div className="rk-skeleton-line" style={{ width: "80%", height: 16 }} />
                  </div>
                </div>
                <div className="cs-desc-paragraphs" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div className="rk-skeleton-line" style={{ width: "100%", height: 14 }} />
                  <div className="rk-skeleton-line" style={{ width: "92%", height: 14 }} />
                  <div className="rk-skeleton-line" style={{ width: "65%", height: 14 }} />
                </div>
              </div>
            </div>
          </section>

          {/* Section 02: Curriculum / Sprints */}
          <section className="cs-ip-section-card">
            <div className="cs-ip-sec-header">
              <div className="cs-ip-sec-header-right">
                <span className="cs-ip-sec-num">۰۲</span>
                <div className="cs-ip-sec-icon-box" />
                <div className="cs-ip-sec-titles">
                  <div className="rk-skeleton-line" style={{ width: 180, height: 18, marginBottom: 4 }} />
                  <div className="rk-skeleton-line" style={{ width: 130, height: 12 }} />
                </div>
              </div>
              <span className="cs-ip-sec-badge">
                <div className="rk-skeleton-line" style={{ width: 65, height: 12 }} />
              </span>
            </div>

            <div className="cs-ip-sec-body">
              <div className="cs-chapters" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[1, 2, 3].map((num) => (
                  <div key={num} className="cs-ch" style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 36, height: 36, background: "var(--college-light)", border: "1px solid var(--ink)", borderRadius: 10 }} />
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

          {/* Section 03: Campus & Venue */}
          <section className="cs-ip-section-card">
            <div className="cs-ip-sec-header">
              <div className="cs-ip-sec-header-right">
                <span className="cs-ip-sec-num">۰۳</span>
                <div className="cs-ip-sec-icon-box" />
                <div className="cs-ip-sec-titles">
                  <div className="rk-skeleton-line" style={{ width: 190, height: 18, marginBottom: 4 }} />
                  <div className="rk-skeleton-line" style={{ width: 140, height: 12 }} />
                </div>
              </div>
              <span className="cs-ip-sec-badge">
                <div className="rk-skeleton-line" style={{ width: 60, height: 12 }} />
              </span>
            </div>

            <div className="cs-ip-sec-body">
              <div className="cs-inperson-location-grid">
                <div className="cs-inperson-address-card">
                  <div className="rk-skeleton-line" style={{ width: 140, height: 18, marginBottom: 8 }} />
                  <div className="rk-skeleton-line" style={{ width: "85%", height: 14, marginBottom: 16 }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div className="rk-skeleton-line" style={{ width: "70%", height: 14 }} />
                    <div className="rk-skeleton-line" style={{ width: "60%", height: 14 }} />
                  </div>
                </div>

                <div className="cs-inperson-schedule-card">
                  <div className="rk-skeleton-line" style={{ width: 150, height: 18, marginBottom: 14 }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div className="rk-skeleton-line" style={{ width: 80, height: 14 }} />
                      <div className="rk-skeleton-line" style={{ width: 90, height: 14 }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div className="rk-skeleton-line" style={{ width: 70, height: 14 }} />
                      <div className="rk-skeleton-line" style={{ width: 85, height: 14 }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div className="rk-skeleton-line" style={{ width: 75, height: 14 }} />
                      <div className="rk-skeleton-line" style={{ width: 100, height: 14 }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 04: Instructor */}
          <section className="cs-ip-section-card">
            <div className="cs-ip-sec-header">
              <div className="cs-ip-sec-header-right">
                <span className="cs-ip-sec-num">۰۴</span>
                <div className="cs-ip-sec-icon-box" />
                <div className="cs-ip-sec-titles">
                  <div className="rk-skeleton-line" style={{ width: 160, height: 18, marginBottom: 4 }} />
                  <div className="rk-skeleton-line" style={{ width: 130, height: 12 }} />
                </div>
              </div>
              <span className="cs-ip-sec-badge">
                <div className="rk-skeleton-line" style={{ width: 65, height: 12 }} />
              </span>
            </div>

            <div className="cs-ip-sec-body">
              <div className="cs-inperson-teacher-card">
                <div
                  className="rk-skeleton-shimmer"
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: "50%",
                    border: "1.5px solid var(--ink)",
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                  <div className="rk-skeleton-line" style={{ width: 130, height: 18 }} />
                  <div className="rk-skeleton-line" style={{ width: 100, height: 14 }} />
                  <div className="rk-skeleton-line" style={{ width: "80%", height: 13, marginTop: 4 }} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
