import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Visibility from "@mui/icons-material/Visibility";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import { getImageUrl } from "../../../../Utils/getImageUrl";
import { Card, Badge, Button, IconButton } from "../../../../Components/UI";
import { toPersianDigits } from "../../../../Utils/jalaliDate";

export default function InPersonCourseCard({ course, onEdit, onDelete, onView }) {
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
        {/* Top Header: Category Tag & InPerson Badge */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <Badge variant={getCategoryBadgeVariant(course.category)} size="md" dot>
            {course.category}
          </Badge>

          <Badge variant={course.courseType === "کارگاه حضوری" ? "amber" : "primary"} size="sm">
            {course.courseType || "دوره حضوری"}
          </Badge>
        </div>

        {/* Course Image & Title */}
        <div className="flex items-center gap-3.5 mb-3">
          <div
            onClick={() => onView && onView(course)}
            className="w-13 h-13 rounded-2xl bg-primary-light border border-primary-border flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform text-primary cursor-pointer"
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
              <SchoolOutlinedIcon className="text-primary" />
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

        {/* Location & Sessions Preview */}
        <div className="flex flex-col gap-1.5 mb-4 bg-bg-light/50 rounded-xl p-2.5 border border-border/60">
          <div className="flex items-center gap-1.5 text-xs text-text-secondary truncate">
            <PlaceOutlinedIcon style={{ fontSize: "1rem" }} className="text-primary shrink-0" />
            <span className="truncate">{course.location?.address || "محل برگزاری نامشخص"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <ClassOutlinedIcon style={{ fontSize: "0.95rem" }} className="text-secondary shrink-0" />
            <span>کدهای فعال: {toPersianDigits(course.sessions?.length || 0)} کد کلاس</span>
          </div>
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

        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            icon={<Visibility fontSize="small" />}
            onClick={() => onView && onView(course)}
          >
            مشاهده
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
      </div>
    </Card>
  );
}
