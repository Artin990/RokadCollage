import React from "react";

export function SkeletonFlagshipCard() {
  return (
    <article className="ch-flag-card" aria-hidden="true" style={{ pointerEvents: "none" }}>
      <div className="ch-flag-visual rk-skeleton-shimmer" style={{ background: "rgba(248, 164, 29, 0.2)" }}>
        <div className="ch-flag-dept-chip" style={{ opacity: 0.6 }}>دپارتمان تخصصی</div>
        <div className="ch-flag-icon-wrap rk-skeleton-shimmer" style={{ background: "#ffffff" }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(0,0,0,0.08)" }} />
        </div>
        <div className="ch-flag-badge" style={{ background: "var(--ink)", opacity: 0.4 }}>
          <span>دوره منتخب</span>
        </div>
      </div>

      <div className="ch-flag-content">
        <div className="ch-flag-top">
          <div className="ch-flag-meta-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <div className="rk-skeleton-line" style={{ width: "90px", height: "14px" }} />
              <div className="rk-skeleton-line" style={{ width: "40px", height: "14px" }} />
            </div>
            <div className="rk-skeleton-line" style={{ width: "70px", height: "22px", borderRadius: "8px" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBlock: "12px" }}>
            <div className="rk-skeleton-line" style={{ width: "75%", height: "26px" }} />
            <div className="rk-skeleton-line" style={{ width: "90%", height: "16px" }} />
          </div>

          <div className="ch-flag-stats-row" style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
            <div className="rk-skeleton-line" style={{ width: "110px", height: "28px", borderRadius: "8px" }} />
            <div className="rk-skeleton-line" style={{ width: "100px", height: "28px", borderRadius: "8px" }} />
            <div className="rk-skeleton-line" style={{ width: "130px", height: "28px", borderRadius: "8px" }} />
          </div>
        </div>

        <div className="ch-flag-actions" style={{ marginTop: "24px" }}>
          <div className="ch-flag-price-block">
            <div className="rk-skeleton-line" style={{ width: "90px", height: "26px" }} />
          </div>
          <div className="ch-flag-btn-group" style={{ display: "flex", gap: "12px" }}>
            <div className="rk-skeleton-line" style={{ width: "150px", height: "42px", borderRadius: "12px" }} />
            <div className="rk-skeleton-line" style={{ width: "140px", height: "42px", borderRadius: "12px" }} />
          </div>
        </div>
      </div>
    </article>
  );
}

export function SkeletonCourseCardItem() {
  return (
    <div className="ch-card" aria-hidden="true" style={{ pointerEvents: "none" }}>
      <div className="ch-card-cover rk-skeleton-shimmer" style={{ background: "rgba(0,0,0,0.04)" }}>
        <div className="ch-card-tag" style={{ opacity: 0.6 }}>دوره تخصصی</div>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(0,0,0,0.08)" }} />
      </div>

      <div className="ch-card-body" style={{ padding: "16px" }}>
        <div className="ch-card-badges-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <div className="rk-skeleton-line" style={{ width: "70px", height: "20px", borderRadius: "6px" }} />
          <div className="rk-skeleton-line" style={{ width: "65px", height: "20px", borderRadius: "6px" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBlock: "8px" }}>
          <div className="rk-skeleton-line" style={{ width: "85%", height: "20px" }} />
          <div className="rk-skeleton-line" style={{ width: "60%", height: "20px" }} />
        </div>

        <div className="ch-card-inst" style={{ display: "flex", alignItems: "center", gap: "8px", marginBlock: "10px" }}>
          <div className="ch-card-av rk-skeleton-shimmer" style={{ width: "24px", height: "24px", borderRadius: "50%" }} />
          <div className="rk-skeleton-line" style={{ width: "75px", height: "13px" }} />
        </div>

        <div className="ch-card-meta" style={{ display: "flex", gap: "12px", marginBlock: "10px" }}>
          <div className="rk-skeleton-line" style={{ width: "35px", height: "14px" }} />
          <div className="rk-skeleton-line" style={{ width: "45px", height: "14px" }} />
          <div className="rk-skeleton-line" style={{ width: "45px", height: "14px" }} />
        </div>

        <div className="ch-card-foot" style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1.5px dashed rgba(0,0,0,0.1)" }}>
          <div className="rk-skeleton-line" style={{ width: "75px", height: "22px" }} />
          <div className="rk-skeleton-line" style={{ width: "80px", height: "34px", borderRadius: "8px" }} />
        </div>
      </div>
    </div>
  );
}

export default function SkeletonCoursesHub() {
  return (
    <div className="space-y-16 py-6" aria-busy="true">
      {/* 1. Flagship Skeleton */}
      <section className="ch-flagships">
        <SkeletonFlagshipCard />
      </section>

      {/* 2. Suggested Groups Skeleton */}
      <section style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="rk-skeleton-shimmer" style={{ width: "36px", height: "36px", borderRadius: "10px", border: "2px solid var(--ink)" }} />
            <div className="rk-skeleton-line" style={{ width: "160px", height: "24px" }} />
          </div>
          <div className="rk-skeleton-line" style={{ width: "110px", height: "18px" }} />
        </div>

        <div className="ch-grid-3">
          <SkeletonCourseCardItem />
          <SkeletonCourseCardItem />
          <SkeletonCourseCardItem />
        </div>
      </section>
    </div>
  );
}
