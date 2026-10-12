import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import Notify from "../../../../Utils/notify";
import { PageHeader, LoadingState, FormSkeleton } from "../../../../Components/UI";
import { virtualCourseUpdateSchema } from "../schemas/virtualCourseSchema";
import {
  fetchVirtualCourseById,
  updateVirtualCourse,
  prepareVirtualPayload,
  toggleVirtualDiscountCode,
} from "../api/virtualApi";
import VirtualCourseForm from "../components/VirtualCourseForm";

export default function UpdateVirtualCourse() {
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
    spotplayerCourseId: "",
    timedDiscount: {
      percentage: "",
      startDate: "",
      endDate: "",
    },
    discountCodes: [],
    sprints: [],
  });

  const loadCourse = async () => {
    setLoading(true);
    try {
      const res = await fetchVirtualCourseById(id);
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
          teachers: (course.teachers || []).map((t) => (typeof t === "object" ? t._id : t)),
          spotplayerCourseId: course.spotplayerCourseId || "",
          timedDiscount: {
            percentage: course.timedDiscount?.percentage ?? "",
            startDate: course.timedDiscount?.startDate || "",
            endDate: course.timedDiscount?.endDate || "",
          },
          discountCodes: course.discountCodes || [],
          sprints: course.sprints || [],
        });
      } else {
        Notify.error("دوره مجازی یافت نشد");
      }
    } catch (err) {
      Notify.error(err.message || "خطا در دریافت اطلاعات دوره مجازی");
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
      const res = await toggleVirtualDiscountCode(id, codeId);
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
    validationSchema: virtualCourseUpdateSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const payload = await prepareVirtualPayload(values, true);
        const res = await updateVirtualCourse(id, payload);

        if (res && res.success !== false) {
          Notify.success("دوره مجازی با موفقیت به‌روزرسانی شد");
          navigate("/virtual-courses");
        } else {
          throw new Error(res?.message || "به‌روزرسانی با خطا مواجه شد");
        }
      } catch (err) {
        Notify.error(err.message || "خطا در به‌روزرسانی دوره مجازی");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col">
      <PageHeader
        title={initialValues.title ? `ویرایش دوره مجازی: ${initialValues.title}` : "ویرایش دوره مجازی"}
        subtitle="ویرایش مشخصات، قیمت، تخفیف‌ها و شناسه دوره در اسپات‌پلیر"
        backTo="/virtual-courses"
      />

      {loading ? (
        <FormSkeleton />
      ) : (
        <VirtualCourseForm
          formik={formik}
          isSubmitting={isSubmitting}
          submitLabel="ذخیره تغییرات دوره مجازی"
          onToggleRemoteCode={handleToggleDiscount}
          togglingCodeId={togglingCodeId}
        />
      )}
    </div>
  );
}
