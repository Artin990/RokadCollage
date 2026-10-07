import Joi from "joi";
import { safeTextRegex, VALID_IMAGE_EXT_REGEX } from "../../Utils/validateRequest.js";

export const createTeacherValidator = Joi.object({
  name: Joi.string()
    .pattern(safeTextRegex)
    .required()
    .messages({
      "string.base": "نام معلم باید یک متن باشد",
      "string.empty": "نام معلم نمی‌تواند خالی باشد",
      "string.pattern.base": "نام معلم نباید شامل کاراکترهای خاص باشد",
      "any.required": "وارد کردن نام معلم الزامی است",
    }),
  specialization: Joi.string()
    .pattern(safeTextRegex)
    .required()
    .messages({
      "string.base": "تخصص معلم باید یک متن باشد",
      "string.empty": "تخصص معلم نمی‌تواند خالی باشد",
      "string.pattern.base": "تخصص معلم نباید شامل کاراکترهای خاص باشد",
      "any.required": "وارد کردن تخصص معلم الزامی است",
    }),
  photo: Joi.string()
    .pattern(VALID_IMAGE_EXT_REGEX)
    .required()
    .messages({
      "string.base": "تصویر معلم باید یک آدرس معتبر باشد",
      "string.empty": "تصویر معلم نمی‌تواند خالی باشد",
      "string.pattern.base": "پسوند فایل تصویر باید یکی از موارد JPG, JPEG, PNG, SVG, WEBP باشد",
      "any.required": "ارسال فایل تصویر معلم الزامی است",
    }),
});

export const updateTeacherValidator = Joi.object({
  name: Joi.string()
    .pattern(safeTextRegex)
    .messages({
      "string.base": "نام معلم باید یک متن باشد",
      "string.empty": "نام معلم نمی‌تواند خالی باشد",
      "string.pattern.base": "نام معلم نباید شامل کاراکترهای خاص باشد",
    }),
  specialization: Joi.string()
    .pattern(safeTextRegex)
    .messages({
      "string.base": "تخصص معلم باید یک متن باشد",
      "string.empty": "تخصص معلم نمی‌تواند خالی باشد",
      "string.pattern.base": "تخصص معلم نباید شامل کاراکترهای خاص باشد",
    }),
  photo: Joi.string()
    .pattern(VALID_IMAGE_EXT_REGEX)
    .messages({
      "string.base": "تصویر معلم باید یک آدرس معتبر باشد",
      "string.empty": "تصویر معلم نمی‌تواند خالی باشد",
      "string.pattern.base": "پسوند فایل تصویر باید یکی از موارد JPG, JPEG, PNG, SVG, WEBP باشد",
    }),
});
