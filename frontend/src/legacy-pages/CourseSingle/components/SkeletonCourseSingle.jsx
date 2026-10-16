import React from "react";

export default function SkeletonCourseSingle() {
  return (
    <div className="cs-page" aria-busy="true">
      {/* Topbar Skeleton */}
      <div className="cs-topbar container" style={{ pointerEvents: "none" }}>
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
          <div style={{ display: "flex", gap: 3 }}>
            <div className="rk-skeleton-shimmer" style={{ width: 28, height: 28, borderRadius: "50%" }} />
            <div className="rk-skeleton-shimmer" style={{ width: 28, height: 28, borderRadius: "50%" }} />
          </div>
        </div>
      </div>

      <div className="container cs-grid" style={{ pointerEvents: "none" }}>
        {/* Main Column */}
        <div className="cs-main">
          <div className="cs-hero">
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBlock: 12 }}>
              <div className="rk-skeleton-line" style={{ width: "80%", height: 36 }} />
              <div className="rk-skeleton-line" style={{ width: "50%", height: 36 }} />
            </div>
            <div className="cs-meta" style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <div className="rk-skeleton-line" style={{ width: 75, height: 26, borderRadius: 999 }} />
              <div className="rk-skeleton-line" style={{ width: 85, height: 26, borderRadius: 999 }} />
              <div className="rk-skeleton-line" style={{ width: 65, height: 26, borderRadius: 999 }} />
            </div>
          </div>

          <div className="cs-tabs" style={{ display: "flex", gap: 16, padding: "0 32px", height: 50, alignItems: "center" }}>
            <div className="rk-skeleton-line" style={{ width: 60, height: 18 }} />
            <div className="rk-skeleton-line" style={{ width: 70, height: 18 }} />
            <div className="rk-skeleton-line" style={{ width: 55, height: 18 }} />
            <div className="rk-skeleton-line" style={{ width: 80, height: 18 }} />
          </div>

          <div className="cs-panel-body" style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="cs-desc-highlight-box" style={{ background: "#FFFDF7", padding: "18px 22px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div className="rk-skeleton-line" style={{ width: "95%", height: 16 }} />
                <div className="rk-skeleton-line" style={{ width: "88%", height: 16 }} />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBlock: 8 }}>
              <div className="rk-skeleton-line" style={{ width: "100%", height: 14 }} />
              <div className="rk-skeleton-line" style={{ width: "95%", height: 14 }} />
              <div className="rk-skeleton-line" style={{ width: "90%", height: 14 }} />
              <div className="rk-skeleton-line" style={{ width: "70%", height: 14 }} />
            </div>

            <div className="cs-desc-facts-card" style={{ padding: 18 }}>
              <div className="rk-skeleton-line" style={{ width: 120, height: 20, marginBottom: 14 }} />
              <div className="cs-desc-facts-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[1, 2, 3].map((n) => (
                  <div key={n} className="cs-desc-fact-item" style={{ padding: 12 }}>
                    <div className="rk-skeleton-line" style={{ width: 50, height: 12, marginBottom: 4 }} />
                    <div className="rk-skeleton-line" style={{ width: 80, height: 16 }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <aside className="cs-side">
          <div className="cs-card" style={{ padding: 20 }}>
            <div className="cs-thumb cs-thumb-side rk-skeleton-shimmer" style={{ background: "rgba(0,0,0,0.06)", height: 180, display: "grid", placeItems: "center" }}>
              <div style={{ width: 54, height: 54, borderRadius: "50%", background: "#ffffff", border: "2px solid var(--ink)" }} />
            </div>

            <div className="cs-price" style={{ marginBlock: "20px 10px" }}>
              <div className="rk-skeleton-line" style={{ width: 140, height: 36 }} />
            </div>

            <div className="rk-skeleton-line" style={{ width: "100%", height: 46, borderRadius: 10, marginBlock: 12 }} />
            <div className="rk-skeleton-line" style={{ width: 80, height: 18, margin: "6px auto" }} />

            <div className="cs-facts" style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24, paddingTop: 18, borderTop: "1.5px dashed var(--ink-light)" }}>
              {[1, 2, 3, 4, 5].map((k) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div className="rk-skeleton-line" style={{ width: 75, height: 14 }} />
                  <div className="rk-skeleton-line" style={{ width: 60, height: 14 }} />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
