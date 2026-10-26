import React from "react";

export function SkeletonCoursesHero() {
  return (
    <header className="ch-hero" aria-hidden="true" style={{ pointerEvents: "none" }}>
      <div className="ch-hero-inner">
        {/* Breadcrumb */}
        <div className="ch-crumb" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22 }}>
          <div className="rk-skeleton-line" style={{ width: 44, height: 16, borderRadius: 6 }} />
          <span className="ch-crumb-sep" style={{ opacity: 0.5 }}>›</span>
          <div className="rk-skeleton-line" style={{ width: 120, height: 16, borderRadius: 6 }} />
        </div>

        {/* Hero Badge */}
        <div
          className="ch-hero-badge"
          style={{
            background: "var(--college-light, #FFF4E5)",
            boxShadow: "2.5px 2.5px 0 var(--ink)",
            border: "2px solid var(--ink)",
            marginBottom: 20,
          }}
        >
          <div className="rk-skeleton-shimmer" style={{ width: 14, height: 14, borderRadius: "50%" }} />
          <div className="rk-skeleton-line" style={{ width: 180, height: 14, borderRadius: 4 }} />
        </div>

        {/* Hero Title Lines */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20, maxWidth: 840 }}>
          <div className="rk-skeleton-line" style={{ width: "72%", height: 42, borderRadius: 10 }} />
          <div className="rk-skeleton-line" style={{ width: "48%", height: 42, borderRadius: 10 }} />
        </div>

        {/* Hero Description Lines */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32, maxWidth: 720 }}>
          <div className="rk-skeleton-line" style={{ width: "95%", height: 16, borderRadius: 4 }} />
          <div className="rk-skeleton-line" style={{ width: "70%", height: 16, borderRadius: 4 }} />
        </div>
      </div>
    </header>
  );
}

