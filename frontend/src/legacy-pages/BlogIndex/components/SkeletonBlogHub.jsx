const CARD_ROTS = ["-1deg", "1deg", "-0.75deg", "1.25deg", "-1.5deg", "0.75deg"];

export function SkeletonBlogIndexCard({ size = "sm", index = 0 }) {
  const rot = CARD_ROTS[index % CARD_ROTS.length];
  return (
    <div
      className={`bi-card bi-card-${size}`}
      aria-hidden="true"
      style={{ "--rot": rot, pointerEvents: "none" }}
    >
      <div className="bi-card-sh" />
      <div className="bi-card-body">
        <div className="bi-card-media rk-skeleton-shimmer" style={{ background: "rgba(0,0,0,0.06)" }}>
          <div className="rk-skeleton-line" style={{ position: "absolute", top: 12, right: 12, width: 60, height: 22, borderRadius: 999 }} />
        </div>

        <div className="bi-card-info">
          <div className="bi-card-meta" style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div className="rk-skeleton-line" style={{ width: 45, height: 12 }} />
            <span className="dot" />
            <div className="rk-skeleton-line" style={{ width: 45, height: 12 }} />
            <span className="dot" />
            <div className="rk-skeleton-line" style={{ width: 35, height: 12 }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBlock: 8 }}>
            <div className="rk-skeleton-line" style={{ width: "90%", height: size === "lg" ? 24 : 18 }} />
            <div className="rk-skeleton-line" style={{ width: "65%", height: size === "lg" ? 24 : 18 }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBlock: 6 }}>
            <div className="rk-skeleton-line" style={{ width: "95%", height: 13 }} />
            <div className="rk-skeleton-line" style={{ width: "80%", height: 13 }} />
          </div>

          <div className="bi-card-foot" style={{ marginTop: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div className="avatar rk-skeleton-shimmer" style={{ width: 24, height: 24, borderRadius: "50%" }} />
              <div className="rk-skeleton-line" style={{ width: 70, height: 12 }} />
            </div>
            <div className="bi-card-arr rk-skeleton-shimmer" style={{ width: 28, height: 28, borderRadius: "50%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonBlogHero() {
  return (
    <section className="bi-hero" aria-hidden="true" style={{ pointerEvents: "none" }}>
      <div className="bi-hero-deco bi-hero-deco-1" style={{ background: "var(--accent)", opacity: 0.2 }} />
      <div className="bi-hero-deco bi-hero-deco-2" style={{ background: "var(--teal)", opacity: 0.2 }} />

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        {/* Back link */}
        <div className="bi-back" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <div className="rk-skeleton-shimmer" style={{ width: 14, height: 14, borderRadius: 3 }} />
          <div className="rk-skeleton-line" style={{ width: 85, height: 14, borderRadius: 4 }} />
        </div>

        {/* Pill */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
          <div className="bi-pill" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px" }}>
            <div className="rk-skeleton-shimmer" style={{ width: 16, height: 16, borderRadius: "50%" }} />
            <div className="rk-skeleton-line" style={{ width: 65, height: 13, borderRadius: 3 }} />
            <span style={{ color: "var(--ink-subtle)", opacity: 0.5 }}>·</span>
            <div className="rk-skeleton-line" style={{ width: 75, height: 13, borderRadius: 3 }} />
          </div>
        </div>

        {/* Title */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginBlock: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, width: "100%", flexWrap: "wrap" }}>
            <div className="rk-skeleton-line" style={{ width: 120, height: 42, borderRadius: 8, transform: "rotate(-1deg)" }} />
            <div className="rk-skeleton-line" style={{ width: 95, height: 42, borderRadius: 8, transform: "rotate(1deg)" }} />
            <div className="rk-skeleton-line" style={{ width: 40, height: 42, borderRadius: 8 }} />
            <div className="rk-skeleton-line" style={{ width: 140, height: 42, borderRadius: 8, transform: "rotate(-1deg)" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, width: "100%", flexWrap: "wrap" }}>
            <div className="rk-skeleton-line" style={{ width: 50, height: 42, borderRadius: 8 }} />
            <div className="rk-skeleton-line" style={{ width: 80, height: 42, borderRadius: 8, transform: "rotate(1deg)" }} />
            <div className="rk-skeleton-line" style={{ width: 150, height: 42, borderRadius: 8, transform: "rotate(-1deg)" }} />
          </div>
        </div>

        {/* Subtitle */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, margin: "0 auto 2.5rem", maxWidth: 600 }}>
          <div className="rk-skeleton-line" style={{ width: "90%", height: 16, borderRadius: 4 }} />
          <div className="rk-skeleton-line" style={{ width: "65%", height: 16, borderRadius: 4 }} />
        </div>

        {/* Search */}
        <div className="bi-search">
          <div className="bi-search-sh" />
          <div className="bi-search-box" style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 18px", height: 56 }}>
            <div className="rk-skeleton-shimmer" style={{ width: 20, height: 20, borderRadius: "50%" }} />
            <div className="rk-skeleton-line" style={{ width: 180, height: 16, borderRadius: 4 }} />
          </div>
        </div>
      </div>
    </section>
  );
}

export function SkeletonBlogFeatured() {
  return (
    <section className="bi-featured" aria-hidden="true" style={{ pointerEvents: "none" }}>
      <div className="container">
        {/* Head */}
        <div className="bi-sec-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="bi-dot-ring" />
            <div className="rk-skeleton-line" style={{ width: 180, height: 26, borderRadius: 6 }} />
          </div>
          <div className="rk-skeleton-line" style={{ width: 110, height: 14, borderRadius: 4 }} />
        </div>

        {/* Card */}
        <div className="bi-featured-card">
          <div className="bi-featured-sh" />
          <div className="bi-featured-grid">
            {/* Media side */}
            <div className="bi-featured-media" style={{ background: "var(--college-light, #FFF4E5)" }}>
              <div className="bi-feat-shape bi-feat-shape-1" style={{ background: "var(--navy-alt)", opacity: 0.15 }} />
              <div className="bi-feat-shape bi-feat-shape-2" style={{ background: "var(--accent)", opacity: 0.15 }} />

              <div className="bi-feat-top">
                <div
                  className="bi-feat-hot"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: ".4rem .9rem",
                    borderRadius: 999,
                  }}
                >
                  <div className="rk-skeleton-shimmer" style={{ width: 12, height: 12, borderRadius: "50%" }} />
                  <div className="rk-skeleton-line" style={{ width: 100, height: 12, borderRadius: 3, background: "rgba(255,255,255,0.3)" }} />
                </div>
              </div>

              <div className="bi-feat-chips" style={{ display: "flex", gap: 9 }}>
                <div
                  className="chip white"
                  style={{
                    padding: ".4rem .9rem",
                    border: "2px solid var(--ink)",
                    borderRadius: 9,
                    boxShadow: "2px 2px 0 var(--ink)",
                  }}
                >
                  <div className="rk-skeleton-line" style={{ width: 55, height: 12, borderRadius: 3 }} />
                </div>
                <div
                  className="chip amber"
                  style={{
                    padding: ".4rem .9rem",
                    border: "2px solid var(--ink)",
                    borderRadius: 9,
                    boxShadow: "2px 2px 0 var(--ink)",
                  }}
                >
                  <div className="rk-skeleton-line" style={{ width: 85, height: 12, borderRadius: 3, background: "rgba(255,255,255,0.3)" }} />
                </div>
              </div>
            </div>

            {/* Body side */}
            <div className="bi-featured-body">
              <div>
                <div className="bi-feat-meta" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1rem" }}>
                  <div className="rk-skeleton-line" style={{ width: 70, height: 13, borderRadius: 3 }} />
                  <span className="sep" />
                  <div className="rk-skeleton-line" style={{ width: 75, height: 13, borderRadius: 3 }} />
                  <span className="sep bi-hide-mob-inline" />
                  <div className="rk-skeleton-line bi-hide-mob-inline" style={{ width: 55, height: 13, borderRadius: 3 }} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBlock: 12 }}>
                  <div className="rk-skeleton-line" style={{ width: "90%", height: 32, borderRadius: 8 }} />
                  <div className="rk-skeleton-line" style={{ width: "60%", height: 32, borderRadius: 8 }} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBlock: 12 }}>
                  <div className="rk-skeleton-line" style={{ width: "98%", height: 16, borderRadius: 4 }} />
                  <div className="rk-skeleton-line" style={{ width: "85%", height: 16, borderRadius: 4 }} />
                </div>
              </div>

              <div className="bi-feat-foot" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16 }}>
                <div className="bi-author-mini" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="avatar rk-skeleton-shimmer" style={{ width: 36, height: 36, borderRadius: "50%" }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div className="rk-skeleton-line" style={{ width: 85, height: 14, borderRadius: 3 }} />
                    <div className="rk-skeleton-line" style={{ width: 110, height: 11, borderRadius: 3 }} />
                  </div>
                </div>

                <div
                  className="bi-read-btn"
                  style={{
                    border: "2px solid var(--ink)",
                    boxShadow: "3px 3px 0 var(--ink)",
                    borderRadius: 12,
                    padding: "8px 16px",
                  }}
                >
                  <div className="rk-skeleton-line" style={{ width: 90, height: 16, borderRadius: 4 }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SkeletonBlogCategories() {
  const chips = [
    { w: 50, rot: "-1deg" },
    { w: 75, rot: "1deg" },
    { w: 65, rot: "-0.5deg" },
    { w: 90, rot: "1.5deg" },
    { w: 80, rot: "-1deg" },
    { w: 110, rot: "0.5deg" },
    { w: 85, rot: "-1deg" },
  ];

  return (
    <section className="bi-cats" aria-hidden="true" style={{ pointerEvents: "none" }}>
      <div className="container">
        <div className="bi-chip-row" style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
          {chips.map((c, i) => (
            <div
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#ffffff",
                border: "2px solid var(--ink)",
                borderRadius: 999,
                padding: "8px 18px",
                transform: `rotate(${c.rot})`,
                boxShadow: "2px 2px 0 var(--ink)",
              }}
            >
              <div className="rk-skeleton-line" style={{ width: c.w, height: 14, borderRadius: 4 }} />
              <div
                className="rk-skeleton-shimmer"
                style={{ width: 20, height: 20, borderRadius: "50%", border: "1px solid var(--ink)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SkeletonBlogGrid() {
  return (
    <section className="bi-grid-sec" id="bi-results" aria-busy="true">
      <div className="container">
        {/* Head */}
        <div className="bi-sec-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div className="rk-skeleton-line" style={{ width: 140, height: 28, borderRadius: 6 }} />
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
            <div className="rk-skeleton-line" style={{ width: 75, height: 14, borderRadius: 3 }} />
          </div>
        </div>

        {/* Cards Grid */}
        <div className="bi-blog-grid">
          <SkeletonBlogIndexCard size="lg" index={0} />
          <SkeletonBlogIndexCard size="sm" index={1} />
          <SkeletonBlogIndexCard size="sm" index={2} />
          <SkeletonBlogIndexCard size="sm" index={3} />
          <SkeletonBlogIndexCard size="sm" index={4} />
          <SkeletonBlogIndexCard size="sm" index={5} />
        </div>
      </div>
    </section>
  );
}

export function SkeletonBlogTrending() {
  return (
    <section className="bi-trending" aria-hidden="true" style={{ pointerEvents: "none" }}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="bi-sec-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="bi-trend-ic rk-skeleton-shimmer" style={{ width: 36, height: 36, borderRadius: "50%" }} />
            <div className="rk-skeleton-line" style={{ width: 180, height: 26, borderRadius: 6 }} />
          </div>
          <div className="rk-skeleton-line" style={{ width: 90, height: 13, borderRadius: 4 }} />
        </div>

        <div className="bi-trend-grid">
          {[1, 2, 3].map((n, i) => (
            <div key={n} className="bi-trend-cell" style={{ transform: i === 1 ? "rotate(1deg)" : "rotate(-1deg)" }}>
              <div className="bi-trend-sh" />
              <article className="bi-trend-card">
                <div className="bi-trend-media" style={{ background: "var(--college-light, #FFF4E5)" }}>
                  <div className="bi-card-circle" style={{ background: "rgba(255,255,255,.25)" }} />
                  <div className="bi-card-square" />
                  <span className="bi-trend-glyph rk-skeleton-shimmer" style={{ width: 40, height: 40, borderRadius: 8 }} />
                </div>
                <div className="bi-trend-body" style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
                  <div className="bi-trend-top">
                    <div
                      style={{
                        display: "inline-block",
                        background: "var(--ink)",
                        borderRadius: 6,
                        padding: "2px 8px",
                      }}
                    >
                      <div className="rk-skeleton-line" style={{ width: 45, height: 12, borderRadius: 2, background: "rgba(255,255,255,0.3)" }} />
                    </div>
                  </div>
                  <div className="rk-skeleton-line" style={{ width: "90%", height: 20, borderRadius: 5 }} />
                  <div className="rk-skeleton-line" style={{ width: "60%", height: 20, borderRadius: 5 }} />
                  <div className="bi-trend-foot" style={{ marginTop: "auto", display: "flex", justifyContent: "space-between" }}>
                    <div className="rk-skeleton-line" style={{ width: 65, height: 13, borderRadius: 3 }} />
                    <div className="rk-skeleton-line" style={{ width: 35, height: 13, borderRadius: 3 }} />
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SkeletonBlogPage() {
  return (
    <div style={{ background: "#ffffff", minHeight: "100vh" }}>
      <SkeletonBlogHero />
      <SkeletonBlogFeatured />
      <SkeletonBlogCategories />
      <SkeletonBlogGrid />
      <SkeletonBlogTrending />
    </div>
  );
}

export default SkeletonBlogPage;
