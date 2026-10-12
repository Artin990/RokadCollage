import React from "react";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import { formatJalaliDate } from "../../../Utils/jalaliDate";
import { Card } from "../../../Components/UI";

export default function SingleCourseDiscounts({ course }) {
  const hasTimedDiscount =
    course.timedDiscount && Number(course.timedDiscount.percentage) > 0;
  const hasDiscountCodes =
    course.discountCodes && course.discountCodes.length > 0;

  if (!hasTimedDiscount && !hasDiscountCodes) return null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2.5 px-1">
        <span className="w-2.5 h-6 rounded-full bg-primary" />
        <h3 className="text-lg md:text-xl font-bold text-secondary">
          تخفیف‌ها و پیشنهادات ویژه
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Timed Discount Card */}
        {hasTimedDiscount && (
          <Card className="p-5 border border-amber-500/30 bg-amber-500/5 flex flex-col justify-between gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-amber-500/15 text-amber-700">
                  <LocalOfferIcon fontSize="small" />
                </span>
                <div>
                  <h4 className="font-bold text-secondary text-sm">
                    تخفیف عمومی زمان‌دار
                  </h4>
                  <p className="text-xs text-text-muted mt-0.5">
                    تخفیف اعمال‌شده مستقیم روی قیمت دوره
                  </p>
                </div>
              </div>

              <span className="text-sm font-black px-2.5 py-1 rounded-xl bg-amber-500 text-white shadow-2xs">
                {course.timedDiscount.percentage}٪
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary pt-3 border-t border-amber-500/15">
              {course.timedDiscount.startDate && (
                <span>
                  شروع: {formatJalaliDate(course.timedDiscount.startDate)}
                </span>
              )}
              {course.timedDiscount.endDate && (
                <span>
                  پایان: {formatJalaliDate(course.timedDiscount.endDate)}
                </span>
              )}
              {!course.timedDiscount.startDate && !course.timedDiscount.endDate && (
                <span>بدون محدودیت زمانی</span>
              )}
            </div>
          </Card>
        )}

        {/* 2. Specific Discount Codes Card */}
        {hasDiscountCodes && (
          <Card className="p-5 border border-purple-500/30 bg-purple-500/5 flex flex-col gap-3 md:col-span-1">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-purple-500/15 text-purple-700">
                <ConfirmationNumberIcon fontSize="small" />
              </span>
              <div>
                <h4 className="font-bold text-secondary text-sm">
                  کدهای تخفیف اختصاصی ({course.discountCodes.length})
                </h4>
                <p className="text-xs text-text-muted mt-0.5">
                  کوپن‌های فعال جهت استفاده در صفحه تسویه‌حساب
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-purple-500/15">
              {course.discountCodes.map((codeItem) => (
                <div
                  key={codeItem._id || codeItem.code}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-surface border border-border text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold bg-bg-light px-2 py-0.5 rounded-lg border border-border text-secondary">
                      {codeItem.code}
                    </span>
                    {codeItem.title && (
                      <span className="text-text-muted text-[11px]">
                        ({codeItem.title})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary">
                      {codeItem.percentage}٪
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        codeItem.isActive !== false
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                      title={codeItem.isActive !== false ? "فعال" : "غیرفعال"}
                    />
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
