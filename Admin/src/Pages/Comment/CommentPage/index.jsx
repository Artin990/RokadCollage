import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import CommentCard from "../components/CommentCard";
import { fetchComments as fetchCommentsApi, deleteComment as deleteCommentApi } from "../api/commentApi";
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

export default function CommentPage() {
    const navigate = useNavigate();

    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const LIMIT = 12;

    const fetchComments = async (pageNumber, query) => {
        if (pageNumber === 1) setLoading(true);
        else setLoadingMore(true);

        try {
            const data = await fetchCommentsApi({
                limit: LIMIT,
                page: pageNumber,
                sort: "-_id",
                q: query || undefined,
            });

            if (data && data.success !== false) {
                const fetchedComments = Array.isArray(data) ? data : data.data || [];

                if (fetchedComments.length < LIMIT) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }

                if (pageNumber === 1) {
                    setComments(fetchedComments);
                } else {
                    setComments((prev) => {
                        const uniqueNewItems = fetchedComments.filter(
                            (newItem) =>
                                !prev.some((existingItem) => existingItem._id === newItem._id)
                        );
                        return [...prev, ...uniqueNewItems];
                    });
                }
            } else {
                Notify.error(data?.message || "خطا در دریافت اطلاعات نظرات");
            }
        } catch (error) {
            Notify.error(error.message || "خطا در دریافت اطلاعات نظرات");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchComments(page, searchQuery);
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

    const handleViewComment = (id) => {
        if (id) navigate(`/comment/${id}`);
    };

    const handleEditComment = (id) => {
        if (id) navigate(`/comment/update/${id}`);
    };

    const handleAddComment = () => navigate("/comment/create");

    const handleDeleteComment = async (id) => {
        const isConfirmed = await confirm(
            "آیا از حذف این نظر اطمینان دارید؟",
            "این نظر از بخش نظرات دوره مربوطه حذف خواهد شد.",
            "بله، حذف کن"
        );

        if (!isConfirmed) return;

        try {
            const deleteData = await deleteCommentApi(id);

            if (deleteData && deleteData.success !== false) {
                setComments((prev) => prev.filter((c) => c._id !== id));
                Notify.success("نظر با موفقیت حذف شد.");
            } else {
                Notify.error(deleteData?.message || "حذف نظر ناموفق بود");
            }
        } catch (error) {
            Notify.error(error.message || "حذف نظر ناموفق بود");
        }
    };

    return (
        <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col">
            <PageHeader
                title="مدیریت نظرات"
                subtitle="بررسی، ثبت و ویرایش نظرات دانشجویان و اساتید درباره دوره‌ها"
                action={
                    <Button
                        variant="primary"
                        size="md"
                        icon={<AddIcon fontSize="small" />}
                        onClick={handleAddComment}
                    >
                        افزودن نظر
                    </Button>
                }
            />

            {/* Unified Toolbar */}
            <Toolbar
                className="mb-6"
                searchPlaceholder="جستجو در نظرات..."
                onSearch={handleSearch}
                onRefresh={() => fetchComments(1, searchQuery)}
                isRefreshing={loading && page === 1}
            />

            {/* Main Content Area */}
            <div className="flex flex-col flex-1">
                {loading && page === 1 ? (
                    <CardGridSkeleton count={6} />
                ) : comments.length === 0 ? (
                    <EmptyState
                        title="نظری یافت نشد"
                        description="هیچ نظری مطابق با جستجوی شما یافت نشد."
                        action={
                            <Button
                                variant="primary"
                                size="sm"
                                icon={<AddIcon fontSize="small" />}
                                onClick={handleAddComment}
                            >
                                افزودن نظر
                            </Button>
                        }
                    />
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
                            {comments.map((comment) => (
                                <CommentCard
                                    key={comment._id}
                                    comment={comment}
                                    onEdit={handleEditComment}
                                    onDelete={handleDeleteComment}
                                    onView={handleViewComment}
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
