import React from "react";
import { Card } from "../../../../Components/UI";

export default function SingleCourseSessions({ sessions }) {
  const sessionList = sessions || [];

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-6 rounded-full bg-primary" />
          <h3 className="text-lg md:text-xl font-bold text-secondary">
            کدهای کلاس و زمان‌بندی برگزاری
          </h3>
        </div>
        {sessionList.length > 0 && (
          <span className="text-xs font-bold text-text-muted bg-surface px-3 py-1 rounded-xl border border-border">
            {sessionList.length} کد کلاس
          </span>
        )}
      </div>

      {sessionList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessionList.map((session, index) => (
            <Card
              key={session._id || index}
              className="p-5 border border-border shadow-xs hover:border-primary-border transition-all flex flex-col justify-between gap-4"
            >
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-primary-light border border-primary-border text-primary font-black text-xs flex items-center justify-center">
                    {index + 1}
                  </span>
                  <h4 className="font-bold text-secondary text-base">
                    {session.code}
                  </h4>
                </div>

                {session.isFull ? (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-danger-light text-danger border border-danger-border">
                    تکمیل ظرفیت
                  </span>
                ) : session.capacity != null ? (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-success-light text-success border border-success-border">
                    {session.remainingCapacity} نفر باقی‌مانده
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-surface text-text-muted border border-border">
                    ظرفیت نامحدود
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="bg-bg-light/80 p-2.5 rounded-xl border border-border/60 flex flex-col gap-0.5">
                  <span className="text-text-muted text-[11px]">روزهای برگزاری:</span>
                  <span className="font-bold text-secondary">{session.scheduleDays || "اعلام نشده"}</span>
                </div>
                <div className="bg-bg-light/80 p-2.5 rounded-xl border border-border/60 flex flex-col gap-0.5">
                  <span className="text-text-muted text-[11px]">ساعت برگزاری:</span>
                  <span className="font-bold text-secondary">{session.scheduleHours || "اعلام نشده"}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-text-muted pt-2 border-t border-border/40">
                <span>ثبت‌نام‌شده: <strong className="text-secondary">{session.enrolledCount || 0}</strong> نفر</span>
                {session.capacity != null && (
                  <span>ظرفیت کل: <strong className="text-secondary">{session.capacity}</strong> نفر</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center text-text-muted text-sm border-dashed">
          هنوز کد کلاسی برای این دوره تعریف نشده است. جهت ثبت زمان‌بندی و ظرفیت، دوره را ویرایش کنید.
        </Card>
      )}
    </section>
  );
}
