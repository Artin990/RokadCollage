import React from "react";
import { SkeletonDepartmentCourseCard } from "./DepartmentCourseCard.jsx";

export function SkeletonDepartmentHero({ deptId = "it" }) {
  return (
    <header className="dp-hero" aria-hidden="true" style={{ pointerEvents: "none" }}>
      <div className="container dp-hero-inner">
        {/* Crumb */}
        <div className="dp-crumb" style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 20 }}>
          <div className="rk-skeleton-line" style={{ width: 40, height: 14, borderRadius: 4 }} />
          <span className="sep" style={{ opacity: 0.5 }}>›</span>
          <div className="rk-skeleton-line" style={{ width: 75, height: 14, borderRadius: 4 }} />
          <span className="sep" style={{ opacity: 0.5 }}>›</span>
          <div className="rk-skeleton-line" style={{ width: 95, height: 14, borderRadius: 4 }} />
        </div>

        {/* Badge */}
        <div
          className="dp-badge"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#ffffff",
            border: "2px solid var(--ink)",
            borderRadius: 999,
            padding: "7px 16px",
            boxShadow: "3px 3px 0 var(--dp, var(--college))",
            transform: "rotate(-1.5deg)",
            marginBottom: 20,
          }}
        >
          <span className="dot" style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--dp, var(--college))", border: "2px solid var(--ink)" }} />
          <div className="rk-skeleton-line" style={{ width: 110, height: 14, borderRadius: 4 }} />
        </div>

        {/* Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "22px 0 14px", maxWidth: 720 }}>
          <div className="rk-skeleton-line" style={{ width: "85%", height: 44, borderRadius: 10 }} />
          <div className="rk-skeleton-line" style={{ width: "55%", height: 44, borderRadius: 10 }} />
        </div>

        {/* Lead */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 640, marginBottom: 26 }}>
          <div className="rk-skeleton-line" style={{ width: "95%", height: 16, borderRadius: 4 }} />
          <div className="rk-skeleton-line" style={{ width: "70%", height: 16, borderRadius: 4 }} />
        </div>

        {/* Action Buttons */}
        <div className="dp-hero-actions" style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <div
            className="dp-btn dp-btn-primary"
            style={{
              padding: "9px 22px",
              borderRadius: 10,
              border: "2px solid var(--ink)",
              boxShadow: "4px 4px 0 var(--ink)",
            }}
          >
            <div className="rk-skeleton-line" style={{ width: 100, height: 15, borderRadius: 4, background: "rgba(255,255,255,0.4)" }} />
          </div>
          <div
            className="dp-btn dp-btn-ghost"
            style={{
              padding: "9px 22px",
              borderRadius: 10,
              border: "2px solid var(--ink)",
              boxShadow: "4px 4px 0 var(--dp, var(--college))",
            }}
          >
            <div className="rk-skeleton-line" style={{ width: 85, height: 15, borderRadius: 4 }} />
          </div>
        </div>

        {/* Stats bar */}
        <div className="dp-hero-stats" style={{ display: "flex", marginTop: 34, background: "#ffffff", border: "2px solid var(--ink)", borderRadius: "20px 0 20px 0", boxShadow: "5px 5px 0 var(--dp, var(--college))", overflow: "hidden" }}>
          {[1, 2, 3].map((n) => (
            <div key={n} className="dp-hstat" style={{ padding: "14px 24px", minWidth: 128, display: "flex", flexDirection: "column", gap: 6 }}>
              <div className="rk-skeleton-line" style={{ width: 55, height: 24, borderRadius: 5 }} />
              <div className="rk-skeleton-line" style={{ width: 75, height: 12, borderRadius: 3 }} />
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

export function SkeletonDepartmentSuggestedRow() {
  return (
    <section className="dp-block" id="dp-suggest" aria-hidden="true" style={{ pointerEvents: "none", marginBottom: 54 }}>
      {/* Head */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <span className="dp-badge-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--college)" }} />
        <div className="rk-skeleton-line" style={{ width: 220, height: 26, borderRadius: 6 }} />
      </div>

      {/* Control bar */}
      <div className="dp-suggest-ctrl" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div className="dp-tabs" style={{ display: "flex", gap: 8 }}>
          <div
            className="dp-tab active"
            style={{
              padding: "6px 16px",
              borderRadius: 8,
              border: "2px solid var(--ink)",
              background: "var(--ink)",
            }}
          >
            <div className="rk-skeleton-line" style={{ width: 65, height: 13, borderRadius: 3, background: "rgba(255,255,255,0.4)" }} />
          </div>
          <div
            className="dp-tab"
            style={{
              padding: "6px 16px",
              borderRadius: 8,
              border: "2px solid var(--ink)",
              background: "#ffffff",
            }}
          >
            <div className="rk-skeleton-line" style={{ width: 55, height: 13, borderRadius: 3 }} />
          </div>
        </div>

        <div className="dp-row-nav" style={{ display: "flex", gap: 8 }}>
          <div className="dp-nav rk-skeleton-shimmer" style={{ width: 34, height: 34, borderRadius: 8, border: "1.5px solid var(--ink)" }} />
          <div className="dp-nav rk-skeleton-shimmer" style={{ width: 34, height: 34, borderRadius: 8, border: "1.5px solid var(--ink)" }} />
        </div>
      </div>

      {/* Suggested Row Cards */}
      <div className="dp-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {[0, 1, 2, 3].map((i) => (
          <SkeletonDepartmentCourseCard key={i} rot={[-0.5, 0.5, -0.25, 0.25][i % 4]} />
        ))}
      </div>
    </section>
  );
}

