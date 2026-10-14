import React, { useState, useEffect } from "react";
import Link from "next/link";
import "./courses-hub.css";
import { getPanelStore } from "@/data/panelStore.js";
import { isWishlisted } from "@/data/selectors.js";
import { getAllCourses } from "@/services/courseService.js";
import { getTeachers } from "@/services/teacherService.js";
import { useHorizontalDragScroll } from "./hooks/useHorizontalDragScroll.js";
import CoursesHubHero from "./components/CoursesHubHero.jsx";
import FlagshipSection from "./components/FlagshipSection.jsx";
import SuggestedGroupSection from "./components/SuggestedGroupSection.jsx";
import InstructorsSection from "./components/InstructorsSection.jsx";
import { CourseModeBadge, CourseSaveButton } from "./components/CourseCardComponents.jsx";
import { Code, Briefcase, Globe, Sparkles, Bookmark, Star, Clock, Users, ArrowLeft } from "lucide-react";

const DEPT_CONFIG = {
  "فناوری اطلاعات": {
    deptId: "it",
    deptName: "فناوری اطلاعات",
    badgeColor: "var(--navy-alt)",
    badgeBg: "var(--male-light)",
    pattern: "/assets/StatCard/blue.png",
    icon: Code,
    themeClass: "flag-it",
    badge: "دپارتمان فناوری اطلاعات",
  },
  "کسب و کار": {
    deptId: "business",
    deptName: "کسب و کار",
    badgeColor: "var(--college-darker)",
    badgeBg: "var(--college-light)",
    pattern: "/assets/StatCard/yellow.png",
    icon: Briefcase,
    themeClass: "flag-business",
    badge: "دپارتمان کسب و کار",
  },
  "زبان‌های خارجی": {
    deptId: "languages",
    deptName: "زبان‌های خارجی",
    badgeColor: "var(--olive)",
    badgeBg: "var(--green-light)",
    pattern: "/assets/StatCard/green.png",
    icon: Globe,
    themeClass: "flag-languages",
    badge: "دپارتمان زبان‌های خارجی",
  },
  "مشاوره": {
    deptId: "counseling",
    deptName: "مشاوره",
    badgeColor: "var(--female-dark)",
    badgeBg: "var(--female-light)",
    pattern: "/assets/StatCard/pink.png",
    icon: Sparkles,
    themeClass: "flag-female",
    badge: "دپارتمان مشاوره",
  },
};

