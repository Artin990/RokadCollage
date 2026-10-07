import React from "react";
import { Input, Textarea, Select } from "../../../Components/UI";
import { categoryOptions } from "../schemas/blogSchema";

/**
 * Basic metadata section for Blog form (Category, Title, Description).
 */
export default function BlogBasicInfoSection({ formik }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Select
          label="دسته‌بندی مرتبط با دوره *"
          placeholder="انتخاب دسته‌بندی موضوعی"
          options={categoryOptions}
          error={formik.touched.category && formik.errors.category}
          {...formik.getFieldProps("category")}
        />

        <Input
          label="عنوان مقاله *"
          placeholder="مثال: نقشه راه ورود به بازار کار طراحی وب"
          error={formik.touched.title && formik.errors.title}
          {...formik.getFieldProps("title")}
        />
      </div>

      <Textarea
        label="توضیحات کوتاه مقاله *"
        rows={4}
        placeholder="خلاصه کوتاهی از موضوع مقاله برای نمایش در کارت و پیش‌نمایش بنویسید (حداقل ۱۰ کاراکتر)..."
        error={formik.touched.description && formik.errors.description}
        {...formik.getFieldProps("description")}
      />
    </div>
  );
}
