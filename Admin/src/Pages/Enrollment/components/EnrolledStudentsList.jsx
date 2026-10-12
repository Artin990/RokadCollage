import React, { useState, useEffect } from "react";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  fetchEnrolledStudents,
  cancelEnrollment,
  manualEnrollInPerson,
} from "../api/enrollmentApi";
import Notify from "../../../Utils/notify";
import confirm from "../../../Utils/confirm";
import Loading from "../../../Components/Loading";
import {
  Badge,
  Button,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableHeadCell,
  TableCell,
  TableBody,
} from "../../../Components/UI";
import { formatJalaliDate, toPersianDigits } from "../../../Utils/jalaliDate";
import UserProfileModal from "../../../Components/UserProfileModal";
import AddStudentModal from "./AddStudentModal";

/**
 * Level 3 Component — Displays list of enrolled students for a session or virtual course.
 * - Allows manual user enrollment into session via search modal
 * - Allows clicking on any student name to open the reusable UserProfileModal
 * - Allows cancelling an enrollment with automated wallet refund if purchased by student
 */
export default function EnrolledStudentsList({
  sessionId,
  courseId,
  title,
  sessionCode,
  onEnrollmentChanged,
}) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      let queryStr = "sort=-createdAt";
      if (sessionId) {
        queryStr += `&session=${sessionId}`;
      } else if (courseId) {
        queryStr += `&course=${courseId}`;
      }

      const res = await fetchEnrolledStudents(queryStr);
      if (res && res.success !== false) {
        const list = Array.isArray(res)
          ? res
          : Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
        setStudents(list);
      } else {
        Notify.error(res?.message || "خطا در دریافت لیست دانش‌آموزان");
      }
    } catch (err) {
      Notify.error(err.response?.data?.message || err.message || "خطا در دریافت لیست دانش‌آموزان");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [sessionId, courseId]);

  const handleStudentAdded = () => {
    fetchStudents();
    if (onEnrollmentChanged) {
      onEnrollmentChanged();
    }
  };

  const handleCancelEnrollment = async (enrollment) => {
    const studentName = enrollment.user?.fullName || "کاربر";
    const price = Number(enrollment.pricePaid) || 0;

    const confirmText =
      price > 0
        ? `آیا از لغو ثبت‌نام «${studentName}» اطمینان دارید؟ با لغو، مبلغ ${toPersianDigits(
            price.toLocaleString("fa-IR")
          )} تومان به کیف پول کاربر بازگردانده شده و ۱ ظرفیت به کد کلاس اضافه می‌شود.`
        : `آیا از لغو ثبت‌نام دستی «${studentName}» اطمینان دارید؟ این کاربر از دوره حذف شده و ۱ ظرفیت به کد کلاس اضافه خواهد شد.`;

    const isConfirmed = await confirm(
      "لغو ثبت‌نام دوره حضوری",
      confirmText,
      "بله، لغو ثبت‌نام کن",
      "warning",
      "#ef4444"
    );

    if (!isConfirmed) return;

    setCancellingId(enrollment._id);
    try {
      const res = await cancelEnrollment(enrollment._id);
      if (res && res.success !== false) {
        Notify.success(res?.message || "ثبت‌نام با موفقیت لغو شد");
        fetchStudents();
        if (onEnrollmentChanged) {
          onEnrollmentChanged();
        }
      } else {
        throw new Error(res?.message || "خطا در لغو ثبت‌نام");
      }
    } catch (err) {
      Notify.error(err.message || "خطا در لغو ثبت‌نام دانش‌آموز");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <Loading
        container
        minHeight="min-h-[220px] sm:min-h-[260px]"
        size={6}
        text="در حال بارگذاری لیست دانش‌آموزان..."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Level 3 Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-1">
        <div className="flex flex-wrap items-center gap-2">
          <PeopleAltOutlinedIcon fontSize="small" className="text-primary" />
          <h5 className="text-xs md:text-sm font-bold text-text-primary">
            دانش‌آموزان ثبت‌نام‌کرده {sessionCode ? `در «${sessionCode}»` : ""}
          </h5>
          <Badge variant="primary" size="sm">
            {toPersianDigits(students.length)} نفر
          </Badge>
        </div>

        {sessionId && (
          <Button
            variant="primary"
            size="sm"
            icon={<PersonAddAlt1Icon fontSize="small" />}
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto"
          >
            افزودن کاربر به این کلاس
          </Button>
        )}
      </div>

      {/* Enrolled Students Table or Empty State */}
      {students.length === 0 ? (
        <div className="text-center py-8 px-4 bg-surface rounded-xl border border-dashed border-border/80 text-text-muted text-xs flex flex-col items-center gap-2">
          <PeopleAltOutlinedIcon className="text-text-muted/60" fontSize="medium" />
          <span>هنوز هیچ دانش‌آموزی در {sessionCode ? `«${sessionCode}»` : "این دوره"} ثبت‌نام نکرده است.</span>
          {sessionId && (
            <Button
              variant="outline"
              size="sm"
              className="mt-1"
              icon={<PersonAddAlt1Icon fontSize="small" />}
              onClick={() => setIsAddModalOpen(true)}
            >
              ثبت‌نام اولین دانش‌آموز
            </Button>
          )}
        </div>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow isHeader hover={false}>
                <TableHeadCell align="center" className="w-12">#</TableHeadCell>
                <TableHeadCell>نام و مشخصات دانش‌آموز</TableHeadCell>
                <TableHeadCell>شماره همراه</TableHeadCell>
                <TableHeadCell>مبلغ پرداختی</TableHeadCell>
                <TableHeadCell>کد تخفیف / نوع</TableHeadCell>
                <TableHeadCell>تاریخ و ساعت ثبت‌نام</TableHeadCell>
                <TableHeadCell align="center">عملیات</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((item, index) => {
                const price = Number(item.pricePaid) || 0;
                const isManualAdmin = price === 0 || item.couponCode === "ثبت‌نام دستی ادمین";
                const isRealCoupon = Boolean(
                  item.couponCode &&
                  item.couponCode.trim() &&
                  item.couponCode !== "ثبت‌نام دستی ادمین"
                );
                const discount = Number(item.discountAmount) || 0;

                return (
                  <TableRow key={item._id || index}>
                    <TableCell align="center" className="text-text-muted font-medium text-xs">
                      {toPersianDigits(index + 1)}
                    </TableCell>
                    <TableCell>
                      <div
                        onClick={() => setSelectedStudentForProfile(item.user)}
                        className="flex items-center gap-2 cursor-pointer group select-none"
                        title="مشاهده پروفایل کامل این دانش‌آموز"
                      >
                        <div className="w-7 h-7 rounded-full bg-primary-light border border-primary-border flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-secondary transition-colors">
                          <PersonOutlineIcon style={{ fontSize: "1rem" }} />
                        </div>
                        <span className="font-bold text-text-primary group-hover:text-primary group-hover:underline underline-offset-4 transition-colors">
                          {item.user?.fullName || "کاربر بدون نام"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-text-secondary" dir="ltr">
                      {item.user?.phoneNumber ? toPersianDigits(item.user.phoneNumber) : "—"}
                    </TableCell>
                    <TableCell className="font-semibold text-secondary">
                      {isManualAdmin ? (
                        <Badge variant="success" size="sm" className="whitespace-nowrap font-bold">
                          رایگان (ثبت‌نام دستی)
                        </Badge>
                      ) : (
                        `${toPersianDigits(price.toLocaleString("fa-IR"))} تومان`
                      )}
                    </TableCell>
                    <TableCell>
                      {isManualAdmin ? (
                        <Badge variant="primary" size="sm" className="whitespace-nowrap font-bold">
                          ثبت‌نام دستی ادمین
                        </Badge>
                      ) : isRealCoupon ? (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Badge variant="amber" size="sm">
                            <LocalOfferIcon style={{ fontSize: "0.8rem" }} />
                            <span>{item.couponCode}</span>
                          </Badge>
                          {discount > 0 && (
                            <span className="text-[10px] text-text-muted">
                              ({toPersianDigits(discount.toLocaleString("fa-IR"))} تومان تخفیف)
                            </span>
                          )}
                        </div>
                      ) : discount > 0 ? (
                        <span className="text-[11px] text-text-muted">
                          تخفیف زمان‌دار ({toPersianDigits(discount.toLocaleString("fa-IR"))} تومان)
                        </span>
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-text-secondary text-xs">
                      {formatJalaliDate(item.createdAt, { withTime: true })}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="ghost"
                        size="xs"
                        className="!text-danger hover:!bg-danger/10 hover:!text-danger !px-2.5 !py-1 text-xs"
                        icon={<DeleteOutlineIcon style={{ fontSize: "1rem" }} />}
                        disabled={cancellingId === item._id}
                        loading={cancellingId === item._id}
                        onClick={() => handleCancelEnrollment(item)}
                        title="لغو ثبت‌نام و عودت وجه به کیف پول"
                      >
                        لغو ثبت‌نام
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* User Profile Modal on Clicking Student Name */}
      {selectedStudentForProfile && (
        <UserProfileModal
          isOpen={Boolean(selectedStudentForProfile)}
          onClose={() => setSelectedStudentForProfile(null)}
          userId={selectedStudentForProfile._id}
          user={selectedStudentForProfile}
        />
      )}

      {/* Add Student to Session Modal */}
      {isAddModalOpen && (
        <AddStudentModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          courseTitle={title}
          subtitle={`کد کلاس: ${sessionCode || ""}`}
          onConfirm={async (user) => {
            try {
              const res = await manualEnrollInPerson(courseId, sessionId, user._id);
              if (res && res.success !== false) {
                Notify.success(res?.message || "دانش‌آموز با موفقیت ثبت‌نام شد");
                setIsAddModalOpen(false);
                handleStudentAdded();
              } else {
                throw new Error(res?.message || "ثبت‌نام با خطا مواجه شد");
              }
            } catch (err) {
              Notify.error(err.message || "خطا در ثبت‌نام دانش‌آموز");
            }
          }}
        />
      )}
    </div>
  );
}
