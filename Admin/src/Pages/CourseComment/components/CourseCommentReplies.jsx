import React, { useState, useEffect } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SchoolIcon from "@mui/icons-material/School";
import VerifiedIcon from "@mui/icons-material/Verified";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import Notify from "../../../Utils/notify";
import confirm from "../../../Utils/confirm";
import Loading from "../../../Components/Loading";
import { Button, IconButton, Badge } from "../../../Components/UI";
import { toPersianDigits, toJalaliDateTime, getRelativeTime } from "../../../Utils/jalaliDate";
import {
  fetchCommentReplies,
  replyToCourseComment,
  deleteCourseComment,
  toggleAdminHeart,
} from "../api/courseCommentApi";

export default function CourseCommentReplies({
  parentId,
  courseId,
  parentAuthor = "کاربر",
  onReplyAdded,
  onReplyDeleted,
  onOpenUserProfile,
}) {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadReplies = async () => {
    setLoading(true);
    try {
      const res = await fetchCommentReplies(parentId);
      if (res && res.data) {
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
          ? res.data.data
          : [];
        setReplies(list);
      }
    } catch (err) {
      Notify.error(err.response?.data?.message || err.message || "خطا در دریافت پاسخ‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (parentId) {
      loadReplies();
    }
  }, [parentId]);

  const handleSendReply = async (e) => {
    e.preventDefault();
    const text = replyText.trim();
    if (!text) {
      Notify.error("لطفاً متن پاسخ را بنویسید");
      return;
    }
    if (text.length < 2) {
      Notify.error("متن پاسخ باید حداقل ۲ کاراکتر باشد");
      return;
    }

    setSubmitting(true);
    try {
      const res = await replyToCourseComment(parentId, { text, courseId });
      if (res && res.success !== false) {
        Notify.success("پاسخ شما با موفقیت ثبت شد");
        setReplyText("");
        const newReply = res.data;
        if (newReply) {
          setReplies((prev) => [...prev, newReply]);
        } else {
          loadReplies();
        }
        if (onReplyAdded) onReplyAdded();
      } else {
        Notify.error(res?.message || "ثبت پاسخ با خطا مواجه شد");
      }
    } catch (err) {
      Notify.error(err.response?.data?.message || err.message || "خطا در ارسال پاسخ");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReply = async (replyId) => {
    const isConfirmed = await confirm(
      "آیا از حذف این پاسخ اطمینان دارید؟",
      "این پاسخ برای همیشه حذف خواهد شد.",
      "بله، حذف شود"
    );
    if (!isConfirmed) return;

    setDeletingId(replyId);
    try {
      const res = await deleteCourseComment(replyId);
      if (res && res.success !== false) {
        Notify.success("پاسخ با موفقیت حذف شد");
        setReplies((prev) => prev.filter((r) => r._id !== replyId));
        if (onReplyDeleted) onReplyDeleted();
      } else {
        Notify.error(res?.message || "خطا در حذف پاسخ");
      }
    } catch (err) {
      Notify.error(err.response?.data?.message || err.message || "خطا در حذف پاسخ");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleHeart = async (replyId) => {
    try {
      const res = await toggleAdminHeart(replyId);
      if (res && res.success !== false) {
        const isHearted = Boolean(res.data?.isHeartedByAdmin);
        setReplies((prev) =>
          prev.map((r) => (r._id === replyId ? { ...r, isHeartedByAdmin: isHearted } : r))
        );
        Notify.success(isHearted ? "قلب آموزشگاه برای پاسخ ثبت شد" : "قلب آموزشگاه برداشته شد");
      }
    } catch (err) {
      Notify.error(err.response?.data?.message || err.message || "خطا در ثبت قلب");
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-3 pt-3 border-t border-border/70 ps-3 sm:ps-5 pe-0 border-s-2 border-primary/40">
      {/* Title */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-secondary flex items-center gap-1.5">
          <span>پاسخ‌های ثبت‌شده</span>
          <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-[11px] font-extrabold">
            {toPersianDigits(replies.length)}
          </span>
        </span>
      </div>

      {/* Replies Loading / List */}
      {loading ? (
        <div className="flex items-center justify-center py-5 gap-2 text-text-muted text-xs bg-bg-light/40 rounded-xl min-h-[72px] border border-border/40">
          <Loading size={6} />
          <span className="font-medium">در حال بارگذاری پاسخ‌ها...</span>
        </div>
      ) : replies.length === 0 ? (
        <div className="text-center py-4 px-3 bg-bg-light/60 rounded-xl text-xs text-text-muted">
          هنوز پاسخی برای این دیدگاه ثبت نشده است. شما می‌توانید اولین پاسخ را ارسال کنید.
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {replies.map((reply) => {
            const author = reply.user;
            const authorName = author?.fullName || "کاربر ناشناس";
            const isAdmin = Boolean(reply.isAdminReply || author?.role === "admin");
            const isEnrolled = Boolean(reply.isEnrolledStudent);

            return (
              <div
                key={reply._id}
                className={`p-3 rounded-2xl border transition-colors ${
                  isAdmin
                    ? "bg-amber-500/5 border-primary/30"
                    : "bg-surface border-border/60"
                }`}
              >
                <div className="flex items-start gap-2.5 sm:gap-3">
                  {/* User Circular Avatar */}
                  <button
                    type="button"
                    onClick={() => author?._id && onOpenUserProfile?.(author)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black cursor-pointer shrink-0 transition-transform hover:scale-105 shadow-2xs ${
                      isAdmin
                        ? "bg-secondary text-primary ring-1 ring-primary/40"
                        : "bg-surface-hover text-text-secondary border border-border"
                    }`}
                    title="مشاهده پروفایل کاربر"
                  >
                    {authorName.charAt(0) || "ک"}
                  </button>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header: Single-line YouTube stream */}
                    <div className="flex items-center gap-1.5 flex-wrap text-xs leading-none">
                      <button
                        type="button"
                        onClick={() => author?._id && onOpenUserProfile?.(author)}
                        className="font-bold text-xs text-text-primary hover:text-primary transition-colors cursor-pointer truncate max-w-[140px] sm:max-w-none text-right"
                      >
                        {authorName}
                      </button>

                      {isAdmin && (
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-secondary text-primary flex items-center gap-0.5 shrink-0">
                          <VerifiedIcon style={{ fontSize: "10px" }} />
                          مدیریت
                        </span>
                      )}

                      {!isAdmin && isEnrolled && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 shrink-0">
                          دانشجو
                        </span>
                      )}

                      <span
                        className="text-[10px] text-text-muted hover:text-text-secondary cursor-default shrink-0"
                        title={toJalaliDateTime(reply.createdAt)}
                      >
                        • {getRelativeTime(reply.createdAt)}
                      </span>
                    </div>

                    {/* Body Text */}
                    <p className="mt-1.5 text-xs text-text-primary leading-relaxed whitespace-pre-wrap select-text break-words">
                      {reply.text}
                    </p>

                    {/* YouTube Style Compact Inline Actions */}
                    <div className="flex items-center gap-2 mt-1.5 text-text-muted text-xs select-none">
                      {(reply.likesCount > 0 || reply.dislikesCount > 0) && (
                        <div className="flex items-center gap-2 text-[11px] text-text-muted">
                          {reply.likesCount > 0 && (
                            <span className="flex items-center gap-1">
                              <ThumbUpOutlinedIcon style={{ fontSize: "12px" }} />
                              <span>{toPersianDigits(reply.likesCount)}</span>
                            </span>
                          )}
                          {reply.dislikesCount > 0 && (
                            <span className="flex items-center gap-1">
                              <ThumbDownOutlinedIcon style={{ fontSize: "12px" }} />
                              <span>{toPersianDigits(reply.dislikesCount)}</span>
                            </span>
                          )}
                        </div>
                      )}

                      {/* Heart Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleHeart(reply._id)}
                        className={`p-1 rounded-full transition-colors cursor-pointer ${
                          reply.isHeartedByAdmin
                            ? "text-rose-500 hover:bg-rose-500/10"
                            : "hover:text-rose-500 hover:bg-surface-hover"
                        }`}
                        title={reply.isHeartedByAdmin ? "برداشتن قلب" : "قلب آموزشگاه"}
                      >
                        {reply.isHeartedByAdmin ? (
                          <FavoriteIcon style={{ fontSize: "14px" }} />
                        ) : (
                          <FavoriteBorderIcon style={{ fontSize: "14px" }} />
                        )}
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteReply(reply._id)}
                        disabled={deletingId === reply._id}
                        className="p-1 rounded-full hover:bg-error-light hover:text-error transition-colors cursor-pointer"
                        title="حذف این پاسخ"
                      >
                        <DeleteOutlineIcon style={{ fontSize: "14px" }} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Admin Quick Reply Form */}
      <form onSubmit={handleSendReply} className="flex flex-col gap-2 pt-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2">
          <textarea
            rows={2}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`پاسخ رسمی آموزشگاه به دیدگاه «${parentAuthor}» را بنویسید...`}
            className="flex-1 p-2.5 rounded-xl bg-surface border border-border text-xs sm:text-sm text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none transition-all placeholder:text-text-muted"
            disabled={submitting}
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="h-10 self-stretch sm:self-end px-4 shrink-0"
            icon={submitting ? <Loading size={4} /> : <SendRoundedIcon style={{ fontSize: "16px", transform: "rotate(180deg)" }} />}
            disabled={submitting || !replyText.trim()}
          >
            {submitting ? "در حال ارسال..." : "ارسال پاسخ"}
          </Button>
        </div>
      </form>
    </div>
  );
}
