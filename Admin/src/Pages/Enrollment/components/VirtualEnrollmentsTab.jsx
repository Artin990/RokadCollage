import React, { useState, useEffect } from "react";
import {
  fetchEnrolledStudents,
  retrySpotPlayerLicense,
  manualEnrollVirtual,
} from "../api/enrollmentApi";
import axiosInstance from "../../../Utils/axiosInstance";
import Notify from "../../../Utils/notify";
import Filter from "../../../Components/Filter";
import Loading from "../../../Components/Loading";
import { Button, Toolbar, CardGridSkeleton } from "../../../Components/UI";
import UserProfileModal from "../../../Components/UserProfileModal";
import AddStudentModal from "./AddStudentModal";
import LicenseKeyModal from "./LicenseKeyModal";
import VirtualCourseAccordionItem from "./VirtualCourseAccordionItem";
import { courseCategoryOptions } from "../../../Constants/validationRules";
import useInfiniteScroll from "../../../Utils/useInfiniteScroll";

export default function VirtualEnrollmentsTab() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({});
  const [expandedCourseId, setExpandedCourseId] = useState(null);

  // Per-course students state
  const [studentsByCourse, setStudentsByCourse] = useState({});
  const [loadingStudents, setLoadingStudents] = useState({});
  const [retryingLicenseId, setRetryingLicenseId] = useState(null);

  // Modals state
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState(null);
  const [addModalCourse, setAddModalCourse] = useState(null);
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);
  const [licenseKeyModalData, setLicenseKeyModalData] = useState(null);

  const LIMIT = 12;

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
        `virtual-courses?limit=${LIMIT}&page=${pageNumber}&sort=-_id${query ? `&q=${encodeURIComponent(query)}` : ""
        }${filterParams}`
      );

      if (data && data.success !== false) {
        const fetched = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.data?.data)
          ? data.data.data
          : [];
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
        throw new Error(data?.message || "خطا در دریافت لیست دوره‌های مجازی");
      }
    } catch (err) {
      Notify.error(err.message || "خطا در دریافت لیست دوره‌های مجازی");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCourses(page, searchQuery, activeFilters);
  }, [page, searchQuery, activeFilters]);

  useInfiniteScroll({
    onReachBottom: () => setPage((prevPage) => prevPage + 1),
    hasMore,
    isLoading: loading || loadingMore,
  });

  const fetchCourseStudents = async (courseId) => {
    setLoadingStudents((prev) => ({ ...prev, [courseId]: true }));
    try {
      const res = await fetchEnrolledStudents(`course=${courseId}&sort=-createdAt`);
      if (res && res.success !== false) {
        const list = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.data)
          ? res.data.data
          : [];
        setStudentsByCourse((prev) => ({ ...prev, [courseId]: list }));
      }
    } catch (err) {
      Notify.error(err.message || "خطا در دریافت ثبت‌نام‌های دوره مجازی");
    } finally {
      setLoadingStudents((prev) => ({ ...prev, [courseId]: false }));
    }
  };

  const toggleCourseAccordion = (courseId) => {
    if (expandedCourseId === courseId) {
      setExpandedCourseId(null);
    } else {
      setExpandedCourseId(courseId);
      if (!studentsByCourse[courseId]) {
        fetchCourseStudents(courseId);
      }
    }
  };

  const handleRetryLicense = async (enrollmentId, courseId) => {
    setRetryingLicenseId(enrollmentId);
    try {
      const res = await retrySpotPlayerLicense(enrollmentId);
      if (res && res.success) {
        Notify.success(res.message || "لایسنس اسپات‌پلیر با موفقیت صادر شد");
        fetchCourseStudents(courseId);
      } else {
        throw new Error(res?.message || "صدور مجدد لایسنس با خطا مواجه شد");
      }
    } catch (err) {
      Notify.error(err.message || "خطا در تلاش مجدد صدور لایسنس");
    } finally {
      setRetryingLicenseId(null);
    }
  };

  const handleConfirmManualEnroll = async (selectedUser) => {
    if (!addModalCourse) return;
    setIsSubmittingAdd(true);
    try {
      const res = await manualEnrollVirtual(addModalCourse._id, selectedUser._id);
      if (res && res.success !== false) {
        Notify.success(res?.message || "کاربر با موفقیت در این دوره مجازی ثبت‌نام شد");
        setAddModalCourse(null);
        fetchCourseStudents(addModalCourse._id);
      } else {
        throw new Error(res?.message || "ثبت‌نام با خطا مواجه شد");
      }
    } catch (err) {
      Notify.error(err.message || "خطا در ثبت‌نام دستی کاربر");
    } finally {
      setIsSubmittingAdd(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Unified Toolbar */}
      <Toolbar
        searchPlaceholder="جستجو در دوره‌های مجازی..."
        searchValue={searchQuery}
        onSearch={(q) => { setSearchQuery(q); setPage(1); }}
        filterConfig={[{ field: "category", label: "دسته‌بندی", options: courseCategoryOptions }]}
        onFilterChange={(f) => { setActiveFilters(f); setPage(1); }}
        onRefresh={() => { setPage(1); fetchCourses(1, searchQuery, activeFilters, true); }}
        isRefreshing={refreshing}
      />

      {/* Courses Accordion List */}
      <div className="flex flex-col flex-1">
        {loading ? (
          <CardGridSkeleton count={4} cols="grid-cols-1" />
        ) : courses.length === 0 ? (
          <div className="text-center py-12 bg-surface rounded-2xl border border-dashed border-border text-text-muted text-sm">
            دوره‌ای یافت نشد.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {courses.map((course) => (
              <VirtualCourseAccordionItem
                key={course._id}
                course={course}
                isExpanded={expandedCourseId === course._id}
                onToggle={() => toggleCourseAccordion(course._id)}
                students={studentsByCourse[course._id] || []}
                loadingStudents={loadingStudents[course._id]}
                onAddStudent={(c) => setAddModalCourse(c)}
                onRetryLicense={handleRetryLicense}
                onViewProfile={(u) => setSelectedStudentForProfile(u)}
                onViewLicenseKey={(enrId, name) => setLicenseKeyModalData({ enrollmentId: enrId, studentName: name })}
                retryingLicenseId={retryingLicenseId}
              />
            ))}
            {loadingMore && <div className="py-4 flex justify-center"><Loading size={6} /></div>}
          </div>
        )}
      </div>

      {/* User Profile Modal */}
      {selectedStudentForProfile && (
        <UserProfileModal
          isOpen={Boolean(selectedStudentForProfile)}
          user={selectedStudentForProfile}
          userId={selectedStudentForProfile._id}
          onClose={() => setSelectedStudentForProfile(null)}
        />
      )}

      {/* Add Student Modal */}
      {addModalCourse && (
        <AddStudentModal
          isOpen={Boolean(addModalCourse)}
          onClose={() => setAddModalCourse(null)}
          courseTitle={addModalCourse.title}
          subtitle="دوره آنلاین / مجازی"
          onConfirm={handleConfirmManualEnroll}
          isSubmitting={isSubmittingAdd}
        />
      )}

      {/* SpotPlayer License Key View & Copy Modal */}
      {licenseKeyModalData && (
        <LicenseKeyModal
          isOpen={Boolean(licenseKeyModalData)}
          onClose={() => setLicenseKeyModalData(null)}
          enrollmentId={licenseKeyModalData.enrollmentId}
          studentName={licenseKeyModalData.studentName}
        />
      )}
    </div>
  );
}
