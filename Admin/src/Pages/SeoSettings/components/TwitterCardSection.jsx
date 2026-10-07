import React from "react";
import { Input, Textarea } from "../../../Components/UI";

export default function TwitterCardSection({ formik }) {
  return (
    <div className="flex flex-col gap-4 border-t border-border/80 pt-6">
      <h2 className="text-base md:text-lg font-bold text-secondary border-b border-border/80 pb-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
        تنظیمات توییتر (Twitter Cards)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-1">
        <Input
          label="نوع کارت (Twitter Card)"
          placeholder="مثال: summary_large_image"
          error={formik.touched.twitterCard && formik.errors.twitterCard}
          {...formik.getFieldProps("twitterCard")}
        />

        <Input
          label="عنوان توییتر (Twitter Title)"
          placeholder="عنوان برای کارت توییتر"
          error={formik.touched.twitterTitle && formik.errors.twitterTitle}
          {...formik.getFieldProps("twitterTitle")}
        />

        <div className="col-span-1 md:col-span-2">
          <Textarea
            label="توضیحات توییتر (Twitter Description)"
            rows={2}
            placeholder="توضیحات برای کارت توییتر..."
            error={formik.touched.twitterDescription && formik.errors.twitterDescription}
            {...formik.getFieldProps("twitterDescription")}
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <Input
            label="لینک تصویر توییتر (Twitter Image)"
            placeholder="https://..."
            dir="ltr"
            error={formik.touched.twitterImage && formik.errors.twitterImage}
            {...formik.getFieldProps("twitterImage")}
          />
        </div>
      </div>
    </div>
  );
}
