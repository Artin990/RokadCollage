import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import Notify from "../../../Utils/notify";
import confirm from "../../../Utils/confirm";
import Filter from "../../../Components/Filter";
import Loading from "../../../Components/Loading";
import {
  Button,
  PageHeader,
  Card,
  Toolbar,
  EmptyState,
  LoadingState,
  CardGridSkeleton,
} from "../../../Components/UI";
import BlogCard from "../components/BlogCard";
import { fetchBlogs, deleteBlog } from "../api/blogApi";
import { BLOG_CATEGORY_OPTIONS } from "../constants/blogConstants";
import useInfiniteScroll from "../../../Utils/useInfiniteScroll";

export default function BlogPage() {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
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
      label: "دسته‌بندی بلاگ",
      options: BLOG_CATEGORY_OPTIONS,
    },
  ];

  const loadBlogs = async (pageNumber, query, filters) => {
    if (pageNumber === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const response = await fetchBlogs({
        page: pageNumber,
        limit: LIMIT,
        sort: "-_id",
        q: query || undefined,
        category: filters.category || undefined,
      });

      if (response && response.success !== false) {
        const fetchedBlogs = Array.isArray(response)
          ? response
          : response.data || [];

        setHasMore(fetchedBlogs.length >= LIMIT);

        if (pageNumber === 1) {
          setBlogs(fetchedBlogs);
        } else {
          setBlogs((prev) => {
            const uniqueNewItems = fetchedBlogs.filter(
              (newItem) =>
                !prev.some((existingItem) => existingItem._id === newItem._id)
            );
            return [...prev, ...uniqueNewItems];
          });
        }
      } else {
        Notify.error(response?.message || "خطا در دریافت اطلاعات مقالات");
      }
    } catch (error) {
      Notify.error(error.message || "خطا در دریافت اطلاعات مقالات");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadBlogs(page, searchQuery, activeFilters);
  }, [page, searchQuery, activeFilters]);

  useInfiniteScroll({
    onReachBottom: () => setPage((prevPage) => prevPage + 1),
    hasMore,
    isLoading: loading || loadingMore,
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
    setHasMore(true);
  };

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    setPage(1);
    setHasMore(true);
  };

  const handleViewBlog = (blog) => {
    if (blog?._id) navigate(`/blog/${blog._id}`);
  };

  const handleEditBlog = (blog) => {
    if (blog?._id) navigate(`/blog/update/${blog._id}`);
  };

  const handleAddBlog = () => navigate("/blog/create");

  const handleDeleteBlog = async (blog) => {
    const id = blog?._id;
    if (!id) return;

    const isConfirmed = await confirm(
      "آیا از حذف این بلاگ اطمینان دارید؟",
      "این عمل غیرقابل بازگشت است و تصویر کاور و متن مقاله حذف خواهد شد.",
      "بله، حذف کن"
    );

    if (!isConfirmed) return;

    try {
      const deleteData = await deleteBlog(id);

      if (deleteData && deleteData.success !== false) {
        setBlogs((prev) => prev.filter((b) => b._id !== id));
        Notify.success("بلاگ با موفقیت حذف شد.");
      } else {
        Notify.error(deleteData?.message || "حذف بلاگ ناموفق بود");
      }
    } catch (error) {
      Notify.error(error.message || "حذف بلاگ ناموفق بود");
    }
  };

  return (
    <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col">
      <PageHeader
        title="مدیریت بلاگ‌ها"
        subtitle="مشاهده، جستجو، ایجاد و ویرایش مقالات وبلاگ و آموزش‌ها"
        action={
          <Button
            variant="primary"
            size="md"
            icon={<AddIcon fontSize="small" />}
            onClick={handleAddBlog}
          >
            افزودن مقاله
          </Button>
        }
      />

      {/* Unified Toolbar */}
      <Toolbar
        className="mb-6"
        searchPlaceholder="جستجو در مقالات..."
        onSearch={handleSearch}
        filters={
          <Filter
            filterConfig={filterConfig}
            onFilterChange={handleFilterChange}
          />
        }
        onRefresh={() => loadBlogs(1, searchQuery, activeFilters)}
        isRefreshing={loading && page === 1}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {loading && page === 1 ? (
          <CardGridSkeleton count={8} />
        ) : blogs.length === 0 ? (
          <EmptyState
            title="هیچ مقاله‌ای یافت نشد"
            description="هیچ مقاله‌ای مطابق جستجو یا دسته‌بندی انتخابی پیدا نشد."
            action={
              <Button
                variant="primary"
                size="sm"
                icon={<AddIcon fontSize="small" />}
                onClick={handleAddBlog}
              >
                افزودن مقاله
              </Button>
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 items-stretch">
              {blogs.map((blog) => (
                <BlogCard
                  key={blog._id}
                  blog={blog}
                  onView={handleViewBlog}
                  onEdit={handleEditBlog}
                  onDelete={handleDeleteBlog}
                />
              ))}
            </div>

            {loadingMore && (
              <div className="flex justify-center mt-8">
                <Loading size={8} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