export default function CoursesPage() {
  const [store, setStore] = useState(getPanelStore);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const instScroll = useHorizontalDragScroll();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("saved") === "true") {
        setShowSavedOnly(true);
      }
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [coursesData, teachersData] = await Promise.all([
          getAllCourses().catch(() => []),
          getTeachers().catch(() => []),
        ]);
        setCourses(Array.isArray(coursesData) ? coursesData : []);
        setInstructors(Array.isArray(teachersData) ? teachersData : []);
      } catch (err) {
        console.error("Failed to load courses or instructors:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const handleStoreChange = (e) => {
      setStore(e.detail || getPanelStore());
    };
    window.addEventListener("rokad_panel_store_changed", handleStoreChange);
    return () => window.removeEventListener("rokad_panel_store_changed", handleStoreChange);
  }, []);

  // دوره‌های نشان‌شده توسط کاربر
  const savedCourses = courses.filter((c) => {
    const slug = c.slug || c._id || c.id;
    return isWishlisted(slug, store);
  });

  // Format flagship courses from real API courses
  const flagshipCourses = courses.slice(0, 3).map((c, i) => {
    const deptInfo = DEPT_CONFIG[c.category] || DEPT_CONFIG["فناوری اطلاعات"];
    return {
      id: c._id || c.id || `flag-${i}`,
      deptId: deptInfo.deptId,
      deptName: c.category || deptInfo.deptName,
      themeClass: deptInfo.themeClass,
      pattern: deptInfo.pattern,
      badge: c.isInPerson || c.mode === "in-person" ? "دوره حضوری و کارگاهی" : "دوره آنلاین و پروژه محور",
      title: c.title,
      inst: c.instructor?.fullName || c.instructor?.name || "استاد کالج رکاد",
      desc: c.description || c.headline || "آموزش جامع و پروژه محور متناسب با نیازهای بازار کار ایران و بین‌الملل.",
      hours: c.duration || `${c.hours || 40} ساعت آموزش`,
      students: `${Number(c.studentCount || 120).toLocaleString("fa-IR")} هنرجو`,
      rating: "۴.۹",
      price: c.price ? `${Number(c.price).toLocaleString("fa-IR")} تومان` : "رایگان",
      slug: c.slug || c.id || c._id,
      mode: c.isInPerson || c.mode === "in-person" ? "in-person" : "online",
      deptHref: `/dept/${deptInfo.deptId}`,
      deptBtnText: `مشاهده دپارتمان ${c.category || deptInfo.deptName}`,
      icon: deptInfo.icon,
    };
  });

  // Group real courses dynamically by category
  const groupedCategories = {};
  courses.forEach((c) => {
    const cat = c.category || "فناوری اطلاعات";
    const deptInfo = DEPT_CONFIG[cat] || DEPT_CONFIG["فناوری اطلاعات"];
    if (!groupedCategories[cat]) {
      groupedCategories[cat] = {
        deptId: deptInfo.deptId,
        deptName: cat,
        badgeColor: deptInfo.badgeColor,
        badgeBg: deptInfo.badgeBg,
        pattern: deptInfo.pattern,
        courses: [],
      };
    }
    groupedCategories[cat].courses.push({
      id: c.id || c._id,
      title: c.title,
      cat: cat,
      inst: c.instructor?.fullName || c.instructor?.name || "استاد کالج",
      hours: c.duration || `${c.hours || 30} ساعت`,
      students: `${Number(c.studentCount || 85).toLocaleString("fa-IR")} هنرجو`,
      rating: "۴.۸",
      price: c.price ? `${Number(c.price).toLocaleString("fa-IR")} تومان` : "رایگان",
      tag: c.isInPerson || c.mode === "in-person" ? "حضوری" : "آنلاین",
      tagType: "hot",
      slug: c.slug || c.id || c._id,
      mode: c.isInPerson || c.mode === "in-person" ? "in-person" : "online",
    });
  });

  const displayedSuggestedGroups = Object.values(groupedCategories);

  const displayedInstructors = instructors.map((t) => ({
    name: t.name,
    dept: t.specialization?.includes("فرانت") || t.specialization?.includes("برنامه") || t.specialization?.includes("UI") ? "فناوری اطلاعات" : t.specialization?.includes("کسب") || t.specialization?.includes("مارکتینگ") ? "کسب و کار" : "زبان‌های خارجی",
    role: t.specialization,
    bio: `استاد و مربی کالج رکاد در زمینه تخصصی ${t.specialization}.`,
    courses: "دوره‌های فعال",
    students: "هنرجوی فعال",
    rating: "۴.۹",
    initial: t.name?.slice(0, 2) || "اس",
    avatar: t.photo || "/assets/StatCard/blue.png",
    color: "var(--male-light)",
  }));

  return (
    <div className="ch-page">
      <CoursesHubHero />

      <div className="ch-container">
        {/* نوار تغییر سریع بین همه دوره‌ها و نشان‌شده‌ها */}
        <div className="ch-hub-toolbar">
          <div className="ch-hub-filter-tabs">
            <button
              type="button"
              className={`ch-hub-filter-btn ${!showSavedOnly ? "active" : ""}`}
              onClick={() => setShowSavedOnly(false)}
            >
              <span>همه دوره‌ها</span>
              <span className="ch-hub-filter-count">{courses.length.toLocaleString("fa-IR")}</span>
            </button>
            <button
              type="button"
              className={`ch-hub-filter-btn ${showSavedOnly ? "active" : ""}`}
              onClick={() => setShowSavedOnly(true)}
            >
              <Bookmark size={15} fill={showSavedOnly ? "currentColor" : "none"} />
              <span>نشان‌شده‌ها</span>
              {savedCourses.length > 0 && (
                <span className="ch-hub-filter-count ch-hub-filter-count-saved">
                  {savedCourses.length.toLocaleString("fa-IR")}
                </span>
              )}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-stone-500 font-bold">در حال بارگذاری دوره‌ها از سرور...</div>
        ) : showSavedOnly ? (
          /* ========================================================
             نمای دوره‌های نشان‌شده (Wishlist View)
             ======================================================== */
          <div className="ch-saved-view">
            <div className="ch-saved-view-head">
              <div className="ch-saved-view-title-wrap">
                <span className="ch-saved-badge">
                  <Bookmark size={14} fill="currentColor" />
                  علاقه‌مندی‌ها
                </span>
                <h2 className="ch-saved-title">
                  دوره‌های نشان‌شده ({savedCourses.length.toLocaleString("fa-IR")})
                </h2>
              </div>
            </div>

            {savedCourses.length === 0 ? (
              <div className="ch-saved-empty">
                <div className="ch-saved-empty-icon">
                  <Bookmark size={32} />
                </div>
                <h3 className="ch-saved-empty-title">هنوز دوره‌ای را نشان نکرده‌اید</h3>
                <p className="ch-saved-empty-desc">
                  با کلیک روی نشان، دوره به این بخش اضافه می‌شود.
                </p>
                <button
                  type="button"
                  className="ch-saved-empty-btn"
                  onClick={() => setShowSavedOnly(false)}
                >
                  مشاهده همه دوره‌ها
                </button>
              </div>
            ) : (
              <div className="ch-saved-grid">
                {savedCourses.map((c) => {
                  const deptInfo = DEPT_CONFIG[c.category] || DEPT_CONFIG["فناوری اطلاعات"];
                  const DeptIcon = deptInfo.icon || Code;
                  const isHp = c.isInPerson || c.mode === "in-person";
                  const instructorName = c.instructor?.fullName || c.instructor?.name || (c.teachers && c.teachers[0]?.name) || "استاد کالج";
                  const priceNum = c.price;

                  return (
                    <Link
                      key={c._id || c.id || c.slug}
                      href={`/courses/${c.slug || c._id || c.id}`}
                      className="ch-card"
                      data-dept={deptInfo.deptId}
                    >
                      <div className="ch-card-cover" style={{ background: deptInfo.badgeBg }}>
                        <img src={deptInfo.pattern} alt="" className="ch-cover-pat" aria-hidden="true" />
                        <span className="ch-card-tag hot">{isHp ? "حضوری" : "آنلاین"}</span>
                        <CourseSaveButton slug={c.slug || c._id || c.id} store={store} />
                        <DeptIcon size={34} style={{ color: deptInfo.badgeColor, position: "relative", zIndex: 1 }} />
                      </div>

                      <div className="ch-card-body">
                        <div className="ch-card-badges-row">
                          <span
                            className="ch-card-dept-badge"
                            style={{ background: deptInfo.badgeBg, color: deptInfo.badgeColor }}
                          >
                            {c.category || deptInfo.deptName}
                          </span>
                          <CourseModeBadge mode={isHp ? "in-person" : "online"} />
                        </div>

                        <h3 className="ch-card-title">{c.title}</h3>

                        <div className="ch-card-inst">
                          <span className="ch-card-av">{instructorName.charAt(0)}</span>
                          <span>مدرس: {instructorName}</span>
                        </div>

                        <div className="ch-card-meta">
                          <span className="ch-card-meta-item ch-rate">
                            <Star size={13} fill="#f5a623" color="#f5a623" />
                            ۴.۹
                          </span>
                          <span className="ch-card-meta-item">
                            <Clock size={13} />
                            {c.duration || "۳۰ ساعت"}
                          </span>
                          <span className="ch-card-meta-item">
                            <Users size={13} />
                            {Number(c.studentCount || 85).toLocaleString("fa-IR")} هنرجو
                          </span>
                        </div>

                        <div className="ch-card-foot">
                          <div className="ch-card-price">
                            <b>{priceNum ? `${Number(priceNum).toLocaleString("fa-IR")} تومان` : "رایگان"}</b>
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
            )}
          </div>
        ) : (
          /* ========================================================
             نمای کامل کاتالوگ دوره‌ها
             ======================================================== */
          <>
            {flagshipCourses.length > 0 && (
              <FlagshipSection flagshipCourses={flagshipCourses} store={store} />
            )}
            {displayedSuggestedGroups.length > 0 && (
              <SuggestedGroupSection suggestedGroups={displayedSuggestedGroups} store={store} />
            )}
            {displayedInstructors.length > 0 && (
              <InstructorsSection topInstructors={displayedInstructors} instScroll={instScroll} />
            )}
          </>
        )}
      </div>
    </div>
  );
}