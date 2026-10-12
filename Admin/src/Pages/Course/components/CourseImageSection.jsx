import React, { useMemo } from "react";
import { useFormikContext } from "formik";
import { ImageUpload } from "../../../Components/UI";
import { getImageUrl } from "../../../Utils/getImageUrl";

export default function CourseImageSection() {
  const { values, errors, touched, setFieldValue } = useFormikContext();

  const imagePreview = useMemo(() => {
    if (!values.img) return null;
    if (values.img instanceof File) {
      return URL.createObjectURL(values.img);
    }
    if (typeof values.img === "string") {
      return getImageUrl(values.img);
    }
    return null;
  }, [values.img]);

  return (
    <div className="border-t border-border/80 pt-5">
      <ImageUpload
        label="تصویر شاخص دوره *"
        imagePreview={imagePreview}
        onChange={(file) => setFieldValue("img", file)}
        error={touched.img && errors.img}
        placeholder="برای آپلود یا تغییر تصویر دوره کلیک کنید"
        accept="image/jpeg, image/jpg, image/png, image/svg+xml, image/webp"
      />
    </div>
  );
}
