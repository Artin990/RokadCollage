import path from "path";
import { catchAsync, HandleERROR } from "vanta-api";
import { VALID_IMAGE_EXT_REGEX } from "../../Utils/uploadConfig.js";
import { removePublicFile } from "../../Utils/fileHelper.js";

/**
 * Handle single file upload response.
 * Pre-processed, resized, and converted to WebP by convertToWebp middleware.
 */
export const uploadSingle = catchAsync(async (req, res, next) => {
  const file = req.file;

  if (!file) {
    return next(new HandleERROR("هیچ فایلی آپلود نشده است", 400));
  }

  return res.status(201).json({
    success: true,
    message: "فایل با موفقیت آپلود شد",
    data: file.filename,
  });
});

/**
 * Handle multiple file uploads response.
 * Pre-processed, resized, and converted to WebP by convertToWebp middleware.
 */
export const uploadMultiple = catchAsync(async (req, res, next) => {
  const files = req.files;

  if (!files || files.length === 0) {
    return next(new HandleERROR("هیچ فایلی آپلود نشده است", 400));
  }

  return res.status(201).json({
    success: true,
    message: "فایل‌ها با موفقیت آپلود شدند",
    data: files.map((file) => file.filename),
  });
});

/**
 * Safely removes an uploaded file from Public directory.
 */
export const removeData = catchAsync(async (req, res, next) => {
  const { filename } = req.body;

  if (!filename) {
    return next(new HandleERROR("ارسال نام فایل برای حذف الزامی است", 400));
  }

  const baseFilename = path.basename(filename.trim());

  if (!VALID_IMAGE_EXT_REGEX.test(baseFilename)) {
    return next(new HandleERROR("فقط حذف فایل‌های تصویری مجاز است", 400));
  }

  if (baseFilename.toLowerCase().startsWith("default-") || baseFilename.toLowerCase().startsWith("default")) {
    return next(new HandleERROR("شما اجازه حذف فایل‌های پیش‌فرض و سیستمی را ندارید", 403));
  }

  const isRemoved = await removePublicFile(baseFilename);
  if (!isRemoved) {
    return next(new HandleERROR("فایل مورد نظر یافت نشد", 404));
  }

  return res.status(200).json({
    success: true,
    message: "فایل با موفقیت حذف شد",
    data: null,
  });
});
