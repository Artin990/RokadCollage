"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  RotateCw,
  BookOpen,
  Bookmark,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { getMyEnrollments } from "@/services/enrollmentService";
import { getAllCourses } from "@/services/courseService";
import { getPanelStore } from "@/data/panelStore";
import { isWishlisted } from "@/data/selectors";
import { useHorizontalDragScroll } from "@/legacy-pages/CoursesPage/hooks/useHorizontalDragScroll.js";
import MyCourseCard from "./components/MyCourseCard";
import SpotPlayerLicenseModal from "@/legacy-pages/CourseSingle/components/SpotPlayerLicenseModal";
import "@/legacy-pages/DepartmentPage/department.css";
import "./my-courses.css";

const MODE_OPTIONS = [
  { id: "all", label: "همه" },
  { id: "in-person", label: "حضوری" },
  { id: "online", label: "غیر حضوری" },
];

const SORTS = [
  { id: "default", label: "پیشفرض" },
  { id: "newest", label: "جدیدترین" },
  { id: "oldest", label: "قدیمی‌ترین" },
  { id: "title", label: "عنوان دوره" },
  { id: "price-low", label: "ارزان‌ترین" },
  { id: "price-high", label: "گران‌ترین" },
];

export default function MyCoursesClient() {
  const [enrollments, setEnrollments] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [store, setStore] = useState(getPanelStore);
  const [loading, setLoading] = useState(true);

  // فیلترها و مرتب‌سازی مخصوص بخش علاقه‌مندی‌ها
  const [modeFilter, setModeFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [sort, setSort] = useState("default");

  // وضعیت باز بودن مدال فیلتر
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  // اسلایدر افقی برای سکشن علاقه‌مندی‌ها
  const savedScroll = useHorizontalDragScroll();

  // لایسنس مودال اسپات‌پلیر
  const [licenseModal, setLicenseModal] = useState({
    isOpen: false,
    courseId: null,
    courseTitle: "",
  });

  useEffect(() => {
    const handleStoreChange = (e) => {
      setStore(e.detail || getPanelStore());
    };
    window.addEventListener("rokad_panel_store_changed", handleStoreChange);
    return () => window.removeEventListener("rokad_panel_store_changed", handleStoreChange);
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [enrollmentData, coursesData] = await Promise.all([
          getMyEnrollments().catch(() => []),
          getAllCourses().catch(() => []),
        ]);

        const rawList = Array.isArray(enrollmentData) ? enrollmentData : enrollmentData?.data || [];
        const validEnrollments = rawList.filter((item) => {
          if (!item || !item.course) return false;
          if (item.status === "failed" || item.status === "cancelled") return false;
          if (item.transactionId && item.transactionId.status === "failed") return false;
          return true;
        });

        setEnrollments(validEnrollments);
        setAllCourses(Array.isArray(coursesData) ? coursesData : []);
      } catch (err) {
        console.error("Failed to load my-courses data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // تفکیک دوره‌های خریداری‌شده و دوره‌های نشان‌شده
  const { enrolledItems, savedItems } = useMemo(() => {
    const enrolledMap = new Map();
    const enrolled = enrollments.map((e) => {
      const cId = String(e.course?._id || e.course?.id || "").trim();
      const cSlug = String(e.course?.slug || "").trim();
      if (cId) enrolledMap.set(cId, true);
      if (cSlug) enrolledMap.set(cSlug, true);

      return {
        ...e,
        isPurchased: true,
        purchaseStatus: "purchased",
        price: e.course?.price || 0,
      };
    });

    const saved = [];
    allCourses.forEach((c) => {
      const cId = String(c._id || c.id || "").trim();
      const cSlug = String(c.slug || "").trim();
      const isSaved = isWishlisted(cSlug, store) || isWishlisted(cId, store);

      if (isSaved && !enrolledMap.has(cId) && !enrolledMap.has(cSlug)) {
        saved.push({
          _id: c._id || c.id,
          isPurchased: false,
          purchaseStatus: "saved",
          course: c,
          createdAt: c.createdAt || new Date().toISOString(),
          status: "saved",
          price: c.price || 0,
        });
      }
    });

    return { enrolledItems: enrolled, savedItems: saved };
  }, [enrollments, allCourses, store]);

  // محاسبه آمار هیرو
  const stats = useMemo(() => {
    const total = enrolledItems.length + savedItems.length;
    const purchasedCount = enrolledItems.length;
    const savedCount = savedItems.length;
    let virtualCount = 0;
    let inPersonCount = 0;

    [...enrolledItems, ...savedItems].forEach((e) => {
      const isVirtual =
        e.courseModel === "VirtualCourse" ||
        e.course?.type === "مجازی" ||
        e.course?.type === "غیر حضوری" ||
        Boolean(e.spotplayer?.key) ||
        !e.session;
      if (isVirtual) virtualCount++;
      else inPersonCount++;
    });

    return {
      total,
      purchasedCount,
      savedCount,
      virtualCount,
      inPersonCount,
    };
  }, [enrolledItems, savedItems]);

  // دسته‌بندی‌های پویا برای دوره‌های نشان‌شده
  const deptOptions = useMemo(() => {
    const categories = new Set();
    savedItems.forEach((e) => {
      const c = e.course?.category || e.course?.department;
      if (c && typeof c === "string") categories.add(c.trim());
    });
    return [
      { id: "all", label: "همه دپارتمان‌ها" },
      ...Array.from(categories).map((cat) => ({ id: cat, label: cat })),
    ];
  }, [savedItems]);

  // فیلتر و مرتب‌سازی دوره‌های نشان‌شده
  const filteredSaved = useMemo(() => {
    let result = savedItems.filter((item) => {
      const course = item.course || {};
      const isVirtual =
        item.courseModel === "VirtualCourse" ||
        course.type === "مجازی" ||
        course.type === "غیر حضوری" ||
        Boolean(item.spotplayer?.key) ||
        !item.session;

      // فیلتر نحوه برگزاری
      if (modeFilter === "in-person" && isVirtual) return false;
      if (modeFilter === "online" && !isVirtual) return false;

      // فیلتر دپارتمان
      if (deptFilter !== "all") {
        const itemCat = (course.category || course.department || "").trim();
        if (itemCat !== deptFilter) return false;
      }

      return true;
    });

    // مرتب‌سازی
    if (sort === "newest") {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sort === "oldest") {
      result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    } else if (sort === "title") {
      result.sort((a, b) => (a.course?.title || "").localeCompare(b.course?.title || "", "fa"));
    } else if (sort === "price-low") {
      result.sort((a, b) => (Number(a.course?.price) || 0) - (Number(b.course?.price) || 0));
    } else if (sort === "price-high") {
      result.sort((a, b) => (Number(b.course?.price) || 0) - (Number(a.course?.price) || 0));
    }

    return result;
  }, [savedItems, modeFilter, deptFilter, sort]);

  // تعداد فیلترهای فعال بخش علاقه‌مندی‌ها
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (modeFilter !== "all") count++;
    if (deptFilter !== "all") count++;
    if (sort !== "default") count++;
    return count;
  }, [modeFilter, deptFilter, sort]);

  const resetFilters = () => {
    setModeFilter("all");
    setDeptFilter("all");
    setSort("default");
  };

  const handleOpenLicense = (courseId, courseTitle) => {
    setLicenseModal({
      isOpen: true,
      courseId,
      courseTitle,
    });
  };

  const handleCloseLicense = () => {
    setLicenseModal({
      isOpen: false,
      courseId: null,
      courseTitle: "",
    });
  };

  return (
    <div className="mc-page">
      {/* ========================================================
          HERO SECTION
          ======================================================== */}
      <header className="mc-hero">
        <img
          src="/assets/StatCard/yellow.png"
          alt=""
          aria-hidden="true"
          className="mc-hero-pattern"
        />

        <div className="mc-hero-inner">
          {/* بردکرامب */}
          <nav className="mc-crumb" aria-label="مسیر">
            <Link href="/">خانه</Link>
            <span className="sep">›</span>
            <span className="cur">دوره‌های من</span>
          </nav>

          {/* بج نشان وضعیت */}
          <div className="mc-badge">
            <span className="dot" />
            <span>مدیریت دوره‌ها</span>
          </div>

          {/* عنوان اصلی همراه با هایلایتر نئوبروتالیست */}
          <h1 className="mc-hero-title">
            دوره‌های من | <span className="mc-hero-accent">مسیر یادگیری و علاقه‌مندی‌ها</span>
          </h1>

          {/* نوار آمار (کل، خریداری‌شده، نشان‌شده‌ها، غیر حضوری) */}
          <div className="dp-hero-stats">
            <div className="dp-hstat">
              <b>{stats.total.toLocaleString("fa-IR")}</b>
              <span>مجموع دوره‌ها</span>
            </div>
            <div className="dp-hstat">
              <b>{stats.purchasedCount.toLocaleString("fa-IR")}</b>
              <span>خریداری‌شده</span>
            </div>
            <div className="dp-hstat">
              <b>{stats.savedCount.toLocaleString("fa-IR")}</b>
              <span>نشان‌شده‌ها</span>
            </div>
            <div className="dp-hstat">
              <b>{stats.virtualCount.toLocaleString("fa-IR")}</b>
              <span>غیر حضوری</span>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================
          MAIN CONTENT AREA
          ======================================================== */}
      <main className="mc-content-wrap">
        {/* وضعیت لودینگ */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-stone-500 font-bold">
            <RotateCw className="w-8 h-8 animate-spin text-[#f8a41d]" />
            <span>در حال بارگذاری دوره‌های شما...</span>
          </div>
        )}

        {!loading && (
          <>
            {/* ========================================================
                ۱. سکشن دوره‌های خریداری‌شده (مستقیم بدون هدر اضافه)
                ======================================================== */}
            <section className="mc-purchased-sec">
              {enrolledItems.length === 0 ? (
                <div className="mc-empty-box">
                  <div className="w-16 h-16 rounded-[14px_0_14px_0] bg-amber-50 text-amber-600 border-2 border-stone-900 shadow-[3px_3px_0_#292827] flex items-center justify-center">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-stone-900">
                    هنوز در دوره‌ای ثبت‌نام نکرده‌اید
                  </h3>
                  <Link
                    href="/courses"
                    className="mt-2 px-6 py-3 bg-[#f8a41d] hover:bg-[#e69415] text-stone-950 font-black text-sm border-2 border-stone-900 rounded-[10px_0_10px_0] shadow-[3.5px_3.5px_0_#292827]"
                  >
                    مشاهده دوره‌ها
                  </Link>
                </div>
              ) : (
                <div className="mc-grid">
                  {enrolledItems.map((item) => (
                    <MyCourseCard
                      key={item._id || item.course?._id || item.course?.slug}
                      item={item}
                      onOpenLicense={handleOpenLicense}
                      store={store}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* ========================================================
                ۲. سکشن جداگانه علاقه‌مندی‌ها (اسلایدر همراه فیلترها و آیکون)
                ======================================================== */}
            <section className="mc-saved-section" id="my-wishlist">
              <div className="mc-saved-head">
                <div className="mc-saved-title-wrap">
                  <span className="mc-saved-tag">
                    <Bookmark size={14} fill="currentColor" />
                    علاقه‌مندی‌ها
                  </span>
                  <h2 className="mc-saved-title">
                    دوره‌های نشان‌شده ({filteredSaved.length.toLocaleString("fa-IR")})
                  </h2>
                </div>

                <div className="mc-saved-controls">
                  {activeFilterCount > 0 && (
                    <div className="dp-active-topic-badge">
                      <span>{activeFilterCount.toLocaleString("fa-IR")} فیلتر فعال</span>
                      <button
                        type="button"
                        className="dp-active-topic-clear"
                        onClick={resetFilters}
                        aria-label="حذف فیلترها"
                      >
                        ×
                      </button>
                    </div>
                  )}

                  {/* دکمه فیلترها با آیکون مشابه دوره‌های معمولی */}
                  <button
                    type="button"
                    className="dp-filter-btn"
                    onClick={() => setFilterOpen(true)}
                    aria-haspopup="dialog"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <line x1="4" y1="7" x2="20" y2="7"></line>
                      <line x1="7" y1="12" x2="17" y2="12"></line>
                      <line x1="10" y1="17" x2="14" y2="17"></line>
                    </svg>
                    <span>فیلترها</span>
                    {activeFilterCount > 0 && (
                      <span className="dp-filter-count">
                        {activeFilterCount.toLocaleString("fa-IR")}
                      </span>
                    )}
                  </button>

                  {filteredSaved.length > 1 && (
                    <div className="mc-saved-nav-btns" aria-label="هدایت اسلاید علاقه‌مندی‌ها">
                      <button
                        type="button"
                        className="mc-saved-nav-btn"
                        disabled={!savedScroll.nav.prev}
                        onClick={() => savedScroll.scroll(false)}
                        aria-label="قبلی"
                        title="قبلی"
                      >
                        <ChevronRight size={18} strokeWidth={2.5} />
                      </button>
                      <button
                        type="button"
                        className="mc-saved-nav-btn"
                        disabled={!savedScroll.nav.next}
                        onClick={() => savedScroll.scroll(true)}
                        aria-label="بعدی"
                        title="بعدی"
                      >
                        <ChevronLeft size={18} strokeWidth={2.5} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {savedItems.length === 0 ? (
                <div className="mc-saved-empty">
                  <div className="mc-saved-empty-icon">
                    <Bookmark size={24} />
                  </div>
                  <p className="mc-saved-empty-text">
                    دوره‌ای در لیست علاقه‌مندی‌های شما قرار ندارد
                  </p>
                </div>
              ) : filteredSaved.length === 0 ? (
                <div className="mc-saved-empty">
                  <p className="mc-saved-empty-text">
                    دوره‌ای با این فیلترها پیدا نشد.
                  </p>
                  <button
                    type="button"
                    className="dp-reset"
                    onClick={resetFilters}
                    style={{ marginInlineStart: 8 }}
                  >
                    پاک کردن فیلترها
                  </button>
                </div>
              ) : (
                <div className="mc-saved-track-wrap">
                  <div className="mc-saved-track" ref={savedScroll.rowRef}>
                    {filteredSaved.map((item) => (
                      <MyCourseCard
                        key={item._id || item.course?._id || item.course?.slug}
                        item={item}
                        onOpenLicense={handleOpenLicense}
                        store={store}
                      />
                    ))}
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* ========================================================
          مدال فیلترهای دوره‌های نشان‌شده
          ======================================================== */}
      {filterOpen && (
        <div
          className="dp-filter-scrim"
          onClick={() => setFilterOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="فیلترها"
        >
          <div
            className="dp-filter-modal"
            ref={filterRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dp-sheet-handle" aria-hidden="true" />
            <div className="dp-filter-head">
              <div className="dp-filter-head-title">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" y1="7" x2="20" y2="7"></line>
                  <line x1="7" y1="12" x2="17" y2="12"></line>
                  <line x1="10" y1="17" x2="14" y2="17"></line>
                </svg>
                <span>فیلترهای علاقه‌مندی‌ها</span>
                {activeFilterCount > 0 && (
                  <span className="dp-filter-count">
                    {activeFilterCount.toLocaleString("fa-IR")}
                  </span>
                )}
              </div>
              <div className="dp-filter-actions">
                {activeFilterCount > 0 && (
                  <button type="button" className="dp-reset" onClick={resetFilters}>
                    پاک کردن همه
                  </button>
                )}
                <button
                  type="button"
                  className="dp-filter-close"
                  onClick={() => setFilterOpen(false)}
                  aria-label="بستن"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="dp-filter-body">
              {/* گروه دپارتمان و حوزه */}
              <div className="dp-fgroup">
                <div className="dp-fgroup-title">دپارتمان و حوزه</div>
                <div className="dp-segment">
                  {deptOptions.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      className={deptFilter === d.id ? "on" : ""}
                      onClick={() => setDeptFilter(d.id)}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* گروه ترتیب نمایش */}
              <div className="dp-fgroup">
                <div className="dp-fgroup-title">ترتیب نمایش</div>
                <div className="dp-segment">
                  {SORTS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={sort === s.id ? "on" : ""}
                      onClick={() => setSort(s.id)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* گروه نحوه برگزاری */}
              <div className="dp-fgroup">
                <div className="dp-fgroup-title">نحوه برگزاری</div>
                <div className="dp-segment">
                  {MODE_OPTIONS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      className={modeFilter === m.id ? "on" : ""}
                      onClick={() => setModeFilter(m.id)}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* مودال لایسنس اسپات‌پلیر */}
      <SpotPlayerLicenseModal
        isOpen={licenseModal.isOpen}
        onClose={handleCloseLicense}
        courseId={licenseModal.courseId}
        courseTitle={licenseModal.courseTitle}
      />
    </div>
  );
}