export function SkeletonFlagshipCard({ theme = "it" }) {
  const bgVisual = theme === "business" ? "var(--college-light, #FFF4E5)" : "var(--male-light, #EAF0FF)";
  const bgGateway = theme === "business" ? "var(--college, #F8A41D)" : "var(--navy-alt, #202a5a)";

  return (
    <article className="ch-flag-card" aria-hidden="true" style={{ pointerEvents: "none" }}>
      {/* Visual Side */}
      <div className="ch-flag-visual" style={{ background: bgVisual }}>
        <div
          className="ch-flag-dept-chip"
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            border: "1.5px solid var(--ink)",
            borderRadius: 8,
            padding: "4px 10px",
          }}
        >
          <div className="rk-skeleton-line" style={{ width: 85, height: 13, borderRadius: 4 }} />
        </div>

        <div className="ch-flag-icon-wrap" style={{ background: "#ffffff", boxShadow: "4px 4px 0 var(--ink)" }}>
          <div className="rk-skeleton-shimmer" style={{ width: 44, height: 44, borderRadius: 10 }} />
        </div>

        <div
          className="ch-flag-badge"
          style={{
            background: "#ffffff",
            color: "var(--ink)",
            border: "1.5px solid var(--ink)",
            boxShadow: "2px 2px 0 var(--ink)",
          }}
        >
          <div className="rk-skeleton-line" style={{ width: 70, height: 13, borderRadius: 4 }} />
        </div>
      </div>

      {/* Content Side */}
      <div className="ch-flag-content">
        <div className="ch-flag-top">
          {/* Meta row */}
          <div className="ch-flag-meta-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div className="rk-skeleton-line" style={{ width: 110, height: 14, borderRadius: 4 }} />
              <div className="rk-skeleton-line" style={{ width: 36, height: 14, borderRadius: 4 }} />
            </div>
            <div
              className="course-mode-badge"
              style={{
                background: "#FFF0D4",
                border: "1.5px solid var(--ink)",
                boxShadow: "1.5px 1.5px 0 var(--ink)",
              }}
            >
              <div className="rk-skeleton-line" style={{ width: 50, height: 12, borderRadius: 4 }} />
            </div>
          </div>

          {/* Title & Desc */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBlock: 10 }}>
            <div className="rk-skeleton-line" style={{ width: "80%", height: 28, borderRadius: 8 }} />
            <div className="rk-skeleton-line" style={{ width: "95%", height: 16, borderRadius: 4 }} />
            <div className="rk-skeleton-line" style={{ width: "65%", height: 16, borderRadius: 4 }} />
          </div>

          {/* Stats Row */}
          <div className="ch-flag-stats-row" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
            {[105, 95, 125].map((w, i) => (
              <div
                key={i}
                className="ch-flag-pill"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "var(--bg-neutral, #FAF8F5)",
                  border: "1.5px solid var(--ink)",
                  borderRadius: 8,
                  padding: "4px 12px",
                }}
              >
                <div className="rk-skeleton-shimmer" style={{ width: 13, height: 13, borderRadius: 3 }} />
                <div className="rk-skeleton-line" style={{ width: w, height: 13, borderRadius: 3 }} />
              </div>
            ))}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="ch-flag-actions" style={{ paddingTop: 16, borderTop: "2px dashed rgba(41, 40, 39, 0.2)" }}>
          <div className="ch-flag-price-block">
            <div className="rk-skeleton-line" style={{ width: 95, height: 26, borderRadius: 6 }} />
          </div>

          <div className="ch-flag-btn-group" style={{ display: "flex", gap: 10 }}>
            <div
              className="ch-btn-view-course"
              style={{
                boxShadow: "3px 3px 0 var(--ink)",
                border: "2px solid var(--ink)",
                padding: "8px 16px",
                borderRadius: 10,
              }}
            >
              <div className="rk-skeleton-line" style={{ width: 110, height: 15, borderRadius: 4 }} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function SkeletonCourseCardItem({ bg = "var(--male-light, #EAF0FF)" }) {
  return (
    <div className="ch-card" aria-hidden="true" style={{ pointerEvents: "none" }}>
      {/* Cover */}
      <div className="ch-card-cover" style={{ background: bg }}>
        <div
          className="ch-card-tag"
          style={{
            background: "#ffffff",
            border: "1.5px solid var(--ink)",
            borderRadius: 6,
            padding: "3px 8px",
          }}
        >
          <div className="rk-skeleton-line" style={{ width: 44, height: 12, borderRadius: 3 }} />
        </div>

        <div className="rk-skeleton-shimmer" style={{ width: 34, height: 34, borderRadius: 8, opacity: 0.6 }} />
      </div>

      {/* Body */}
      <div className="ch-card-body">
        {/* Badges row */}
        <div className="ch-card-badges-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            className="ch-card-dept-badge"
            style={{
              background: "#ffffff",
              border: "1.5px solid var(--ink)",
              borderRadius: 6,
              padding: "2px 8px",
            }}
          >
            <div className="rk-skeleton-line" style={{ width: 68, height: 12, borderRadius: 3 }} />
          </div>
          <div
            className="course-mode-badge"
            style={{
              background: "#E0F5F2",
              border: "1.5px solid var(--ink)",
              borderRadius: 6,
              padding: "2px 8px",
            }}
          >
            <div className="rk-skeleton-line" style={{ width: 42, height: 11, borderRadius: 3 }} />
          </div>
        </div>

        {/* Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, minHeight: 48, marginTop: 4 }}>
          <div className="rk-skeleton-line" style={{ width: "90%", height: 18, borderRadius: 5 }} />
          <div className="rk-skeleton-line" style={{ width: "60%", height: 18, borderRadius: 5 }} />
        </div>

        {/* Instructor */}
        <div className="ch-card-inst" style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
          <div className="ch-card-av rk-skeleton-shimmer" style={{ width: 26, height: 26, borderRadius: 8 }} />
          <div className="rk-skeleton-line" style={{ width: 85, height: 13, borderRadius: 4 }} />
        </div>

        {/* Meta row */}
        <div className="ch-card-meta">
          <div className="ch-card-meta-item">
            <div className="rk-skeleton-shimmer" style={{ width: 13, height: 13, borderRadius: 3 }} />
            <div className="rk-skeleton-line" style={{ width: 24, height: 12, borderRadius: 3 }} />
          </div>
          <div className="ch-card-meta-item">
            <div className="rk-skeleton-shimmer" style={{ width: 13, height: 13, borderRadius: 3 }} />
            <div className="rk-skeleton-line" style={{ width: 42, height: 12, borderRadius: 3 }} />
          </div>
          <div className="ch-card-meta-item">
            <div className="rk-skeleton-shimmer" style={{ width: 13, height: 13, borderRadius: 3 }} />
            <div className="rk-skeleton-line" style={{ width: 44, height: 12, borderRadius: 3 }} />
          </div>
        </div>

        {/* Foot */}
        <div className="ch-card-foot">
          <div className="ch-card-price">
            <div className="rk-skeleton-line" style={{ width: 75, height: 18, borderRadius: 5 }} />
          </div>
          <div
            className="ch-card-btn"
            style={{
              background: "var(--ink)",
              border: "2px solid var(--ink)",
              padding: "6px 14px",
              borderRadius: 8,
              boxShadow: "2px 2px 0 rgba(0, 0, 0, 0.2)",
            }}
          >
            <div className="rk-skeleton-line" style={{ width: 62, height: 13, borderRadius: 3, background: "rgba(255,255,255,0.3)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonDepartmentGroup({ nameWidth = 140, bg = "var(--male-light, #EAF0FF)", color = "var(--navy-alt)" }) {
  return (
    <div className="ch-suggested-dept-wrap" style={{ marginBottom: 68 }} aria-hidden="true">
      {/* Header */}
      <div className="ch-suggested-dept-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: bg,
            color: color,
            border: "2px solid var(--ink)",
            borderRadius: 8,
            padding: "4px 12px",
            boxShadow: "2px 2px 0 var(--ink)",
          }}
        >
          <div className="rk-skeleton-shimmer" style={{ width: 14, height: 14, borderRadius: 3 }} />
          <div className="rk-skeleton-line" style={{ width: nameWidth, height: 14, borderRadius: 4 }} />
        </div>

        <div className="ch-dept-more-link" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <div className="rk-skeleton-line" style={{ width: 110, height: 14, borderRadius: 4 }} />
          <div className="rk-skeleton-shimmer" style={{ width: 15, height: 15, borderRadius: "50%" }} />
        </div>
      </div>

      {/* Grid of 3 Cards */}
      <div className="ch-grid-3">
        <SkeletonCourseCardItem bg={bg} />
        <SkeletonCourseCardItem bg={bg} />
        <SkeletonCourseCardItem bg={bg} />
      </div>
    </div>
  );
}

export function SkeletonInstructorsSection() {
  return (
    <section className="ch-sec" aria-hidden="true" style={{ pointerEvents: "none" }}>
      {/* Head */}
      <div className="ch-sec-head">
        <div className="ch-sec-title-wrap">
          <div
            className="ch-sec-tag"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              border: "1.5px solid var(--ink)",
              borderRadius: 8,
              padding: "3px 12px",
              boxShadow: "2px 2px 0 var(--college, #f8a41d)",
            }}
          >
            <div className="rk-skeleton-shimmer" style={{ width: 13, height: 13, borderRadius: 3 }} />
            <div className="rk-skeleton-line" style={{ width: 120, height: 13, borderRadius: 3 }} />
          </div>
          <div className="rk-skeleton-line" style={{ width: 260, height: 28, borderRadius: 8, marginTop: 4 }} />
        </div>

        <div className="ch-inst-nav-btns">
          <div className="ch-inst-nav-btn rk-skeleton-shimmer" style={{ width: 38, height: 38, borderRadius: 10, border: "2px solid var(--ink)" }} />
          <div className="ch-inst-nav-btn rk-skeleton-shimmer" style={{ width: 38, height: 38, borderRadius: 10, border: "2px solid var(--ink)" }} />
        </div>
      </div>

      {/* Track of Instructor Cards */}
      <div className="ch-inst-track-wrap">
        <div className="ch-inst-track">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="ch-inst-card" style={{ flex: "0 0 290px", width: 290 }}>
              <div className="ch-inst-cover" style={{ background: "var(--college-light, #FFF4E5)" }}>
                <div
                  className="ch-inst-dept-badge"
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 12,
                    background: "#ffffff",
                    border: "1.5px solid var(--ink)",
                    borderRadius: 6,
                    padding: "2px 8px",
                  }}
                >
                  <div className="rk-skeleton-line" style={{ width: 70, height: 11, borderRadius: 3 }} />
                </div>
              </div>

              <div className="ch-inst-av-centered-wrap" style={{ display: "flex", justifyContent: "center", marginTop: -36 }}>
                <div
                  className="ch-inst-av-box rk-skeleton-shimmer"
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "14px 4px 14px 4px",
                    border: "2px solid var(--ink)",
                    boxShadow: "3px 3px 0 var(--ink)",
                  }}
                />
              </div>

              <div style={{ padding: "16px 20px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div className="rk-skeleton-line" style={{ width: 120, height: 18, borderRadius: 5 }} />
                <div className="rk-skeleton-line" style={{ width: 150, height: 13, borderRadius: 4 }} />
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-around",
                    paddingTop: 12,
                    marginTop: 8,
                    borderTop: "1.5px dashed rgba(41, 40, 39, 0.2)",
                  }}
                >
                  <div className="rk-skeleton-line" style={{ width: 75, height: 14, borderRadius: 4 }} />
                  <div className="rk-skeleton-line" style={{ width: 75, height: 14, borderRadius: 4 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function SkeletonCoursesHub() {
  return (
    <div className="ch-skeleton-hub-wrap py-2" aria-busy="true">
      {/* 1. Flagship Section Skeleton */}
      <section className="ch-sec" style={{ marginTop: 44, marginBottom: 72 }}>
        <div className="ch-sec-head">
          <div className="ch-sec-title-wrap">
            <div
              className="ch-sec-tag"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                border: "1.5px solid var(--ink)",
                borderRadius: 8,
                padding: "3px 12px",
                boxShadow: "2px 2px 0 var(--college, #f8a41d)",
              }}
            >
              <div className="rk-skeleton-shimmer" style={{ width: 12, height: 12, borderRadius: "50%" }} />
              <div className="rk-skeleton-line" style={{ width: 95, height: 13, borderRadius: 3 }} />
            </div>
            <div className="rk-skeleton-line" style={{ width: 320, height: 30, borderRadius: 8 }} />
            <div className="rk-skeleton-line" style={{ width: 240, height: 15, borderRadius: 4 }} />
          </div>
        </div>

        <div className="ch-flagships" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <SkeletonFlagshipCard theme="it" />
          <SkeletonFlagshipCard theme="business" />
        </div>
      </section>

      {/* 2. Suggested Groups Skeletons (IT, Business, Counseling) */}
      <SkeletonDepartmentGroup
        nameWidth={130}
        bg="var(--male-light, #EAF0FF)"
        color="var(--navy-alt, #202a5a)"
      />
      <SkeletonDepartmentGroup
        nameWidth={115}
        bg="var(--college-light, #FFF4E5)"
        color="var(--college-darker, #ba7b16)"
      />

      {/* 3. Instructors Section Skeleton */}
      <SkeletonInstructorsSection />
    </div>
  );
}

export function SkeletonCoursesPage() {
  return (
    <div className="ch-page">
      <SkeletonCoursesHero />
      <div className="ch-container">
        <SkeletonCoursesHub />
      </div>
    </div>
  );
}
