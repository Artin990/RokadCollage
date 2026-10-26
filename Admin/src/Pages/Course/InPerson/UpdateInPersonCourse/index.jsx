import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import Notify from "../../../../Utils/notify";
import { PageHeader, LoadingState, FormSkeleton } from "../../../../Components/UI";
import { inPersonCourseUpdateSchema } from "../schemas/inPersonCourseSchema";
import {
  fetchInPersonCourseById,
  updateInPersonCourse,
  prepareInPersonPayload,
  toggleInPersonDiscountCode,
} from "../api/inPersonApi";
import InPersonCourseForm from "../components/InPersonCourseForm";

export default function UpdateInPersonCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [togglingCodeId, setTogglingCodeId] = useState(null);

  const [initialValues, setInitialValues] = useState({
    category: "",
    title: "",
    duration: "",
    price: "",
    description: "",
    tags: [],
    img: null,
    teachers: [],
    timedDiscount: {
      percentage: "",
      startDate: "",
      endDate: "",
    },
    discountCodes: [],
    sprints: [],
    location: {
      address: "",
      googleMapEmbedUrl: "",
      neshanEmbedUrl: "",
      baladEmbedUrl: "",
      mapEmbedUrl: "",
    },
  });

  const loadCourse = async () => {
    setLoading(true);
    try {
      const res = await fetchInPersonCourseById(id);
      let course = null;
      if (res && res.data) {
        course = Array.isArray(res.data) ? res.data[0] : res.data;
      } else if (Array.isArray(res)) {
        course = res[0];
      }

      if (course) {
        setInitialValues({
          category: course.category || "",
          title: course.title || "",
          duration: course.duration || "",
          price: course.price ?? "",
          description: course.description || "",
          tags: course.tags || [],
          img: course.img || null,
          courseType: course.courseType || "دوره حضوری",
          approximateSessions: course.approximateSessions || "",
          totalHours: course.totalHours || "",
          scheduleDays: course.scheduleDays || "",
          tuitionPerPerson: course.tuitionPerPerson ?? "",
          proposedTeacher: course.proposedTeacher || "",
          approximateStartDate: course.approximateStartDate || "",
          approximateEndDate: course.approximateEndDate || "",
          joujmanEvent: course.joujmanEvent || {
            title: "رویداد پایانی و ژوژمان",
            description: "در انتهای هر دوره، یک جلسه رسمی پروژه‌های نوجوانان با دعوت رسمی از والدین و ۲ الی ۳ نفر از اساتید متخصص در این حوزه برگزار می‌شود که باعث افزایش اعتماد اولیاء، ارزیابی دقیق فنی، سنجش برای جذب در استودیو رکاد و ایجاد حس افتخار و انگیزه در نوجوانان می‌شود.",
            isActive: true,
          },
          teachers: (course.teachers || []).map((t) => (typeof t === "object" ? t._id : t)),
          timedDiscount: {
            percentage: course.timedDiscount?.percentage ?? "",
            startDate: course.timedDiscount?.startDate || "",
            endDate: course.timedDiscount?.endDate || "",
          },
          discountCodes: course.discountCodes || [],
          sprints: course.sprints || [],
          location: {
            address: course.location?.address || "",
            googleMapEmbedUrl: course.location?.googleMapEmbedUrl || "",
            neshanEmbedUrl: course.location?.neshanEmbedUrl || "",
            baladEmbedUrl: course.location?.baladEmbedUrl || "",
            mapEmbedUrl: course.location?.mapEmbedUrl || "",
          },
        });
      } else {
        Notify.error("دوره حضوری یافت نشد");
      }
    } catch (err) {
      Notify.error(err.message || "خطا در دریافت اطلاعات دوره");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadCourse();
  }, [id]);

  const handleToggleDiscount = async (codeId) => {
    setTogglingCodeId(codeId);
    try {
      const res = await toggleInPersonDiscountCode(id, codeId);
      if (res && res.success !== false) {
        Notify.success(res?.message || "وضعیت کد تخفیف با موفقیت تغییر کرد");
        if (res.data?.discountCodes) {
          formik.setFieldValue("discountCodes", res.data.discountCodes);
        }
      } else {
        throw new Error(res?.message || "خطا در تغییر وضعیت کد تخفیف");
      }
    } catch (err) {
      Notify.error(err.message || "خطا در تغییر وضعیت کد تخفیف");
    } finally {
      setTogglingCodeId(null);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: inPersonCourseUpdateSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const payload = await prepareInPersonPayload(values, true);
        const res = await updateInPersonCourse(id, payload);

        if (res && res.success !== false) {
          Notify.success("دوره حضوری با موفقیت به‌روزرسانی شد");
          navigate("/in-person-courses");
        } else {
          throw new Error(res?.message || "به‌روزرسانی با خطا مواجه شد");
        }
      } catch (err) {
        Notify.error(err.message || "خطا در به‌روزرسانی دوره حضوری");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col">
      <PageHeader
        title={initialValues.title ? `ویرایش دوره حضوری: ${initialValues.title}` : "ویرایش دوره حضوری"}
        subtitle="ویرایش مشخصات، قیمت، موقعیت مکانی و تخفیف‌ها"
        backTo="/in-person-courses"
      />

      {loading ? (
        <FormSkeleton />
      ) : (
        <InPersonCourseForm
          formik={formik}
          isSubmitting={isSubmitting}
          submitLabel="ذخیره تغییرات دوره"
          mode="update"
          courseId={id}
          onToggleRemoteCode={handleToggleDiscount}
          togglingCodeId={togglingCodeId}
        />
      )}
    </div>
  );
}
