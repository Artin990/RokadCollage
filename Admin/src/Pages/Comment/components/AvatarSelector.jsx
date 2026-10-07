import React, { useState, useEffect } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Notify from "../../../Utils/notify";
import { getImageUrl } from "../../../Utils/getImageUrl";
import { DEFAULT_AVATARS } from "../../../Constants/defaultAvatars";

export default function AvatarSelector({ value, onChange, error, touched }) {
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof value === "string" && value) {
      if (value.startsWith("default-") || value.startsWith("default")) {
        setImagePreview(`/default-avatars/${value}`);
      } else {
        setImagePreview(getImageUrl(value));
      }
    } else {
      setImagePreview(null);
    }
  }, [value]);

  const handleCustomImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/svg+xml",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        Notify.error("فرمت فایل غیرمجاز است. فقط JPG, JPEG, PNG, SVG, WEBP مجاز است.");
        e.target.value = "";
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        Notify.error("حجم تصویر نباید بیشتر از ۵ مگابایت باشد.");
        e.target.value = "";
        return;
      }
      if (file.name.toLowerCase().startsWith("default-") || file.name.toLowerCase().startsWith("default")) {
        Notify.error("نام فایل مجاز نیست. لطفاً نام فایل را تغییر دهید.");
        e.target.value = "";
        return;
      }
      onChange(file);
    }
  };

  const handleSelectDefaultAvatar = (filename) => {
    onChange(filename);
  };

  const isCustomUploaded =
    value instanceof File ||
    (typeof value === "string" &&
      value &&
      !value.startsWith("default-") &&
      !value.startsWith("default"));

  return (
    <div className="flex flex-col gap-3 border-t border-border/80 pt-5">
      <label className="text-xs md:text-sm font-semibold text-text-primary select-none">
        تصویر یا آواتار (اختیاری)
      </label>
      <p className="text-xs text-text-muted">
        می‌توانید یکی از آواتارهای پیش‌فرض زیر را انتخاب کرده یا عکس جدیدی آپلود کنید.
      </p>

      {/* Default Avatars List */}
      <div className="flex gap-3 flex-wrap items-center mt-1">
        {DEFAULT_AVATARS.map((avatar) => {
          const isSelected = typeof value === "string" && value === avatar.filename;
          return (
            <div
              key={`avatar-${avatar.id}`}
              onClick={() => handleSelectDefaultAvatar(avatar.filename)}
              title={avatar.alt}
              className={`w-14 h-14 rounded-full cursor-pointer transition-all hover:scale-105 p-0.5 border-2 ${
                isSelected
                  ? "border-primary shadow-sm ring-4 ring-primary/20 scale-105"
                  : "border-border hover:border-border-hover"
              }`}
            >
              <img
                src={`/default-avatars/${avatar.filename}`}
                alt={avatar.alt}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          );
        })}
      </div>

      <span className="text-xs text-text-muted font-bold my-1">یا</span>

      {/* Custom Image Upload Input */}
      <div className="w-full md:w-1/2 h-32 border-2 border-dashed border-border hover:border-primary rounded-xl flex flex-col items-center justify-center gap-2 bg-bg-light/60 hover:bg-primary-light/30 transition-colors cursor-pointer relative overflow-hidden group">
        <input
          id="custom-img"
          type="file"
          accept="image/jpeg, image/jpg, image/png, image/svg+xml, image/webp"
          onChange={handleCustomImageChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        {imagePreview && isCustomUploaded ? (
          <>
            <img
              src={imagePreview}
              alt="پیش‌نمایش تصویر انتخابی"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
              تغییر عکس اختصاصی
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1.5 p-3 text-center">
            <CloudUploadIcon className="text-primary" />
            <p className="text-xs font-semibold text-text-secondary">
              آپلود تصویر اختصاصی (اختیاری)
            </p>
            <span className="text-[11px] text-text-muted">
              فرمت‌های JPG، PNG، SVG یا WEBP (حداکثر ۵ مگابایت)
            </span>
          </div>
        )}
      </div>

      {touched && error && (
        <span className="text-xs text-error font-medium animate-fadeIn">
          {error}
        </span>
      )}
    </div>
  );
}
