import React, { useState, useRef } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Notify from "../../../Utils/notify";

/**
 * ImageUpload Component
 * World-class, responsive, drag-and-drop media upload component.
 * Features state-of-the-art empty dropzone & showcase media card on populated state.
 */
export function ImageUpload({
  label = "تصویر",
  error = null,
  imagePreview = null,
  onChange,
  onClear = null,
  height = "min-h-[170px]",
  id = "img-upload",
  className = "",
  placeholder = "انتخاب یا کشیدن تصویر به این بخش",
  accept = "image/jpeg, image/jpg, image/png, image/svg+xml, image/webp",
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const validateAndProcessFile = (file) => {
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/svg+xml",
      "image/webp",
    ];

    const hasValidExt = /\.(jpe?g|png|svg|webp)$/i.test(file.name);
    if (!allowedTypes.includes(file.type) && !hasValidExt) {
      Notify.error("فرمت فایل غیرمجاز است. لطفاً JPG، PNG، SVG یا WEBP انتخاب کنید.");
      return;
    }

    if (file.name.toLowerCase().startsWith("default-")) {
      Notify.error("نام فایل مجاز نیست. لطفاً نام فایل را تغییر دهید.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Notify.error("حجم فایل نباید بیشتر از ۵ مگابایت باشد.");
      return;
    }

    if (onChange) {
      onChange(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
    // Reset value so same file can be re-uploaded if desired
    e.target.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange(null);
    }
  };

  return (
    <div className={`flex flex-col gap-2 w-full text-right ${className}`}>
      {/* Label and Specs Row */}
      {label && (
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 select-none">
          <label htmlFor={id} className="text-xs sm:text-sm font-black text-secondary cursor-pointer tracking-tight">
            {label}
          </label>
          <span className="text-[11px] text-text-muted bg-surface px-2 py-0.5 rounded-lg border border-border/70 font-medium">
            JPG, PNG, WEBP, SVG • حداکثر ۵MB
          </span>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        id={id}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {imagePreview ? (
        /* State 2: Populated Showcase Media Card */
        <div
          className={`
            w-full p-3 sm:p-4 rounded-2xl sm:rounded-3xl border bg-surface shadow-xs
            flex flex-col sm:flex-row items-center gap-3.5 sm:gap-5 transition-all duration-200
            ${error ? "border-error/80 ring-2 ring-error/20" : "border-border/80 hover:border-border-hover"}
          `}
        >
          {/* Thumbnail Showcase Frame */}
          <div className="relative w-full sm:w-44 md:w-52 h-44 sm:h-32 rounded-xl sm:rounded-2xl bg-bg-light/70 border border-border/60 overflow-hidden flex items-center justify-center shrink-0 shadow-inner group/preview">
            {/* Subtle Checkered Backdrop for Transparent PNGs / SVGs */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
                backgroundSize: "8px 8px",
              }}
            />

            <img
              src={imagePreview}
              alt="پیش‌نمایش تصویر انتخابی"
              className="relative z-10 max-w-full max-h-full object-contain p-2 rounded-xl drop-shadow-xs transition-transform duration-300 group-hover/preview:scale-105"
            />
          </div>

          {/* Details & Actions */}
          <div className="flex-1 flex flex-col justify-between w-full min-w-0 py-0.5">
            <div>

              <p className="text-xs sm:text-sm font-black text-secondary truncate">
                تصویر آماده ثبت
              </p>
              <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                این فایل پس از ذخیره فرم به عنوان تصویر نهایی اعمال می‌گردد.
              </p>
            </div>

            {/* Action Buttons Toolbar */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/60 flex-wrap">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 sm:flex-initial h-9 px-3.5 rounded-xl bg-surface hover:bg-primary-soft text-text-secondary hover:text-primary border border-border hover:border-primary-border text-xs font-black inline-flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-2xs group/btn"
              >
                <CloudUploadIcon style={{ fontSize: "16px" }} className="text-primary group-hover/btn:scale-110 transition-transform" />
                <span>تغییر تصویر</span>
              </button>

              {(onClear || onChange) && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="h-9 px-3 rounded-xl bg-surface hover:bg-error-light text-text-muted hover:text-error border border-border/80 hover:border-error-border text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-2xs"
                  title="حذف تصویر"
                >
                  <DeleteOutlineIcon style={{ fontSize: "16px" }} />
                  <span>حذف</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* State 1: Modern Interactive Dropzone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            w-full ${height} p-4 sm:p-6
            border-2 border-dashed rounded-2xl sm:rounded-3xl
            flex flex-col items-center justify-center text-center
            transition-all duration-300 relative overflow-hidden group cursor-pointer select-none
            ${
              error
                ? "border-error/80 bg-error-light/30 hover:bg-error-light/40"
                : isDragging
                ? "border-primary bg-primary-soft/50 ring-4 ring-primary/20 scale-[1.01]"
                : "border-border/90 hover:border-primary/80 bg-bg-light/40 hover:bg-primary-soft/10 hover:shadow-xs"
            }
          `}
        >
          {/* Squircle Upload Icon Badge */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-surface border border-border/80 shadow-xs flex items-center justify-center text-primary group-hover:scale-105 group-hover:border-primary/40 group-hover:shadow-md transition-all duration-300 mb-2.5">
            <AddPhotoAlternateOutlinedIcon style={{ fontSize: "26px" }} />
          </div>

          {/* Prompt Typography */}
          <div className="flex flex-col gap-1 max-w-sm">
            <span className="text-xs sm:text-sm font-black text-secondary group-hover:text-primary transition-colors">
              {isDragging ? "فایل را همین‌جا رها کنید..." : placeholder}
            </span>
            <span className="text-[11px] text-text-muted leading-relaxed">
              یا فایل مورد نظر را به این قسمت بکشید و رها کنید
            </span>
          </div>

          {/* Action Trigger Pill */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface border border-border/80 group-hover:border-primary/60 text-xs font-bold text-text-secondary group-hover:text-primary shadow-2xs group-hover:shadow-xs transition-all duration-200">
            <CloudUploadIcon style={{ fontSize: "15px" }} className="text-primary" />
            <span>انتخاب فایل از دستگاه</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <span className="text-xs text-error font-medium animate-fadeIn flex items-center gap-1 mt-0.5">
          <span>⚠️</span>
          <span>{error}</span>
        </span>
      )}
    </div>
  );
}

export default ImageUpload;
