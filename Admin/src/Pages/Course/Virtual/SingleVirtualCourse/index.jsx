import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import Notify from "../../../../Utils/notify";
import Loading from "../../../../Components/Loading";
import { Button, Card, PageHeader } from "../../../../Components/UI";
import { fetchVirtualCourseById } from "../api/virtualApi";
import SingleCourseHero from "../../shared/singleCourse/SingleCourseHero";
import SingleCourseDiscounts from "../../shared/singleCourse/SingleCourseDiscounts";
import SingleCourseAbout from "../../shared/singleCourse/SingleCourseAbout";
import SingleCourseSprints from "../../shared/singleCourse/SingleCourseSprints";
import SingleCourseTeachers from "../../shared/singleCourse/SingleCourseTeachers";

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

    if (id) loadCourse();
  }, [id]);

  if (loading) {
    return (
      <div dir="rtl" className="flex justify-center items-center min-h-[70vh] bg-background">
        <Loading size={12} />
      </div>
    );
  }

  if (!course) {
    return (
      <div dir="rtl" className="p-6 md:p-8 max-w-4xl mx-auto text-center">
        <Card className="p-8">
          <h2 className="text-xl font-bold text-secondary mb-3">دوره مجازی یافت نشد</h2>
          <Button variant="primary" onClick={() => navigate("/virtual-courses")}>
            بازگشت به لیست دوره‌های مجازی
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div dir="rtl" className="p-6 md:p-8 w-full bg-background min-h-screen">
      <PageHeader
        title={course.title}
        subtitle="صفحه اختصاصی و مشخصات دوره مجازی (اسپات‌پلیر)"
        backTo="/virtual-courses"
        backLabel="بازگشت به دوره‌های مجازی"
        action={
          <Button
            variant="primary"
            size="md"
            icon={<EditIcon fontSize="small" />}
            onClick={() => navigate(`/virtual-courses/update/${course._id}`)}
          >
            ویرایش دوره مجازی
          </Button>
        }
      />

      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        {/* SpotPlayer Key Banner */}
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
              <VpnKeyIcon fontSize="small" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-secondary">
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
