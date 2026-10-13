"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  RotateCw,
  BookOpen,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Search,
} from "lucide-react";
import { getMyEnrollments } from "@/services/enrollmentService";
import { getPanelStore } from "@/data/panelStore";
import MyCourseCard from "./components/MyCourseCard";
import SpotPlayerLicenseModal from "@/legacy-pages/CourseSingle/components/SpotPlayerLicenseModal";
import "./my-courses.css";

const STATUS_FILTERS = [
  { id: "all", label: "همه دوره‌ها" },
  { id: "active", label: "در حال یادگیری" },
  { id: "recent", label: "تازه‌ها" },
  { id: "completed", label: "تکمیل‌شده" },
];

const DEPT_FILTERS = [
  { id: "all", label: "همه حوزه‌ها" },
  { id: "it", label: "فناوری اطلاعات" },
  { id: "business", label: "کسب‌وکار" },
  { id: "languages", label: "زبان‌های خارجی" },
];

export default function MyCoursesClient() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // لایسنس مودال اسپات‌پلیر
  const [licenseModal, setLicenseModal] = useState({
    isOpen: false,
    courseId: null,
    courseTitle: "",
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getMyEnrollments();
        const list = Array.isArray(data) ? data : data?.data || [];

        // Fallback to local panel store if backend has no active enrollments
        if (list.length === 0) {
          const store = getPanelStore();
          if (store?.myCourses?.length > 0) {
            const fallbackList = store.myCourses.map((mc, idx) => ({
              _id: mc.id || mc._id || `mc_${idx}`,
              createdAt: mc.enrolledAt || new Date().toISOString(),
              course: {
                _id: mc.id || mc._id || `course_${idx}`,
                title: mc.title,
                slug: mc.slug,
                type: mc.type || "مجازی",
                duration: mc.sessions || "۴۰ ساعت",
                category: mc.category || (idx % 2 === 0 ? "فناوری اطلاعات" : "کسب‌وکار"),
                instructor: mc.inst || "اساتید کالج رکاد",
              },
              spotplayer: {
                key: "0001testps7e9xn2s88okxumc4qgiROKAD",
                downloadUrl: "https://dl.spotplayer.ir/player_access/",
                status: "issued",
              },
            }));
            setEnrollments(fallbackList);
            return;
          }
        }
        setEnrollments(list);
      } catch (err) {
        console.error("Failed to load enrollments:", err);
        const store = getPanelStore();
        if (store?.myCourses?.length > 0) {
          const fallbackList = store.myCourses.map((mc, idx) => ({
            _id: mc.id || mc._id || `mc_${idx}`,
            createdAt: mc.enrolledAt || new Date().toISOString(),
            course: {
              _id: mc.id || mc._id || `course_${idx}`,
              title: mc.title,
              slug: mc.slug,
              type: mc.type || "مجازی",
              duration: mc.sessions || "۴۰ ساعت",
              category: mc.category || "فناوری اطلاعات",
              instructor: mc.inst || "اساتید کالج رکاد",
            },
          }));
          setEnrollments(fallbackList);
        }
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

  // فیلتر دوره‌ها
  const filteredCourses = useMemo(() => {
    return enrollments.filter((item) => {
      const course = item.course || {};
      const title = (course.title || "").toLowerCase();
      const instructor = (course.instructor || "").toLowerCase();
      const cat = (course.category || course.dept || "").toLowerCase();

      // جستجو
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        if (!title.includes(q) && !instructor.includes(q)) {
          return false;
        }
      }

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
  }, [enrollments, statusFilter, deptFilter, searchQuery]);

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
          src="/assets/StatCard/blue.png"
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
            <span>دوره‌های فعال و در حال یادگیری</span>
          </div>

          {/* عنوان اصلی همراه با هایلایتر نئوبروتالیست */}
          <h1 className="mc-hero-title">
            دوره‌های من | <span className="mc-hero-accent">مسیر رشد تخصصی شما</span>
          </h1>

          {/* نوار آمار (دوره‌های من، تکمیل شده، نوع دسترسی) */}
          <div className="mc-hero-stats">
            <div className="mc-hstat">
              <b>{stats.total.toLocaleString("fa-IR")}</b>
              <span>دوره‌های ثبت‌نام‌شده</span>
            </div>
            <div className="mc-hstat">
              <b>{stats.virtualCount.toLocaleString("fa-IR")}</b>
              <span>مجازی و اسپات‌پلیر</span>
            </div>
            <div className="mc-hstat">
              <b>{stats.inPersonCount.toLocaleString("fa-IR")}</b>
              <span>کارگاه حضوری</span>
            </div>
            <div className="mc-hstat">
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
        {/* نوار فیلترها (بدون سوئیچرهای اضافه تب) */}
        <div className="mc-filter-bar">
          {/* فیلترهای وضعیت */}
          <div className="mc-filter-group">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`mc-filter-btn ${statusFilter === f.id ? "active" : ""}`}
                onClick={() => setStatusFilter(f.id)}
              >
                <span>{f.label}</span>
                {f.id === "all" && (
                  <span className="mc-filter-badge">{enrollments.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* فیلترهای دپارتمان و حوزه */}
          <div className="mc-filter-group">
            {DEPT_FILTERS.map((d) => (
              <button
                key={d.id}
                type="button"
                className={`mc-filter-btn ${deptFilter === d.id ? "active" : ""}`}
                onClick={() => setDeptFilter(d.id)}
              >
                <span>{d.label}</span>
              </button>
            ))}
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
                : "دوره‌ای با این فیلتر یافت نشد"}
            </h3>
            <Link
              href="/courses"
              className="mt-2 px-6 py-3 bg-[#f8a41d] hover:bg-[#e69415] text-stone-950 font-black text-sm border-2 border-stone-900 rounded-[10px_0_10px_0] shadow-[3.5px_3.5px_0_#292827] transition-transform active:translate-x-0.5 active:translate-y-0.5"
            >
              مشاهده دوره‌ها
            </Link>
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
