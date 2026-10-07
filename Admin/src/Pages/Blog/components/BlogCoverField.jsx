import React from "react";
import { ImageUpload } from "../../../Components/UI";

/**
 * Cover image field for Blog form using shared ImageUpload component.
 */
export default function BlogCoverField({
  imagePreview,
  onImageSelect,
  error,
}) {
  return (
    <div className="w-full">
      <ImageUpload
        label="تصویر شاخص و کاور مقاله *"
        imagePreview={imagePreview}
        onChange={onImageSelect}
        error={error}
        placeholder="برای آپلود یا تغییر تصویر کاور مقاله کلیک کنید"
        accept="image/jpeg, image/jpg, image/png, image/svg+xml, image/webp"
      />
    </div>
  );
}
