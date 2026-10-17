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
        <div className="rk-skeleton-line" style={{ width: 95, height: 16 }} />
        <div className="cs-crumbs" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div className="rk-skeleton-line" style={{ width: 45, height: 14 }} />
          <span className="sep">›</span>
          <div className="rk-skeleton-line" style={{ width: 55, height: 14 }} />
          <span className="sep">›</span>
          <div className="rk-skeleton-line" style={{ width: 130, height: 14 }} />
        </div>
        <div className="cs-inperson-top-actions" style={{ marginInlineStart: "auto", display: "flex", gap: 10, alignItems: "center" }}>
          <div className="rk-skeleton-line" style={{ width: 105, height: 28, borderRadius: 999 }} />
          <div className="rk-skeleton-shimmer" style={{ width: 36, height: 36, borderRadius: 8, border: "1.5px solid var(--ink)" }} />
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
                minHeight: 380,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  width: 95,
                  height: 28,
                  background: "#fff",
                  border: "1.5px solid var(--ink)",
                  borderRadius: 8,
                  boxShadow: "2px 2px 0 var(--ink)",
                }}
              />
            </div>

            {/* Content column */}
            <div className="cs-ip-hero-content">
              <div className="cs-ip-hero-header-info">
                <div className="cs-ip-hero-topline">
                  <div className="rk-skeleton-line" style={{ width: 110, height: 24, borderRadius: 6 }} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBlock: 4 }}>
                  <div className="rk-skeleton-line" style={{ width: "85%", height: 32 }} />
                  <div className="rk-skeleton-line" style={{ width: "55%", height: 32 }} />
                </div>

                <div className="cs-ip-hero-pills" style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  <div className="rk-skeleton-line" style={{ width: 140, height: 30, borderRadius: 999 }} />
                  <div className="rk-skeleton-line" style={{ width: 130, height: 30, borderRadius: 999 }} />
                </div>
              </div>

              <div className="cs-ip-hero-actions-bar">
                <div className="cs-ip-price-col">
                  <div className="cs-ip-price-row" style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <div className="rk-skeleton-line" style={{ width: 160, height: 32 }} />
                    <div className="rk-skeleton-line" style={{ width: 35, height: 16 }} />
                  </div>
                  <div className="cs-ip-seat-alert" style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                    <span className="seat-dot" />
                    <div className="rk-skeleton-line" style={{ width: 120, height: 14 }} />
                  </div>
                </div>

                <div className="cs-ip-btns-row" style={{ display: "flex", gap: 12 }}>
                  <div className="rk-skeleton-line" style={{ width: 130, height: 44, borderRadius: 10 }} />
                  <div className="rk-skeleton-line" style={{ width: 120, height: 44, borderRadius: 10 }} />
                </div>
              </div>

              <div className="cs-ip-guarantee-strip" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="rk-skeleton-shimmer" style={{ width: 16, height: 16, borderRadius: "50%", flexShrink: 0 }} />
                <div className="rk-skeleton-line" style={{ width: "65%", height: 14 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections Stack */}
        <div className="cs-ip-sections-stack" style={{ marginTop: 28 }}>
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
              <div className="rk-skeleton-line" style={{ width: 85, height: 26, borderRadius: 999 }} />
            </div>

            <div className="cs-ip-sec-body" style={{ padding: "24px" }}>
              <div style={{ background: "#FFFDF7", border: "1.5px solid var(--ink)", borderRadius: "var(--r-md)", padding: "18px 22px", marginBottom: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div className="rk-skeleton-line" style={{ width: "95%", height: 16 }} />
                  <div className="rk-skeleton-line" style={{ width: "80%", height: 16 }} />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div className="rk-skeleton-line" style={{ width: "100%", height: 14 }} />
                <div className="rk-skeleton-line" style={{ width: "92%", height: 14 }} />
                <div className="rk-skeleton-line" style={{ width: "65%", height: 14 }} />
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
              <div className="rk-skeleton-line" style={{ width: 90, height: 26, borderRadius: 999 }} />
            </div>

            <div className="cs-ip-sec-body" style={{ padding: "24px" }}>
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
              <div className="rk-skeleton-line" style={{ width: 100, height: 26, borderRadius: 999 }} />
            </div>

            <div className="cs-ip-sec-body" style={{ padding: "24px" }}>
              <div className="cs-inperson-location-grid">
                <div className="cs-inperson-address-card" style={{ padding: 20 }}>
                  <div className="rk-skeleton-line" style={{ width: 140, height: 18, marginBottom: 8 }} />
                  <div className="rk-skeleton-line" style={{ width: "85%", height: 14, marginBottom: 16 }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div className="rk-skeleton-line" style={{ width: "70%", height: 14 }} />
                    <div className="rk-skeleton-line" style={{ width: "60%", height: 14 }} />
                  </div>
                </div>

                <div className="cs-inperson-schedule-card" style={{ padding: 20 }}>
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
              <div className="rk-skeleton-line" style={{ width: 85, height: 26, borderRadius: 999 }} />
            </div>

            <div className="cs-ip-sec-body" style={{ padding: "24px" }}>
              <div className="cs-inperson-teacher-card" style={{ display: "flex", gap: 18, alignItems: "center" }}>
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
