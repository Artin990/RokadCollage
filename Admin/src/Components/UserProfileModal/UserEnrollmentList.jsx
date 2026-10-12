import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Loading from "../Loading";
import { Badge } from "../UI";
import { formatJalaliDate, toPersianDigits } from "../../Utils/jalaliDate";

/**
 * UserEnrollmentList - Renders the user's enrollment history list inside UserProfileModal.
 */
export default function UserEnrollmentList({
  enrollments = [],
  loading = false,
  onCancelEnrollment,
  cancellingId,
}) {
  if (loading) {
    return (
      <div className="min-h-[120px] w-full flex flex-col items-center justify-center gap-2.5 rounded-2xl bg-bg-light/30 border border-dashed border-border/80 p-5 select-none">
        <div className="w-9 h-9 rounded-xl bg-primary-soft/80 flex items-center justify-center text-primary shadow-2xs border border-primary-border/60">
          <Loading size={6} />
        </div>
        <span className="text-xs text-text-muted font-bold">در حال بارگذاری سوابق ثبت‌نام...</span>
      </div>
    );
  }

  if (enrollments.length === 0) {
    return (
      <div className="min-h-[90px] py-6 px-4 w-full flex flex-col items-center justify-center gap-1.5 text-center bg-bg-light/40 rounded-2xl border border-dashed border-border/80 text-text-muted text-xs select-none">
        این کاربر هنوز در هیچ دوره‌ای ثبت‌نام نکرده است.
      </div>
    );
  }

  return (
    <div className="max-h-[240px] overflow-y-auto overscroll-contain flex flex-col gap-2 custom-scrollbar">
      {enrollments.map((enr) => {
        const price = Number(enr.pricePaid) || 0;
        const isManualAdmin = price === 0 || enr.couponCode === "ثبت‌نام دستی ادمین";
        const hasCoupon = enr.couponCode && enr.couponCode !== "ثبت‌نام دستی ادمین";

        return (
          <div
            key={enr._id}
            className="p-3 sm:p-3.5 rounded-2xl bg-surface border border-border/80 hover:border-primary/40 hover:bg-primary-soft/10 transition-all duration-150 text-xs shadow-2xs flex flex-col gap-2 group"
          >
            {/* Row 1: Course Title and Cancel Action */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0">
                  <SchoolOutlinedIcon style={{ fontSize: "1.05rem" }} />
                </div>
                <span className="font-bold text-text-primary text-xs sm:text-sm truncate" title={enr.course?.title}>
                  {enr.course?.title || "دوره آموزشی"}
                </span>
              </div>

              {onCancelEnrollment && (
                <button
                  type="button"
                  onClick={() => onCancelEnrollment(enr)}
                  disabled={cancellingId === enr._id}
                  className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                  title="لغو ثبت‌نام و بازگشت وجه به کیف پول"
                >
                  <DeleteOutlineIcon style={{ fontSize: "1.1rem" }} />
                </button>
              )}
            </div>

            {/* Row 2: Metadata (Session/Platform, Date) & Payment Status */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50 flex-wrap text-[11px]">
              <div className="flex items-center gap-2 text-text-muted shrink-0">
                <span className="font-medium text-text-secondary">
                  {enr.session?.code ? `کد کلاس: ${toPersianDigits(enr.session.code)}` : "دوره مجازی"}
                </span>
                <span>•</span>
                <span>{formatJalaliDate(enr.createdAt, { withTime: false })}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {hasCoupon && (
                  <div className="flex items-center gap-1 text-[10px] text-text-muted bg-bg-light px-2 py-0.5 rounded-md border border-border/60">
                    <LocalOfferIcon style={{ fontSize: "0.75rem" }} className="text-amber-600" />
                    <span>{enr.couponCode}</span>
                  </div>
                )}

                {isManualAdmin ? (
                  <Badge variant="success" size="sm" className="whitespace-nowrap font-bold">
                    رایگان (ثبت‌نام دستی ادمین)
                  </Badge>
                ) : (
                  <span className="font-black text-secondary text-xs sm:text-sm whitespace-nowrap">
                    {toPersianDigits(price.toLocaleString("fa-IR"))} تومان
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
