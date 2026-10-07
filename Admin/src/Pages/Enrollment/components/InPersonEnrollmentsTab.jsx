import React, { useState, useEffect } from "react";
import axiosInstance from "../../../Utils/axiosInstance";
import Notify from "../../../Utils/notify";
import Search from "../../../Components/Search";
import Filter from "../../../Components/Filter";
import Loading from "../../../Components/Loading";
import { Badge, Button, Card, CourseIcon } from "../../../Components/UI";
import { toPersianDigits } from "../../../Utils/jalaliDate";
import { getImageUrl } from "../../../Utils/getImageUrl";
import SchoolIcon from "@mui/icons-material/School";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import RefreshIcon from "@mui/icons-material/Refresh";
import CourseAccordionContent from "./CourseAccordionContent";

export default function InPersonEnrollmentsTab() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({});
  const [expandedCourseId, setExpandedCourseId] = useState(null);

  const LIMIT = 12;

  const filterConfig = [
    {
      field: "category",
      label: "دسته‌بندی",
      options: [
        { label: "فناوری اطلاعات", value: "فناوری اطلاعات" },
        { label: "گرافیک", value: "گرافیک" },
        { label: "زبان", value: "زبان" },
        { label: "MBA", value: "MBA" },
      ],
    },
  ];

  const fetchCourses = async (pageNumber = 1, query = "", filters = {}, isRefresh = false) => {
    if (pageNumber === 1) {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      let filterParams = "";
      if (filters.category) filterParams += `&category=${encodeURIComponent(filters.category)}`;

      const data = await axiosInstance.get(
        `in-person-courses?limit=${LIMIT}&page=${pageNumber}&sort=-_id${
          query ? `&q=${encodeURIComponent(query)}` : ""
        }${filterParams}`
      );

      if (data && data.success !== false) {
        const fetched = Array.isArray(data) ? data : data.data || [];
        setHasMore(fetched.length >= LIMIT);

        if (pageNumber === 1) {
          setCourses(fetched);
        } else {
          setCourses((prev) => {
            const unique = fetched.filter(
              (item) => !prev.some((existing) => existing._id === item._id)
            );
            return [...prev, ...unique];
          });
        }
      } else {
        Notify.error(data?.message || "خطا در دریافت لیست دوره‌های حضوری");
      }
    } catch (err) {
      Notify.error(err.message || "خطا در دریافت لیست دوره‌های حضوری");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCourses(page, searchQuery, activeFilters);
  }, [page, searchQuery, activeFilters]);

  // Infinite Scroll Trigger
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = window.innerHeight;

      if (
        scrollHeight - scrollTop <= clientHeight + 150 &&
        !loading &&
        !loadingMore &&
        hasMore
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, loadingMore, hasMore]);

  const toggleCourseAccordion = (courseId) => {
    setExpandedCourseId((prev) => (prev === courseId ? null : courseId));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full">
          <Search
            placeholder="جستجو در عنوان دوره‌های حضوری..."
            onSearch={(q) => {
              setSearchQuery(q);
              setPage(1);
            }}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <Filter
            config={filterConfig}
            onFilterChange={(f) => {
              setActiveFilters(f);
              setPage(1);
            }}
          />
          <Button
            variant="outline"
            size="md"
            icon={<RefreshIcon className={refreshing ? "animate-spin" : ""} fontSize="small" />}
            onClick={() => fetchCourses(1, searchQuery, activeFilters, true)}
            title="تازوه‌سازی لیست"
          />
        </div>
      </div>

      {/* Courses Accordion List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loading size={10} />
        </div>
      ) : courses.length === 0 ? (
        <Card className="p-12 text-center text-text-secondary">
          دوره حضوری یافت نشد.
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {courses.map((course) => {
            const isExpanded = expandedCourseId === course._id;
            const iconUrl = getImageUrl(course.icon);
            const price = Number(course.price) || 0;

            return (
              <div
                key={course._id}
                className="bg-surface border border-border rounded-2xl overflow-hidden shadow-2xs transition-all duration-200"
              >
                <div
                  onClick={() => toggleCourseAccordion(course._id)}
                  className={`p-4 md:p-5 flex items-center justify-between cursor-pointer select-none transition-colors ${
                    isExpanded ? "bg-bg-light/80 border-b border-border" : "hover:bg-bg-light/40"
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-primary-light border border-primary-border flex items-center justify-center p-2 shrink-0">
                      {course.icon ? (
                        <CourseIcon icon={course.icon} alt={course.title} />
                      ) : (
                        <SchoolIcon className="text-primary" />
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-secondary text-base truncate">{course.title}</h3>
                        <Badge variant="blue" size="sm" dot>
                          {course.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-text-muted mt-1">
                        <span>مدت دوره: {course.duration}</span>
                        <span>•</span>
                        <span>{price === 0 ? "رایگان" : `${toPersianDigits(price.toLocaleString())} تومان`}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-text-muted hidden md:inline">
                      {isExpanded ? "بستن کدهای کلاس" : "مشاهده کدهای کلاس"}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-bg-light flex items-center justify-center text-text-secondary">
                      {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 md:p-6 bg-white animate-in fade-in duration-200">
                    <CourseAccordionContent courseId={course._id} courseTitle={course.title} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {loadingMore && (
        <div className="flex justify-center items-center py-6">
          <Loading size={6} />
        </div>
      )}
    </div>
  );
}
