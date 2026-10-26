import React from "react";
import {
  Layers,
  Calendar,
  Clock,
  CalendarDays,
  CreditCard,
  UserCheck,
  CalendarRange,
  BookOpen,
} from "lucide-react";
import { toFa } from "./InPersonHero.jsx";

export default function InPersonSpecs({
  course,
  schedule,
  displayPrice,
  teacherName,
}) {
  const specs = [
    {
      id: "title",
      title: "عنوان دوره",
      value: course.title,
      icon: BookOpen,
      highlight: true,
      colSpan: "full",
    },
    {
      id: "sessions",
      title: "تعداد جلسات تقریبی",
      value: course.approximateSessions || course.sessionsCount ? `${course.approximateSessions || course.sessionsCount}` : "۱۶ جلسه تقریبی",
      icon: Layers,
    },
    {
      id: "hours",
      title: "طول دوره (ساعت)",
      value: course.totalHours || course.duration || "۴۸ ساعت",
      icon: Clock,
    },
    {
      id: "days",
      title: "روزهای برگزاری",
      value: course.scheduleDays || course.days || schedule?.days || "شنبه و چهارشنبه",
      icon: CalendarDays,
    },
    {
      id: "tuition",
      title: "شهریه مصوب هر نفر (تومان)",
      value: `${displayPrice} تومان`,
      icon: CreditCard,
      badge: "مصوب شورای آموزشی",
    },
    {
      id: "teacher",
      title: "نام مدرس پیشنهادی",
      value: course.proposedTeacher || teacherName || "اساتید هیئت علمی کالج رکاد",
      icon: UserCheck,
    },
    {
      id: "dates",
      title: "تاریخ شروع تقریبی - تاریخ پایان تقریبی",
      value: `${course.approximateStartDate || schedule?.startDate || "۱۵ آبان ۱۴۰۴"} الی ${course.approximateEndDate || "۳۰ دی ۱۴۰۴"}`,
      icon: CalendarRange,
    },
  ];

  return (
    <section className="cs-ip-section-card cs-ip-specs-section" id="course-specs">
      <div className="cs-ip-sec-header">
        <div className="cs-ip-sec-header-right">
          <span className="cs-ip-sec-num">۰۱</span>
          <div className="cs-ip-sec-icon-box">
            <Layers size={18} />
          </div>
          <div className="cs-ip-sec-titles">
            <h2 className="cs-ip-sec-title">مشخصات ساختار دوره حضوری</h2>
            <span className="cs-ip-sec-sub">
              اطلاعات رسمی، زمان‌بندی هفتگی، شهریه مصوب و تاریخ‌های برگزاری
            </span>
          </div>
        </div>
        <span className="cs-ip-sec-badge highlight">شناسه رسمی دوره</span>
      </div>

      <div className="cs-ip-sec-body">
        <div className="cs-ip-specs-grid">
          {specs.map((item) => {
            const IconComponent = item.icon;
            const isFull = item.colSpan === "full";

            return (
              <div
                key={item.id}
                className={`cs-ip-spec-item ${isFull ? "col-span-full" : ""}`}
              >
                <div className="spec-icon-box">
                  <IconComponent size={18} />
                </div>
                <div className="spec-content">
                  <span className="spec-title">{item.title}</span>
                  <strong className="spec-val">{item.value}</strong>
                </div>
                {item.badge && (
                  <span className="spec-badge-chip">{item.badge}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
