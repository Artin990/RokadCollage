import React from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { getImageUrl } from "../../../Utils/getImageUrl";
import { Card, Badge } from "../../../Components/UI";

export default function SingleCourseHero({ course }) {
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

  return (
    <Card className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm border border-border">
      <div className="flex items-center gap-5">
        {/* Course Image */}
        <div className="w-18 h-18 md:w-20 md:h-20 rounded-2xl bg-primary-light border-2 border-primary-border flex items-center justify-center overflow-hidden shrink-0 shadow-2xs text-primary">
          {course.img ? (
            <img
              src={getImageUrl(course.img)}
              alt={course.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <span className="text-xs text-text-muted">بدون تصویر</span>
          )}
        </div>

        {/* Title, Category & Type */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={getCategoryBadgeVariant(course.category)} size="md" dot>
              {course.category}
            </Badge>
            <Badge variant="info" size="sm">
              {course.type}
            </Badge>
          </div>

          <h2 className="text-xl md:text-2xl font-black text-secondary leading-snug">
            {course.title}
          </h2>

          <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-text-muted">
            <div className="flex items-center gap-1.5">
              <AccessTimeIcon style={{ fontSize: "1.1rem" }} />
              <span>مدت دوره: {course.duration}</span>
            </div>

            <span className="text-border">•</span>

            {/* Dynamic Price and Discount Status */}
            {Number(course.price) > 0 ? (
              <div className="flex items-center gap-2">
                {course.isDiscountActive && course.activeDiscountPercentage > 0 ? (
                  <>
                    <span className="text-xs text-text-muted line-through">
                      {Number(course.price).toLocaleString("fa-IR")} تومان
                    </span>
                    <span className="text-sm font-black text-primary">
                      {Number(course.finalPrice).toLocaleString("fa-IR")} تومان
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-700 border border-amber-500/30">
                      {course.activeDiscountPercentage}٪ تخفیف
                    </span>
                  </>
                ) : (
                  <span className="font-bold text-secondary text-sm">
                    {Number(course.price).toLocaleString("fa-IR")} تومان
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs font-bold text-success bg-success-light px-2.5 py-0.5 rounded-lg border border-success-border">
                رایگان
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tags */}
      {course.tags && course.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 md:max-w-xs self-start md:self-center">
          {course.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs font-semibold bg-bg-light text-text-secondary px-3 py-1 rounded-xl border border-border/80 shadow-2xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}
