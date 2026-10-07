import React, { useState, useEffect } from "react";
import GroupsIcon from "@mui/icons-material/Groups";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import axiosInstance from "../../../Utils/axiosInstance";
import Notify from "../../../Utils/notify";
import Loading from "../../../Components/Loading";
import { Badge } from "../../../Components/UI";
import { toPersianDigits } from "../../../Utils/jalaliDate";
import EnrolledStudentsList from "./EnrolledStudentsList";

/**
 * Level 2 Component — Course Accordion Content
 * - In-Person: fetches and renders class sessions, expands level 3 enrolled students upon selection.
 * - Virtual: renders direct virtual notice and renders level 3 enrolled students.
 */
export default function CourseAccordionContent({ course, courseId, courseTitle }) {
  const targetCourse = course || { _id: courseId, title: courseTitle, type: "حضوری" };
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  const fetchSessions = async (isMounted = true) => {
    if (targetCourse.type && targetCourse.type !== "حضوری") return;
    setLoadingSessions(true);
    try {
      const res = await axiosInstance.get(`in-person-courses/${targetCourse._id}/sessions`);
      if (isMounted && res && res.data) {
        const sessionList = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];
        setSessions(sessionList);
        if (sessionList.length === 1 && !selectedSessionId) {
          setSelectedSessionId(sessionList[0]._id);
        }
      }
    } catch (err) {
      if (isMounted) {
        console.error("Error fetching sessions:", err);
        Notify.error("خطا در دریافت کدهای کلاس دوره");
      }
    } finally {
      if (isMounted) setLoadingSessions(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchSessions(isMounted);

    return () => {
      isMounted = false;
    };
  }, [targetCourse._id, targetCourse.type]);

  // For virtual courses, directly display the enrolled students list
  if (targetCourse.type === "مجازی") {
    return (
      <div className="flex flex-col gap-4 p-4 md:p-5 bg-bg-light/50 border-t border-border/80">
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-info-light/60 border border-info-border text-info-text text-xs leading-relaxed">
          <InfoOutlinedIcon fontSize="small" className="shrink-0" />
          <span>
            این دوره به صورت <strong>مجازی</strong> برگزار می‌شود و بدون کد کلاس است. تمامی ثبت‌نام‌کنندگان مستقیماً در ادامه لیست شده‌اند:
          </span>
        </div>

        <EnrolledStudentsList courseId={targetCourse._id} title={targetCourse.title} />
      </div>
    );
  }

  // For in-person courses
  return (
    <div className="flex flex-col gap-5 p-4 md:p-5 bg-bg-light/50 border-t border-border/80">
      {/* Level 2: Class Sessions List */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GroupsIcon fontSize="small" className="text-secondary" />
            <h4 className="text-xs md:text-sm font-bold text-secondary">
              کدهای کلاس دوره (یک کد کلاس را برای مشاهده ثبت‌نام‌ها انتخاب کنید)
            </h4>
          </div>
          {sessions.length > 0 && (
            <span className="text-xs text-text-muted">
              تعداد کدها: <strong>{toPersianDigits(sessions.length)}</strong>
            </span>
          )}
        </div>

        {loadingSessions ? (
          <div className="py-6 flex flex-col items-center justify-center gap-2">
            <Loading size={6} />
            <span className="text-xs text-text-muted">در حال بارگذاری کدهای کلاس...</span>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-border/80 rounded-xl text-text-muted text-xs">
            هنوز هیچ کد کلاسی برای این دوره حضوری تعریف نشده است.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {sessions.map((sess) => {
              const isSelected = selectedSessionId === sess._id;
              const cap = sess.capacity || 0;
              const enrolled = sess.enrolledCount || 0;
              const remaining = sess.remainingCapacity ?? (cap - enrolled);
              const isFull = sess.isFull ?? (cap > 0 && enrolled >= cap);

              return (
                <div
                  key={sess._id}
                  onClick={() =>
                    setSelectedSessionId(isSelected ? null : sess._id)
                  }
                  className={`
                    cursor-pointer rounded-xl p-3.5 border transition-all duration-200 flex flex-col justify-between gap-3 text-xs select-none
                    ${isSelected
                      ? "bg-primary-light/40 border-primary shadow-xs ring-2 ring-primary/20"
                      : "bg-surface border-border hover:border-primary-border/80 hover:bg-surface/80"
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs px-2.5 py-1 rounded-lg bg-primary-light text-primary border border-primary-border">
                      {sess.code}
                    </span>
                    <Badge variant={isFull ? "danger" : "success"} size="sm">
                      {isFull ? "تکمیل ظرفیت" : `${toPersianDigits(remaining)} جای خالی`}
                    </Badge>
                  </div>

                  <div className="flex flex-col gap-1.5 text-text-secondary text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <CalendarTodayIcon style={{ fontSize: "0.85rem" }} className="text-text-muted shrink-0" />
                      <span>{sess.scheduleDays || "اعلام نشده"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <AccessTimeIcon style={{ fontSize: "0.85rem" }} className="text-text-muted shrink-0" />
                      <span>{sess.scheduleHours || "اعلام نشده"}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
                    <span className="text-text-muted">
                      ثبت‌نام: <strong className="text-secondary">{toPersianDigits(enrolled)}</strong> از {toPersianDigits(cap)} نفر
                    </span>
                    <span className={`font-bold ${isSelected ? "text-primary" : "text-text-secondary"}`}>
                      {isSelected ? "بستن لیست ▲" : "مشاهده دانش‌آموزان ▼"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Level 3: Enrolled Students of Selected Session */}
      {selectedSessionId && (
        <div className="pt-3 border-t border-border/80 animate-fadeIn">
          {(() => {
            const currentSession = sessions.find((s) => s._id === selectedSessionId);
            return (
              <EnrolledStudentsList
                sessionId={selectedSessionId}
                sessionCode={currentSession?.code}
                title={course.title}
                courseId={course._id}
                onEnrollmentChanged={() => fetchSessions(true)}
              />
            );
          })()}
        </div>
      )}
    </div>
  );
}
