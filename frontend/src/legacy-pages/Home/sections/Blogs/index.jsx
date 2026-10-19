/* V3: Editorial Magazine connected to API */
"use client";

import React, { useEffect, useRef, useState } from "react";
import PatternLayer from "@/components/PatternLayer";
import { getBlogs } from "@/services/blogService.js";
import Link from "next/link";

function SkeletonBlogCard({ index = 0 }) {
  return (
    <article className="mag-card" aria-hidden="true">
      <div className="shadow" />
      <div className="body">
        <div
          className="cover rk-skeleton-shimmer"
          style={{
            background:
              index % 2 === 0
                ? "linear-gradient(135deg, rgba(230,126,34,0.35), rgba(211,84,0,0.45))"
                : "linear-gradient(135deg, rgba(41,128,185,0.35), rgba(26,74,107,0.45))",
          }}
        >
          <div className="num" style={{ opacity: 0.7 }}>
            ۰{index + 1}
          </div>
          <div className="glyph-lg" style={{ opacity: 0.2 }}>
            ✦
          </div>
        </div>
        <div className="info" style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "20px 24px" }}>
          <div className="cat-row">
            <div className="rk-skeleton-line" style={{ width: "65px", height: "24px", borderRadius: "8px 0 8px 0" }} />
            <div className="rk-skeleton-line" style={{ width: "50px", height: "14px" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBlock: "4px" }}>
            <div className="rk-skeleton-line" style={{ width: "95%", height: "20px" }} />
            <div className="rk-skeleton-line" style={{ width: "70%", height: "20px" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div className="rk-skeleton-line" style={{ width: "90%", height: "14px" }} />
            <div className="rk-skeleton-line" style={{ width: "60%", height: "14px" }} />
          </div>
          <div className="foot" style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="author-mini" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div className="dot rk-skeleton-shimmer" style={{ width: "24px", height: "24px", borderRadius: "50%" }} />
              <div className="rk-skeleton-line" style={{ width: "80px", height: "12px" }} />
            </div>
            <div className="rk-skeleton-line" style={{ width: "60px", height: "24px", borderRadius: "6px" }} />
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Blogs() {
  const [blogsList, setBlogsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [step, setStep] = useState(0);
  const [dragDx, setDragDx] = useState(null);
  const carRef = useRef(null);
  const trackRef = useRef(null);
  const timerRef = useRef(null);
  const dragRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getBlogs({ limit: 6 });
        const list = Array.isArray(res) ? res : res.data || [];
        setBlogsList(list);
      } catch (err) {
        console.error("Failed to load blogs from API:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalArticles = blogsList.length;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 720px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const maxIndex = isMobile ? Math.max(0, totalArticles - 1) : 0;
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
      const g = parseFloat(window.getComputedStyle(track).columnGap) || 0;
      setStep(card.offsetWidth + g);
    };
    measure();
    window.addEventListener("resize", measure);
    const t = setTimeout(measure, 300);
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, [isMobile, blogsList]);

  useEffect(() => {
    if (!isMobile || totalArticles === 0) return;
    const start = () => {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        if (!dragRef.current) setIdx((i) => (i >= maxIndex ? 0 : i + 1));
      }, 4000);
    };
    start();
    const el = carRef.current;
    const enter = () => clearInterval(timerRef.current);
    const leave = () => start();
    el?.addEventListener("mouseenter", enter);
    el?.addEventListener("mouseleave", leave);
    return () => {
      clearInterval(timerRef.current);
      el?.removeEventListener("mouseenter", enter);
      el?.removeEventListener("mouseleave", leave);
    };
  }, [isMobile, maxIndex, totalArticles]);

  const onPointerDown = (e) => {
    if (!isMobile) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragRef.current = { id: e.pointerId, startX: e.clientX, dx: 0 };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    setDragDx(0);
  };

  const onPointerMove = (e) => {
    if (!dragRef.current || dragRef.current.id !== e.pointerId) return;
    const dx = e.clientX - dragRef.current.startX;
    dragRef.current.dx = dx;
    setDragDx(dx);
  };

  const endDrag = (e) => {
    if (!dragRef.current || dragRef.current.id !== e.pointerId) return;
    const dx = dragRef.current.dx;
    dragRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    setDragDx(null);
    const threshold = 40;
    if (dx > threshold) {
      setIdx((i) => Math.min(maxIndex, i + 1));
    } else if (dx < -threshold) {
      setIdx((i) => Math.max(0, i - 1));
    }
  };

  const shift = isMobile ? idx * step + (dragDx || 0) : 0;

  return (
    <section className="section mag-section" id="blog">
      <PatternLayer />
      <div className="container">
        <div className="mag-head">
          <div className="left">
            <h2 className="mag-title">
              <span className="w w2">بینش‌ها</span>
              <span className="w w3">و تجربه‌ها</span>
            </h2>
            <p className="mag-desc" style={{ color: "var(--ink-subtle)", fontWeight: 500 }}>
              مقاله‌های دست‌اول از مدیران و مدرسین کالج برای تسلط بر مهارت‌های روز
            </p>
          </div>

          <div className="right">
            <Link href="/blog" className="mag-btn">
              <span className="mag-btn-text">مشاهده مقالات</span>
              <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="mag-carousel-wrap" aria-busy="true">
            <div className="mag-grid">
              <SkeletonBlogCard index={0} />
              <SkeletonBlogCard index={1} />
            </div>
          </div>
        ) : blogsList.length === 0 ? (
          <div className="text-center py-12 text-stone-500 font-bold">هنوز مقاله‌ای منتشر نشده است.</div>
        ) : (
          <div
            className={`mag-carousel-wrap${dragging ? " dragging" : ""}`}
            ref={carRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <div
              className="mag-grid"
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
              {blogsList.map((a, i) => {
                const articleSlug = a.slug || a._id;
                return (
                  <article className="mag-card" key={a._id || i}>
                    <div className="shadow" />
                    <div className="body">
                      <div className="cover">
                        <span className="num">۰{i + 1}</span>
                        <span className="glyph-lg">✦</span>
                      </div>
                      <div className="info">
                        <div className="cat-row">
                          <span className="cat">{a.category || "مقاله"}</span>
                          <span className="read-time">{a.readTime || "۵ دقیقه"}</span>
                        </div>
                        <h3>
                          <Link href={`/blog/${articleSlug}`}>
                            {a.title}
                          </Link>
                        </h3>
                        <p>{a.description}</p>
                        <div className="foot">
                          <div className="author-mini">
                            <span className="dot">ر</span>
                            <span>تحریریه کالج رکاد</span>
                          </div>
                          <Link href={`/blog/${articleSlug}`} className="go">
                            مطالعه
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
                              <path d="M15 6l-6 6 6 6" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
