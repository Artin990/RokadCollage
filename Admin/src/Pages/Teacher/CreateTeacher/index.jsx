import React, { useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../Utils/axiosInstance";
import Notify from "../../../Utils/notify";
import {
  Button,
  Input,
  PageHeader,
  Card,
  ImageUpload,
} from "../../../Components/UI";
import { teacherValidationSchema } from "../schemas/teacherSchema";

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
        const formData = new FormData();
        formData.append("file", values.photo);

        const uploadData = await axiosInstance.post("upload", formData);

        if (!uploadData || !uploadData.success) {
          throw new Error(uploadData?.message || "آپلود تصویر با خطا مواجه شد");
        }

        const payload = {
          name: values.name.trim(),
          specialization: values.specialization.trim(),
          photo: uploadData.data,
        };

        const response = await axiosInstance.post("teacher", payload);

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
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div dir="rtl" className="p-6 md:p-8 w-full bg-background min-h-screen">
      <PageHeader
        title="افزودن استاد جدید"
        subtitle="ثبت مشخصات و تصویر مدرس دوره"
        backTo="/teacher"
      />

      <Card className="p-6 md:p-8 max-w-2xl mx-auto shadow-xs">
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
          <Input
            label="نام و نام خانوادگی استاد *"
            placeholder="مثال: دکتر علی رضایی"
            error={formik.touched.name && formik.errors.name}
            {...formik.getFieldProps("name")}
          />

          <Input
            label="حوزه تخصص و تدریس *"
            placeholder="مثال: متخصص طراحی رابط کاربری و تجربه کاربری"
            error={formik.touched.specialization && formik.errors.specialization}
            {...formik.getFieldProps("specialization")}
          />

          <div className="pt-2 border-t border-border/80">
            <ImageUpload
              label="تصویر پرسنلی استاد *"
              imagePreview={imagePreview}
              onChange={handleImageSelect}
              error={formik.touched.photo && formik.errors.photo}
              placeholder="برای آپلود تصویر پرسنلی استاد کلیک کنید"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-border/80 gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => navigate("/teacher")}
              disabled={isSubmitting}
            >
              انصراف
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
            >
              ثبت استاد
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
