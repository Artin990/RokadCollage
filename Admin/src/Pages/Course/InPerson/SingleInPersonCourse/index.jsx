import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import Notify from "../../../../Utils/notify";
import Loading from "../../../../Components/Loading";
import { Button, Card, PageHeader } from "../../../../Components/UI";
import { fetchInPersonCourseById } from "../api/inPersonApi";
import SingleCourseHero from "../../shared/singleCourse/SingleCourseHero";
import SingleCourseDiscounts from "../../shared/singleCourse/SingleCourseDiscounts";
import SingleCourseAbout from "../../shared/singleCourse/SingleCourseAbout";
import SingleCourseSprints from "../../shared/singleCourse/SingleCourseSprints";
import SingleCourseSessions from "../../shared/singleCourse/SingleCourseSessions";
import SingleCourseLocation from "../../shared/singleCourse/SingleCourseLocation";
import SingleCourseTeachers from "../../shared/singleCourse/SingleCourseTeachers";

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
      <div dir="rtl" className="flex justify-center items-center min-h-[70vh] bg-background">
        <Loading size={12} />
      </div>
    );
  }

  if (!course) {
    return (
      <div dir="rtl" className="p-6 md:p-8 max-w-4xl mx-auto text-center">
        <Card className="p-8">
          <h2 className="text-xl font-bold text-secondary mb-3">دوره حضوری یافت نشد</h2>
          <Button variant="primary" onClick={() => navigate("/in-person-courses")}>
            بازگشت به لیست دوره‌های حضوری
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div dir="rtl" className="p-6 md:p-8 w-full bg-background min-h-screen">
      <PageHeader
        title={course.title}
        subtitle="صفحه اختصاصی و جزئیات کامل کارگاه حضوری"
        backTo="/in-person-courses"
        backLabel="بازگشت به دوره‌های حضوری"
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

      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        <SingleCourseHero course={course} />
        <SingleCourseDiscounts course={course} />
        <SingleCourseAbout description={course.description} />
        <SingleCourseSprints sprints={course.sprints} />
        <SingleCourseSessions sessions={course.sessions} />
        <SingleCourseLocation location={course.location} />
        <SingleCourseTeachers teachers={course.teachers} />
      </div>
    </div>
  );
}
