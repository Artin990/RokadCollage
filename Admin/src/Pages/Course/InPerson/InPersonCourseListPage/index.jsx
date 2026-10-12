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
import InPersonCourseCard from "../components/InPersonCourseCard";
import { fetchInPersonCourses, deleteInPersonCourse } from "../api/inPersonApi";
import useInfiniteScroll from "../../../../Utils/useInfiniteScroll";

export default function InPersonCourseListPage() {
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

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const executeLoad = async () => {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      try {
        const data = await fetchInPersonCourses(page, searchQuery, activeFilters, LIMIT);

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
          Notify.error(data?.message || "خطا در دریافت لیست دوره‌های حضوری");
        }
      } catch (err) {
        if (isMounted) Notify.error(err.message || "خطا در دریافت لیست دوره‌های حضوری");
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

  const handleEdit = (course) => {
    if (course?._id) navigate(`/in-person-courses/update/${course._id}`);
  };

  const handleView = (course) => {
    if (course?._id) navigate(`/in-person-courses/${course._id}`);
  };

  const handleDelete = async (course) => {
    const isConfirmed = await confirm(
      `آیا از حذف دوره «${course.title}» اطمینان دارید؟`,
      "این عمل تمام اطلاعات، جلسات و تخفیف‌های دوره را پاک خواهد کرد.",
      "بله، حذف کن"
    );

    if (!isConfirmed) return;

    try {
      const res = await deleteInPersonCourse(course._id);
      if (res && res.success !== false) {
        setCourses((prev) => prev.filter((c) => c._id !== course._id));
        Notify.success("دوره حضوری با موفقیت حذف شد");
      } else {
        throw new Error(res?.message || "حذف دوره ناموفق بود");
      }
    } catch (err) {
      Notify.error(err.message || "خطا در حذف دوره");
    }
  };

  return (
    <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col">
      <PageHeader
        title="دوره‌های حضوری"
        subtitle="مشاهده، جستجو، ثبت و ویرایش کارگاه‌ها و دوره‌های حضوری"
        action={
          <Button
            variant="primary"
            size="md"
            icon={<AddIcon fontSize="small" />}
            onClick={() => navigate("/in-person-courses/create")}
          >
            افزودن دوره حضوری
          </Button>
        }
      />

      {/* Unified Toolbar */}
      <Toolbar
        className="mb-6"
        searchPlaceholder="جستجو در دوره‌های حضوری..."
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

      {/* Main Grid */}
      <div className="flex flex-col flex-1">
        {loading && page === 1 ? (
          <CardGridSkeleton count={8} />
        ) : courses.length === 0 ? (
          <EmptyState
            title="دوره حضوری یافت نشد"
            description="هیچ دوره‌ای مطابق با جستجو یا فیلترهای انتخابی یافت نشد."
            action={
              <Button
                variant="primary"
                size="sm"
                icon={<AddIcon fontSize="small" />}
                onClick={() => navigate("create")}
              >
                افزودن دوره حضوری
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 items-stretch">
            {courses.map((course) => (
              <InPersonCourseCard
                key={course._id}
                course={course}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
            ))}
          </div>
        )}

        {loadingMore && (
          <div className="flex justify-center items-center py-6">
            <Loading size={8} />
          </div>
        )}
      </div>
    </div>
  );
}
