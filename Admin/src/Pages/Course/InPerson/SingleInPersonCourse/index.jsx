import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import Notify from "../../../../Utils/notify";
import { Button, Card, PageHeader, LoadingState, FormSkeleton } from "../../../../Components/UI";
import { fetchInPersonCourseById } from "../api/inPersonApi";
import SingleCourseHero from "../../components/SingleCourseHero";
import SingleCourseDiscounts from "../../components/SingleCourseDiscounts";
import SingleCourseAbout from "../../components/SingleCourseAbout";
import SingleCourseSprints from "../../components/SingleCourseSprints";
import SingleCourseSessions from "../components/SingleCourseSessions";
import SingleCourseLocation from "../components/SingleCourseLocation";
import SingleCourseTeachers from "../../components/SingleCourseTeachers";

export default function SingleInPersonCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      try {
        const response = await fetchInPersonCourseById(id);
        let data = null;
        if (response && response.data) {
          data = Array.isArray(response.data) ? response.data[0] : response.data;
        } else if (Array.isArray(response)) {
          data = response[0];
        }

        if (data) {
          setCourse(data);
        } else {
          Notify.error("دوره حضوری یافت نشد");
        }
      } catch (error) {
        Notify.error(error.message || "خطا در دریافت اطلاعات دوره");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadCourse();
  }, [id]);

  if (loading) {
    return (
      <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col">
        <PageHeader
          title="مشخصات دوره حضوری"
          subtitle="در حال بارگذاری اطلاعات دوره..."
          backTo="/in-person-courses"
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
          backTo="/in-person-courses"
        />
        <div className="p-12 text-center text-text-secondary bg-surface rounded-2xl border border-dashed border-border mt-4">
          اطلاعات دوره یافت نشد یا ممکن است حذف شده باشد.
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col">
      <PageHeader
        title={course.title}
        subtitle="جزئیات کامل دوره حضوری، کدهای کلاس و موقعیت مکانی"
        backTo="/in-person-courses"
        action={
          <Button
            variant="primary"
            size="md"
            icon={<EditIcon fontSize="small" />}
            onClick={() => navigate(`/in-person-courses/update/${course._id}`)}
          >
            ویرایش دوره
          </Button>
        }
      />

      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <SingleCourseHero course={course} isVirtual={false} />

        <SingleCourseDiscounts course={course} />

        <SingleCourseAbout description={course.description} />

        <SingleCourseTeachers teachers={course.teachers} />

        <SingleCourseSprints sprints={course.sprints} />

        <SingleCourseSessions sessions={course.sessions} courseId={course._id} />

        <SingleCourseLocation location={course.location} />
      </div>
    </div>
  );
}