export function SkeletonDepartmentCoursesSection() {
  return (
    <section className="dp-courses-sec" id="dp-all" aria-busy="true">
      {/* Head */}
      <div className="dp-sec-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 14, borderBottom: "2px dashed rgba(41, 40, 39, 0.15)" }}>
        <div className="rk-skeleton-line" style={{ width: 190, height: 28, borderRadius: 6 }} />

        {/* Filter and sort action buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#ffffff",
              border: "2px solid var(--ink)",
              borderRadius: 8,
              padding: "6px 14px",
              boxShadow: "2px 2px 0 var(--ink)",
            }}
          >
            <div className="rk-skeleton-shimmer" style={{ width: 14, height: 14, borderRadius: 3 }} />
            <div className="rk-skeleton-line" style={{ width: 60, height: 13, borderRadius: 3 }} />
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#ffffff",
              border: "2px solid var(--ink)",
              borderRadius: 8,
              padding: "6px 14px",
              boxShadow: "2px 2px 0 var(--ink)",
            }}
          >
            <div className="rk-skeleton-line" style={{ width: 75, height: 13, borderRadius: 3 }} />
          </div>
        </div>
      </div>

      {/* Grid of 6 Courses */}
      <div className="dp-grid">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <SkeletonDepartmentCourseCard key={i} rot={[-0.5, 0.5, -0.25, 0.25][i % 4]} />
        ))}
      </div>
    </section>
  );
}

export function SkeletonDepartmentPage({ deptId = "languages" }) {
  const collegePersonaColors = {
    "--dp": "var(--college, #F8A41D)",
    "--dp-light": "var(--college-light, #FFF4E5)",
    "--dp-dark": "var(--college-darker, #ba7b16)",
    "--dp-text": "var(--ink)",
  };

  return (
    <div className="dp-page" style={collegePersonaColors}>
      <SkeletonDepartmentHero deptId={deptId} />
      <main className="dp-main container" style={{ paddingTop: 36, paddingBottom: 80 }}>
        <SkeletonDepartmentSuggestedRow />
        <SkeletonDepartmentCoursesSection />
      </main>
    </div>
  );
}

export default SkeletonDepartmentPage;
