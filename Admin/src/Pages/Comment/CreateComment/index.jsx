import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import Notify from "../../../Utils/notify";
import { PageHeader } from "../../../Components/UI";
import { commentValidationSchema } from "../schemas/commentSchema";
import { createComment, fetchCommentCourses } from "../api/commentApi";
import CommentForm from "../components/CommentForm";

export default function CreateComment() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadCourses = async () => {
      setLoadingCourses(true);
      try {
        const response = await fetchCommentCourses();
        if (response && response.success !== false) {
          const list = Array.isArray(response) ? response : response.data || [];
          setCourses(list);
        }
      } catch (error) {
        Notify.error("خطا در بارگذاری لیست دوره‌ها برای انتخاب");
      } finally {
        setLoadingCourses(false);
      }
    };

    loadCourses();
  }, []);

  const formik = useFormik({
    initialValues: {
      course: "",
      courseModel: "InPersonCourse",
      name: "",
      role: "",
      job: "",
      comment: "",
      img: "default-BoyStudent.png",
    },
    validationSchema: commentValidationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const payload = {
          course: values.course,
          courseModel: values.courseModel || "InPersonCourse",
          name: values.name.trim(),
          role: values.role.trim(),
          job: values.job ? values.job.trim() : "",
          comment: values.comment.trim(),
          img: values.img || "default-BoyStudent.png",
        };

        const res = await createComment(payload);
        if (res && res.success !== false) {
          Notify.success("نظر جدید با موفقیت ثبت شد");
          navigate("/comment");
        } else {
          throw new Error(res?.message || "ثبت نظر با خطا مواجه شد");
        }
      } catch (err) {
        Notify.error(err.message || "خطا در ثبت نظر");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col">
      <PageHeader
        title="افزودن نظر جدید"
        subtitle="ثبت دیدگاه یا تجربه دانشجو یا استاد درباره دوره آموزشی"
        backTo="/comment"
      />

      <CommentForm
        formik={formik}
        courses={courses}
        loadingCourses={loadingCourses}
        isSubmitting={isSubmitting}
        submitLabel="ثبت نظر جدید"
      />
    </div>
  );
}
