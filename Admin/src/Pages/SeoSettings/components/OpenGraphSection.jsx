import React from "react";
import { Input, Textarea } from "../../../Components/UI";

export default function OpenGraphSection({ formik }) {
  return (
    <div className="flex flex-col gap-4 border-t border-border/80 pt-6">
      <h2 className="text-base md:text-lg font-bold text-secondary border-b border-border/80 pb-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
        تنظیمات شبکه‌های اجتماعی (Open Graph)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-1">
        <Input
          label="عنوان (OG Title)"
          placeholder="عنوان اشتراک‌گذاری در شبکه‌های اجتماعی"
          error={formik.touched.ogTitle && formik.errors.ogTitle}
          {...formik.getFieldProps("ogTitle")}
        />

        <Input
          label="نوع (OG Type)"
          placeholder="مثال: website"
          error={formik.touched.ogType && formik.errors.ogType}
          {...formik.getFieldProps("ogType")}
        />

        <div className="col-span-1 md:col-span-2">
          <Textarea
            label="توضیحات (OG Description)"
            rows={2}
            placeholder="توضیحات اشتراک‌گذاری در شبکه‌های اجتماعی..."
            error={formik.touched.ogDescription && formik.errors.ogDescription}
            {...formik.getFieldProps("ogDescription")}
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <Input
            label="لینک تصویر (OG Image)"
            placeholder="https://..."
            dir="ltr"
            error={formik.touched.ogImage && formik.errors.ogImage}
            {...formik.getFieldProps("ogImage")}
          />
        </div>
      </div>
    </div>
  );
}
