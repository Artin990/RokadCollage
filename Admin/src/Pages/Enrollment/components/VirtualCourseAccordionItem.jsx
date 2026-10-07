import React from "react";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import ReplayIcon from "@mui/icons-material/Replay";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Loading from "../../../Components/Loading";
import { Badge, Button, CourseIcon } from "../../../Components/UI";
import { formatJalaliDate, toPersianDigits } from "../../../Utils/jalaliDate";
import LicenseStatusBadge from "../shared/LicenseStatusBadge";

export default function VirtualCourseAccordionItem({
  course,
  isExpanded,
  onToggle,
  students = [],
  loadingStudents = false,
  onAddStudent,
  onRetryLicense,
  onViewProfile,
  onViewLicenseKey,
  retryingLicenseId,
}) {
  return (
    <div className="bg-surface rounded-2xl border border-border shadow-xs overflow-hidden transition-all duration-200">
      {/* Course Accordion Header */}
      <div
        onClick={onToggle}
        className={`p-4 md:p-5 flex items-center justify-between cursor-pointer select-none transition-colors ${
          isExpanded ? "bg-bg-light/80 border-b border-border" : "hover:bg-bg-light/40"
        }`}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-primary-light border border-primary-border flex items-center justify-center p-2 shrink-0">
            {course.icon ? (
              <CourseIcon icon={course.icon} alt={course.title} />
            ) : (
              <OndemandVideoIcon className="text-primary" />
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-secondary text-base truncate">{course.title}</h3>
              <Badge variant="purple" size="sm" dot>
                {course.category}
              </Badge>
              <Badge variant="neutral" size="sm">
                مجازی (اسپات‌پلیر)
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-xs text-text-muted mt-1">
              <span>مدت دوره: {course.duration}</span>
              {course.spotplayerCourseId && (
                <span className="font-mono text-[11px] truncate max-w-[200px]" title={course.spotplayerCourseId}>
                  SpotPlayer: {course.spotplayerCourseId}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            icon={<PersonAddAlt1Icon fontSize="small" />}
            onClick={(e) => {
              e.stopPropagation();
              onAddStudent(course);
            }}
          >
            ثبت‌نام دستی
          </Button>

          <div className="text-text-muted">
            {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </div>
        </div>
      </div>

      {/* Accordion Body */}
      {isExpanded && (
        <div className="p-4 md:p-6 bg-bg-light/20">
          {loadingStudents ? (
            <div className="py-8 flex justify-center">
              <Loading size={6} />
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-8 text-text-muted text-xs md:text-sm">
              هیچ ثبت‌نامی برای این دوره مجازی یافت نشد.
            </div>
          ) : (
            <div className="w-full overflow-x-auto bg-surface rounded-xl border border-border">
              <table className="w-full text-right text-xs md:text-sm">
                <thead className="bg-bg-light/60 text-text-secondary border-b border-border font-bold">
                  <tr>
                    <th className="py-3 px-3">نام و شماره کاربر</th>
                    <th className="py-3 px-3">تاریخ ثبت‌نام</th>
                    <th className="py-3 px-3">مبلغ پرداختی</th>
                    <th className="py-3 px-3">وضعیت لایسنس</th>
                    <th className="py-3 px-3 text-center">عملیات لایسنس</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {students.map((enr) => {
                    const licenseStatus = enr.spotplayer?.status || "pending";
                    const canRetry = licenseStatus === "pending" || licenseStatus === "failed" || licenseStatus === "processing";
                    const isIssued = licenseStatus === "issued";

                    return (
                      <tr key={enr._id} className="hover:bg-bg-light/40 transition-colors">
                        <td className="py-3 px-3">
                          <button
                            type="button"
                            onClick={() => onViewProfile(enr.user)}
                            className="font-bold text-secondary hover:text-primary transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <PersonOutlineIcon style={{ fontSize: "1rem" }} className="text-text-muted" />
                            <span>{enr.user?.fullName || "کاربر ناشناس"}</span>
                          </button>
                          <span className="text-[11px] text-text-muted font-mono mt-0.5 block">
                            {toPersianDigits(enr.user?.phoneNumber || "-")}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-text-muted">
                          {formatJalaliDate(enr.createdAt, { withTime: true })}
                        </td>

                        <td className="py-3 px-3">
                          <span className="font-bold text-secondary">
                            {enr.pricePaid === 0
                              ? "رایگان (ادمین)"
                              : `${toPersianDigits(enr.pricePaid?.toLocaleString("fa-IR"))} تومان`}
                          </span>
                          {enr.couponCode && (
                            <span className="text-[10px] text-primary block mt-0.5">
                              کد: {enr.couponCode}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3">
                          <LicenseStatusBadge status={licenseStatus} />
                        </td>

                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {isIssued && (
                              <Button
                                variant="outline"
                                size="xs"
                                icon={<VpnKeyIcon fontSize="inherit" />}
                                onClick={() => onViewLicenseKey(enr._id, enr.user?.fullName || "دانشجو")}
                              >
                                کلید لایسنس
                              </Button>
                            )}

                            {canRetry && (
                              <Button
                                variant="outline"
                                size="xs"
                                icon={<ReplayIcon className={retryingLicenseId === enr._id ? "animate-spin" : ""} fontSize="inherit" />}
                                onClick={() => onRetryLicense(enr._id, course._id)}
                                disabled={retryingLicenseId === enr._id}
                              >
                                تلاش مجدد صدور
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
