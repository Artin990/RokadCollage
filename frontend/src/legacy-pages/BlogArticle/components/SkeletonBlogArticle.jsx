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
            {/* Category / Tags */}
            <div className="rbs-tags" style={{ display: "flex", gap: 10 }}>
              <div className="rk-skeleton-line" style={{ width: 85, height: 30, borderRadius: 999 }} />
              <div className="rk-skeleton-line" style={{ width: 70, height: 30, borderRadius: 999 }} />
            </div>

            {/* Article Title */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBlock: "12px 20px" }}>
              <div className="rk-skeleton-line" style={{ width: "95%", height: 38 }} />
              <div className="rk-skeleton-line" style={{ width: "65%", height: 38 }} />
            </div>

            {/* Meta */}
            <div className="rbs-meta" style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div className="rk-skeleton-line" style={{ width: 70, height: 15 }} />
              <span className="dot" style={{ color: "var(--ink-light)" }}>●</span>
              <div className="rk-skeleton-line" style={{ width: 85, height: 15 }} />
              <span className="dot" style={{ color: "var(--ink-light)" }}>●</span>
              <div className="rk-skeleton-line" style={{ width: 110, height: 15 }} />
            </div>

            {/* Cover Card */}
            <div className="rbs-cover">
              <div
                className="rbs-cover-card rk-skeleton-shimmer"
                style={{
                  background: "linear-gradient(135deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.08) 100%)",
                }}
              >
                <div
                  style={{
                    width: 130,
                    height: 36,
                    background: "#ffffff",
                    border: "2px solid var(--college-dark)",
                    borderRadius: 999,
                    boxShadow: "3px 3px 0 var(--college-dark)",
                  }}
                />
              </div>
            </div>

            {/* Prose Content */}
            <div className="rbs-prose" style={{ display: "flex", flexDirection: "column", gap: 14, marginBlock: 24 }}>
              <div className="rk-skeleton-line" style={{ width: "100%", height: 16 }} />
              <div className="rk-skeleton-line" style={{ width: "97%", height: 16 }} />
              <div className="rk-skeleton-line" style={{ width: "92%", height: 16 }} />
              <div className="rk-skeleton-line" style={{ width: "70%", height: 16 }} />

              {/* Subheading with colored bar */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBlock: "28px 10px" }}>
                <div style={{ width: 8, height: 28, borderRadius: 999, background: "var(--college)" }} />
                <div className="rk-skeleton-line" style={{ width: "45%", height: 26 }} />
              </div>

              <div className="rk-skeleton-line" style={{ width: "100%", height: 16 }} />
              <div className="rk-skeleton-line" style={{ width: "95%", height: 16 }} />
              <div className="rk-skeleton-line" style={{ width: "88%", height: 16 }} />

              {/* Quote Box */}
              <div
                className="rbs-quote"
                style={{
                  margin: "24px 0",
                  padding: "24px 28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div className="rk-skeleton-line" style={{ width: "95%", height: 18 }} />
                <div className="rk-skeleton-line" style={{ width: "80%", height: 18 }} />
              </div>

              <div className="rk-skeleton-line" style={{ width: "98%", height: 16 }} />
              <div className="rk-skeleton-line" style={{ width: "85%", height: 16 }} />
            </div>

            {/* Author Footer Card */}
            <div className="rbs-author" style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div
                className="avatar rk-skeleton-shimmer"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  border: "2px solid var(--ink)",
                  boxShadow: "2px 2px 0 var(--ink)",
                  flexShrink: 0,
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                <div className="rk-skeleton-line" style={{ width: 120, height: 18 }} />
                <div className="rk-skeleton-line" style={{ width: 90, height: 13 }} />
                <div className="rk-skeleton-line" style={{ width: "75%", height: 12, marginTop: 4 }} />
              </div>
            </div>
          </article>

          {/* Sticky Sidebar */}
          <aside className="rbs-side">
            {/* Author Card */}
            <div className="rbs-side-card rbs-side-author">
              <div className="row" style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                <div
                  className="avatar rk-skeleton-shimmer"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    border: "2px solid var(--ink)",
                    boxShadow: "2px 2px 0 var(--ink)",
                    flexShrink: 0,
                  }}
                />
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div className="rk-skeleton-line" style={{ width: 100, height: 16 }} />
                  <div className="rk-skeleton-line" style={{ width: 75, height: 12 }} />
                </div>
              </div>
              <div className="rk-skeleton-line" style={{ width: "92%", height: 12 }} />
            </div>

            {/* Table of Contents */}
            <div className="rbs-side-card">
              <div className="head">
                <div className="rk-skeleton-line" style={{ width: 100, height: 16 }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        border: "1px solid var(--ink)",
                        background: "var(--college-light)",
                        boxShadow: "1.5px 1.5px 0 var(--ink)",
                        flexShrink: 0,
                      }}
                    />
                    <div className="rk-skeleton-line" style={{ width: `${80 - i * 8}%`, height: 14 }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Share Card */}
            <div className="rbs-side-card">
              <div className="head">
                <div className="rk-skeleton-line" style={{ width: 90, height: 16 }} />
              </div>
              <div style={{ marginTop: 12 }}>
                <div className="rk-skeleton-line" style={{ width: "100%", height: 38, borderRadius: 8 }} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
