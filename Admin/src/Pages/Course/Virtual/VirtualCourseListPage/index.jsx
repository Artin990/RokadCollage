import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import Notify from "../../../../Utils/notify";
import confirm from "../../../../Utils/confirm";
import Search from "../../../../Components/Search";
import Filter from "../../../../Components/Filter";
import Loading from "../../../../Components/Loading";
import { Button, PageHeader } from "../../../../Components/UI";
import VirtualCourseCard from "../components/VirtualCourseCard";
import { fetchVirtualCourses, deleteVirtualCourse } from "../api/virtualApi";

export default function VirtualCourseListPage() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({});

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

  const loadCourses = async (pageNumber, query, filters) => {
    if (pageNumber === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const data = await fetchVirtualCourses(pageNumber, query, filters, LIMIT);

      if (data && data.success !== false) {
        const fetched = Array.isArray(data) ? data : data.data || [];

        if (fetched.length < LIMIT) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

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
        Notify.error(data?.message || "خطا در دریافت لیست دوره‌های مجازی");
      }
    } catch (err) {
      Notify.error(err.message || "خطا در برقراری ارتباط با سرور");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadCourses(page, searchQuery, activeFilters);
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

  const handleDelete = async (course) => {
    const isConfirmed = await confirm(
      `آیا از حذف دوره مجازی «${course.title}» اطمینان دارید؟`,
      "اطلاعات این دوره و دسترسی‌های آن حذف خواهند شد.",
      "بله، حذف شود"
    );

    if (isConfirmed) {
      try {
        const res = await deleteVirtualCourse(course._id);
        if (res && res.success !== false) {
          Notify.success("دوره مجازی با موفقیت حذف شد");
          setCourses((prev) => prev.filter((c) => c._id !== course._id));
        } else {
          throw new Error(res?.message || "خطا در حذف دوره");
        }
      } catch (err) {
        Notify.error(err.message || "خطا در حذف دوره مجازی");
      }
    }
  };

  return (
    <div dir="rtl" className="p-6 md:p-8 w-full bg-background min-h-screen">
      <PageHeader
        title="دوره‌های مجازی"
        subtitle="مدیریت دوره‌های آموزشی ضبط‌شده و صدور لایسنس اسپات‌پلیر"
      >
        <Button
          variant="primary"
          icon={<AddIcon fontSize="small" />}
          onClick={() => navigate("/virtual-courses/create")}
        >
          افزودن دوره مجازی جدید
        </Button>
      </PageHeader>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Search
            placeholder="جستجو در عنوان، توضیحات یا شناسه اسپات‌پلیر..."
            onSearch={(q) => {
              setSearchQuery(q);
              setPage(1);
            }}
          />
        </div>
        <Filter
          config={filterConfig}
          onFilterChange={(f) => {
            setActiveFilters(f);
            setPage(1);
          }}
        />
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loading size={12} />
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-2xl border border-border shadow-xs">
          <p className="text-base text-text-secondary font-medium">
            هیچ دوره مجازی مطابق با جستجوی شما یافت نشد.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <VirtualCourseCard
              key={course._id}
              course={course}
              onEdit={(c) => navigate(`/virtual-courses/update/${c._id}`)}
              onDelete={handleDelete}
              onView={(c) => navigate(`/virtual-courses/${c._id}`)}
            />
          ))}
        </div>
      )}

      {loadingMore && (
        <div className="flex justify-center items-center py-8">
          <Loading size={8} />
        </div>
      )}
    </div>
  );
}
