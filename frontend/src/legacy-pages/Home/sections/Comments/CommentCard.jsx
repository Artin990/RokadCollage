import React from "react";

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function CommentCard({ testimonial }) {
  const t = testimonial;
  return (
    <article className="cmt3-card" key={t.name}>
      <div className="shadow" />
      <div className="body">
        <div className="avatar-side">
          <div className="avatar-big">{t.name.charAt(0)}</div>
          <p className="name-white">{t.name}</p>
          <p className="role-white">{t.role}</p>
          <div className="cmt3-stars">
            {Array.from({ length: 5 }, (_, s) => (
              <StarIcon key={s} />
            ))}
          </div>
        </div>
        <div className="content-side">
          <div className="head-row">
            <span className="course-chip">{t.course}</span>
            <span className="date">{t.date}</span>
          </div>
          <p className="quote-text">{t.quote}</p>
          <div className="foot-row">
            <span className="status">
              <span className="pulse" />
              {t.status}
            </span>
            <span>هنرجوی رکاد</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export function SkeletonCommentCard({ index = 0 }) {
  return (
    <article className="cmt3-card" aria-hidden="true">
      <div className="shadow" />
      <div className="body">
        <div className="avatar-side">
          <div className="avatar-big rk-skeleton-shimmer" style={{ background: "rgba(255,255,255,0.2)", borderColor: "rgba(255,255,255,0.4)" }}>
            <div className="w-8 h-8 rounded-md bg-white/30" />
          </div>
          <div className="rk-skeleton-line" style={{ width: "70px", height: "14px", margin: "0 auto 6px", background: "rgba(255,255,255,0.45)" }} />
          <div className="rk-skeleton-line" style={{ width: "50px", height: "11px", margin: "0 auto", background: "rgba(255,255,255,0.3)" }} />
          <div className="cmt3-stars" style={{ opacity: 0.6, marginTop: "10px", gap: "3px" }}>
            {Array.from({ length: 5 }, (_, s) => (
              <div key={s} className="w-3.5 h-3.5 rounded-xs bg-white/40" />
            ))}
          </div>
        </div>
        <div className="content-side">
          <div className="head-row">
            <div className="rk-skeleton-line" style={{ width: "95px", height: "24px", borderRadius: "10px 0 10px 0" }} />
            <div className="rk-skeleton-line" style={{ width: "55px", height: "14px" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBlock: "8px" }}>
            <div className="rk-skeleton-line" style={{ width: "95%", height: "15px" }} />
            <div className="rk-skeleton-line" style={{ width: "85%", height: "15px" }} />
            <div className="rk-skeleton-line" style={{ width: "65%", height: "15px" }} />
          </div>
          <div className="foot-row" style={{ marginTop: "auto" }}>
            <div className="rk-skeleton-line" style={{ width: "85px", height: "22px", borderRadius: "8px" }} />
            <div className="rk-skeleton-line" style={{ width: "65px", height: "14px" }} />
          </div>
        </div>
      </div>
    </article>
  );
}
