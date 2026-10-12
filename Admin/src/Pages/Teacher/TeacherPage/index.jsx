import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import axiosInstance from "../../../Utils/axiosInstance";
import TeacherCard from "../components/TeacherCard";
import { fetchTeachers as fetchTeachersApi, deleteTeacher as deleteTeacherApi } from "../api/teacherApi";
import Notify from "../../../Utils/notify";
import confirm from "../../../Utils/confirm";
import Loading from "../../../Components/Loading";
import useInfiniteScroll from "../../../Utils/useInfiniteScroll";
import {
    Button,
    PageHeader,
    Card,
    Toolbar,
    EmptyState,
    LoadingState,
    CardGridSkeleton,
} from "../../../Components/UI";

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
            const data = await fetchTeachersApi({
                limit: LIMIT,
                page: pageNumber,
                sort: "-_id",
                q: query || undefined,
            });

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

    const handleEditTeacher = (teacher) => {
        if (teacher?._id) navigate(`/teacher/update/${teacher._id}`);
    };

    const handleAddTeacher = () => navigate("/teacher/create");

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
            const deleteData = await deleteTeacherApi(id);

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
        <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col">
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
                        افزودن استاد
                    </Button>
                }
            />

            {/* Unified Toolbar */}
            <Toolbar
                className="mb-6"
                searchPlaceholder="جستجو در اساتید..."
                onSearch={handleSearch}
                onRefresh={() => fetchTeachers(1, searchQuery)}
                isRefreshing={loading && page === 1}
            />

            {/* Main Content Area */}
            <div className="flex flex-col flex-1">
                {loading && page === 1 ? (
                <CardGridSkeleton count={6} />
            ) : teachers.length === 0 ? (
                <EmptyState
                    title="استادی یافت نشد"
                    description="هیچ استادی مطابق با جستجوی شما یافت نشد."
                    action={
                        <Button
                            variant="primary"
                            size="sm"
                            icon={<AddIcon fontSize="small" />}
                            onClick={handleAddTeacher}
                        >
                            افزودن استاد
                        </Button>
                    }
                />
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 items-stretch">
                        {teachers.map((teacher) => (
                            <TeacherCard
                                key={teacher._id}
                                teacher={teacher}
                                onEdit={handleEditTeacher}
                                onDelete={handleDeleteTeacher}
                            />
                        ))}
                    </div>

                    {loadingMore && (
                        <div className="flex justify-center mt-8 py-4 pb-10">
                            <Loading size={10} />
                        </div>
                    )}
                </>
            )}
            </div>
        </div>
    );
}