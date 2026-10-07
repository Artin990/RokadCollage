import Joi from "joi";
import { VALID_IMAGE_EXT_REGEX } from "../../Utils/uploadConfig.js";

export const removeFileValidator = Joi.object({
  filename: Joi.string()
    .trim()
    .required()
    .pattern(VALID_IMAGE_EXT_REGEX)
    .messages({
      "string.base": "نام فایل باید یک متن باشد",
      "string.empty": "ارسال نام فایل برای حذف الزامی است",
      "string.pattern.base": "فقط حذف فایل‌های تصویری مجاز است",
      "any.required": "ارسال نام فایل برای حذف الزامی است",
    }),
});
