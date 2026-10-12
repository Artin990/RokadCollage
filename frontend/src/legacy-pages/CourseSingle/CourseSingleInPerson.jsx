import React, { useState, useEffect } from "react";
import "./course.css";
import "./courseInPerson.css";
import PatternLayer from "../../components/PatternLayer";
import { getPanelStore, toggleWishlist } from "../../data/panelStore.js";
import { isEnrolledIn, isWishlisted as checkWishlisted } from "../../data/selectors.js";
import CheckoutModal from "../Checkout/CheckoutModal.jsx";
import InPersonHero from "./components/InPersonHero.jsx";
import InPersonSprints from "./components/InPersonSprints.jsx";
import InPersonVenue from "./components/InPersonVenue.jsx";
import { InPersonAbout, InPersonTeacher } from "./components/InPersonTeacher.jsx";

export default function CourseSingleInPerson({ course, slug }) {
  const [store, setStore] = useState(getPanelStore);
  const [openSprint, setOpenSprint] = useState(0);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    const handleStoreChange = (e) => {
      setStore(e.detail || getPanelStore());
    };
    window.addEventListener("rokad_panel_store_changed", handleStoreChange);
    return () => window.removeEventListener("rokad_panel_store_changed", handleStoreChange);
  }, []);

  const courseSlug = course.slug || slug;
  const isLoggedIn = Boolean(store?.auth?.isLoggedIn);
  const isEnrolled = isEnrolledIn(courseSlug, store);
  const isWished = isLoggedIn && checkWishlisted(courseSlug, store);

  const venue = {
    name: course.location?.name || "کمپوس مرکزی کالج رکاد",
    address: course.location?.address || "تهران، میدان آزادی، بلوار اکبری، جنب ایستگاه مترو، پلاک ۲۴",
    metro: "۲ دقیقه پیاده‌روی از ایستگاه مترو میدان آزادی",
    parking: "دارای پارکینگ اختصاصی برای هنرجویان",
    room: course.location?.room || "سالن کارگاهی آلفا",
  };

  const schedule = {
    days: course.days || "شنبه و چهارشنبه",
    hours: course.hours || "۱۶:۰۰ الی ۲۰:۰۰",
    totalWeeks: course.duration || "۱۰ هفته",
    totalHours: course.duration ? `${course.duration} آموزش و کارگاه عملی` : "۸۰ ساعت کارگاهی + ۴۰ ساعت منتورینگ",
    startDate: course.startDate || "به‌زودی",
  };

  const capacity = {
    total: course.capacity || 20,
    registered: course.enrolledCount || 12,
    remaining: Math.max(0, (course.capacity || 20) - (course.enrolledCount || 12)),
    pct: Math.min(100, Math.round(((course.enrolledCount || 12) / (course.capacity || 20)) * 100)),
  };

  const liveSprints = Array.isArray(course.sprints) && course.sprints.length > 0
    ? course.sprints.map((s, idx) => ({
        n: `۰${idx + 1}`,
        weeks: `بخش ${idx + 1}`,
        title: s.title || `اسپرینت ${idx + 1}`,
        desc: s.description || "تمرین و پیاده‌سازی گام‌به‌گام در محیط کارگاهی",
        output: s.output || "پروژه و تحویل تمرین عملی",
      }))
    : [
        {
          n: "۰۱",
          weeks: "هفته ۱ و ۲",
          title: "راه‌اندازی محیط کار تیمی و استانداردهای توسعه",
          desc: "پیکربندی ورک‌استیشن، گیت تیمی و پیاده‌سازی نخستین تسک کارگاهی.",
          output: "ریپازیتوری تیمی استاندارد",
        },
        {
          n: "۰۲",
          weeks: "هفته ۳ تا ۵",
          title: "معماری عمیق، حل چالش‌های واقعی و کد ریویو زنده",
          desc: "پیاده‌سازی معماری ماژولار و بررسی خط‌به‌خط پروژه‌ها.",
          output: "پیاده‌سازی هسته عملیاتی پروژه",
        },
      ];

  const firstTeacher = Array.isArray(course.teachers) && course.teachers.length > 0 ? course.teachers[0] : course.teacher;
  const teacher = {
    name: firstTeacher?.name || firstTeacher?.fullName || "استاد کالج رکاد",
    role: firstTeacher?.role || "مدرس ارشد و سرپرست کارگاه حضوری",
    bio: firstTeacher?.bio || firstTeacher?.description || "مدرس باسابقه و راهبر دوره‌های تخصصی کالج رکاد.",
    initial: (firstTeacher?.name || firstTeacher?.fullName || "رکاد").slice(0, 2),
  };

  const handleBookmarkClick = () => {
    if (!isLoggedIn) {
      try {
        sessionStorage.setItem("rokad_auth_redirect", `course/${courseSlug}`);
        sessionStorage.setItem("rokad_auth_msg", `برای نشان کردن کارگاه «${course.title}»، لطفاً ابتدا حساب کاربری بسازید.`);
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

  const handleCheckoutOpen = () => {
    if (!isLoggedIn) {
      try {
        sessionStorage.setItem("rokad_auth_redirect", `course/${courseSlug}`);
        sessionStorage.setItem("rokad_auth_msg", `برای ثبت‌نام در کارگاه «${course.title}»، لطفاً ابتدا حساب کاربری بسازید.`);
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
    setCheckoutOpen(true);
  };

  return (
    <main className="cs-page cs-inperson-wrapper" id="course">
      <PatternLayer rotate={0} />

      <InPersonHero
        course={course}
        schedule={schedule}
        capacity={capacity}
        isLoggedIn={isLoggedIn}
        isEnrolled={isEnrolled}
        isWished={isWished}
        onBookmarkClick={handleBookmarkClick}
        onCheckoutOpen={handleCheckoutOpen}
      />


      <div className="container">
        <div className="cs-ip-sections-stack">
          <InPersonAbout course={course} />
          <InPersonSprints
            sprints={liveSprints}
            schedule={schedule}
            openSprint={openSprint}
            setOpenSprint={setOpenSprint}
          />
          <InPersonVenue
            venue={venue}
            cleanDays={cleanDays}
            cleanHours={cleanHours}
            cleanRoom={cleanRoom}
          />
          <InPersonTeacher teacher={teacher} />
        </div>
      </div>

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        course={course}
      />
    </main>
  );
}
