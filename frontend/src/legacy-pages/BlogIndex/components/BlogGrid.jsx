"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Filter } from "lucide-react";
import { I, toFa } from "./BlogIcons.jsx";
import BlogCard, { SkeletonBlogIndexCard } from "./BlogCard.jsx";
import { PAGE_SIZE } from "../data/blogIndexData.js";
import { getBlogs } from "@/services/blogService.js";
import BlogFilterModal, { SORTS } from "./BlogFilterModal.jsx";
import { DEFAULT_CATEGORIES } from "./BlogCategories.jsx";

const ENTER_STAGGER = 60, ENTER_MS = 550, EXIT_STAGGER = 45, EXIT_MS = 420;

export default function BlogGrid({ activeCategory, setActiveCategory, searchQuery }) {
  const [blogsList, setBlogsList] = useState([]);
  const [allBlogsForCounts, setAllBlogsForCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [animState, setAnimState] = useState({ phase: "idle", fromIndex: 0 });
  const animTimers = useRef([]);

  // Fetch blogs for counts once
  useEffect(() => {
    let isMounted = true;
    getBlogs({ limit: 100 })
      .then((res) => {
        if (!isMounted) return;
        const list = Array.isArray(res) ? res : res.data || [];
        setAllBlogsForCounts(list);
      })
      .catch((err) => console.error("Failed to load blog list for counts:", err));
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch blogs based on activeCategory and searchQuery
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await getBlogs({
          category: activeCategory !== "all" ? activeCategory : undefined,
          search: searchQuery ? searchQuery.trim() : undefined,
        });
        const list = Array.isArray(res) ? res : res.data || [];
        setBlogsList(list);
      } catch (err) {
        console.error("Failed to load blogs from API:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [activeCategory, searchQuery]);

  const clearAnimTimers = () => {
    animTimers.current.forEach(clearTimeout);
    animTimers.current = [];
  };

  useEffect(() => clearAnimTimers, []);

  useEffect(() => {
    clearAnimTimers();
    setVisible(PAGE_SIZE);
    setAnimState({ phase: "idle", fromIndex: 0 });
  }, [activeCategory, searchQuery, sortBy]);

  // Calculate counts for categories
  const categoryCounts = {};
  allBlogsForCounts.forEach((b) => {
    if (b.category) {
      categoryCounts[b.category] = (categoryCounts[b.category] || 0) + 1;
    }
  });

  const activeFilterCount = (activeCategory !== "all" ? 1 : 0) + (sortBy !== "newest" ? 1 : 0);

  const sortedRaw = [...blogsList].sort((a, b) => {
    if (sortBy === "oldest") return (a.id || a._id) > (b.id || b._id) ? 1 : -1;
    if (sortBy === "popular") return (b.views || 0) - (a.views || 0);
    return 0; // default newest
  });

  const formattedPosts = sortedRaw.map((b, i) => ({
    id: b.id || b._id,
    title: b.title,
    excerpt: b.excerpt || b.headline || (b.content ? b.content.replace(/<[^>]+>/g, "").slice(0, 100) + "..." : ""),
    tag: b.category || "آموزش",
    tagColor: i % 2 === 0 ? "primary" : "secondary",
    author: b.author?.fullName || b.author?.name || "تحریریه کالج رکاد",
    readTime: b.readTime ? `${toFa(b.readTime)} دقیقه` : "۵ دقیقه",
    reads: `${toFa(b.views || 320)}`,
    date: b.createdAt ? new Date(b.createdAt).toLocaleDateString("fa-IR") : "به‌تازگی",
    size: i === 0 ? "lg" : "sm",
    slug: b.slug || b.id || b._id,
  }));

  const sorted = formattedPosts;
  const posts = sorted.slice(0, visible);
  const hasMore = visible < sorted.length;

  const loadMore = () => {
    if (animState.phase !== "idle" || !hasMore) return;
    const from = visible;
    const count = Math.min(PAGE_SIZE, sorted.length - from);
    setVisible((v) => v + PAGE_SIZE);
    setAnimState({ phase: "enter", fromIndex: from });
    animTimers.current.push(
      setTimeout(() => {
        setAnimState((s) => (s.phase === "enter" ? { phase: "idle", fromIndex: 0 } : s));
      }, (count - 1) * ENTER_STAGGER + ENTER_MS + 60)
    );
  };

  const collapseAll = () => {
    if (animState.phase !== "idle" || visible <= PAGE_SIZE) return;
    setAnimState({ phase: "exit", fromIndex: PAGE_SIZE });
    const EXIT_TOTAL = EXIT_MS + (visible - PAGE_SIZE - 1) * EXIT_STAGGER + 80;
    animTimers.current.push(
      setTimeout(() => {
        setVisible(PAGE_SIZE);
        setAnimState({ phase: "idle", fromIndex: 0 });
      }, EXIT_TOTAL)
    );
  };

  const currentCategoryLabel = DEFAULT_CATEGORIES.find((c) => c.id === activeCategory)?.label || activeCategory;
  const currentSortLabel = SORTS.find((s) => s.id === sortBy)?.label;

  return (
    <section className="bi-grid-sec" id="bi-results">
      <div className="container">
        <div className="bi-sec-head">
          <div className="flex items-center gap-3">
            <h2 className="bi-h2 m-0">
              <span style={{ display: "inline-block", transform: "rotate(-1deg)" }}>همه‌ی</span>{" "}
              <span className="bi-marker" style={{ transform: "rotate(1deg)" }}>مقاله‌ها</span>
            </h2>
            {activeCategory !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 border border-[#1f1e1d] text-xs font-bold rounded-lg shadow-xs">
                <span>دسته‌بندی: {currentCategoryLabel}</span>
                <button
                  type="button"
                  onClick={() => setActiveCategory && setActiveCategory("all")}
                  className="text-stone-500 hover:text-black font-black text-sm leading-none"
                  aria-label="حذف فیلتر دسته‌بندی"
                >
                  ×
                </button>
              </span>
            )}
            {sortBy !== "newest" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 border border-[#1f1e1d] text-xs font-bold rounded-lg shadow-xs">
                <span>ترتیب: {currentSortLabel}</span>
                <button
                  type="button"
                  onClick={() => setSortBy("newest")}
                  className="text-stone-500 hover:text-black font-black text-sm leading-none"
                  aria-label="ریست مرتب‌سازی"
                >
                  ×
                </button>
              </span>
            )}
          </div>

          {/* دکمهٔ باز کردن مودال فیلترها (شامل مرتب‌سازی و دسته‌بندی) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="dp-filter-btn"
              onClick={() => setFilterModalOpen(true)}
              aria-label="فیلترها"
            >
              <Filter size={14} />
              <span>فیلترها</span>
              {activeFilterCount > 0 && (
                <span className="dp-filter-count">{toFa(activeFilterCount)}</span>
              )}
            </button>
          </div>
        </div>

        {/* مودال فیلتر مقالات (موبایل و دسکتاپ) */}
        <BlogFilterModal
          isOpen={filterModalOpen}
          onClose={() => setFilterModalOpen(false)}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categoryCounts={categoryCounts}
          totalCount={allBlogsForCounts.length}
        />

        {loading ? (
          <div className="bi-blog-grid" aria-busy="true">
            <SkeletonBlogIndexCard size="lg" index={0} />
            <SkeletonBlogIndexCard size="sm" index={1} />
            <SkeletonBlogIndexCard size="sm" index={2} />
            <SkeletonBlogIndexCard size="sm" index={3} />
            <SkeletonBlogIndexCard size="sm" index={4} />
          </div>
        ) : sorted.length === 0 ? (
          <div style={{ textAlign: "center", color: "var(--ink-subtle)", fontWeight: 700, padding: "3rem 1rem" }}>
            <p style={{ fontSize: 16, margin: 0 }}>مقاله‌ای مطابق با جست‌وجوی شما پیدا نشد.</p>
            <p style={{ fontSize: 13, opacity: 0.8, marginTop: 6 }}>می‌توانید کلمهٔ دیگری را جست‌وجو کنید یا دسته‌بندی را تغییر دهید.</p>
          </div>
        ) : (
          <div className="bi-blog-grid">
            {posts.map((p, i) => (
              <BlogCard
                key={p.id}
                post={p}
                index={i}
                entering={animState.phase === "enter" && i >= animState.fromIndex}
                exiting={animState.phase === "exit" && i >= animState.fromIndex}
                animDelay={(i - animState.fromIndex) * (animState.phase === "exit" ? EXIT_STAGGER : ENTER_STAGGER)}
              />
            ))}
          </div>
        )}

        {(hasMore || visible > PAGE_SIZE) && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginTop: "3.5rem" }}>
            <div className="bi-loadmore">
              <div className="bi-loadmore-sh" />
              {hasMore ? (
                <button onClick={loadMore} disabled={animState.phase !== "idle"}>
                  {animState.phase === "enter" ? (
                    <>
                      در حال بارگذاری
                      <span className="bi-loadmore-dots" aria-hidden="true"><span>.</span><span>.</span><span>.</span></span>
                    </>
                  ) : (
                    <>
                      مقاله‌های بیشتر
                      <span className="bi-loadmore-num">{toFa(sorted.length - visible)}</span>
                    </>
                  )}
                </button>
              ) : (
                <button className="bi-loadmore-close" onClick={collapseAll} disabled={animState.phase !== "idle"}>
                  {animState.phase === "exit" ? (
                    "در حال بستن…"
                  ) : (
                    <>
                      بستن مقاله‌ها <I.X style={{ width: 16, height: 16 }} />
                    </>
                  )}
                </button>
              )}
            </div>
            {!hasMore && animState.phase !== "exit" && (
              <p className="bi-loadmore-end" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <Sparkles size={16} />
                <span>به آخر لیست رسیدی! مقاله جدید به‌زودی اضافه می‌شه.</span>
              </p>
            )}
          </div>
        )}

        <div className="bi-divider" aria-hidden="true">
          <span className="line" />
          <span className="glyph">✦</span>
          <span className="line" />
        </div>
      </div>
    </section>
  );
}
