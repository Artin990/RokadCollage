import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bookmark, Star, Clock, Users, ArrowLeft, BookmarkCheck } from "lucide-react";
import { DEPT_ICONS, CourseModeBadge, CourseSaveButton } from "./CourseCardComponents.jsx";

export default function SavedCoursesSection({ savedCourses = [], store }) {
  const [idx, setIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [step, setStep] = useState(0);
  const [dragDx, setDragDx] = useState(null);
  const carRef = useRef(null);
  const trackRef = useRef(null);
  const dragRef = useRef(null);

  const total = savedCourses.length;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const maxIndex = isMobile ? Math.max(0, total - 1) : 0;
  const dragging = dragDx !== null;

  useEffect(() => {
    if (!isMobile) {
      setIdx(0);
      return;
    }
    const measure = () => {
      const track = trackRef.current;
      const card = track?.firstElementChild;
      if (!track || !card) return;
      const g = parseFloat(window.getComputedStyle(track).gap) || 16;
      setStep(card.offsetWidth + g);
    };
    measure();
    window.addEventListener("resize", measure);
    const t = setTimeout(measure, 300);
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, [isMobile, total]);

  useEffect(() => {
    if (idx > maxIndex) {
      setIdx(Math.max(0, maxIndex));
    }
  }, [maxIndex, idx]);

  const goTo = (i) => setIdx(Math.max(0, Math.min(i, maxIndex)));

  const onPointerDown = (e) => {
    if (!isMobile) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragRef.current = { id: e.pointerId, startX: e.clientX, dx: 0 };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
    setDragDx(0);
  };

  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d || e.pointerId !== d.id) return;
    d.dx = e.clientX - d.startX;
    setDragDx(d.dx);
  };

  const endDrag = (e) => {
    const d = dragRef.current;
    if (!d) return;
    dragRef.current = null;
    try {
      e.currentTarget.releasePointerCapture?.(d.id);
    } catch {
      /* noop */
    }
    setDragDx(null);
    if (Math.abs(d.dx) > 50) {
      if (d.dx > 0) goTo(idx + 1);
      else goTo(idx - 1);
    }
  };

  const rawShift = idx * step + (dragging ? dragDx : 0);
  const shift = Math.max(0, Math.min(rawShift, maxIndex * step));

  return (
    <section className="ch-sec ch-saved-sec" id="saved-courses">
      <div className="ch-sec-head">
        <div className="ch-sec-title-wrap">
          <span className="ch-sec-tag ch-saved-tag">
            <Bookmark size={13} fill="currentColor" strokeWidth={2.4} />
            ذخیره‌شده‌ها
          </span>
          <h2 className="ch-sec-title">دوره‌های نشان‌شده</h2>
        </div>
        {total > 0 && (
          <span className="ch-saved-count-pill">
            <BookmarkCheck size={14} />
            {Number(total).toLocaleString("fa-IR")} دوره
          </span>
        )}
      </div>

      {total === 0 ? (
        <div className="ch-saved-empty">
          <div className="ch-saved-empty-icon">
            <Bookmark size={24} strokeWidth={2} />
          </div>
          <p className="ch-saved-empty-text">دوره‌ای نشان نشده است</p>
        </div>
      ) : (
        <>
          <div
            className={`ch-courses-carousel-wrap${dragging ? " dragging" : ""}`}
            ref={carRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <div
              className="ch-grid-3"
              ref={trackRef}
              style={
                isMobile
                  ? {
                      transform: `translateX(${shift}px)`,
                      transition: dragging ? "none" : undefined,
                    }
                  : undefined
              }
            >
              {savedCourses.map((c) => {
                const DeptIcon = DEPT_ICONS[c.deptId] || Star;
                return (
                  <Link
                    key={c.id || c.slug}
                    href={`/courses/${c.slug}`}
                    className="ch-card"
                    data-dept={c.deptId}
                  >
                    <div className="ch-card-cover" style={{ background: c.badgeBg }}>
                      <img src={c.pattern} alt="" className="ch-cover-pat" aria-hidden="true" />
                      <span className={`ch-card-tag ${c.tagType || "hot"}`}>{c.tag}</span>
                      <CourseSaveButton slug={c.slug} store={store} />
                      <DeptIcon size={34} style={{ color: c.badgeColor, position: "relative", zIndex: 1 }} />
                    </div>

                    <div className="ch-card-body">
                      <div className="ch-card-badges-row">
                        <span
                          className="ch-card-dept-badge"
                          style={{ background: c.badgeBg, color: c.badgeColor }}
                        >
                          {c.cat}
                        </span>
                        <CourseModeBadge mode={c.mode} />
                      </div>

                      <h3 className="ch-card-title">{c.title}</h3>

                      <div className="ch-card-inst">
                        <span className="ch-card-av">{c.inst?.charAt(0) || "ا"}</span>
                        <span>مدرس: {c.inst}</span>
                      </div>

                      <div className="ch-card-meta">
                        <span className="ch-card-meta-item ch-rate">
                          <Star size={13} fill="#f5a623" color="#f5a623" />
                          {c.rating}
                        </span>
                        <span className="ch-card-meta-item">
                          <Clock size={13} />
                          {c.hours}
                        </span>
                        <span className="ch-card-meta-item">
                          <Users size={13} />
                          {c.students}
                        </span>
                      </div>

                      <div className="ch-card-foot">
                        <div className="ch-card-price">
                          {c.old && <s>{c.old}</s>}
                          <b>{c.price}</b>
                        </div>
                        <span className="ch-card-btn">
                          <span>مشاهده</span>
                          <ArrowLeft size={13} />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {isMobile && total > 1 && (
            <div className="ch-mobile-dots">
              <div className="cmt3-dots">
                {Array.from({ length: total }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`cmt3-dot${i === idx ? " active" : ""}`}
                    aria-label={`اسلاید ${i + 1}`}
                    onClick={() => goTo(i)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
