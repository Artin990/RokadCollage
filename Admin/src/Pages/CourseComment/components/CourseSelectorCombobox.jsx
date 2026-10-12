import React, { useState, useRef, useEffect, useMemo } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import OndemandVideoOutlinedIcon from "@mui/icons-material/OndemandVideoOutlined";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import { getImageUrl } from "../../../Utils/getImageUrl";
import { Badge, Button } from "../../../Components/UI";
import { toPersianDigits } from "../../../Utils/jalaliDate";

export default function CourseSelectorCombobox({
  courses = [],
  selectedCourseId,
  selectedCourse,
  onSelectCourse,
  onViewCourse,
  loading = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input on open
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery("");
    }
  }, [isOpen]);

  // Filter courses based on search query
  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return courses;
    return courses.filter((c) => {
      const titleMatch = c?.title?.toLowerCase().includes(query);
      const catMatch = c?.category?.toLowerCase().includes(query);
      return titleMatch || catMatch;
    });
  }, [courses, searchQuery]);

  const activeCourse =
    selectedCourse ||
    courses.find((c) => c._id === selectedCourseId) ||
    courses[0] ||
    null;

  const handleSelect = (course) => {
    onSelectCourse(course._id);
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className="relative w-full bg-surface rounded-2xl border border-border/80 p-3.5 sm:p-4 shadow-xs transition-all hover:border-primary/40"
    >
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
        {/* Main Trigger Button */}
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <span className="text-[11px] font-bold text-text-muted flex items-center gap-1.5">
            <OndemandVideoOutlinedIcon style={{ fontSize: "15px" }} className="text-primary" />
            <span>دوره مجازی انتخابی برای بررسی دیدگاه‌ها:</span>
          </span>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full flex items-center justify-between gap-3 p-2 sm:p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
              isOpen
                ? "bg-primary-soft/40 border-primary ring-2 ring-primary/20 shadow-xs"
                : "bg-bg-light/60 hover:bg-bg-light border-border/80 hover:border-border-hover"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Course Thumbnail or Icon */}
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0 overflow-hidden border border-purple-500/20">
                {activeCourse?.img ? (
                  <img
                    src={getImageUrl(activeCourse.img)}
                    alt={activeCourse.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <SchoolOutlinedIcon fontSize="small" />
                )}
              </div>

              {/* Title & Category Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-black text-secondary truncate block max-w-full">
                    {activeCourse?.title || "دوره مجازی انتخاب نشده"}
                  </span>
                  {activeCourse?.category && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 shrink-0">
                      {activeCourse.category}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-text-muted font-medium mt-0.5 block truncate">
                  برای تغییر دوره و جستجو در لیست کلیک کنید
                </span>
              </div>
            </div>

            {/* Down Arrow / Action Indicator */}
            <div className="flex items-center gap-1.5 shrink-0 ps-2 text-text-muted">
              <span className="text-[11px] font-bold hidden sm:inline text-primary">
                {isOpen ? "بستن لیست" : "تغییر دوره"}
              </span>
              <KeyboardArrowDownRoundedIcon
                className={`transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-primary" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Quick External Actions */}
        {activeCourse && (
          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto pt-2.5 md:pt-0 border-t md:border-t-0 md:border-s border-border/80 md:ps-4">
            <Button
              variant="outline"
              size="sm"
              icon={<OpenInNewRoundedIcon style={{ fontSize: "16px" }} />}
              onClick={() => onViewCourse?.(activeCourse)}
              className="text-xs font-bold w-full md:w-auto"
            >
              مشاهده صفحه دوره
            </Button>
          </div>
        )}
      </div>

      {/* Floating Searchable Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] inset-x-0 z-50 bg-surface rounded-2xl border border-border shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header Search Input */}
          <div className="p-3 border-b border-border/80 bg-bg-light/40">
            <div className="relative flex items-center">
              <SearchIcon
                className="absolute start-3 text-text-muted pointer-events-none"
                style={{ fontSize: "18px" }}
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در عناوین دوره‌ها یا دسته‌بندی..."
                className="w-full h-10 ps-10 pe-10 rounded-xl bg-surface border border-border/90 text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-xs truncate placeholder:truncate"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute end-2.5 p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-light transition-colors"
                  title="پاک‌کردن متن جستجو"
                >
                  <CloseIcon style={{ fontSize: "16px" }} />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between px-1 pt-2 text-[11px] text-text-muted">
              <span>
                {filteredCourses.length > 0
                  ? `یافت شده: ${toPersianDigits(filteredCourses.length)} از ${toPersianDigits(courses.length)} دوره`
                  : "موردی یافت نشد"}
              </span>
              <span className="text-[10px]">دوره مورد نظر را انتخاب نمایید</span>
            </div>
          </div>

          {/* Courses List */}
          <div className="max-h-72 overflow-y-auto overscroll-contain p-2 flex flex-col gap-1 divide-y divide-border/40 custom-scrollbar">
            {filteredCourses.length === 0 ? (
              <div className="py-8 text-center flex flex-col items-center justify-center gap-1.5 text-text-muted">
                <SearchIcon style={{ fontSize: "28px" }} className="text-text-muted/40" />
                <span className="text-xs font-bold">دوره‌ای مطابق با عبارت جستجو یافت نشد</span>
                <span className="text-[11px]">عبارت دیگری را جستجو کنید</span>
              </div>
            ) : (
              filteredCourses.map((c) => {
                const isSelected = c._id === activeCourse?._id;
                return (
                  <button
                    key={c._id}
                    type="button"
                    onClick={() => handleSelect(c)}
                    className={`w-full flex items-center justify-between gap-3 p-2.5 rounded-xl text-right transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary/10 border border-primary/30 text-secondary"
                        : "hover:bg-bg-light text-text-primary border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Thumbnail */}
                      <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0 overflow-hidden border border-purple-500/20">
                        {c.img ? (
                          <img
                            src={getImageUrl(c.img)}
                            alt={c.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <SchoolOutlinedIcon style={{ fontSize: "16px" }} />
                        )}
                      </div>

                      {/* Title & Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-xs font-black truncate block ${
                              isSelected ? "text-primary-text font-black" : "text-secondary"
                            }`}
                          >
                            {c.title}
                          </span>
                          {c.category && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-surface text-text-muted border border-border/80">
                              {c.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Active State Icon */}
                    {isSelected && (
                      <div className="shrink-0 text-primary flex items-center gap-1">
                        <span className="text-[11px] font-bold hidden sm:inline">انتخاب شده</span>
                        <CheckCircleRoundedIcon style={{ fontSize: "18px" }} />
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
