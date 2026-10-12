import React from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { Card } from "../../../Components/UI";
import { getImageUrl } from "../../../Utils/getImageUrl";

export default function CommentCard({ comment, onEdit, onDelete, onView }) {
  const courseTitle = comment.course?.title || "دوره مشخص‌نشده";
  const courseCategory = comment.course?.category;
  const avatarUrl = getImageUrl(comment.img);

  return (
    <Card
      hoverable
      className="group relative p-4 sm:p-5 flex flex-col justify-between h-full rounded-2xl sm:rounded-3xl border border-border/80 hover:border-primary/40 bg-surface shadow-xs hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
    >
      <div>
        {/* Top Meta Bar: Course Tag & Category Badge */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-primary-soft/80 text-secondary text-[11px] sm:text-xs font-bold border border-primary-border/60 max-w-[70%] sm:max-w-[75%]"
            title={courseTitle}
          >
            <SchoolOutlinedIcon style={{ fontSize: "0.95rem" }} className="text-primary shrink-0" />
            <span className="truncate">{courseTitle}</span>
          </div>

          {courseCategory && (
            <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-lg bg-surface-muted text-text-muted border border-border/70 shrink-0">
              {courseCategory}
            </span>
          )}
        </div>

        {/* Commenter Profile: Avatar, Name, Role, Job */}
        <div
          className="flex items-center gap-3 cursor-pointer group/author mb-3"
          onClick={() => onView && onView(comment._id)}
          title="مشاهده جزئیات نظر"
        >
          <div className="relative shrink-0">
            <img
              src={avatarUrl}
              alt={comment.name || "کاربر"}
              className="w-11 h-11 sm:w-12 sm:h-12 object-cover rounded-2xl ring-2 ring-border/80 group-hover/author:ring-primary/50 shadow-2xs transition-all duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-avatars/default-BoyStudent.png";
              }}
            />
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-black text-secondary text-sm sm:text-base line-clamp-1 group-hover/author:text-primary transition-colors tracking-tight">
              {comment.name}
            </span>

            <div className="flex items-center gap-1.5 flex-wrap text-xs text-text-muted mt-1">
              <span className="inline-flex items-center gap-1 font-semibold text-text-secondary bg-bg-light/80 px-2 py-0.5 rounded-lg border border-border/50 text-[11px]">
                <PersonOutlineIcon style={{ fontSize: "0.85rem" }} className="text-primary" />
                {comment.role || "دانشجو"}
              </span>

              {comment.job && (
                <span className="inline-flex items-center gap-1 text-text-muted text-[11px] truncate max-w-[130px] sm:max-w-[160px]">
                  <WorkOutlineIcon style={{ fontSize: "0.8rem" }} />
                  {comment.job}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Comment Speech Bubble */}
        <div
          onClick={() => onView && onView(comment._id)}
          className="relative my-2 sm:my-3 p-3.5 sm:p-4 rounded-2xl bg-bg-light/60 border border-border/60 group-hover:bg-bg-light/90 group-hover:border-primary/20 transition-all duration-300 cursor-pointer overflow-hidden"
          title="مشاهده متن کامل نظر"
        >
          {/* Decorative Watermark Quote Icon */}
          <FormatQuoteIcon
            className="absolute -top-1 -start-1 text-primary/10 group-hover:text-primary/20 transition-colors pointer-events-none transform -scale-x-100"
            style={{ fontSize: "2.75rem" }}
          />

          <p className="relative z-10 text-xs sm:text-sm text-text-secondary group-hover:text-text-primary leading-relaxed line-clamp-3 sm:line-clamp-4 font-normal select-text">
            {comment.comment}
          </p>
        </div>
      </div>

      {/* Action Footer: Responsive, Touch-Friendly */}
      <div className="pt-3 sm:pt-3.5 border-t border-border/80 flex items-center justify-between gap-2 mt-auto">
        <button
          type="button"
          onClick={() => onView && onView(comment._id)}
          className="flex-1 h-9 px-3 rounded-xl bg-surface hover:bg-primary-soft text-text-secondary hover:text-primary border border-border hover:border-primary-border text-xs font-black inline-flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-2xs group/btn"
        >
          <VisibilityOutlinedIcon style={{ fontSize: "15px" }} className="group-hover/btn:scale-110 transition-transform" />
          <span>مشاهده جزئیات</span>
        </button>

        <button
          type="button"
          onClick={() => onEdit(comment._id)}
          className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-xl flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary-soft border border-border/70 hover:border-primary-border transition-all duration-200 cursor-pointer"
          title="ویرایش نظر"
          aria-label="ویرایش نظر"
        >
          <EditOutlinedIcon style={{ fontSize: "16px" }} />
        </button>

        <button
          type="button"
          onClick={() => onDelete(comment._id)}
          className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-xl flex items-center justify-center text-text-muted hover:text-error hover:bg-error-light border border-border/70 hover:border-error-border transition-all duration-200 cursor-pointer"
          title="حذف نظر"
          aria-label="حذف نظر"
        >
          <DeleteOutlineIcon style={{ fontSize: "16px" }} />
        </button>
      </div>
    </Card>
  );
}
