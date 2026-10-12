import React, { useState, useEffect } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
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

  const handleClearCustomImage = () => {
    onChange(DEFAULT_AVATARS[0]?.filename || "");
  };

  const isCustomUploaded =
    value instanceof File ||
    (typeof value === "string" &&
      value &&
      !value.startsWith("default-") &&
      !value.startsWith("default"));

  return (
    <div className="flex flex-col gap-3 border-t border-border/80 pt-5 text-right">
      <div className="flex items-center justify-between gap-2 select-none">
        <label className="text-xs md:text-sm font-black text-secondary">
          تصویر یا آواتار نظردهنده (اختیاری)
        </label>
        <span className="text-[11px] text-text-muted">
          انتخاب آواتار آماده یا آپلود تصویر دلخواه
        </span>
      </div>

      {/* Default Avatars List */}
      <div className="flex gap-2.5 sm:gap-3 flex-wrap items-center mt-0.5">
        {DEFAULT_AVATARS.map((avatar) => {
          const isSelected = typeof value === "string" && value === avatar.filename;
          return (
            <div
              key={`avatar-${avatar.id}`}
              onClick={() => handleSelectDefaultAvatar(avatar.filename)}
              title={avatar.alt}
              className={`w-12 h-12 sm:w-13 sm:h-13 rounded-2xl cursor-pointer transition-all hover:scale-105 p-1 border-2 shadow-2xs ${
                isSelected
                  ? "border-primary bg-primary-soft/50 ring-4 ring-primary/20 scale-105"
                  : "border-border/80 hover:border-primary/40 bg-surface"
              }`}
            >
              <img
                src={`/default-avatars/${avatar.filename}`}
                alt={avatar.alt}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 my-1 text-xs text-text-muted">
        <span className="w-8 h-px bg-border" />
        <span className="font-bold text-[11px]">یا آپلود تصویر اختصاصی</span>
        <span className="flex-1 h-px bg-border" />
      </div>

      {/* Custom Image Upload Card / Dropzone */}
      {imagePreview && isCustomUploaded ? (
        <div className="w-full p-3 rounded-2xl border border-border/80 bg-surface shadow-xs flex flex-col sm:flex-row items-center gap-3">
          <div className="w-20 h-20 rounded-xl bg-bg-light border border-border/60 overflow-hidden flex items-center justify-center shrink-0">
            <img
              src={imagePreview}
              alt="پیش‌نمایش تصویر انتخابی"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0 text-right">
            <span className="text-xs font-bold text-secondary block truncate">
              تصویر اختصاصی انتخاب شد
            </span>
            <span className="text-[11px] text-text-muted mt-0.5 block">
              می‌توانید تصویر را تغییر دهید یا یکی از آواتارهای بالا را انتخاب کنید.
            </span>

            <div className="flex items-center gap-2 mt-2">
              <label
                htmlFor="custom-img-change"
                className="h-8 px-3 rounded-xl bg-surface hover:bg-primary-soft text-text-secondary hover:text-primary border border-border text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <CloudUploadIcon style={{ fontSize: "14px" }} className="text-primary" />
                <span>تغییر فایل</span>
                <input
                  id="custom-img-change"
                  type="file"
                  accept="image/jpeg, image/jpg, image/png, image/svg+xml, image/webp"
                  onChange={handleCustomImageChange}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleClearCustomImage}
                className="h-8 px-2.5 rounded-xl bg-surface hover:bg-error-light text-text-muted hover:text-error border border-border/80 text-xs font-bold inline-flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                title="حذف تصویر اختصاصی"
              >
                <DeleteOutlineIcon style={{ fontSize: "14px" }} />
                <span>حذف</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <label
          htmlFor="custom-img"
          className="w-full sm:max-w-md min-h-[90px] border-2 border-dashed border-border/80 hover:border-primary/70 rounded-2xl flex items-center justify-center gap-3 bg-bg-light/40 hover:bg-primary-soft/10 p-3.5 transition-all cursor-pointer group shadow-2xs select-none"
        >
          <input
            id="custom-img"
            type="file"
            accept="image/jpeg, image/jpg, image/png, image/svg+xml, image/webp"
            onChange={handleCustomImageChange}
            className="hidden"
          />

          <div className="w-10 h-10 rounded-xl bg-surface border border-border/80 flex items-center justify-center text-primary group-hover:scale-105 shadow-2xs shrink-0">
            <CloudUploadIcon style={{ fontSize: "20px" }} />
          </div>

          <div className="flex flex-col min-w-0 text-right">
            <span className="text-xs font-bold text-secondary group-hover:text-primary transition-colors">
              کلیک برای انتخاب عکس اختصاصی از دستگاه
            </span>
            <span className="text-[11px] text-text-muted mt-0.5">
              JPG، PNG، WEBP یا SVG (حداکثر ۵ مگابایت)
            </span>
          </div>
        </label>
      )}

      {touched && error && (
        <span className="text-xs text-error font-medium animate-fadeIn flex items-center gap-1 mt-0.5">
          <span>⚠️</span>
          <span>{error}</span>
        </span>
      )}
    </div>
  );
}
