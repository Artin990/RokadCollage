import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import Notify from "../../../Utils/notify";
import { getImageUrl } from "../../../Utils/getImageUrl";
import { PageHeader, LoadingState } from "../../../Components/UI";
import { teacherUpdateSchema } from "../schemas/teacherSchema";
import {
  fetchTeacherById,
  updateTeacher,
  uploadTeacherPhoto,
} from "../api/teacherApi";
import TeacherForm from "../components/TeacherForm";

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
        const response = await fetchTeacherById(id);
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
          finalPhotoName = await uploadTeacherPhoto(values.photo);
        }

        const payload = {
          name: values.name.trim(),
          specialization: values.specialization.trim(),
          photo: finalPhotoName,
        };

        const response = await updateTeacher(id, payload);

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
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  return (
    <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col">
      <PageHeader
        title={initialValues.fullName ? `ویرایش مشخصات استاد: ${initialValues.fullName}` : "ویرایش مشخصات استاد"}
        subtitle="ویرایش نام، تخصص و تصویر مدرس"
        backTo="/teacher"
      />

      {loading ? (
        <LoadingState text="در حال بارگذاری اطلاعات استاد..." minHeight="min-h-[440px]" />
      ) : (
        <TeacherForm
          formik={formik}
          imagePreview={imagePreview}
          onImageSelect={handleImageSelect}
          isSubmitting={isSubmitting}
          submitLabel="ذخیره تغییرات"
          onCancel={() => navigate("/teacher")}
        />
      )}
    </div>
  );
}
