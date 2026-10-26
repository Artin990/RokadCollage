import React, { useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import Notify from "../../../../Utils/notify";
import { PageHeader } from "../../../../Components/UI";
import { inPersonCourseValidationSchema } from "../schemas/inPersonCourseSchema";
import { createInPersonCourse, prepareInPersonPayload } from "../api/inPersonApi";
import InPersonCourseForm from "../components/InPersonCourseForm";

export default function CreateInPersonCourse() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      category: "",
      title: "",
      duration: "",
      price: "",
      description: "",
      tags: ["دوره حضوری"],
      img: null,
      courseType: "دوره حضوری",
      approximateSessions: "",
      totalHours: "",
      scheduleDays: "",
      tuitionPerPerson: "",
      proposedTeacher: "",
      approximateStartDate: "",
      approximateEndDate: "",
      joujmanEvent: {
        title: "رویداد پایانی و ژوژمان",
        description: "در انتهای هر دوره، یک جلسه رسمی پروژه‌های نوجوانان با دعوت رسمی از والدین و ۲ الی ۳ نفر از اساتید متخصص در این حوزه برگزار می‌شود که باعث افزایش اعتماد اولیاء، ارزیابی دقیق فنی، سنجش برای جذب در استودیو رکاد و ایجاد حس افتخار و انگیزه در نوجوانان می‌شود.",
        isActive: true,
      },
      teachers: [],
      timedDiscount: {
        percentage: "",
        startDate: "",
        endDate: "",
      },
      discountCodes: [],
      sprints: [],
      location: {
        address: "مشهد - فرامرز عباسی ۳۳",
        googleMapEmbedUrl: "",
        neshanEmbedUrl: "",
        baladEmbedUrl: "",
        mapEmbedUrl: "",
      },
      sessions: [
        {
          code: "کد ۱",
          scheduleDays: "",
          scheduleHours: "",
          capacity: "",
        },
      ],
    },
    validationSchema: inPersonCourseValidationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const payload = await prepareInPersonPayload(values, false);
        const res = await createInPersonCourse(payload);

        if (res && res.success !== false) {
          Notify.success("دوره حضوری با موفقیت ایجاد شد");
          navigate("/in-person-courses");
        } else {
          throw new Error(res?.message || "ثبت دوره حضوری با خطا مواجه شد");
        }
      } catch (err) {
        Notify.error(err.message || "خطا در ثبت دوره حضوری");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col">
      <PageHeader
        title="افزودن دوره حضوری جدید"
        subtitle="تعریف مشخصات، قیمت، کدهای کلاس و موقعیت مکانی دوره حضوری"
        backTo="/in-person-courses"
      />

      <InPersonCourseForm
        formik={formik}
        isSubmitting={isSubmitting}
        submitLabel="ثبت و ایجاد دوره حضوری"
        mode="create"
      />
    </div>
  );
}
