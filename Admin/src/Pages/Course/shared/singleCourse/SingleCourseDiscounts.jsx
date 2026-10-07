import React from "react";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import { Card, Badge } from "../../../../Components/UI";
import { formatJalaliDate } from "../../../../Utils/jalaliDate";

export default function SingleCourseDiscounts({ course }) {
  const hasTimedDiscount = course.timedDiscount && course.timedDiscount.percentage > 0;
  const hasDiscountCodes = course.discountCodes && course.discountCodes.length > 0;

  if (!hasTimedDiscount && !hasDiscountCodes) return null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2.5 px-1">
        <span className="w-2.5 h-6 rounded-full bg-primary" />
        <h3 className="text-lg md:text-xl font-bold text-secondary">
          وضعیت تخفیف‌ها و اعتبارسنجی زمان‌دار
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Timed discount */}
        {hasTimedDiscount && (
          <Card className="p-5 border border-border shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-secondary text-sm flex items-center gap-2">
                <LocalOfferIcon className="text-primary" fontSize="small" />
                تخفیف عمومی زمان‌دار
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-700 border border-amber-500/30">
                {course.timedDiscount.percentage}٪
              </span>
            </div>

            <div className="flex flex-col gap-1.5 text-xs text-text-secondary bg-bg-light p-3 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-text-muted">تاریخ و زمان شروع:</span>
                <span className="font-semibold text-secondary">
                  {course.timedDiscount.startDate
                    ? formatJalaliDate(course.timedDiscount.startDate)
                    : "تعیین نشده (بدون محدودیت)"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">تاریخ و زمان پایان:</span>
                <span className="font-semibold text-secondary">
                  {course.timedDiscount.endDate
                    ? formatJalaliDate(course.timedDiscount.endDate)
                    : "تعیین نشده (بدون محدودیت)"}
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Course specific discount codes */}
        {hasDiscountCodes && (
          <Card className="p-5 border border-border shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-secondary text-sm flex items-center gap-2">
                <ConfirmationNumberIcon className="text-primary" fontSize="small" />
                کدهای تخفیف اختصاصی ({course.discountCodes.length} کد)
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {course.discountCodes.map((d, dIdx) => (
                <div
                  key={d._id || dIdx}
                  className={`flex flex-col gap-1.5 text-xs p-3 rounded-xl border ${
                    d.isActive !== false
                      ? "bg-bg-light border-border/80"
                      : "bg-bg-subtle border-border/40 opacity-75"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-primary bg-primary-light px-2 py-0.5 rounded border border-primary-border">
                        {d.code}
                      </span>
                      {d.title && (
                        <span className="text-text-secondary text-[11px]">
                          {d.title}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={d.isActive !== false ? "success" : "neutral"}
                        size="sm"
                      >
                        {d.isActive !== false ? "فعال" : "غیرفعال"}
                      </Badge>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-primary-light text-primary border border-primary-border">
                        {d.percentage}٪
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-text-muted pt-1 border-t border-border/40">
                    <span>
                      شروع: {d.startDate ? formatJalaliDate(d.startDate) : "نامحدود"}
                    </span>
                    <span>
                      پایان: {d.endDate ? formatJalaliDate(d.endDate) : "نامحدود"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </section>
  );
}
