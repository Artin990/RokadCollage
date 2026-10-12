import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import Notify from "../../Utils/notify";
import confirm from "../../Utils/confirm";
import Loading from "../../Components/Loading";
import {
  PageHeader,
  Card,
  Button,
  IconButton,
  SearchInput,
  Select,
  Toolbar,
  LoadingState,
  CommentListSkeleton,
} from "../../Components/UI";
import UserProfileModal from "../../Components/UserProfileModal";
import { fetchVirtualCourses, fetchVirtualCourseById } from "../Course/Virtual/api/virtualApi";
import {
  fetchCourseComments,
  toggleAdminHeart,
  togglePinComment,
  deleteCourseComment,
} from "./api/courseCommentApi";
import CourseCommentStats from "./components/CourseCommentStats";
import CourseCommentCard from "./components/CourseCommentCard";
import AdminNewCommentModal from "./components/AdminNewCommentModal";
import CourseSelectorCombobox from "./components/CourseSelectorCombobox";
import { toPersianDigits } from "../../Utils/jalaliDate";

export default function CourseCommentsPage() {
  const { courseId: paramCourseId } = useParams();
  const navigate = useNavigate();

  const [courseId, setCourseId] = useState(paramCourseId || "");
  const [coursesList, setCoursesList] = useState([]);
  const [course, setCourse] = useState(null);
  const [loadingCourse, setLoadingCourse] = useState(false);

  // Comments state
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [meta, setMeta] = useState({ totalReviews: 0, totalQa: 0, totalAll: 0 });

  // Filters & Search
  const [activeType, setActiveType] = useState("all"); // 'all' | 'qa' | 'review'
  const [sortOrder, setSortOrder] = useState("newest"); // 'newest' | 'popular' | 'oldest'
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isNewCommentModalOpen, setIsNewCommentModalOpen] = useState(false);
  const [selectedUserForProfile, setSelectedUserForProfile] = useState(null);

  // 1. Load Virtual Courses List for Selector
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await fetchVirtualCourses({ limit: 100 });
        let list = [];
        if (res && res.data) {
          list = Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data.data)
            ? res.data.data
            : [];
        } else if (Array.isArray(res)) {
          list = res;
        }
        setCoursesList(list);

        // If no courseId in params, select the first course by default
        if (!paramCourseId && list.length > 0 && !courseId) {
          setCourseId(list[0]._id);
        }
      } catch (err) {
        // Silently handled or notified
      }
    };

    loadCourses();
  }, [paramCourseId]);

  // Keep internal courseId synced if route param changes
  useEffect(() => {
    if (paramCourseId) {
      setCourseId(paramCourseId);
    }
  }, [paramCourseId]);

  // 2. Load Selected Course Details
  useEffect(() => {
    if (!courseId) return;

    const loadSelectedCourse = async () => {
      setLoadingCourse(true);
      try {
        const res = await fetchVirtualCourseById(courseId);
        const data = res?.data ? (Array.isArray(res.data) ? res.data[0] : res.data) : res;
        if (data) {
          setCourse(data);
        }
      } catch (err) {
        // Silently handled or notified
      } finally {
        setLoadingCourse(false);
      }
    };

    loadSelectedCourse();
  }, [courseId]);

  // 3. Load Comments for Current Course
  const loadComments = useCallback(
    async (currentPage = 1, isManualRefresh = false) => {
      if (!courseId) return;

      if (isManualRefresh) setRefreshing(true);
      else setLoadingComments(true);

      try {
        const res = await fetchCourseComments(courseId, {
          page: currentPage,
          limit: 25,
          type: activeType,
          sort: sortOrder,
          search: searchQuery,
        });

        if (res && res.success !== false) {
          const fetched = Array.isArray(res.data) ? res.data : [];
          setComments(fetched);
          if (res.pagination) {
            setPage(res.pagination.page || 1);
            setTotalPages(res.pagination.totalPages || 1);
            setTotalCount(res.pagination.total || 0);
          }
          if (res.meta) {
            setMeta(res.meta);
          }
        } else {
          Notify.error(res?.message || "خطا در دریافت دیدگاه‌های دوره");
        }
      } catch (err) {
        Notify.error(err.response?.data?.message || err.message || "خطا در برقراری ارتباط");
      } finally {
        setLoadingComments(false);
        setRefreshing(false);
      }
    },
    [courseId, activeType, sortOrder, searchQuery]
  );

  useEffect(() => {
    if (courseId) {
      loadComments(1);
    }
  }, [loadComments]);

  // 4. Comment Handlers
  const handleToggleHeart = async (commentId) => {
    try {
      const res = await toggleAdminHeart(commentId);
      if (res && res.success !== false) {
        const isHearted = Boolean(res.data?.isHeartedByAdmin);
        setComments((prev) =>
          prev.map((c) => (c._id === commentId ? { ...c, isHeartedByAdmin: isHearted } : c))
        );
        Notify.success(isHearted ? "قلب آموزشگاه برای دیدگاه ثبت شد" : "قلب آموزشگاه برداشته شد");
      }
    } catch (err) {
      Notify.error(err.response?.data?.message || err.message || "خطا در ثبت قلب");
    }
  };

  const handleTogglePin = async (commentId) => {
    try {
      const res = await togglePinComment(commentId);
      if (res && res.success !== false) {
        const isPinned = Boolean(res.data?.isPinned);
        setComments((prev) => {
          const updated = prev.map((c) =>
            c._id === commentId ? { ...c, isPinned } : c
          );
          // Re-sort: pinned comments to the top
          return updated.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
        });
        Notify.success(isPinned ? "دیدگاه با موفقیت پین شد" : "دیدگاه از حالت پین خارج شد");
      }
    } catch (err) {
      Notify.error(err.response?.data?.message || err.message || "خطا در پین دیدگاه");
    }
  };

  const handleDeleteComment = async (commentId) => {
    const isConfirmed = await confirm(
      "آیا از حذف کامل این دیدگاه اطمینان دارید؟",
      "این دیدگاه و تمامی پاسخ‌های ثبت‌شده برای آن به طور کامل حذف خواهند شد.",
      "بله، حذف شود"
    );
    if (!isConfirmed) return;

    try {
      const res = await deleteCourseComment(commentId);
      if (res && res.success !== false) {
        Notify.success("دیدگاه با موفقیت حذف شد");
        setComments((prev) => prev.filter((c) => c._id !== commentId));
        setTotalCount((prev) => Math.max(0, prev - 1));
      } else {
        Notify.error(res?.message || "خطا در حذف دیدگاه");
      }
    } catch (err) {
      Notify.error(err.response?.data?.message || err.message || "خطا در حذف دیدگاه");
    }
  };

  const handleCommentCreated = (newDoc) => {
    if (newDoc) {
      setComments((prev) => [newDoc, ...prev]);
      setTotalCount((prev) => prev + 1);
    } else {
      loadComments(1);
    }
  };

  const sortOptions = [
    { value: "newest", label: "جدیدترین‌ها" },
    { value: "popular", label: "بیشترین لایک (محبوب‌ترین)" },
    { value: "oldest", label: "قدیمی‌ترین‌ها" },
  ];

  const totalHeartedCount = comments.filter((c) => c.isHeartedByAdmin).length;

  return (
    <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col">
      {/* Top Header */}
      <PageHeader
        title={course ? `مدیریت دیدگاه‌های «${course.title}»` : "مدیریت دیدگاه‌ها و پرسش‌های دوره‌ها"}
        subtitle="بررسی و پاسخ به پرسش‌های دانشجویان، ثبت قلب آموزشگاه و اطلاعیه‌های رسمی دوره"
        backTo="/virtual-courses"
        action={
          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              variant="primary"
              size="md"
              icon={<AddCommentOutlinedIcon fontSize="small" />}
              onClick={() => setIsNewCommentModalOpen(true)}
              disabled={!courseId}
            >
              ثبت دیدگاه یا اطلاعیه جدید
            </Button>
          </div>
        }
      />

      <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
        {/* Course Quick Switcher Combobox with Instant Search */}
        <CourseSelectorCombobox
          courses={coursesList}
          selectedCourseId={courseId}
          selectedCourse={course}
          loading={loadingCourse}
          onSelectCourse={(selectedId) => {
            if (selectedId && selectedId !== courseId) {
              setCourseId(selectedId);
              navigate(`/virtual-courses/${selectedId}/comments`, { replace: true });
            }
          }}
          onViewCourse={(targetCourse) => {
            if (targetCourse?._id) {
              navigate(`/virtual-courses/${targetCourse._id}`);
            }
          }}
        />

        {/* Stats Row */}
        <CourseCommentStats
          totalAll={meta.totalAll || totalCount}
          totalQa={meta.totalQa || 0}
          totalReviews={meta.totalReviews || 0}
          totalHearted={meta.totalHearted !== undefined ? meta.totalHearted : totalHeartedCount}
        />

        {/* Unified Filter & Search Toolbar */}
        <Toolbar
          onSearch={(q) => {
            setSearchQuery(q);
            setPage(1);
          }}
          searchValue={searchQuery}
          searchPlaceholder="جستجو در دیدگاه‌ها یا نویسنده..."
          onRefresh={() => loadComments(page, true)}
          isRefreshing={refreshing || loadingComments}
          start={
            <div className="flex items-center gap-1.5 bg-bg-light p-1 rounded-xl shrink-0 overflow-x-auto h-10 border border-border/60 hide-scrollbar w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setActiveType("all");
                  setPage(1);
                }}
                className={`h-full px-3.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center justify-center ${
                  activeType === "all"
                    ? "bg-surface text-secondary shadow-xs"
                    : "text-text-secondary hover:text-secondary"
                }`}
              >
                همه ({toPersianDigits(meta.totalAll || totalCount)})
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveType("qa");
                  setPage(1);
                }}
                className={`h-full px-3.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 justify-center ${
                  activeType === "qa"
                    ? "bg-blue-500 text-white shadow-xs"
                    : "text-blue-700 hover:bg-blue-50"
                }`}
              >
                <span>پرسش و پاسخ</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-900 font-black">
                  {toPersianDigits(meta.totalQa || 0)}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveType("review");
                  setPage(1);
                }}
                className={`h-full px-3.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 justify-center ${
                  activeType === "review"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                <span>نظرات دوره</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-900 font-black">
                  {toPersianDigits(meta.totalReviews || 0)}
                </span>
              </button>
            </div>
          }
        >
          {/* Sort Selector */}
          <div className="w-full sm:w-44 shrink-0">
            <Select
              placeholder="مرتب‌سازی"
              options={sortOptions}
              value={sortOrder}
              onChange={(e) => {
                const val = e?.target?.value !== undefined ? e.target.value : e;
                if (val) {
                  setSortOrder(val);
                  setPage(1);
                }
              }}
            />
          </div>
        </Toolbar>

        {/* Comments List Area */}
        <div className="flex flex-col flex-1">
          {loadingComments ? (
            <CommentListSkeleton count={4} />
          ) : comments.length === 0 ? (
          <Card className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-3xl bg-primary-soft text-primary flex items-center justify-center">
              <CampaignOutlinedIcon style={{ fontSize: "28px" }} />
            </div>
            <h4 className="text-base font-extrabold text-secondary">
              دیدگاهی یافت نشد
            </h4>
            <p className="text-xs text-text-muted max-w-md">
              {searchQuery
                ? "هیچ دیدگاهی مطابق با عبارت جستجو شده پیدا نشد."
                : "برای این بخش هنوز دیدگاهی ثبت نشده است. شما می‌توانید با زدن دکمه بالای صفحه، اولین اطلاعیه یا پیام راهنما را ثبت کنید."}
            </p>
            <Button
              variant="outline"
              size="sm"
              icon={<AddCommentOutlinedIcon fontSize="small" />}
              onClick={() => setIsNewCommentModalOpen(true)}
              className="mt-2"
            >
              ثبت دیدگاه یا اطلاعیه
            </Button>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {comments.map((comment) => (
              <CourseCommentCard
                key={comment._id}
                comment={comment}
                onToggleHeart={handleToggleHeart}
                onTogglePin={handleTogglePin}
                onDelete={handleDeleteComment}
                onOpenUserProfile={(u) => setSelectedUserForProfile(u)}
              />
            ))}
          </div>
        )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => {
                const newP = page - 1;
                setPage(newP);
                loadComments(newP);
              }}
            >
              صفحه قبل
            </Button>
            <span className="text-xs text-text-secondary px-3">
              صفحه {toPersianDigits(page)} از {toPersianDigits(totalPages)}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => {
                const newP = page + 1;
                setPage(newP);
                loadComments(newP);
              }}
            >
              صفحه بعد
            </Button>
          </div>
        )}
      </div>

      {/* Admin New Comment Modal */}
      {isNewCommentModalOpen && (
        <AdminNewCommentModal
          isOpen={isNewCommentModalOpen}
          onClose={() => setIsNewCommentModalOpen(false)}
          courseId={courseId}
          courseTitle={course?.title || "دوره آموزشی"}
          onCommentCreated={handleCommentCreated}
        />
      )}

      {/* User Profile Modal when clicking author */}
      {selectedUserForProfile && (
        <UserProfileModal
          isOpen={Boolean(selectedUserForProfile)}
          onClose={() => setSelectedUserForProfile(null)}
          userId={selectedUserForProfile._id}
          user={selectedUserForProfile}
        />
      )}
    </div>
  );
}
