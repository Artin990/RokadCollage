import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import PatternLayer from "@/components/PatternLayer";

export default function CoursesHubHero() {
  return (
    <header className="ch-hero">
      <PatternLayer rotate={0} />
      <div className="ch-hero-inner">
        <nav className="ch-crumb" aria-label="مسیر راهنما">
          <Link href="/">خانه</Link>
          <span className="ch-crumb-sep">›</span>
          <span className="ch-crumb-cur">دوره‌ها و دپارتمان‌ها</span>
        </nav>

        <div className="ch-hero-badge">
          <Sparkles size={14} />
          <span>کاتالوگ دوره‌ها</span>
        </div>

        <h1 className="ch-hero-title">
          <span className="ch-marker">دوره‌های تخصصی</span> کالج رکاد
        </h1>

        <p className="ch-hero-desc">
          آموزش کاربردی و پروژه‌محور متناسب با نیازهای بازار کار و اشتغال.
        </p>
      </div>
    </header>
  );
}
