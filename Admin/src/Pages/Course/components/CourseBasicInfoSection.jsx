import React from "react";
import { useFormikContext } from "formik";
import { Select, Input } from "../../../Components/UI";
import { categoryOptions } from "../schemas/courseCommonSchema";

export default function CourseBasicInfoSection() {
  const { values, errors, touched, handleChange, handleBlur } = useFormikContext();

  return (
    <div className="flex flex-col gap-5">
      {/* Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Select
          label="دپارتمان / دسته‌بندی دوره"
          name="category"
          placeholder="انتخاب دپارتمان / دسته‌بندی"
          options={categoryOptions}
          value={values.category || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.category && errors.category}
          required
        />

        {/* Title */}
        <Input
          label="عنوان دوره"
          name="title"
          placeholder="مثال: آموزش جامع ری‌اکت و نکست‌جی‌اس"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.title && errors.title}
          required
        />
      </div>

      {/* Duration & Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label="طول مدت دوره"
          name="duration"
          placeholder="مثال: ۴۰ ساعت یا ۳ ماه"
          value={values.duration}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.duration && errors.duration}
          required
        />

        <Input
          label="قیمت دوره (تومان)"
          name="price"
          type="number"
          placeholder="0 برای دوره رایگان"
          value={values.price}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.price && errors.price}
          helperText="در صورت رایگان بودن، 0 وارد کنید"
        />
      </div>
    </div>
  );
}
