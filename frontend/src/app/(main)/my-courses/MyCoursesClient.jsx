"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { RotateCw, BookOpen } from "lucide-react";
import { getMyEnrollments } from "@/services/enrollmentService";
import MyCourseCard from "./components/MyCourseCard";
import SpotPlayerLicenseModal from "@/legacy-pages/CourseSingle/components/SpotPlayerLicenseModal";
import "@/legacy-pages/DepartmentPage/department.css";
import "./my-courses.css";

const MODE_OPTIONS = [
  { id: "all", label: "همه" },
  { id: "in-person", label: "حضوری" },
  { id: "online", label: "غیر حضوری" },
];

const STATUS_OPTIONS = [
  { id: "all", label: "همه" },
  { id: "active", label: "در حال یادگیری" },
  { id: "recent", label: "تازه‌ها" },
  { id: "completed", label: "تکمیل‌شده" },
];

const DEPT_OPTIONS = [
  { id: "all", label: "همه حوزه‌ها" },
  { id: "it", label: "فناوری اطلاعات" },
  { id: "business", label: "کسب‌وکار" },
  { id: "languages", label: "زبان‌ها" },
];

const SORTS = [
  { id: "default", label: "پیشفرض" },
  { id: "newest", label: "جدیدترین" },
  { id: "oldest", label: "قدیمی‌ترین" },
  { id: "title", label: "عنوان دوره" },
];

