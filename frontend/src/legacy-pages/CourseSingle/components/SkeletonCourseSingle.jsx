import React from "react";
import PatternLayer from "@/components/PatternLayer";
import "@/legacy-pages/CourseSingle/course.css";

export default function SkeletonCourseSingle() {
  return (
    <div className="cs-page" aria-busy="true" style={{ position: "relative" }}>
      <PatternLayer rotate={0} />

      {/* Topbar Skeleton */}
      <div className="container" style={{ pointerEvents: "none" }}>
        <div className="cs-topbar">
          <div className="rk-skeleton-line" style={{ width: 90, height: 16 }} />
          <div className="cs-crumbs" style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div className="rk-skeleton-line" style={{ width: 45, height: 14 }} />
            <span className="sep">›</span>
            <div className="rk-skeleton-line" style={{ width: 60, height: 14 }} />
            <span className="sep">›</span>
            <div className="rk-skeleton-line" style={{ width: 120, height: 14 }} />
          </div>
          <div className="cs-students" style={{ marginInlineStart: "auto", display: "flex", gap: 8, alignItems: "center" }}>
            <div className="rk-skeleton-line" style={{ width: 65, height: 14 }} />
            <div className="avs" style={{ display: "flex" }}>
              <div className="rk-skeleton-shimmer" style={{ width: 32, height: 32, borderRadius: "50%", border: "1.5px solid var(--ink)", marginInlineStart: -8 }} />
              <div className="rk-skeleton-shimmer" style={{ width: 32, height: 32, borderRadius: "50%", border: "1.5px solid var(--ink)", marginInlineStart: -8 }} />
              <div className="rk-skeleton-shimmer" style={{ width: 32, height: 32, borderRadius: "50%", border: "1.5px solid var(--ink)", marginInlineStart: -8 }} />
            </div>
          </div>
        </div>
      </div>

      <div className="container cs-grid" style={{ pointerEvents: "none" }}>
        {/* Main Column */}
        <div className="cs-main">
          <div className="cs-hero">
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBlock: 6 }}>
              <div className="rk-skeleton-line" style={{ width: "70%", height: 34 }} />
              <div className="rk-skeleton-line" style={{ width: "40%", height: 34 }} />
            </div>
            <div className="cs-meta" style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <div className="rk-skeleton-line" style={{ width: 75, height: 26, borderRadius: 999 }} />
              <div className="rk-skeleton-line" style={{ width: 85, height: 26, borderRadius: 999 }} />
              <div className="rk-skeleton-line" style={{ width: 65, height: 26, borderRadius: 999 }} />
            </div>
          </div>

          <div className="cs-tabs" style={{ display: "flex", gap: 16, padding: "0 32px", height: 50, alignItems: "center" }}>
            <div className="rk-skeleton-line" style={{ width: 65, height: 20 }} />
            <div className="rk-skeleton-line" style={{ width: 75, height: 20 }} />
            <div className="rk-skeleton-line" style={{ width: 55, height: 20 }} />
            <div className="rk-skeleton-line" style={{ width: 85, height: 20 }} />
            <div className="rk-skeleton-line" style={{ width: 50, height: 20 }} />
          </div>

          <div className="cs-panel-body" style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Highlight box */}
            <div style={{ background: "#FFFDF7", border: "1.5px solid var(--ink)", borderRadius: "var(--r-md)", padding: "18px 22px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div className="rk-skeleton-line" style={{ width: "95%", height: 16 }} />
                <div className="rk-skeleton-line" style={{ width: "88%", height: 16 }} />
              </div>
            </div>

            {/* Description lines */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBlock: 8 }}>
              <div className="rk-skeleton-line" style={{ width: "100%", height: 14 }} />
              <div className="rk-skeleton-line" style={{ width: "95%", height: 14 }} />
              <div className="rk-skeleton-line" style={{ width: "92%", height: 14 }} />
              <div className="rk-skeleton-line" style={{ width: "65%", height: 14 }} />
            </div>

            {/* Facts card / Course features */}
            <div style={{ border: "1.5px solid var(--ink)", borderRadius: "var(--r-md)", padding: 18, background: "#fff" }}>
              <div className="rk-skeleton-line" style={{ width: 140, height: 20, marginBottom: 16 }} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[1, 2, 3].map((n) => (
                  <div key={n} style={{ border: "1px solid var(--ink-light)", borderRadius: 8, padding: 14, background: "var(--bg-light)" }}>
                    <div className="rk-skeleton-line" style={{ width: 60, height: 12, marginBottom: 6 }} />
                    <div className="rk-skeleton-line" style={{ width: 90, height: 16 }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <aside className="cs-side">
          <div className="cs-card">
            {/* Thumbnail */}
            <div
              className="cs-thumb cs-thumb-side rk-skeleton-shimmer"
              style={{
                background: "linear-gradient(135deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.08) 100%)",
                height: 180,
                display: "grid",
                placeItems: "center",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "#ffffff",
                  border: "2px solid var(--ink)",
                  display: "grid",
                  placeItems: "center",
                  boxShadow: "2px 2px 0 var(--ink)",
                }}
              >
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderTop: "8px solid transparent",
                    borderBottom: "8px solid transparent",
                    borderLeft: "13px solid var(--ink)",
                    marginInlineStart: 3,
                  }}
                />
              </div>
            </div>

            {/* Price */}
            <div className="cs-price" style={{ marginBlock: "20px 10px", display: "flex", alignItems: "baseline", gap: 8 }}>
              <div className="rk-skeleton-line" style={{ width: 150, height: 38 }} />
              <div className="rk-skeleton-line" style={{ width: 35, height: 16 }} />
            </div>

            {/* CTA Button */}
            <div className="rk-skeleton-line" style={{ width: "100%", height: 46, borderRadius: 10, marginBlock: 12 }} />

            {/* Wishlist Sub-btn */}
            <div className="rk-skeleton-line" style={{ width: 90, height: 18, margin: "6px auto 14px" }} />

            <div className="cs-divider" />

            {/* Facts Grid */}
            <div className="cs-facts">
              {[1, 2, 3, 4, 5, 6].map((k) => (
                <div key={k} className="f">
                  <div className="rk-skeleton-line" style={{ width: 55, height: 12, marginBottom: 4 }} />
                  <div className="rk-skeleton-line" style={{ width: 80, height: 16 }} />
                </div>
              ))}
            </div>
          </div>

          {/* Instructor Card */}
          <div className="cs-instr">
            <div
              className="rk-skeleton-shimmer"
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                border: "1.5px solid var(--ink)",
                flexShrink: 0,
              }}
            />
            <div className="who" style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
              <div className="rk-skeleton-line" style={{ width: 110, height: 16 }} />
              <div className="rk-skeleton-line" style={{ width: 80, height: 13 }} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
