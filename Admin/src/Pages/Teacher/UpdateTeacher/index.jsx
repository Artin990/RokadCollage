import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../Utils/axiosInstance";
import Notify from "../../../Utils/notify";
import { getImageUrl } from "../../../Utils/getImageUrl";
import Loading from "../../../Components/Loading";
import {
  Button,
  Input,
  PageHeader,
  Card,
  ImageUpload,
} from "../../../Components/UI";
import { teacherUpdateSchema } from "../schemas/teacherSchema";

export default function UpdateTeacher() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [initialValues, setInitialValues] = useState({
    name: "",
    specialization: "",
    photo: null,
  });

  useEffect(() => {
    const fetchTeacher = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`teacher/${id}`);
        const data = response?.data || response;

        if (data) {
          setInitialValues({
            name: data.name || "",
            specialization: data.specialization || "",
            photo: data.photo || null,
          });

          if (data.photo) {
            setImagePreview(getImageUrl(data.photo));
          }
        }
      } catch (error) {
        Notify.error(error.message || "خطا در دریافت اطلاعات استاد");
        navigate("/teacher");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTeacher();
  }, [id, navigate]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: teacherUpdateSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        let finalPhotoName = values.photo;

        if (values.photo instanceof File) {
          const formData = new FormData();
          formData.append("file", values.photo);

          const uploadData = await axiosInstance.post("upload", formData);
          if (!uploadData || !uploadData.success) {
            throw new Error(uploadData?.message || "آپلود تصویر با خطا مواجه شد");
          }
          finalPhotoName = uploadData.data;
        }

        const payload = {
          name: values.name.trim(),
          specialization: values.specialization.trim(),
          photo: finalPhotoName,
        };

        const response = await axiosInstance.patch(`teacher/${id}`, payload);

        if (response && response.success !== false) {
          Notify.success("اطلاعات استاد با موفقیت ویرایش شد.");
          navigate("/teacher");
        } else {
          throw new Error(response?.message || "ویرایش با خطا مواجه شد");
        }
      } catch (error) {
        Notify.error(error.message || "خطا در ویرایش استاد");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleImageSelect = (file) => {
    formik.setFieldValue("photo", file);
    setImagePreview(URL.createObjectURL(file));
  };

  if (loading) {
    return (
      <div dir="rtl" className="flex justify-center items-center min-h-[60vh]">
        <Loading size={12} />
      </div>
    );
  }

  return (
    <div dir="rtl" className="p-6 md:p-8 w-full bg-background min-h-screen">
      <PageHeader
        title="ویرایش مشخصات استاد"
        subtitle="ویرایش نام، تخصص و تصویر مدرس"
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
            placeholder="مثال: متخصص طراحی رابط کاربری"
            error={formik.touched.specialization && formik.errors.specialization}
            {...formik.getFieldProps("specialization")}
          />

          <div className="pt-2 border-t border-border/80">
            <ImageUpload
              label="تغییر تصویر پرسنلی استاد"
              imagePreview={imagePreview}
              onChange={handleImageSelect}
              error={formik.touched.photo && formik.errors.photo}
              placeholder="برای تغییر تصویر کلیک کنید"
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
              ذخیره تغییرات
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
