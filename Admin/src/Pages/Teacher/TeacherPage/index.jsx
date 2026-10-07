import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import axiosInstance from "../../../Utils/axiosInstance";
import TeacherCard from "../components/TeacherCard";
import Notify from "../../../Utils/notify";
import confirm from "../../../Utils/confirm";
import Search from "../../../Components/Search";
import Loading from "../../../Components/Loading";
import { Button, PageHeader, Card } from "../../../Components/UI";

export default function TeacherPage() {
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const LIMIT = 12;

  const fetchTeachers = async (pageNumber, query) => {
    if (pageNumber === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const data = await axiosInstance.get(
        `teacher?limit=${LIMIT}&page=${pageNumber}&sort=-_id${
          query ? `&q=${encodeURIComponent(query)}` : ""
        }`
      );

      if (data && data.success !== false) {
        const fetchedTeachers = Array.isArray(data)
          ? data
          : data.data || [];

        if (fetchedTeachers.length < LIMIT) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        if (pageNumber === 1) {
          setTeachers(fetchedTeachers);
        } else {
          setTeachers((prev) => {
            const uniqueNewItems = fetchedTeachers.filter(
              (newItem) =>
                !prev.some((existingItem) => existingItem._id === newItem._id)
            );
            return [...prev, ...uniqueNewItems];
          });
        }
      } else {
        Notify.error(data?.message || "خطا در دریافت اطلاعات اساتید");
      }
    } catch (error) {
      Notify.error(error.message || "خطا در دریافت اطلاعات اساتید");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchTeachers(page, searchQuery);
  }, [page, searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = window.innerHeight;

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        if (hasMore && !loading && !loadingMore) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, loadingMore]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
    setHasMore(true);
  };

  const handleEditTeacher = (teacher) => {
    if (teacher?._id) navigate(`update/${teacher._id}`);
  };

  const handleAddTeacher = () => navigate("create");

  const handleDeleteTeacher = async (teacher) => {
    const id = teacher?._id;
    if (!id) return;

    const isConfirmed = await confirm(
      "آیا از حذف این استاد اطمینان دارید؟",
      "این عمل غیرقابل بازگشت است و تصویر استاد نیز حذف خواهد شد.",
      "بله، حذف کن"
    );

    if (!isConfirmed) return;

    try {
      const deleteData = await axiosInstance.delete(`teacher/${id}`);

      if (deleteData && deleteData.success !== false) {
        setTeachers((prev) => prev.filter((t) => t._id !== id));
        Notify.success("استاد با موفقیت حذف شد.");
      } else {
        Notify.error(deleteData?.message || "حذف استاد ناموفق بود");
      }
    } catch (error) {
      Notify.error(error.message || "حذف استاد ناموفق بود");
    }
  };

  return (
    <div dir="rtl" className="p-6 md:p-8 w-full bg-background min-h-screen">
      <PageHeader
        title="مدیریت اساتید"
        subtitle="مشاهده، ثبت و ویرایش مشخصات اساتید و مدرسان دوره‌ها"
        action={
          <Button
            variant="primary"
            size="md"
            icon={<AddIcon fontSize="small" />}
            onClick={handleAddTeacher}
          >
            افزودن استاد جدید
          </Button>
        }
      >
        <Card className="flex justify-end p-4 shadow-xs">
          <Search onSearch={handleSearch} placeholder="جستجو در اساتید..." />
        </Card>
      </PageHeader>

      {/* Main Content Area */}
      {loading && page === 1 ? (
        <div className="flex justify-center mt-20">
          <Loading size={12} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            {teachers.map((teacher) => (
              <TeacherCard
                key={teacher._id}
                teacher={teacher}
                onEdit={handleEditTeacher}
                onDelete={handleDeleteTeacher}
              />
            ))}
          </div>

          {teachers.length === 0 && !loading && (
            <div className="col-span-full text-center text-text-secondary py-16 bg-surface rounded-2xl border border-border/60">
              هیچ استادی یافت نشد.
            </div>
          )}

          {loadingMore && (
            <div className="flex justify-center mt-8 py-4 pb-10">
              <Loading size={10} />
            </div>
          )}
        </>
      )}
    </div>
  );
}