import React from "react";
import { Sparkles } from "lucide-react";
import PatternLayer from "@/components/PatternLayer";

export default function CoursesHubHero() {
  return (
    <header className="ch-hero">
      <PatternLayer rotate={0} />
      <div className="ch-hero-inner">
        <nav className="ch-crumb" aria-label="مسیر راهنما">
          <a href="#">خانه</a>
          <span className="ch-crumb-sep">›</span>
          <span className="ch-crumb-cur">دوره‌ها و دپارتمان‌ها</span>
        </nav>

        <div className="ch-hero-badge">
          <Sparkles size={14} />
          <span>کاتالوگ دوره‌ها</span>
        </div>

        <h1 className="ch-hero-title">
          مسیر حرفه‌ای خود را با{" "}
          <span className="ch-marker">دوره‌های تخصصی</span> کالج بسازید
        </h1>

        <p className="ch-hero-desc">
          مجموعه‌ای منتخب از کاربردی‌ترین دوره‌های پروژه‌محور در دپارتمان‌های فناوری اطلاعات، کسب‌وکار و زبان‌های خارجی، تدریس‌شده توسط برجسته‌ترین اساتید و مدیران صنعت.
        </p>
      </div>
    </header>
  );
}
