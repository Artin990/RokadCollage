import Link from "next/link";
import { Bookmark, MapPin, Monitor } from "lucide-react";
import { DEPT_PERSONA } from "@/data/departments.js";
import { toggleWishlist } from "@/data/panelStore.js";
import { isWishlisted } from "@/data/selectors.js";
import { CourseIcon, StarIcon, ClockIcon, UsersIcon, BookIcon } from "./DepartmentIcons.jsx";
import { getCourseImageUrl, isCustomImage } from "@/utils/getImageUrl.js";

export const getSlugForDeptCourse = (c) => {
  if (c?.slug) return c.slug;
  if (c?._id) return c._id;
  if (c?.id && !String(c.id).startsWith("dept-c-")) return c.id;
  return c?._id || c?.id || "";
};

export default function DepartmentCourseCard({ c, rot, persona: cardPersona, store }) {
  const cardTheme = cardPersona || DEPT_PERSONA[c.department] || DEPT_PERSONA.languages;
  const slug = getSlugForDeptCourse(c);
  const isSaved = isWishlisted(slug, store);
  const isOnline = c.mode === "online" || c.mode === "غیرحضوری" || c.mode === "غیر حضوری";
  const customCover = isCustomImage(c.img);
  const coverUrl = customCover ? getCourseImageUrl(c.img) : null;

  return (
    <Link
      className="dp-card"
      data-dept={cardTheme.id}
      href={`/courses/${slug}`}
      onClick={() => {
        try {
          const m = isOnline ? "online" : "in-person";
          sessionStorage.setItem(`rokad_course_mode_${slug}`, m);
          sessionStorage.setItem("rokad_last_course_mode", m);
        } catch (_) {}
      }}
      style={{
        "--rot": `rotate(${rot}deg)`,
        "--dp": cardTheme.colorVar,
        "--dp-light": cardTheme.lightVar,
        "--dp-dark": cardTheme.darkVar,
        "--dp-text": cardTheme.id === "it" ? "var(--white)" : "var(--ink)",
      }}
    >
      <div className="dp-card-cover">
        {customCover ? (
          <img className="dp-cover-custom-img" src={coverUrl} alt={c.title || ""} />
        ) : (
          <>
            <img className="dp-cover-pattern" src={cardTheme.pattern} alt="" aria-hidden="true" />
            <CourseIcon id={c.ic} size={34} />
          </>
        )}
        {c.tag && <span className="dp-card-tag">{c.tag}</span>}
        <button
          type="button"
          className={`course-card-save-btn${isSaved ? " is-saved" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(slug);
          }}
          aria-label={isSaved ? "حذف از نشان‌شده‌ها" : "نشان کردن دوره"}
          title={isSaved ? "حذف از نشان‌شده‌ها" : "نشان کردن دوره"}
        >
          <Bookmark size={15} fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2.2} />
        </button>
      </div>
      <div className="dp-card-body">
        <div className="dp-card-top-row">
          <div className="dp-card-cat">{c.cat}</div>
          <span className={`course-mode-badge ${isOnline ? "online" : "in-person"}`}>
            {isOnline ? <Monitor size={12} strokeWidth={2.4} /> : <MapPin size={12} strokeWidth={2.4} />}
            <span>{isOnline ? "غیر حضوری" : "حضوری"}</span>
          </span>
        </div>
        <div className="dp-card-title">{c.title}</div>
        <div className="dp-card-inst">
          <span className="dp-av">{c.inst.charAt(0)}</span>
          <span>{c.inst}</span>
        </div>
        <div className="dp-card-meta">
          {c.rating ? (
            <span className="dp-rate"><StarIcon /> {c.rating}</span>
          ) : null}
          {c.hours ? (
            <span><ClockIcon /> {c.hours}</span>
          ) : null}
          {c.sessions ? (
            <span><BookIcon /> {c.sessions}</span>
          ) : null}
          {c.students ? (
            <span><UsersIcon /> {c.students}</span>
          ) : null}
        </div>
        <div className="dp-card-foot">
          {c.free ? (
            <span className="dp-free">رایگان</span>
          ) : (
            <span className="dp-price">
              {c.old && <s>{c.old}</s>}
              <b>{c.price}</b>
            </span>
          )}
          <span
            className="dp-card-btn"
          >
            مشاهده
          </span>
        </div>
      </div>
    </Link>
  );
}

export function SkeletonDepartmentCourseCard({ rot = 0 }) {
  return (
    <div
      className="dp-card"
      aria-hidden="true"
      style={{
        "--rot": `rotate(${rot}deg)`,
        pointerEvents: "none",
      }}
    >
      <div className="dp-card-cover rk-skeleton-shimmer" style={{ background: "rgba(0,0,0,0.05)" }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(0,0,0,0.08)" }} />
      </div>
      <div className="dp-card-body">
        <div className="dp-card-top-row">
          <div className="rk-skeleton-line" style={{ width: "65px", height: "18px", borderRadius: "6px" }} />
          <div className="rk-skeleton-line" style={{ width: "70px", height: "18px", borderRadius: "6px" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBlock: "8px" }}>
          <div className="rk-skeleton-line" style={{ width: "85%", height: "20px" }} />
          <div className="rk-skeleton-line" style={{ width: "60%", height: "20px" }} />
        </div>
        <div className="dp-card-meta" style={{ marginTop: "auto", display: "flex", gap: "10px", marginBlock: "10px" }}>
          <div className="rk-skeleton-line" style={{ width: "40px", height: "14px" }} />
          <div className="rk-skeleton-line" style={{ width: "45px", height: "14px" }} />
          <div className="rk-skeleton-line" style={{ width: "45px", height: "14px" }} />
        </div>
        <div className="dp-card-foot" style={{ marginTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="rk-skeleton-line" style={{ width: "70px", height: "22px" }} />
          <div className="rk-skeleton-line" style={{ width: "80px", height: "32px", borderRadius: "8px" }} />
        </div>
      </div>
    </div>
  );
}

