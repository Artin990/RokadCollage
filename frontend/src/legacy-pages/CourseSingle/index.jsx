import React, { useEffect, useRef, useState, useMemo } from "react";
import "./course.css";
import PatternLayer from "../../components/PatternLayer";
import { DEFAULT_STATE, getPanelStore, enrollInCourse, toggleWishlist } from "../../data/panelStore.js";
import { isEnrolledIn, isWishlisted as checkWishlisted } from "../../data/selectors.js";
import dynamic from "next/dynamic";

const CheckoutModal = dynamic(() => import("../Checkout/CheckoutModal.jsx"), { ssr: false });
const VideoPlayerModal = dynamic(() => import("../../components/VideoPlayerModal/index.jsx"), { ssr: false });
const SpotPlayerLicenseModal = dynamic(() => import("./components/SpotPlayerLicenseModal.jsx"), { ssr: false });
import CourseSingleInPerson from "./CourseSingleInPerson.jsx";
import CourseSingleNotFound from "./components/CourseSingleNotFound.jsx";
import SkeletonCourseSingle from "./components/SkeletonCourseSingle.jsx";
import SkeletonCourseInPerson from "./components/SkeletonCourseInPerson.jsx";
import { CourseTopbar, CourseSidebar } from "./components/CourseSidebar.jsx";
import CourseMobilePlayer from "./components/CourseMobilePlayer.jsx";
import ResourcesPanel from "./components/ResourcesPanel.jsx";
import {
  DescriptionPanel,
  CurriculumPanel,
  ReviewsPanel,
  QaPanel,
} from "./components/CoursePanels.jsx";

import { getCourseBySlugOrId } from "@/services/courseService.js";
import { getCourseLicense } from "@/services/enrollmentService.js";