export default function MyCoursesClient() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  // فیلترها و مرتب‌سازی
  const [modeFilter, setModeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [sort, setSort] = useState("default");

  // وضعیت باز بودن منو و مدال
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const sortRef = useRef(null);
  const filterRef = useRef(null);

  // لایسنس مودال اسپات‌پلیر
  const [licenseModal, setLicenseModal] = useState({
    isOpen: false,
    courseId: null,
    courseTitle: "",
  });

  // بستن دراپ‌داون سورت هنگام کلیک در بیرون
  useEffect(() => {
    function handleClickOutside(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getMyEnrollments();
        const rawList = Array.isArray(data) ? data : data?.data || [];

        // Exclude failed/cancelled enrollments, failed payments, and courses without an active license
        const validList = rawList.filter((item) => {
          if (!item || !item.course) return false;
          if (item.status === "failed" || item.status === "cancelled") return false;
          if (item.transactionId && item.transactionId.status === "failed") return false;

          // Only courses with an active license should appear
          const hasActiveLicense = Boolean(
            item.spotplayer?.key || (item.spotplayer?.licenseId && item.spotplayer?.status === "issued")
          );
          if (!hasActiveLicense || item.spotplayer?.status === "failed") {
            return false;
          }

          return true;
        });

        setEnrollments(validList);
      } catch (err) {
        console.error("Failed to load enrollments:", err);
        setEnrollments([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // محاسبه آمار هیرو
  const stats = useMemo(() => {
    const total = enrollments.length;
    let virtualCount = 0;
    let inPersonCount = 0;
    let completedCount = 0;

    enrollments.forEach((e) => {
      const isVirtual =
        e.courseModel === "VirtualCourse" ||
        e.course?.type === "مجازی" ||
        e.course?.type === "غیر حضوری" ||
        Boolean(e.spotplayer?.key) ||
        !e.session;
      if (isVirtual) virtualCount++;
      else inPersonCount++;

      if (e.status === "completed" || e.progress === 100) {
        completedCount++;
      }
    });

    return {
      total,
      virtualCount,
      inPersonCount,
      completedCount,
    };
  }, [enrollments]);

  // محاسبه تعداد فیلترهای فعال
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (modeFilter !== "all") count++;
    if (statusFilter !== "all") count++;
    if (deptFilter !== "all") count++;
    return count;
  }, [modeFilter, statusFilter, deptFilter]);

  // پاک کردن همه فیلترها
  const resetFilters = () => {
    setModeFilter("all");
    setStatusFilter("all");
    setDeptFilter("all");
    setSort("default");
  };

  // فیلتر و مرتب‌سازی دوره‌ها
  const filteredCourses = useMemo(() => {
    let result = enrollments.filter((item) => {
      const course = item.course || {};
      const title = (course.title || "").toLowerCase();
      const cat = (course.category || course.dept || "").toLowerCase();
      const isVirtual =
        item.courseModel === "VirtualCourse" ||
        course.type === "مجازی" ||
        course.type === "غیر حضوری" ||
        Boolean(item.spotplayer?.key) ||
        !item.session;

      // فیلتر نحوه برگزاری (حضوری / غیر حضوری)
      if (modeFilter === "in-person" && isVirtual) return false;
      if (modeFilter === "online" && !isVirtual) return false;

      // فیلتر وضعیت
      if (statusFilter === "completed") {
        if (item.status !== "completed" && item.progress !== 100) return false;
      } else if (statusFilter === "active") {
        if (item.status === "completed" || item.progress === 100) return false;
      } else if (statusFilter === "recent") {
        const itemDate = new Date(item.createdAt || 0).getTime();
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        if (itemDate < thirtyDaysAgo && enrollments.indexOf(item) > 2) return false;
      }

      // فیلتر دپارتمان
      if (deptFilter !== "all") {
        if (deptFilter === "it") {
          const isIt =
            cat.includes("it") ||
            cat.includes("فناوری") ||
            cat.includes("وب") ||
            title.includes("وردپرس") ||
            title.includes("سئو") ||
            title.includes("ui/ux") ||
            title.includes("پایتون");
          if (!isIt) return false;
        } else if (deptFilter === "business") {
          const isBiz =
            cat.includes("business") ||
            cat.includes("کسب") ||
            cat.includes("مارکتینگ") ||
            cat.includes("مدیریت") ||
            title.includes("فروش");
          if (!isBiz) return false;
        } else if (deptFilter === "languages") {
          const isLang = cat.includes("lang") || cat.includes("زبان") || title.includes("انگلیسی");
          if (!isLang) return false;
        }
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
    }

    return result;
  }, [enrollments, modeFilter, statusFilter, deptFilter, sort]);

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
          HERO SECTION (دقیقاً مشابه تک‌صفحه دپارتمان‌ها)
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
            <span>دوره‌های فعال</span>
          </div>

          {/* عنوان اصلی همراه با هایلایتر نئوبروتالیست */}
          <h1 className="mc-hero-title">
            دوره‌های من | <span className="mc-hero-accent">مسیر رشد تخصصی شما</span>
          </h1>

          {/* نوار آمار (دوره‌های من، غیر حضوری، کارگاه حضوری، تکمیل شده) */}
          <div className="dp-hero-stats">
            <div className="dp-hstat">
              <b>{stats.total.toLocaleString("fa-IR")}</b>
              <span>دوره‌های ثبت‌نام‌شده</span>
            </div>
            <div className="dp-hstat">
              <b>{stats.virtualCount.toLocaleString("fa-IR")}</b>
              <span>غیر حضوری</span>
            </div>
            <div className="dp-hstat">
              <b>{stats.inPersonCount.toLocaleString("fa-IR")}</b>
              <span>کارگاه حضوری</span>
            </div>
            <div className="dp-hstat">
              <b>{stats.completedCount.toLocaleString("fa-IR")}</b>
              <span>تکمیل‌شده</span>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================
          MAIN CONTENT AREA
          ======================================================== */}
      <main className="mc-content-wrap">
        {/* نوار فیلتر و مرتب‌سازی دقیقاً منطبق با استایل دپارتمان (dp-toolbar) */}
        <div className="dp-toolbar">
          <div className="dp-toolbar-start">
            <div className="dp-count">
              <b>{filteredCourses.length.toLocaleString("fa-IR")}</b> دوره
            </div>
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
          </div>

          <div className="dp-tools">
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

            <div className="dp-sort" ref={sortRef}>
              <span className="dp-sort-lab">ترتیب:</span>
              <button
                type="button"
                className="dp-sort-btn"
                onClick={() => setSortOpen((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
              >
                {SORTS.find((s) => s.id === sort)?.label} <span className="caret">▼</span>
              </button>

              {sortOpen && (
                <ul className="dp-sort-menu" role="listbox">
                  {SORTS.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={sort === s.id}
                        className={sort === s.id ? "active" : ""}
                        onClick={() => {
                          setSort(s.id);
                          setSortOpen(false);
                        }}
                      >
                        {s.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* وضعیت لودینگ */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-stone-500 font-bold">
            <RotateCw className="w-8 h-8 animate-spin text-[#f8a41d]" />
            <span>در حال بارگذاری دوره‌های شما...</span>
          </div>
        )}

        {/* لیست خالی */}
        {!loading && filteredCourses.length === 0 && (
          <div className="mc-empty-box">
            <div className="w-16 h-16 rounded-[14px_0_14px_0] bg-amber-50 text-amber-600 border-2 border-stone-900 shadow-[3px_3px_0_#292827] flex items-center justify-center">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-stone-900">
              {enrollments.length === 0
                ? "هنوز در دوره‌ای ثبت‌نام نکرده‌اید"
                : "دوره‌ای با این فیلترها یافت نشد"}
            </h3>
            {activeFilterCount > 0 ? (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-2 px-6 py-2.5 bg-white hover:bg-stone-50 text-stone-950 font-black text-xs border-2 border-stone-900 rounded-[10px_0_10px_0] shadow-[2.5px_2.5px_0_#292827]"
              >
                پاک کردن فیلترها
              </button>
            ) : (
              <Link
                href="/courses"
                className="mt-2 px-6 py-3 bg-[#f8a41d] hover:bg-[#e69415] text-stone-950 font-black text-sm border-2 border-stone-900 rounded-[10px_0_10px_0] shadow-[3.5px_3.5px_0_#292827] transition-transform active:translate-x-0.5 active:translate-y-0.5"
              >
                مشاهده دوره‌ها
              </Link>
            )}
          </div>
        )}

        {/* گرید دوره‌ها (۳ کارت در هر ردیف) */}
        {!loading && filteredCourses.length > 0 && (
          <div className="mc-grid">
            {filteredCourses.map((item) => (
              <MyCourseCard
                key={item._id || item.course?._id}
                item={item}
                onOpenLicense={handleOpenLicense}
              />
            ))}
          </div>
        )}
      </main>

      {/* ========================================================
          مدال فیلترهای دوره‌ها (مشابه DepartmentFilterModal)
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
                <span>فیلترهای دوره‌ها</span>
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

              {/* گروه وضعیت دوره */}
              <div className="dp-fgroup">
                <div className="dp-fgroup-title">وضعیت دوره</div>
                <div className="dp-segment">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={statusFilter === s.id ? "on" : ""}
                      onClick={() => setStatusFilter(s.id)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* گروه دپارتمان و حوزه */}
              <div className="dp-fgroup">
                <div className="dp-fgroup-title">دپارتمان و حوزه</div>
                <div className="dp-segment">
                  {DEPT_OPTIONS.map((d) => (
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
