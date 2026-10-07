import React from "react";
import { Input, Textarea } from "../../../Components/UI";

export default function BasicMetaSection({ formik }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-base md:text-lg font-bold text-secondary border-b border-border/80 pb-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
        تنظیمات پایه (Basic SEO)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-1">
        <Input
          label="عنوان سایت (Title)"
          placeholder="مثال: کالج آموزشی و فناوری رکاد"
          error={formik.touched.title && formik.errors.title}
          {...formik.getFieldProps("title")}
        />

        <Input
          label="ربات‌ها (Robots)"
          placeholder="مثال: index, follow"
          error={formik.touched.robots && formik.errors.robots}
          {...formik.getFieldProps("robots")}
        />

        <div className="col-span-1 md:col-span-2">
          <Textarea
            label="توضیحات (Description)"
            rows={3}
            placeholder="توضیحات پیش‌فرض سایت برای موتورهای جستجو..."
            error={formik.touched.description && formik.errors.description}
            {...formik.getFieldProps("description")}
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <Input
            label="کلمات کلیدی (Keywords)"
            placeholder="کلمات را با کاما جدا کنید (مثال: رکاد, کالج آموزشی, برنامه نویسی, طراحی)"
            error={formik.touched.keywords && formik.errors.keywords}
            {...formik.getFieldProps("keywords")}
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <Input
            label="آدرس کنونیکال (Canonical URL)"
            placeholder="https://..."
            dir="ltr"
            error={formik.touched.canonicalUrl && formik.errors.canonicalUrl}
            {...formik.getFieldProps("canonicalUrl")}
          />
        </div>
      </div>
    </div>
  );
}
