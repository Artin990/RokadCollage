import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SchoolIcon from "@mui/icons-material/School";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import Notify from "../../../Utils/notify";
import confirm from "../../../Utils/confirm";
import Loading from "../../../Components/Loading";
import {
  Button,
  IconButton,
  Card,
  Badge,
  PageHeader,
  LoadingState,
} from "../../../Components/UI";
import { getImageUrl } from "../../../Utils/getImageUrl";
import { formatJalaliDate, toPersianDigits } from "../../../Utils/jalaliDate";
import { fetchCommentById, deleteComment as deleteCommentApi } from "../api/commentApi";

/**
 * SingleComment Page
 * Dedicated Page: Single Comment Detailed View & Client Preview
 * Displays complete comment details, commenter info, linked course, and live website fidelity preview.
 */
export default function SingleComment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [comment, setComment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadComment = async () => {
      setLoading(true);
      try {
        const res = await fetchCommentById(id);
        const data = res?.data || res;
        if (isMounted) {
          if (data) {
            const resolvedDoc = Array.isArray(data) ? data[0] : data;
            setComment(resolvedDoc);
          } else {
            Notify.error("نظر مورد نظر یافت نشد.");
          }
        }
      } catch (err) {
        if (isMounted) {
          Notify.error(err.message || "خطا در دریافت اطلاعات نظر");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) loadComment();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleDelete = async () => {
    const isConfirmed = await confirm(
      "آیا از حذف این نظر اطمینان دارید؟",
      "با حذف این مورد، نظر از صفحه دوره مربوطه در سایت نیز برداشته خواهد شد.",
      "بله، حذف کن"
    );

    if (!isConfirmed) return;

    setIsDeleting(true);
    try {
      const res = await deleteCommentApi(id);
      if (res && res.success !== false) {
        Notify.success("نظر با موفقیت حذف شد.");
        navigate("/comment");
      } else {
        Notify.error(res?.message || "حذف نظر ناموفق بود");
      }
    } catch (err) {
      Notify.error(err.message || "حذف نظر ناموفق بود");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col">
        <PageHeader
          title="جزئیات نظر دانش‌آموز"
          subtitle="در حال دریافت اطلاعات نظر..."
          backTo="/comment"
        />
        <LoadingState text="در حال بارگذاری اطلاعات نظر..." minHeight="min-h-[440px]" />
      </div>
    );
  }

  if (!comment) {
    return (
      <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col">
        <PageHeader
          title="نظر یافت نشد"
          backTo="/comment"
        />
        <div className="p-12 text-center text-text-muted bg-surface rounded-2xl border border-dashed border-border mt-4">
          اطلاعات نظر یافت نشد یا ممکن است این نظر حذف شده باشد.
          <div className="mt-4">
            <Button variant="secondary" size="sm" onClick={() => navigate("/comment")}>
              بازگشت به لیست نظرات
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const avatarUrl = getImageUrl(comment.img);
  const course = comment.course;
  const courseTitle = course?.title || "دوره مشخص‌نشده";
  const courseCategory = course?.category;
  const isVirtual = comment.courseModel === "VirtualCourse" || course?.type === "مجازی";
  const coursePath = course?._id
    ? isVirtual
      ? `/virtual-courses/${course._id}`
      : `/in-person-courses/${course._id}`
    : null;

  const formattedDate = comment.createdAt
    ? formatJalaliDate(comment.createdAt, { withTime: true })
    : null;

  return (
    <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col">
      {/* Top Header */}
      <PageHeader
        title={`نظر ${comment.name || "کاربر"}`}
        subtitle={`ثبت شده برای دوره «${courseTitle}»`}
        backTo="/comment"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              icon={<EditIcon fontSize="small" />}
              onClick={() => navigate(`/comment/update/${comment._id}`)}
            >
              ویرایش نظر
            </Button>

            <Button
              variant="danger"
              size="sm"
              icon={<DeleteOutlineIcon fontSize="small" />}
              onClick={handleDelete}
              disabled={isDeleting}
            >
              حذف نظر
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Col (1): Author & Linked Course Card */}
        <div className="flex flex-col gap-6">
          {/* Author Card */}
          <Card className="p-6 flex flex-col gap-5">
            <h3 className="text-sm font-extrabold text-secondary border-b border-border/80 pb-3">
              مشخصات نظردهنده
            </h3>

            <div className="flex items-center gap-4">
              <img
                src={avatarUrl}
                alt={comment.name || "کاربر"}
                className="w-16 h-16 object-cover rounded-2xl border-2 border-primary-border shadow-sm shrink-0"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-avatars/default-BoyStudent.png";
                }}
              />
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-secondary text-base">
                  {comment.name || "بدون نام"}
                </span>
                <span className="text-xs text-text-muted mt-1 flex items-center gap-1">
                  <PersonOutlineIcon style={{ fontSize: "0.95rem" }} className="text-primary" />
                  {comment.role || "نقش تعریف‌نشده"}
                </span>
                {comment.job && (
                  <span className="text-xs text-text-secondary mt-1 flex items-center gap-1">
                    <WorkOutlineIcon style={{ fontSize: "0.9rem" }} className="text-text-muted" />
                    {comment.job}
                  </span>
                )}
              </div>
            </div>

            {formattedDate && (
              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-text-muted">
                <span className="flex items-center gap-1.5">
                  <CalendarTodayOutlinedIcon style={{ fontSize: "0.85rem" }} />
                  تاریخ ثبت:
                </span>
                <span className="font-medium">{toPersianDigits(formattedDate)}</span>
              </div>
            )}
          </Card>

          {/* Linked Course Card */}
          <Card className="p-6 flex flex-col gap-4">
            <h3 className="text-sm font-extrabold text-secondary border-b border-border/80 pb-3 flex items-center justify-between">
              <span>دوره آموزشی مرتبط</span>
              <SchoolIcon fontSize="small" className="text-primary" />
            </h3>

            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-sm text-secondary leading-snug">
                  {courseTitle}
                </span>
                {courseCategory && (
                  <Badge variant="purple" size="sm">
                    {courseCategory}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-text-muted">
                <span>نوع دوره:</span>
                <Badge variant={isVirtual ? "blue" : "success"} size="sm">
                  {isVirtual ? "دوره مجازی (ویدیوئی)" : "دوره حضوری"}
                </Badge>
              </div>

              {coursePath && (
                <div className="pt-2">
                  <Link
                    to={coursePath}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover transition-colors"
                  >
                    <span>مشاهده صفحه دوره</span>
                    <OpenInNewIcon style={{ fontSize: "0.95rem" }} />
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Col (2 cols): Full Comment & Live Site Preview */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Main Full Comment Display */}
          <Card className="p-6 sm:p-8 flex flex-col gap-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div className="flex items-center gap-2">
                <FormatQuoteIcon className="text-primary transform -scale-x-100" fontSize="medium" />
                <h3 className="text-base font-extrabold text-secondary">متن کامل دیدگاه</h3>
              </div>
              <Badge variant="success" size="sm">
                تأیید شده / فعال
              </Badge>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-bg-light/70 border border-border/70 relative">
              <p className="text-sm sm:text-base text-text-primary leading-loose font-medium whitespace-pre-line">
                {comment.comment}
              </p>
            </div>
          </Card>

          {/* Client-Fidelity Preview Box */}
          <Card className="p-6 sm:p-8 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-secondary">
                  پیش‌نمایش در وب‌سایت اصلی (Client Preview)
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  ظاهر و قالب این نظر در بخش نظرات دانشجویان در صفحه دوره
                </p>
              </div>
              <span className="text-[11px] font-bold text-primary bg-primary-light px-2.5 py-1 rounded-lg border border-primary-border">
                طراحی سایت
              </span>
            </div>

            {/* Mock website testimonial card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-surface to-bg-light border border-border shadow-md max-w-xl mx-auto w-full">
              <div className="flex items-center gap-3.5 mb-4">
                <img
                  src={avatarUrl}
                  alt={comment.name || "کاربر"}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/30"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-avatars/default-BoyStudent.png";
                  }}
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-sm text-secondary">
                    {comment.name}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-text-muted mt-0.5">
                    <span>{comment.role}</span>
                    {comment.job && (
                      <>
                        <span>•</span>
                        <span className="text-text-secondary">{comment.job}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative bg-surface/90 p-4 rounded-xl border border-border/60 text-xs sm:text-sm text-text-secondary leading-relaxed">
                <FormatQuoteIcon
                  className="text-primary/20 absolute -top-3 start-2"
                  style={{ fontSize: "2rem" }}
                />
                <p className="relative z-10">«{comment.comment}»</p>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-text-muted">
                <span className="font-medium text-primary">دوره {courseTitle}</span>
                <span>{formattedDate ? toPersianDigits(formattedDate) : ""}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
