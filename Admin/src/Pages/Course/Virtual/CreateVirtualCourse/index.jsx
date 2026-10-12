import React, { useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import Notify from "../../../../Utils/notify";
import { PageHeader } from "../../../../Components/UI";
import { virtualCourseValidationSchema } from "../schemas/virtualCourseSchema";
import { createVirtualCourse, prepareVirtualPayload } from "../api/virtualApi";
import VirtualCourseForm from "../components/VirtualCourseForm";

export default function CreateVirtualCourse() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      category: "",
      title: "",
      duration: "",
      price: "",
      description: "",
      tags: [],
      img: null,
      teachers: [],
      spotplayerCourseId: "",
      timedDiscount: {
        percentage: "",
        startDate: "",
        endDate: "",
      },
      discountCodes: [],
      sprints: [],
    },
    validationSchema: virtualCourseValidationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const payload = await prepareVirtualPayload(values, false);
        const res = await createVirtualCourse(payload);

        if (res && res.success !== false) {
          Notify.success("دوره مجازی با موفقیت ایجاد شد");
          navigate("/virtual-courses");
        } else {
          throw new Error(res?.message || "ثبت دوره مجازی با خطا مواجه شد");
        }
      } catch (err) {
        Notify.error(err.message || "خطا در ثبت دوره مجازی");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col">
      <PageHeader
        title="افزودن دوره مجازی جدید"
        subtitle="تعریف مشخصات، قیمت، تخفیف‌ها و شناسه اتصال به اسپات‌پلیر"
        backTo="/virtual-courses"
      />

      <VirtualCourseForm
        formik={formik}
        isSubmitting={isSubmitting}
        submitLabel="ثبت و ایجاد دوره مجازی"
      />
    </div>
  );
}
