import React, { useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Card } from "../../../Components/UI";
import { toPersianDigits, toJalaliDate, toJalaliDateTime, getRelativeTime } from "../../../Utils/jalaliDate";
import CourseCommentReplies from "./CourseCommentReplies";

export default function CourseCommentCard({
  comment,
  onToggleHeart,
  onTogglePin,
  onDelete,
  onOpenUserProfile,
}) {
  const [showReplies, setShowReplies] = useState(false);
  const [localReplyCount, setLocalReplyCount] = useState(comment.replyCount || 0);

  const author = comment.user;
  const authorName = author?.fullName || "کاربر ناشناس";
  const isAdmin = Boolean(comment.isAdminReply || author?.role === "admin");
  const isEnrolled = Boolean(comment.isEnrolledStudent);
  const isQa = comment.type === "qa";

  const handleReplyAdded = () => {
    setLocalReplyCount((prev) => prev + 1);
  };

  const handleReplyDeleted = () => {
    setLocalReplyCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <Card
      className={`p-3.5 sm:p-5 rounded-2xl transition-all duration-200 border ${
        comment.isPinned
          ? "border-amber-400/50 bg-amber-500/[0.02] shadow-2xs"
          : "border-border/80 hover:border-border-hover bg-surface shadow-xs"
      }`}
    >
      {/* Pinned Announcement - Subtle YouTube Style */}
      {comment.isPinned && (
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2.5 ps-0.5 select-none">
          <PushPinIcon style={{ fontSize: "14px", transform: "rotate(45deg)" }} />
          <span>سنجاق شده توسط آموزشگاه</span>
        </div>
      )}

      {/* Main 2-Column Row: Circular Avatar + Content Stream */}
      <div className="flex items-start gap-3 sm:gap-3.5">
        {/* User Circular Avatar */}
        <button
          type="button"
          onClick={() => author?._id && onOpenUserProfile?.(author)}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-black cursor-pointer shrink-0 transition-transform hover:scale-105 shadow-2xs ${
            isAdmin
              ? "bg-secondary text-primary ring-2 ring-primary/30"
              : "bg-surface-hover text-text-secondary border border-border"
          }`}
          title="مشاهده پروفایل کاربر"
        >
          {authorName.charAt(0) || "ک"}
        </button>

        {/* Content Column */}
        <div className="flex-1 min-w-0">
          {/* Header Line (YouTube Single-Line Flow: Name • Status • Time) */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap leading-tight">
            {/* Author Name */}
            <button
              type="button"
              onClick={() => author?._id && onOpenUserProfile?.(author)}
              className="text-xs sm:text-sm font-black text-secondary hover:text-primary transition-colors cursor-pointer truncate max-w-[150px] sm:max-w-none text-right"
            >
              {authorName}
            </button>

            {/* Admin Badge */}
            {isAdmin && (
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-secondary text-primary flex items-center gap-0.5 shrink-0">
                <VerifiedIcon style={{ fontSize: "11px" }} />
                مدیریت
              </span>
            )}

            {/* Enrolled Student Tag */}
            {!isAdmin && isEnrolled && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 shrink-0">
                دانشجو
              </span>
            )}

            {/* Type Marker */}
            <span className="text-[10px] text-text-muted shrink-0">
              {isQa ? "• پرسش" : "• دیدگاه"}
            </span>

            {/* Relative Timestamp */}
            <span
              className="text-[11px] text-text-muted hover:text-text-secondary cursor-default shrink-0"
              title={toJalaliDateTime(comment.createdAt)}
            >
              • {getRelativeTime(comment.createdAt)}
            </span>
          </div>

          {/* Comment Body Text (YouTube Style: clean, unboxed, natural reading) */}
          <div className="mt-1.5 mb-2 text-xs sm:text-sm text-text-primary leading-relaxed whitespace-pre-wrap select-text break-words">
            {comment.text}
          </div>

          {/* YouTube Action Bar: Tightly Grouped Inline Controls */}
          <div className="flex items-center gap-1 sm:gap-1.5 text-text-muted select-none flex-wrap -ms-1.5">
            {/* Like */}
            <button
              type="button"
              className="inline-flex items-center gap-1 h-7.5 px-2 rounded-full hover:bg-surface-hover hover:text-text-primary transition-colors cursor-pointer text-xs"
              title="پسندیدن"
            >
              <ThumbUpOutlinedIcon style={{ fontSize: "14px" }} />
              {comment.likesCount > 0 && (
                <span className="font-semibold text-[11px]">{toPersianDigits(comment.likesCount)}</span>
              )}
            </button>

            {/* Dislike */}
            <button
              type="button"
              className="inline-flex items-center gap-1 h-7.5 px-2 rounded-full hover:bg-surface-hover hover:text-text-primary transition-colors cursor-pointer text-xs"
              title="نپسندیدن"
            >
              <ThumbDownOutlinedIcon style={{ fontSize: "14px" }} />
              {comment.dislikesCount > 0 && (
                <span className="font-semibold text-[11px]">{toPersianDigits(comment.dislikesCount)}</span>
              )}
            </button>

            {/* Creator Heart (YouTube Style) */}
            <button
              type="button"
              onClick={() => onToggleHeart?.(comment._id)}
              className={`inline-flex items-center gap-1 h-7.5 px-2 rounded-full transition-colors cursor-pointer text-xs ${
                comment.isHeartedByAdmin
                  ? "text-rose-500 hover:bg-rose-500/10 font-bold"
                  : "hover:bg-surface-hover hover:text-rose-500"
              }`}
              title={comment.isHeartedByAdmin ? "برداشتن قلب آموزشگاه" : "ثبت قلب آموزشگاه"}
            >
              {comment.isHeartedByAdmin ? (
                <FavoriteIcon style={{ fontSize: "15px" }} />
              ) : (
                <FavoriteBorderIcon style={{ fontSize: "15px" }} />
              )}
              {comment.isHeartedByAdmin && (
                <span className="text-[10px] hidden sm:inline">قلب آموزشگاه</span>
              )}
            </button>

            {/* Pin Toggle */}
            <button
              type="button"
              onClick={() => onTogglePin?.(comment._id)}
              className={`inline-flex items-center justify-center w-7.5 h-7.5 rounded-full transition-colors cursor-pointer text-xs ${
                comment.isPinned
                  ? "text-amber-600 bg-amber-500/15 hover:bg-amber-500/25"
                  : "hover:bg-surface-hover hover:text-amber-600"
              }`}
              title={comment.isPinned ? "برداشتن سنجاق" : "سنجاق به بالای صفحه"}
            >
              {comment.isPinned ? (
                <PushPinIcon style={{ fontSize: "14px" }} />
              ) : (
                <PushPinOutlinedIcon style={{ fontSize: "14px" }} />
              )}
            </button>

            {/* Reply Button */}
            <button
              type="button"
              onClick={() => setShowReplies(true)}
              className="h-7.5 px-2.5 rounded-full hover:bg-surface-hover hover:text-text-primary text-xs font-bold transition-colors cursor-pointer"
            >
              پاسخ
            </button>

            {/* Delete Button */}
            <button
              type="button"
              onClick={() => onDelete?.(comment._id)}
              className="inline-flex items-center justify-center w-7.5 h-7.5 rounded-full hover:bg-error-light hover:text-error transition-colors cursor-pointer"
              title="حذف دیدگاه"
            >
              <DeleteOutlineIcon style={{ fontSize: "15px" }} />
            </button>
          </div>

          {/* YouTube-style Replies Dropdown Trigger */}
          {localReplyCount > 0 && (
            <div className="mt-1.5">
              <button
                type="button"
                onClick={() => setShowReplies(!showReplies)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover hover:bg-primary-soft/50 py-1 px-2.5 rounded-full transition-colors cursor-pointer -ms-1.5"
              >
                <KeyboardArrowDownIcon
                  style={{
                    fontSize: "16px",
                    transform: showReplies ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                />
                <span>
                  {showReplies
                    ? "بستن پاسخ‌ها"
                    : `${toPersianDigits(localReplyCount)} پاسخ`}
                </span>
              </button>
            </div>
          )}

          {/* Nested Replies Drawer / Accordion */}
          {showReplies && (
            <div className="mt-3">
              <CourseCommentReplies
                parentId={comment._id}
                courseId={comment.course?._id || comment.course}
                parentAuthor={authorName}
                onReplyAdded={handleReplyAdded}
                onReplyDeleted={handleReplyDeleted}
                onOpenUserProfile={onOpenUserProfile}
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
