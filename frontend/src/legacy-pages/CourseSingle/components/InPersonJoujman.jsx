import React from "react";
import {
  Trophy,
  Users,
  Award,
  Sparkles,
  CheckCircle2,
  Briefcase,
  HeartHandshake,
} from "lucide-react";

export default function InPersonJoujman({ course }) {
  const customDescription =
    course?.joujmanEvent?.description ||
    "در انتهای هر دوره، یک جلسه رسمی پروژه‌های نوجوانان با دعوت رسمی از والدین و ۲ الی ۳ نفر از اساتید متخصص در این حوزه برگزار می‌شود که باعث افزایش اعتماد اولیاء، ارزیابی دقیق فنی، سنجش برای جذب در استودیو رکاد و ایجاد حس افتخار و انگیزه در نوجوانان می‌شود.";

  const joujmanHighlights = [
    {
      icon: Users,
      title: "دعوت رسمی از والدین و اولیاء",
      desc: "حضور مستقیم خانواده‌ها در جلسه رسمی برای دیدن دستاوردهای عملی فرزندان و افزایش اعتماد و همراهی اولیاء.",
    },
    {
      icon: Award,
      title: "ارزیابی فنی ۲ الی ۳ استاد متخصص",
      desc: "بررسی موشکافانه کدها، دیزاین‌ها و خروجی پروژه‌ها توسط هیئت داوران و اساتید تراز اول حوزه مربوطه.",
    },
    {
      icon: Briefcase,
      title: "سنجش برای جذب در استودیو رکاد",
      desc: "شناسایی نوجوانان مستعد و ورود برگزیدگان دوره به پروژه‌های واقعی و درآمدزای استودیو طراحی و تولید رکاد.",
    },
    {
      icon: Sparkles,
      title: "ایجاد حس افتخار و انگیزه کاری",
      desc: "تجربه ارائه عمومی حرفه‌ای (Pitching)، ساخت پرتفولیوی معتبر و جهش چشمگیر در اعتمادبه‌نفس نوجوانان.",
    },
  ];

  return (
    <section className="cs-ip-section-card cs-ip-joujman-section" id="joujman-event">
      <div className="cs-ip-sec-header">
        <div className="cs-ip-sec-header-right">
          <span className="cs-ip-sec-num">★</span>
          <div className="cs-ip-sec-icon-box joujman-icon-box">
            <Trophy size={18} />
          </div>
          <div className="cs-ip-sec-titles">
            <h2 className="cs-ip-sec-title">رویداد پایانی و ژوژمان</h2>
            <span className="cs-ip-sec-sub">
              جلسه رسمی ارائه پروژه‌های نوجوانان، ارزیابی اساتید و جذب در استودیو رکاد
            </span>
          </div>
        </div>
        <span className="cs-ip-sec-badge joujman-badge">ویژه نوجوانان و والدین</span>
      </div>

      <div className="cs-ip-sec-body">
        <div className="cs-ip-joujman-panel">
          {/* Main Statement Box */}
          <div className="cs-ip-joujman-lead-box">
            <div className="quote-mark">“</div>
            <p className="cs-ip-joujman-lead-text">
              {customDescription}
            </p>
          </div>

          {/* 4 Outcome Pillars Grid */}
          <div className="cs-ip-joujman-grid">
            {joujmanHighlights.map((hl, i) => {
              const IconComp = hl.icon;
              return (
                <div key={i} className="cs-ip-joujman-card">
                  <div className="joujman-card-header">
                    <div className="joujman-card-icon">
                      <IconComp size={18} />
                    </div>
                    <h4 className="joujman-card-title">{hl.title}</h4>
                  </div>
                  <p className="joujman-card-desc">{hl.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Studio Rokad Guarantee Footnote */}
          <div className="cs-ip-joujman-footnote">
            <div className="footnote-pill">
              <HeartHandshake size={15} />
              <span>پایان دوره، آغاز مسیر حرفه‌ای است: دانش‌آموختگان برتر با دعوت اختصاصی به استودیو متصل می‌شوند.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
