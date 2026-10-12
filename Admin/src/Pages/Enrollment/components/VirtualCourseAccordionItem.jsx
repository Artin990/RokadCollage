import React from "react";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import ReplayIcon from "@mui/icons-material/Replay";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import SyncIcon from "@mui/icons-material/Sync";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Loading from "../../../Components/Loading";
import {
  Badge,
  Button,
  Table,
  TableHead,
  TableRow,
  TableHeadCell,
  TableCell,
  TableBody,
  TableSkeleton,
} from "../../../Components/UI";
import { getImageUrl } from "../../../Utils/getImageUrl";
import { formatJalaliDate, toPersianDigits } from "../../../Utils/jalaliDate";

/**
 * Standardized status badge for SpotPlayer license issuance
 */
function LicenseStatusBadge({ status = "pending" }) {
  switch (status) {
    case "issued":
      return (
        <Badge variant="success" size="sm" className="flex items-center gap-1 font-bold">
          <CheckCircleOutlineIcon style={{ fontSize: "0.9rem" }} />
          <span>صادر شد</span>
        </Badge>
      );
    case "processing":
      return (
        <Badge variant="info" size="sm" className="flex items-center gap-1 font-bold">
          <SyncIcon className="animate-spin" style={{ fontSize: "0.9rem" }} />
          <span>در حال صدور</span>
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="error" size="sm" className="flex items-center gap-1 font-bold">
          <ErrorOutlineIcon style={{ fontSize: "0.9rem" }} />
          <span>ناموفق</span>
        </Badge>
      );
    case "pending":
    default:
      return (
        <Badge variant="amber" size="sm" className="flex items-center gap-1 font-bold">
          <HourglassEmptyIcon style={{ fontSize: "0.9rem" }} />
          <span>در انتظار</span>
        </Badge>
      );
  }
}

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
    <div className="bg-surface rounded-2xl border border-border shadow-xs overflow-hidden transition-shadow duration-150">
      {/* Course Accordion Header */}
      <div
        onClick={onToggle}
        className={`p-4 md:p-5 flex items-center justify-between cursor-pointer select-none transition-colors border-b ${
          isExpanded
            ? "bg-bg-light/60 border-border/60"
            : "border-transparent hover:bg-bg-light/40"
        }`}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-primary-light border border-primary-border flex items-center justify-center overflow-hidden shrink-0">
            {course.img ? (
              <img
                src={getImageUrl(course.img)}
                alt={course.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
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
            <TableSkeleton rows={3} cols={5} />
          ) : students.length === 0 ? (
            <div className="text-center py-8 text-text-muted text-xs md:text-sm">
              هیچ ثبت‌نامی برای این دوره مجازی یافت نشد.
            </div>
          ) : (
            <div className="w-full overflow-x-auto bg-surface rounded-2xl border border-border/80 shadow-2xs">
              <Table>
                <TableHead>
                  <TableRow isHeader hover={false}>
                    <TableHeadCell>نام و شماره کاربر</TableHeadCell>
                    <TableHeadCell>تاریخ ثبت‌نام</TableHeadCell>
                    <TableHeadCell>مبلغ پرداختی</TableHeadCell>
                    <TableHeadCell>وضعیت لایسنس</TableHeadCell>
                    <TableHeadCell align="center">عملیات لایسنس</TableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((enr) => {
                    const licenseStatus = enr.spotplayer?.status || "pending";
                    const canRetry = licenseStatus === "pending" || licenseStatus === "failed" || licenseStatus === "processing";
                    const isIssued = licenseStatus === "issued";

                    return (
                      <TableRow key={enr._id}>
                        <TableCell>
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
                        </TableCell>

                        <TableCell className="text-text-muted text-xs">
                          {formatJalaliDate(enr.createdAt, { withTime: true })}
                        </TableCell>

                        <TableCell>
                          {enr.pricePaid === 0 || enr.couponCode === "ثبت‌نام دستی ادمین" ? (
                            <Badge variant="success" size="sm" className="whitespace-nowrap font-bold">
                              رایگان (ثبت‌نام دستی ادمین)
                            </Badge>
                          ) : (
                            <span className="font-bold text-secondary">
                              {`${toPersianDigits(enr.pricePaid?.toLocaleString("fa-IR"))} تومان`}
                            </span>
                          )}
                          {enr.couponCode && enr.couponCode !== "ثبت‌نام دستی ادمین" && (
                            <span className="text-[10px] text-primary block mt-0.5">
                              کد تخفیف: {enr.couponCode}
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          <LicenseStatusBadge status={licenseStatus} />
                        </TableCell>

                        <TableCell align="center">
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
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
