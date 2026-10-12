import React from "react";
import { useFormik } from "formik";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import Notify from "../../../Utils/notify";
import { Modal, Button, Textarea, Select } from "../../../Components/UI";
import { newCourseCommentSchema } from "../schemas/commentSchema";
import { createCourseComment } from "../api/courseCommentApi";

export default function AdminNewCommentModal({
  isOpen,
  onClose,
  courseId,
  courseTitle = "دوره آموزشی",
  onCommentCreated,
}) {
  const formik = useFormik({
    initialValues: {
      text: "",
      type: "qa",
    },
    validationSchema: newCourseCommentSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const res = await createCourseComment(courseId, {
          text: values.text.trim(),
          type: values.type,
        });

        if (res && res.success !== false) {
          Notify.success("دیدگاه/اطلاعیه مدیریت با موفقیت ثبت شد");
          resetForm();
          if (onCommentCreated) onCommentCreated(res.data);
          onClose();
        } else {
          Notify.error(res?.message || "خطا در ثبت دیدگاه");
        }
      } catch (err) {
        Notify.error(err.response?.data?.message || err.message || "خطا در ثبت دیدگاه");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const typeOptions = [
    { value: "qa", label: "بخش پرسش و پاسخ (Q&A)" },
    { value: "review", label: "بخش نظرات و بازخوردها (Review)" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ثبت دیدگاه یا اطلاعیه جدید مدیریت"
      maxWidth="max-w-lg"
    >
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-center gap-2 p-3 rounded-xl bg-primary-soft border border-primary-border text-xs text-secondary font-medium">
          <CampaignOutlinedIcon className="text-primary shrink-0" fontSize="small" />
          <span>
            این پیام به عنوان دیدگاه رسمی مدیریت آموزشگاه در صفحه دوره «{courseTitle}» نمایش داده خواهد شد.
          </span>
        </div>

        <Select
          label="بخش انتشار دیدگاه"
          name="type"
          value={formik.values.type}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          options={typeOptions}
          error={formik.touched.type && formik.errors.type}
        />

        <Textarea
          label="متن دیدگاه، راهنمایی یا اطلاعیه *"
          name="text"
          rows={4}
          value={formik.values.text}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="متن پیام خود را برای دانشجویان بنویسید..."
          error={formik.touched.text && formik.errors.text}
        />

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-3 border-t border-border mt-2">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onClose}
            disabled={formik.isSubmitting}
            className="w-full sm:w-auto"
          >
            انصراف
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={formik.isSubmitting || !formik.values.text.trim()}
            className="w-full sm:w-auto"
          >
            {formik.isSubmitting ? "در حال ثبت..." : "ثبت دیدگاه رسمی"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
