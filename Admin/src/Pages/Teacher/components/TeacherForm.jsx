import React from "react";
import { Button, Input, Card, ImageUpload } from "../../../Components/UI";

export default function TeacherForm({
  formik,
  imagePreview,
  onImageSelect,
  isSubmitting,
  submitLabel = "ثبت استاد",
  onCancel,
}) {
  return (
    <Card className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto shadow-xs">
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
            label="تصویر پرسنلی استاد"
            imagePreview={imagePreview}
            onChange={onImageSelect}
            error={formik.touched.photo && formik.errors.photo}
            placeholder="برای آپلود یا تغییر تصویر پرسنلی استاد کلیک کنید"
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end pt-4 border-t border-border/80 gap-2.5 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            انصراف
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            className="w-full sm:w-auto"
          >
            {submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
}
