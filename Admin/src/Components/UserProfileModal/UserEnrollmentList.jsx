import React from "react";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import Loading from "../Loading";
import { Badge } from "../UI";
import { formatJalaliDate, toPersianDigits } from "../../Utils/jalaliDate";

/**
 * UserEnrollmentList - Renders the user's enrollment history list inside UserProfileModal.
 */
export default function UserEnrollmentList({ enrollments = [], loading = false }) {
  if (loading) {
    return (
      <div className="py-6 flex flex-col items-center justify-center gap-2">
        <Loading size={6} />
        <span className="text-xs text-text-muted">در حال بارگذاری سوابق ثبت‌نام...</span>
      </div>
    );
  }

  if (enrollments.length === 0) {
    return (
      <div className="text-center py-6 px-4 bg-bg-light/40 rounded-xl border border-dashed border-border/80 text-text-muted text-xs">
        این کاربر هنوز در هیچ دوره‌ای ثبت‌نام نکرده است.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
      {enrollments.map((enr) => {
        const price = Number(enr.pricePaid) || 0;
        return (
          <div
            key={enr._id}
            className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border/70 hover:border-primary-border transition-colors text-xs shadow-2xs"
          >
            <div className="flex flex-col gap-1">
              <span className="font-bold text-text-primary">
                {enr.course?.title || "دوره آموزشی"}
              </span>
              <div className="flex items-center gap-2 text-[11px] text-text-muted">
                <span>
                  {enr.session?.code ? `کد کلاس: ${enr.session.code}` : "دوره مجازی"}
                </span>
                <span>•</span>
                <span>{formatJalaliDate(enr.createdAt)}</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              {price === 0 ? (
                <Badge variant="success" size="sm">
                  رایگان / دستی
                </Badge>
              ) : (
                <span className="font-bold text-secondary text-xs">
                  {toPersianDigits(price.toLocaleString("fa-IR"))} تومان
                </span>
              )}

              {enr.couponCode && (
                <div className="flex items-center gap-1 text-[10px] text-text-muted font-mono">
                  <LocalOfferIcon style={{ fontSize: "0.75rem" }} />
                  <span>{enr.couponCode}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
