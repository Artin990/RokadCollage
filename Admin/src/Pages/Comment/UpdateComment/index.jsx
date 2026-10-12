import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import Notify from "../../../Utils/notify";
import { PageHeader, LoadingState } from "../../../Components/UI";
import { commentValidationSchema } from "../schemas/commentSchema";
import {
  fetchCommentById,
  updateComment,
  fetchCommentCourses,
} from "../api/commentApi";
import CommentForm from "../components/CommentForm";

export default function UpdateComment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [initialValues, setInitialValues] = useState({
    course: "",
    courseModel: "InPersonCourse",
    name: "",
    role: "",
    job: "",
    comment: "",
    img: "default-BoyStudent.png",
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [commentRes, coursesRes] = await Promise.all([
          fetchCommentById(id),
          fetchCommentCourses(),
        ]);

        if (coursesRes && coursesRes.success !== false) {
          const list = Array.isArray(coursesRes) ? coursesRes : coursesRes.data || [];
          setCourses(list);
        }
        setLoadingCourses(false);

        let comment = null;
        if (commentRes && commentRes.data) {
          comment = Array.isArray(commentRes.data) ? commentRes.data[0] : commentRes.data;
        } else if (commentRes) {
          comment = commentRes;
        }

        if (comment) {
          setInitialValues({
            course: comment.course?._id || comment.course || "",
            courseModel: comment.courseModel || "InPersonCourse",
            name: comment.name || "",
            role: comment.role || "",
            job: comment.job || "",
            comment: comment.comment || "",
            img: comment.img || "default-BoyStudent.png",
          });
        } else {
          Notify.error("اطلاعات نظر یافت نشد");
        }
      } catch (err) {
        Notify.error(err.message || "خطا در بارگذاری اطلاعات نظر");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadData();
  }, [id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
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

        const res = await updateComment(id, payload);
        if (res && res.success !== false) {
          Notify.success("نظر با موفقیت به‌روزرسانی شد");
          navigate("/comment");
        } else {
          throw new Error(res?.message || "به‌روزرسانی نظر با خطا مواجه شد");
        }
      } catch (err) {
        Notify.error(err.message || "خطا در به‌روزرسانی نظر");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col">
      <PageHeader
        title={initialValues.name ? `ویرایش نظر: ${initialValues.name}` : "ویرایش نظر"}
        subtitle="ویرایش دیدگاه، متن و مشخصات نویسنده نظر"
        backTo="/comment"
      />

      {loading ? (
        <LoadingState text="در حال بارگذاری اطلاعات نظر..." minHeight="min-h-[440px]" />
      ) : (
        <CommentForm
          formik={formik}
          courses={courses}
          loadingCourses={loadingCourses}
          isSubmitting={isSubmitting}
          submitLabel="ذخیره تغییرات نظر"
        />
      )}
    </div>
  );
}
