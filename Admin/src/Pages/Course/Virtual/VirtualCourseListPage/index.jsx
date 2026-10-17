import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import Notify from "../../../../Utils/notify";
import confirm from "../../../../Utils/confirm";
import Filter from "../../../../Components/Filter";
import Loading from "../../../../Components/Loading";
import {
  Button,
  PageHeader,
  Toolbar,
  EmptyState,
  LoadingState,
  CardGridSkeleton,
} from "../../../../Components/UI";
import VirtualCourseCard from "../components/VirtualCourseCard";
import { fetchVirtualCourses, deleteVirtualCourse } from "../api/virtualApi";
import useInfiniteScroll from "../../../../Utils/useInfiniteScroll";

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
        { label: "مشاوره", value: "مشاوره" },
      ],
    },
  ];

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const executeLoad = async () => {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      try {
        const data = await fetchVirtualCourses(page, searchQuery, activeFilters, LIMIT);

        if (!isMounted) return;

        if (data && data.success !== false) {
          const fetched = Array.isArray(data) ? data : data.data || [];
          setHasMore(fetched.length >= LIMIT);

          if (page === 1) {
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
        if (isMounted) Notify.error(err.message || "خطا در برقراری ارتباط با سرور");
      } finally {
        if (isMounted) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    };

    executeLoad();

    return () => {
      isMounted = false;
    };
  }, [page, searchQuery, activeFilters, refreshKey]);

  useInfiniteScroll({
    onReachBottom: () => setPage((prevPage) => prevPage + 1),
    hasMore,
    isLoading: loading || loadingMore,
  });

  const handleRefresh = () => {
    if (page === 1) {
      setRefreshKey((k) => k + 1);
    } else {
      setPage(1);
    }
  };

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
    <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col">
      <PageHeader
        title="دوره‌های مجازی"
        subtitle="مدیریت دوره‌های آموزشی ضبط‌شده و صدور لایسنس اسپات‌پلیر"
        action={
          <Button
            variant="primary"
            size="md"
            icon={<AddIcon fontSize="small" />}
            onClick={() => navigate("/virtual-courses/create")}
          >
            افزودن دوره مجازی
          </Button>
        }
      />

      {/* Unified Toolbar */}
      <Toolbar
        className="mb-6"
        searchPlaceholder="جستجو در دوره‌های مجازی..."
        onSearch={(q) => {
          setSearchQuery(q);
          setPage(1);
        }}
        filters={
          <Filter
            filterConfig={filterConfig}
            onFilterChange={(f) => {
              setActiveFilters(f);
              setPage(1);
            }}
          />
        }
        onRefresh={handleRefresh}
        isRefreshing={loading && page === 1}
      />

      {/* Courses Grid */}
      <div className="flex flex-col flex-1">
        {loading && page === 1 ? (
          <CardGridSkeleton count={8} />
        ) : courses.length === 0 ? (
          <EmptyState
            title="دوره مجازی یافت نشد"
            description="هیچ دوره مجازی مطابق با جستجوی شما یافت نشد."
            action={
              <Button
                variant="primary"
                size="sm"
                icon={<AddIcon fontSize="small" />}
                onClick={() => navigate("/virtual-courses/create")}
              >
                افزودن دوره مجازی
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
    </div>
  );
}
