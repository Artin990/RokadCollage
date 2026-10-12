import React, { useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import Notify from "../../../Utils/notify";
import { PageHeader } from "../../../Components/UI";
import { teacherValidationSchema } from "../schemas/teacherSchema";
import { createTeacher, uploadTeacherPhoto } from "../api/teacherApi";
import TeacherForm from "../components/TeacherForm";

export default function CreateTeacher() {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      specialization: "",
      photo: null,
    },
    validationSchema: teacherValidationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const photoFileName = await uploadTeacherPhoto(values.photo);

        const payload = {
          name: values.name.trim(),
          specialization: values.specialization.trim(),
          photo: photoFileName,
        };

        const response = await createTeacher(payload);

        if (response && response.success !== false) {
          Notify.success("استاد با موفقیت ایجاد شد.");
          navigate("/teacher");
        } else {
          throw new Error(response?.message || "ثبت استاد با خطا مواجه شد");
        }
      } catch (error) {
        Notify.error(error.message || "خطا در ثبت استاد");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleImageSelect = (file) => {
    formik.setFieldValue("photo", file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  return (
    <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col">
      <PageHeader
        title="افزودن استاد جدید"
        subtitle="ثبت مشخصات و تصویر مدرس دوره"
        backTo="/teacher"
      />

      <TeacherForm
        formik={formik}
        imagePreview={imagePreview}
        onImageSelect={handleImageSelect}
        isSubmitting={isSubmitting}
        submitLabel="ثبت استاد"
        onCancel={() => navigate("/teacher")}
      />
    </div>
  );
}
