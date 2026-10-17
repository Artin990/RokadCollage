import React from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Visibility from "@mui/icons-material/Visibility";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import OndemandVideoOutlinedIcon from "@mui/icons-material/OndemandVideoOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import { getImageUrl } from "../../../../Utils/getImageUrl";
import { Card, Badge, Button, IconButton } from "../../../../Components/UI";
import { toPersianDigits } from "../../../../Utils/jalaliDate";

export default function VirtualCourseCard({ course, onEdit, onDelete, onView, onManageComments }) {
  const navigate = useNavigate();
  const getCategoryBadgeVariant = (category) => {
    switch (category) {
      case "فناوری اطلاعات":
        return "blue";
      case "کسب و کار":
      case "MBA":
        return "amber";
      case "زبان‌های خارجی":
      case "زبان":
        return "success";
      case "مشاوره":
        return "pink";
      case "گرافیک":
        return "purple";
      default:
        return "primary";
    }
  };

  const basePrice = Number(course.price) || 0;
  const isDiscountActive = Boolean(course.isDiscountActive && course.activeDiscountPercentage > 0);
  const finalPrice = course.finalPrice != null ? Number(course.finalPrice) : basePrice;

  return (
    <Card hoverable className="p-5 flex flex-col justify-between h-full group">
      <div>
        {/* Top Header: Category Tag & Virtual Badge */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <Badge variant={getCategoryBadgeVariant(course.category)} size="md" dot>
            {course.category}
          </Badge>

          <Badge variant="purple" size="sm">
            مجازی
          </Badge>
        </div>

        {/* Course Image & Title */}
        <div className="flex items-center gap-3.5 mb-3">
          <div
            onClick={() => onView && onView(course)}
            className="w-13 h-13 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform text-purple-600 cursor-pointer"
            title="مشاهده جزئیات دوره"
          >
            {course.img ? (
              <img
                src={getImageUrl(course.img)}
                alt={course.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <OndemandVideoOutlinedIcon className="text-purple-600" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3
              onClick={() => onView && onView(course)}
              className="font-bold text-secondary text-base truncate group-hover:text-primary transition-colors cursor-pointer"
              title={course.title}
            >
              {course.title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-text-muted mt-1">
              <AccessTimeIcon style={{ fontSize: "0.95rem" }} />
              <span>{course.duration || "مدت نامشخص"}</span>
            </div>
          </div>
        </div>

        {/* SpotPlayer Badge Indicator (Clickable to open single course page) */}
        <div
          onClick={() => onView && onView(course)}
          className="mb-4 bg-purple-50/70 hover:bg-purple-100/80 border border-purple-200/60 hover:border-purple-300 rounded-xl p-2.5 flex items-center justify-between gap-2 cursor-pointer transition-all duration-200 group/spot hover:shadow-xs active:scale-[0.99]"
          title="مشاهده صفحه تک دوره"
        >
          <div className="flex items-center gap-1.5 text-xs text-purple-900 font-medium group-hover/spot:text-purple-950">
            <VpnKeyOutlinedIcon style={{ fontSize: "1rem" }} className="text-purple-600 shrink-0 group-hover/spot:scale-110 transition-transform" />
            <span>شناسه اسپات‌پلیر:</span>
          </div>
          <span
            className="font-mono text-[11px] font-bold text-purple-700 group-hover/spot:text-purple-900 truncate max-w-[140px] group-hover/spot:underline underline-offset-2"
            title={course.spotplayerCourseId || "تعریف نشده"}
            dir="ltr"
          >
            {course.spotplayerCourseId || "ثبت نشده"}
          </span>
        </div>

        {/* Sprints & Teachers count */}
        <div className="flex items-center justify-between py-2.5 border-y border-border/60 text-xs text-text-secondary mb-4">
          <span>سرفصل‌ها: {toPersianDigits(course.sprints?.length || 0)} بخش</span>
          <span>مدرسین: {toPersianDigits(course.teachers?.length || 0)} نفر</span>
        </div>
      </div>

      {/* Pricing & Footer Actions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-text-muted">هزینه دوره:</span>
          {basePrice > 0 ? (
            <div className="flex flex-col items-end">
              {isDiscountActive ? (
                <>
                  <span className="text-xs text-text-muted line-through">
                    {basePrice.toLocaleString("fa-IR")} تومان
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-700 border border-amber-500/30">
                      {course.activeDiscountPercentage}٪
                    </span>
                    <span className="font-extrabold text-primary text-base">
                      {finalPrice.toLocaleString("fa-IR")} تومان
                    </span>
                  </div>
                </>
              ) : (
                <span className="font-bold text-secondary text-sm">
                  {basePrice.toLocaleString("fa-IR")} تومان
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs font-bold text-success bg-success-light px-2 py-0.5 rounded-lg border border-success-border">
              رایگان
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              icon={<Visibility fontSize="small" />}
              onClick={() => onView && onView(course)}
            >
              مشاهده دوره
            </Button>

            <IconButton
              variant="ghost"
              size="sm"
              icon={<EditIcon fontSize="small" />}
              onClick={() => onEdit && onEdit(course)}
              aria-label="ویرایش دوره"
              title="ویرایش دوره"
            />

            <IconButton
              variant="danger"
              size="sm"
              icon={<DeleteOutlineIcon fontSize="small" />}
              onClick={() => onDelete && onDelete(course)}
              aria-label="حذف دوره"
              title="حذف دوره"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs font-bold py-1.5 hover:bg-primary/10 hover:border-primary hover:text-primary transition-all duration-200"
            icon={<ForumOutlinedIcon style={{ fontSize: "1rem" }} />}
            onClick={() => {
              if (onManageComments) {
                onManageComments(course);
              } else {
                navigate(`/virtual-courses/${course._id}/comments`);
              }
            }}
          >
            مدیریت کامنت‌ها
          </Button>
        </div>
      </div>
    </Card>
  );
}
