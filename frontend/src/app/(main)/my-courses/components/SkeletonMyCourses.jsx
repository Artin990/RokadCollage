import React from "react";
import { SkeletonMyCourseCard } from "./MyCourseCard";
import "@/legacy-pages/DepartmentPage/department.css";
import "../my-courses.css";

export default function SkeletonMyCourses() {
  return (
    <div className="mc-page" aria-busy="true" style={{ pointerEvents: "none" }}>
      {/* Hero Skeleton */}
      <header className="mc-hero">
        <div className="mc-hero-inner">
          {/* Breadcrumb */}
          <div className="mc-crumb" style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div className="rk-skeleton-line" style={{ width: 45, height: 14 }} />
            <span className="sep">›</span>
            <div className="rk-skeleton-line" style={{ width: 85, height: 14 }} />
          </div>

          {/* Badge */}
          <div className="mc-badge" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span className="dot" />
            <div className="rk-skeleton-line" style={{ width: 80, height: 14 }} />
          </div>

          {/* Title */}
          <div style={{ margin: "14px 0 20px" }}>
            <div className="rk-skeleton-line" style={{ width: "min(480px, 85%)", height: 38 }} />
          </div>

          {/* Hero Stats */}
          <div className="dp-hero-stats">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="dp-hstat">
                <div className="rk-skeleton-line" style={{ width: 45, height: 24, marginBottom: 4 }} />
                <div className="rk-skeleton-line" style={{ width: 75, height: 12 }} />
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Wrap */}
      <main className="mc-content-wrap">
        {/* Filter / Search Bar Skeleton */}
        <div
          style={{
            background: "#ffffff",
            border: "2px solid var(--ink)",
            borderRadius: "16px 0 16px 0",
            boxShadow: "4px 4px 0 var(--ink)",
            padding: "16px 20px",
            marginBottom: 32,
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="rk-skeleton-line" style={{ width: 220, height: 42, borderRadius: 10 }} />
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div className="rk-skeleton-line" style={{ width: 80, height: 36, borderRadius: 999 }} />
            <div className="rk-skeleton-line" style={{ width: 90, height: 36, borderRadius: 999 }} />
            <div className="rk-skeleton-line" style={{ width: 85, height: 36, borderRadius: 999 }} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div className="rk-skeleton-line" style={{ width: 100, height: 40, borderRadius: 10 }} />
            <div className="rk-skeleton-line" style={{ width: 110, height: 40, borderRadius: 10 }} />
          </div>
        </div>

        {/* Courses Grid */}
        <div className="mc-grid">
          {[1, 2, 3, 4, 5, 6].map((k) => (
            <SkeletonMyCourseCard key={k} />
          ))}
        </div>
      </main>
    </div>
  );
}
