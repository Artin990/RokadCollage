import React from "react";

export default function SkeletonBlogArticle() {
  return (
    <section className="rbs-page" aria-busy="true">
      <div className="container" style={{ pointerEvents: "none" }}>
        {/* Breadcrumb Skeleton */}
        <div className="rbs-crumb" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div className="rk-skeleton-line" style={{ width: 45, height: 14 }} />
          <span className="sep">/</span>
          <div className="rk-skeleton-line" style={{ width: 45, height: 14 }} />
          <span className="sep">/</span>
          <div className="rk-skeleton-line" style={{ width: 140, height: 14 }} />
        </div>

        <div className="rbs-layout">
          {/* Main Article Column */}
          <article className="rbs-article">
            <div className="rbs-tags" style={{ display: "flex", gap: 8 }}>
              <div className="rk-skeleton-line" style={{ width: 75, height: 26, borderRadius: 6 }} />
              <div className="rk-skeleton-line" style={{ width: 60, height: 26, borderRadius: 6 }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBlock: 16 }}>
              <div className="rk-skeleton-line" style={{ width: "95%", height: 38 }} />
              <div className="rk-skeleton-line" style={{ width: "65%", height: 38 }} />
            </div>

            <div className="rbs-meta" style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div className="rk-skeleton-line" style={{ width: 65, height: 14 }} />
              <div className="rk-skeleton-line" style={{ width: 80, height: 14 }} />
              <div className="rk-skeleton-line" style={{ width: 95, height: 14 }} />
            </div>

            <div className="rbs-cover" style={{ marginBlock: 24 }}>
              <div
                className="rbs-cover-card rk-skeleton-shimmer"
                style={{
                  height: 320,
                  background: "rgba(0,0,0,0.06)",
                  border: "2px solid var(--ink)",
                  borderRadius: "16px 0 16px 0",
                  boxShadow: "4px 4px 0 var(--ink)",
                }}
              />
            </div>

            <div className="rbs-prose" style={{ display: "flex", flexDirection: "column", gap: 14, marginBlock: 24 }}>
              <div className="rk-skeleton-line" style={{ width: "100%", height: 16 }} />
              <div className="rk-skeleton-line" style={{ width: "98%", height: 16 }} />
              <div className="rk-skeleton-line" style={{ width: "92%", height: 16 }} />
              <div className="rk-skeleton-line" style={{ width: "75%", height: 16 }} />

              <div style={{ height: 16 }} />

              <div className="rk-skeleton-line" style={{ width: "40%", height: 24, marginBlock: 8 }} />
              <div className="rk-skeleton-line" style={{ width: "100%", height: 16 }} />
              <div className="rk-skeleton-line" style={{ width: "96%", height: 16 }} />
              <div className="rk-skeleton-line" style={{ width: "85%", height: 16 }} />
            </div>

            <div className="rbs-author" style={{ padding: 20, display: "flex", gap: 16, alignItems: "center", border: "2px solid var(--ink)", borderRadius: "14px 0 14px 0", boxShadow: "3px 3px 0 var(--ink)", background: "#ffffff" }}>
              <div className="avatar rk-skeleton-shimmer" style={{ width: 56, height: 56, borderRadius: "50%", flexShrink: 0 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                <div className="rk-skeleton-line" style={{ width: 110, height: 18 }} />
                <div className="rk-skeleton-line" style={{ width: 85, height: 13 }} />
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="rbs-side">
            <div className="rbs-side-card rbs-side-author" style={{ padding: 20, border: "2px solid var(--ink)", borderRadius: "14px 0 14px 0", boxShadow: "3px 3px 0 var(--ink)", background: "#ffffff" }}>
              <div className="row" style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                <div className="avatar rk-skeleton-shimmer" style={{ width: 44, height: 44, borderRadius: "50%" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div className="rk-skeleton-line" style={{ width: 90, height: 16 }} />
                  <div className="rk-skeleton-line" style={{ width: 70, height: 12 }} />
                </div>
              </div>
              <div className="rk-skeleton-line" style={{ width: "90%", height: 12 }} />
            </div>

            <div className="rbs-side-card" style={{ marginTop: 20, padding: 20, border: "2px solid var(--ink)", borderRadius: "14px 0 14px 0", boxShadow: "3px 3px 0 var(--ink)", background: "#ffffff" }}>
              <div className="rk-skeleton-line" style={{ width: 110, height: 18, marginBottom: 16 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rk-skeleton-line" style={{ width: `${85 - i * 8}%`, height: 14 }} />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
