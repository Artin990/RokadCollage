import React from "react";
import { useFormikContext } from "formik";
import { Select, Input } from "../../../../Components/UI";
import { categoryOptions } from "../courseCommonSchema";

export default function CourseBasicInfoSection() {
  const { values, errors, touched, handleChange, handleBlur } = useFormikContext();

  return (
    <div className="flex flex-col gap-5">
      {/* Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Select
          label="دسته‌بندی دوره"
          placeholder="انتخاب دسته‌بندی"
          options={categoryOptions}
          name="category"
          value={values.category}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.category && errors.category}
        />

        <Input
          label="عنوان دوره"
          placeholder="مثال: آموزش جامع ری‌اکت و نکست‌جی‌اس"
          name="title"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.title && errors.title}
        />
      </div>

      {/* Duration & Base Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label="مدت دوره"
          placeholder="مثال: ۱۲ هفته (یا ۳ ماه)"
          name="duration"
          value={values.duration}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.duration && errors.duration}
        />

        <Input
          label="قیمت پایه دوره (تومان)"
          type="number"
          min="0"
          placeholder="مثال: ۲۵۰۰۰۰۰ (۰ برای رایگان)"
          name="price"
          value={values.price}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.price && errors.price}
        />
      </div>
    </div>
  );
}
