import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import Notify from "../../../../Utils/notify";
import { Button, PageHeader, LoadingState, FormSkeleton } from "../../../../Components/UI";
import { fetchVirtualCourseById } from "../api/virtualApi";
import SingleCourseHero from "../../components/SingleCourseHero";
import SingleCourseDiscounts from "../../components/SingleCourseDiscounts";
import SingleCourseAbout from "../../components/SingleCourseAbout";
import SingleCourseSprints from "../../components/SingleCourseSprints";
import SingleCourseTeachers from "../../components/SingleCourseTeachers";

export default function SingleVirtualCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      try {
        const response = await fetchVirtualCourseById(id);
        let data = null;
        if (response && response.data) {
          data = Array.isArray(response.data) ? response.data[0] : response.data;
        } else if (Array.isArray(response)) {
          data = response[0];
        }

        if (data) {
          setCourse(data);
        } else {
          Notify.error("دوره مجازی یافت نشد");
        }
      } catch (error) {
        Notify.error(error.message || "خطا در دریافت اطلاعات دوره مجازی");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCourse();
    }
  }, [id]);

  if (loading) {
    return (
      <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col">
        <PageHeader
          title="مشخصات دوره مجازی"
          subtitle="در حال بارگذاری اطلاعات دوره..."
          backTo="/virtual-courses"
        />
        <FormSkeleton />
      </div>
    );
  }

  if (!course) {
    return (
      <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col">
        <PageHeader
          title="دوره یافت نشد"
          backTo="/virtual-courses"
        />
        <div className="p-12 text-center text-text-secondary bg-surface rounded-2xl border border-dashed border-border mt-4">
          دوره مجازی مورد نظر یافت نشد یا ممکن است حذف شده باشد.
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col">
      <PageHeader
        title={course.title}
        subtitle="جزئیات و مشخصات کامل دوره مجازی، سرفصل‌ها و اساتید"
        backTo="/virtual-courses"
        action={
          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              variant="outline"
              size="md"
              icon={<ForumOutlinedIcon fontSize="small" />}
              onClick={() => navigate(`/virtual-courses/${course._id}/comments`)}
            >
              مدیریت کامنت‌ها و پرسش‌ها
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={<EditIcon fontSize="small" />}
              onClick={() => navigate(`/virtual-courses/update/${course._id}`)}
            >
              ویرایش دوره
            </Button>
          </div>
        }
      />

      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        {/* SpotPlayer Connection Banner */}
        <div className="bg-purple-50/80 border border-purple-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <VpnKeyIcon fontSize="small" />
            </div>
            <div>
              <h4 className="font-bold text-purple-950 text-sm md:text-base">
                شناسه اتصال به پنل SpotPlayer
              </h4>
              <p className="text-xs text-text-muted mt-0.5">
                شناسه دوره برای صدور لایسنس دانشجویان در وب‌سرویس
              </p>
            </div>
          </div>
          <div className="bg-white px-3.5 py-1.5 rounded-xl border border-purple-200 font-mono text-purple-900 font-bold text-sm tracking-wide self-start sm:self-auto" dir="ltr">
            {course.spotplayerCourseId || "تعریف نشده"}
          </div>
        </div>

        <SingleCourseHero course={course} />
        <SingleCourseDiscounts course={course} />
        <SingleCourseAbout description={course.description} />
        {course.sprints?.length > 0 && <SingleCourseSprints sprints={course.sprints} />}
        <SingleCourseTeachers teachers={course.teachers} />
      </div>
    </div>
  );
}