export default function CourseSingle({ slug, initialCourse }) {
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState(0);
  const [openChapter, setOpenChapter] = useState(0);
  const headRef = useRef(null);

  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [activeLesson, setActiveLesson] = useState(null);

  const [course, setCourse] = useState(() => initialCourse || null);
  const [loading, setLoading] = useState(() => !initialCourse);
  const [store, setStore] = useState(DEFAULT_STATE);
  const [enrollToast, setEnrollToast] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [licenseModalOpen, setLicenseModalOpen] = useState(false);
  const [serverEnrolled, setServerEnrolled] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchCourse() {
      if (!initialCourse) {
        setLoading(true);
      }
      try {
        const live = await getCourseBySlugOrId(slug);
        if (live && isMounted) {
          setCourse(live);
        }
      } catch (err) {
        console.error("Failed to load course details from API:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    fetchCourse();
    return () => {
      isMounted = false;
    };
  }, [slug, initialCourse]);

  const allLessons = useMemo(() => {
    return (course?.chapters || []).flatMap((ch) => ch.lessons || []);
  }, [course]);

  useEffect(() => {
    setMounted(true);
    setStore(getPanelStore());
    const handleStoreChange = (e) => {
      setStore(e.detail || getPanelStore());
    };
    window.addEventListener("rokad_panel_store_changed", handleStoreChange);
    return () => window.removeEventListener("rokad_panel_store_changed", handleStoreChange);
  }, []);

  if (loading && !course) {
    let storedMode = null;
    if (typeof window !== "undefined") {
      try {
        storedMode =
          sessionStorage.getItem(`rokad_course_mode_${slug}`) ||
          sessionStorage.getItem("rokad_last_course_mode");
      } catch (_) {}
    }

    const inPersonIdentifiers = [
      "icdl",
      "photoshop",
      "فتوشاپ",
      "premiere",
      "پریمیر",
      "after-effects",
      "aftereffects",
      "افترافکت",
      "wordpress",
      "وردپرس",
      "ui-ux",
      "ui",
      "ux",
      "figma",
      "فیگما",
      "frontend",
      "front",
      "فرانت",
      "backend",
      "back",
      "بک",
      "ai",
      "هوش-مصنوعی",
      "سواد-دیجیتال",
      "bootcamp",
      "بوت‌کمپ",
      "بوتکمپ",
      "حضوری",
      "in-person",
      "inperson",
      "workshop",
      "کارگاه",
      "camp",
      "6adfabec1c8f1dee7a5156e2",
      "6adfabec1c8f1dee7a5156ed",
      "6adfabec1c8f1dee7a5156f3",
      "6adfabec1c8f1dee7a5156f9",
      "6adfabec1c8f1dee7a5156ff",
      "6adfabec1c8f1dee7a515705",
      "6adfabec1c8f1dee7a51570b",
      "6adfabec1c8f1dee7a515711",
      "6adfabec1c8f1dee7a515717",
      "6acd22418fb60eb8907d8af5",
      "6acd22418fb60eb8907d8af6",
    ];

    const cleanSlug = String(slug || "").toLowerCase();
    const isInPersonSlug =
      storedMode === "in-person" ||
      storedMode === "onsite" ||
      inPersonIdentifiers.some((id) => cleanSlug.includes(id));

    if (isInPersonSlug) {
      const isWorkshop = cleanSlug.includes("workshop") || cleanSlug.includes("کارگاه");
      return <SkeletonCourseInPerson isWorkshop={isWorkshop} />;
    }
    return <SkeletonCourseSingle />;
  }

  if (!course) {
    return <CourseSingleNotFound />;
  }

  const isBootcampOrInPerson =
    course.mode === "in-person" ||
    course.isInPerson ||
    course.type === "حضوری" ||
    course.courseType === "دوره حضوری" ||
    course.courseType === "کارگاه حضوری" ||
    (typeof course.courseType === "string" && course.courseType.includes("حضوری")) ||
    Boolean(course.approximateSessions) ||
    Boolean(course.tuitionPerPerson) ||
    Boolean(course.location?.address) ||
    (slug && (
      slug.includes("bootcamp") ||
      slug.includes("حضوری") ||
      slug.includes("in-person") ||
      slug.includes("inperson") ||
      slug.includes("workshop") ||
      slug.includes("کارگاه") ||
      slug.includes("بوت‌کمپ") ||
      slug.includes("بوتکمپ") ||
      slug.includes("figma") ||
      slug.includes("فیگما") ||
      slug.includes("ui-ux") ||
      slug.includes("ux") ||
      slug.includes("ui") ||
      slug.includes("camp") ||
      slug === "6acd22418fb60eb8907d8af5" ||
      slug === "6acd22418fb60eb8907d8af6"
    ));

  if (isBootcampOrInPerson) {
    return <CourseSingleInPerson course={course} slug={slug} />;
  }

  const courseSlug = course.slug || slug;
  const isEnrolled = mounted && Boolean(
    serverEnrolled ||
    isEnrolledIn(courseSlug, store) ||
    (course._id && isEnrolledIn(course._id, store)) ||
    (slug && isEnrolledIn(slug, store))
  );
  const isWishlisted = mounted && Boolean(store?.auth?.isLoggedIn && checkWishlisted(courseSlug, store));

  useEffect(() => {
    const hasToken = typeof window !== "undefined" && Boolean(localStorage.getItem("rokad_token"));
    const isLoggedIn = Boolean(store?.auth?.isLoggedIn || hasToken);
    const targetId = course?._id || course?.id || slug;

    if (!isLoggedIn || !targetId) return;

    getCourseLicense(targetId)
      .then((res) => {
        if (res?.isEnrolled) {
          setServerEnrolled(true);
          enrollInCourse({
            id: course?._id || course?.id,
            _id: course?._id || course?.id,
            slug: courseSlug,
            title: course?.title,
            teacher: course?.teacher?.name || course?.teachers?.[0]?.name,
          });
        }
      })
      .catch(() => {});
  }, [store?.auth?.isLoggedIn, course?._id, course?.id, courseSlug, slug]);

  const courseTabs = ["توضیحات", ...(course.tabs || ["سرفصل‌ها", "نظرات", "پرسش و پاسخ", "منابع"]).filter((t) => t !== "توضیحات")];

  const handleStartPurchase = () => {
    if (!Boolean(store?.auth?.isLoggedIn)) {
      try {
        sessionStorage.setItem("rokad_auth_redirect", `course/${courseSlug}`);
        sessionStorage.setItem("rokad_auth_msg", `برای ثبت‌نام در «${course.title}»، لطفاً ابتدا وارد شوید یا ثبت‌نام کنید.`);
      } catch (_) {}
      window.dispatchEvent(
        new CustomEvent("rokad_auth_required", {
          detail: {
            message: `برای ثبت‌نام در «${course.title}»، لطفاً ابتدا در کالج ثبت‌نام کنید.`,
            action: "register",
          },
        })
      );
      return;
    }

    const isFree = course.price === "رایگان" || course.free === true || course.price === "۰";
    if (isFree) {
      enrollInCourse({
        slug: courseSlug,
        title: course.title,
        teacher: course.teacher?.name || "اساتید کالج رکاد",
        sessions: course.facts?.find((f) => f.k === "مدت زمان")?.v ? `۱۲ فصل · ${course.facts.find((f) => f.k === "مدت زمان").v}` : "۱۲ فصل · ۳۲ ساعت",
      });
      setEnrollToast(true);
      return;
    }
    setCheckoutOpen(true);
  };

  const handleWishlistToggle = () => {
    if (!Boolean(store?.auth?.isLoggedIn)) {
      try {
        sessionStorage.setItem("rokad_auth_redirect", `course/${courseSlug}`);
        sessionStorage.setItem("rokad_auth_msg", `برای افزودن «${course.title}» به نشان‌شده‌ها، لطفاً ابتدا حساب کاربری بسازید.`);
      } catch (_) {}
      window.dispatchEvent(
        new CustomEvent("rokad_auth_required", {
          detail: {
            message: `برای ذخیره «${course.title}»، لطفاً ابتدا در کالج ثبت‌نام کنید.`,
            action: "register",
          },
        })
      );
      return;
    }
    toggleWishlist(courseSlug);
  };


  const handleOpenVideo = (lesson = null) => {
    if (lesson && !lesson.free && !isEnrolled) {
      handleStartPurchase();
      return;
    }
    setActiveLesson(lesson || allLessons.find((l) => l.free) || allLessons[0] || null);
    setVideoModalOpen(true);
  };

  return (
    <main className="cs-page" id="course">
      <PatternLayer rotate={0} />

      <CourseTopbar course={course} />

      <div className="cs-grid container">
        <CourseMobilePlayer course={course} headRef={headRef} onOpenVideo={() => handleOpenVideo()} />

        <div className="cs-main">
          <div className="cs-hero">
            <h1>
              <span style={{ display: "inline-block", transform: "rotate(-0.5deg)" }}>{course.title}</span>
            </h1>
            <div className="cs-meta">
              {(course.meta || course.tags || []).map((m) => (
                <span className="m" key={m}>{m}</span>
              ))}
            </div>
          </div>

          <div className="cs-tabs" role="tablist">
            {courseTabs.map((t, i) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === i}
                className={tab === i ? "on" : ""}
                onClick={() => setTab(i)}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === 0 && <DescriptionPanel course={course} />}
          {tab === 1 && (
            <CurriculumPanel
              course={course}
              openChapter={openChapter}
              setOpenChapter={setOpenChapter}
              onLessonPlay={handleOpenVideo}
              isEnrolled={isEnrolled}
            />
          )}
          {tab === 2 && <ReviewsPanel course={course} />}
          {tab === 3 && <QaPanel course={course} />}
          {tab === 4 && <ResourcesPanel course={course} isEnrolled={isEnrolled} onEnrollClick={handleStartPurchase} />}
        </div>

        <CourseSidebar
          course={course}
          isEnrolled={isEnrolled}
          isWishlisted={isWishlisted}
          enrollToast={enrollToast}
          onStartPurchase={handleStartPurchase}
          onOpenLicense={() => setLicenseModalOpen(true)}
          onWishlistToggle={handleWishlistToggle}
          onOpenVideo={() => handleOpenVideo()}
        />
      </div>

      <SpotPlayerLicenseModal
        isOpen={licenseModalOpen}
        onClose={() => setLicenseModalOpen(false)}
        courseId={course._id || course.id}
        courseTitle={course.title}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        course={course}
      />

      <VideoPlayerModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        videoUrl={course.videoUrl}
        title={course.title}
        lessonTitle={activeLesson ? activeLesson.t : (course.eyebrow || "پیش‌نمایش ویدیو دوره")}
        poster={course.pattern || "/assets/StatCard/blue.png"}
        lessons={allLessons}
        currentLesson={activeLesson}
        onSelectLesson={(les) => setActiveLesson(les)}
      />
    </main>
  );
}
