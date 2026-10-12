import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import Visibility from "@mui/icons-material/Visibility";
import { getImageUrl } from "../../../Utils/getImageUrl";
import { formatJalaliDate } from "../../../Utils/jalaliDate";
import { Card, Badge, Button, IconButton } from "../../../Components/UI";

export default function BlogCard({ blog, onEdit, onDelete, onView }) {
  const getCategoryVariant = (cat) => {
    switch (cat) {
      case "گرافیک":
        return "purple";
      case "مسیر شغلی":
        return "amber";
      case "MBA":
        return "primary";
      case "زبان":
        return "success";
      case "فرانتاند":
        return "blue";
      case "بکاند":
        return "indigo";
      default:
        return "neutral";
    }
  };

  const imageUrl = getImageUrl(blog.img);
  const formattedDate = blog.createdAt
    ? formatJalaliDate(blog.createdAt, { withTime: false })
    : null;

  return (
    <Card hoverable className="overflow-hidden flex flex-col justify-between h-full group">
      <div>
        {/* Blog Image */}
        <div
          className="w-full h-44 bg-surface-hover relative overflow-hidden cursor-pointer"
          onClick={() => (onView ? onView(blog) : onEdit?.(blog))}
          title="مشاهده مقاله"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">
              بدون تصویر
            </div>
          )}

          {/* Category Badge overlay */}
          <div className="absolute top-3 start-3">
            <Badge variant={getCategoryVariant(blog.category)} size="sm">
              {blog.category}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {formattedDate && (
            <div className="flex items-center gap-1.5 text-[11px] text-text-muted mb-2 font-medium">
              <CalendarTodayOutlinedIcon style={{ fontSize: 13 }} />
              <span>{formattedDate}</span>
            </div>
          )}

          <h3
            className="font-bold text-secondary text-base mb-2 line-clamp-1 group-hover:text-primary transition-colors cursor-pointer"
            onClick={() => (onView ? onView(blog) : onEdit?.(blog))}
            title={blog.title}
          >
            {blog.title}
          </h3>

          <p className="text-text-secondary text-xs leading-relaxed line-clamp-3">
            {blog.description}
          </p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-5 pb-5 pt-3 border-t border-border flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          icon={<Visibility fontSize="small" />}
          onClick={() => onView && onView(blog)}
        >
          مشاهده
        </Button>

        <IconButton
          variant="ghost"
          size="sm"
          icon={<EditIcon fontSize="small" />}
          onClick={() => onEdit && onEdit(blog)}
          aria-label="ویرایش مقاله"
          title="ویرایش مقاله"
        />

        <IconButton
          variant="danger"
          size="sm"
          icon={<DeleteOutlineIcon fontSize="small" />}
          onClick={() => onDelete && onDelete(blog)}
          title="حذف مقاله"
          aria-label="حذف مقاله"
        />
      </div>
    </Card>
  );
}
