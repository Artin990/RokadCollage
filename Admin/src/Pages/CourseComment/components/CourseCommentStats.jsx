import React from "react";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { toPersianDigits } from "../../../Utils/jalaliDate";

export default function CourseCommentStats({
  totalAll = 0,
  totalQa = 0,
  totalReviews = 0,
  totalHearted = 0,
}) {
  const statItems = [
    {
      title: "کل دیدگاه‌های دوره",
      count: totalAll,
      icon: <ForumOutlinedIcon fontSize="small" className="text-primary" />,
      bg: "bg-primary/10 border-primary/20",
      textColor: "text-primary",
    },
    {
      title: "پرسش‌ها و پاسخ‌ها",
      count: totalQa,
      icon: <QuestionAnswerOutlinedIcon fontSize="small" className="text-blue-500" />,
      bg: "bg-blue-500/10 border-blue-500/20",
      textColor: "text-blue-600",
    },
    {
      title: "نظرات و بازخوردها",
      count: totalReviews,
      icon: <RateReviewOutlinedIcon fontSize="small" className="text-emerald-500" />,
      bg: "bg-emerald-500/10 border-emerald-500/20",
      textColor: "text-emerald-600",
    },
    {
      title: "دارای قلب آموزشگاه",
      count: totalHearted,
      icon: <FavoriteIcon fontSize="small" className="text-rose-500" />,
      bg: "bg-rose-500/10 border-rose-500/20",
      textColor: "text-rose-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
      {statItems.map((item, idx) => (
        <div
          key={idx}
          className={`p-3 sm:p-4 rounded-2xl border ${item.bg} bg-surface shadow-2xs flex items-center justify-between gap-2 sm:gap-3 transition-transform hover:-translate-y-0.5 min-w-0`}
        >
          <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
            <span className="text-[10px] sm:text-xs text-text-secondary font-bold truncate">
              {item.title}
            </span>
            <span className={`text-base sm:text-2xl font-black ${item.textColor} truncate`}>
              {toPersianDigits(item.count)}
            </span>
          </div>
          <div className="p-2 sm:p-2.5 rounded-xl bg-surface shadow-xs shrink-0 flex items-center justify-center">
            {item.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
