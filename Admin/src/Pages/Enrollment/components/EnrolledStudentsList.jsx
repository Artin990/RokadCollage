import React, { useState, useEffect } from "react";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import axiosInstance from "../../../Utils/axiosInstance";
import Notify from "../../../Utils/notify";
import Loading from "../../../Components/Loading";
import { Badge, Button } from "../../../Components/UI";
import { formatJalaliDate, toPersianDigits } from "../../../Utils/jalaliDate";
import UserProfileModal from "../../../Components/UserProfileModal";
import AddStudentModal from "../shared/AddStudentModal";

/**
 * Level 3 Component — Displays list of enrolled students for a session or virtual course.
 * - Allows manual user enrollment into session via search modal
 * - Allows clicking on any student name to open the reusable UserProfileModal
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

  const fetchStudents = async () => {
    setLoading(true);
    try {
      let endpoint = "enrollment/all?sort=-createdAt";
      if (sessionId) {
        endpoint += `&session=${sessionId}`;
      } else if (courseId) {
        endpoint += `&course=${courseId}`;
      }

      const res = await axiosInstance.get(endpoint);
      if (res && res.success !== false) {
        const list = Array.isArray(res) ? res : res.data || [];
        setStudents(list);
      } else {
        Notify.error(res?.message || "خطا در دریافت لیست دانش‌آموزان");
      }
    } catch (err) {
      console.error("Error fetching enrolled students:", err);
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

  if (loading) {
    return (
      <div className="py-8 flex flex-col items-center justify-center gap-2">
        <Loading size={6} />
        <span className="text-xs text-text-muted">در حال بارگذاری لیست دانش‌آموزان...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Level 3 Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
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
        <div className="overflow-x-auto rounded-xl border border-border/80 bg-surface shadow-2xs">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-bg-subtle/80 text-text-secondary border-b border-border/70 font-semibold">
                <th className="py-3 px-3.5 w-12 text-center">#</th>
                <th className="py-3 px-3.5">نام و مشخصات دانش‌آموز</th>
                <th className="py-3 px-3.5">شماره همراه</th>
                <th className="py-3 px-3.5">مبلغ پرداختی</th>
                <th className="py-3 px-3.5">کد تخفیف / نوع</th>
                <th className="py-3 px-3.5">تاریخ و ساعت ثبت‌نام</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 text-text-primary">
              {students.map((item, index) => {
                const price = Number(item.pricePaid) || 0;
                const hasCoupon = Boolean(item.couponCode && item.couponCode.trim());
                const discount = Number(item.discountAmount) || 0;

                return (
                  <tr key={item._id || index} className="hover:bg-bg-subtle/40 transition-colors">
                    <td className="py-3 px-3.5 text-center text-text-muted font-medium">
                      {toPersianDigits(index + 1)}
                    </td>
                    <td className="py-3 px-3.5">
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
                    </td>
                    <td className="py-3 px-3.5 font-mono text-text-secondary" dir="ltr">
                      {item.user?.phoneNumber ? toPersianDigits(item.user.phoneNumber) : "—"}
                    </td>
                    <td className="py-3 px-3.5 font-semibold text-secondary">
                      {price === 0 ? (
                        <Badge variant="success" size="sm">دستی / رایگان</Badge>
                      ) : (
                        `${toPersianDigits(price.toLocaleString("fa-IR"))} تومان`
                      )}
                    </td>
                    <td className="py-3 px-3.5">
                      {hasCoupon ? (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Badge variant="amber" size="sm" className="font-mono">
                            <LocalOfferIcon style={{ fontSize: "0.8rem" }} />
                            {item.couponCode}
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
                    </td>
                    <td className="py-3 px-3.5 text-text-secondary">
                      {formatJalaliDate(item.createdAt, { withTime: true })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
              const res = await axiosInstance.post(
                `in-person-courses/${courseId}/sessions/${sessionId}/enrollments`,
                { userId: user._id }
              );
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
