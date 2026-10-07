import Joi from "joi";
import {
  safeTextRegex,
  objectIdRegex,
  VALID_IMAGE_EXT_REGEX,
} from "../../Utils/validateRequest.js";

export const createCommentValidator = Joi.object({
  course: Joi.string()
    .pattern(objectIdRegex)
    .required()
    .messages({
      "string.base": "شناسه دوره باید یک شناسه معتبر باشد",
      "string.pattern.base": "شناسه دوره ارسال‌شده نامعتبر است",
      "any.required": "انتخاب دوره مرتبط الزامی است",
    }),
  courseModel: Joi.string()
    .valid("InPersonCourse", "VirtualCourse")
    .optional()
    .messages({
      "any.only": "مدل دوره باید InPersonCourse یا VirtualCourse باشد",
    }),
  comment: Joi.string()
    .min(3)
    .pattern(safeTextRegex)
    .required()
    .messages({
      "string.base": "متن کامنت باید یک متن باشد",
      "string.empty": "متن کامنت نمی‌تواند خالی باشد",
      "string.min": "متن کامنت باید حداقل ۳ کاراکتر باشد",
      "string.pattern.base": "متن کامنت نباید شامل کاراکترهای غیرمجاز باشد",
      "any.required": "وارد کردن متن نظر الزامی است",
    }),
  name: Joi.string()
    .pattern(safeTextRegex)
    .required()
    .messages({
      "string.base": "نام باید یک متن باشد",
      "string.empty": "نام فرد نمی‌تواند خالی باشد",
      "string.pattern.base": "نام نباید شامل کاراکترهای خاص باشد",
      "any.required": "وارد کردن نام نویسنده الزامی است",
    }),
  role: Joi.string()
    .pattern(safeTextRegex)
    .required()
    .messages({
      "string.base": "نقش باید یک متن باشد",
      "string.empty": "نقش فرد نمی‌تواند خالی باشد",
      "string.pattern.base": "نقش نباید شامل کاراکترهای خاص باشد",
      "any.required": "وارد کردن نقش فرد کامنت‌گذار الزامی است",
    }),
  job: Joi.string()
    .pattern(safeTextRegex)
    .allow("", null)
    .optional()
    .messages({
      "string.base": "شغل باید یک متن باشد",
      "string.pattern.base": "شغل نباید شامل کاراکترهای خاص باشد",
    }),
  img: Joi.string()
    .pattern(VALID_IMAGE_EXT_REGEX)
    .allow("", null)
    .optional()
    .messages({
      "string.pattern.base": "پسوند فایل باید یکی از موارد JPG, JPEG, PNG, SVG, WEBP باشد",
      "string.base": "تصویر باید یک متن (نام فایل) باشد",
    }),
});

export const updateCommentValidator = Joi.object({
  course: Joi.string()
    .pattern(objectIdRegex)
    .messages({
      "string.base": "شناسه دوره باید یک شناسه معتبر باشد",
      "string.pattern.base": "شناسه دوره ارسال‌شده نامعتبر است",
    }),
  courseModel: Joi.string()
    .valid("InPersonCourse", "VirtualCourse")
    .optional(),
  comment: Joi.string()
    .min(3)
    .pattern(safeTextRegex)
    .messages({
      "string.base": "متن کامنت باید یک متن باشد",
      "string.empty": "متن کامنت نمی‌تواند خالی باشد",
      "string.min": "متن کامنت باید حداقل ۳ کاراکتر باشد",
      "string.pattern.base": "متن کامنت نباید شامل کاراکترهای غیرمجاز باشد",
    }),
  name: Joi.string()
    .pattern(safeTextRegex)
    .messages({
      "string.base": "نام باید یک متن باشد",
      "string.empty": "نام فرد نمی‌تواند خالی باشد",
      "string.pattern.base": "نام نباید شامل کاراکترهای خاص باشد",
    }),
  role: Joi.string()
    .pattern(safeTextRegex)
    .messages({
      "string.base": "نقش باید یک متن باشد",
      "string.empty": "نقش فرد نمی‌تواند خالی باشد",
      "string.pattern.base": "نقش نباید شامل کاراکترهای خاص باشد",
    }),
  job: Joi.string()
    .pattern(safeTextRegex)
    .allow("", null)
    .optional()
    .messages({
      "string.base": "شغل باید یک متن باشد",
      "string.pattern.base": "شغل نباید شامل کاراکترهای خاص باشد",
    }),
  img: Joi.string()
    .pattern(VALID_IMAGE_EXT_REGEX)
    .allow("", null)
    .optional()
    .messages({
      "string.pattern.base": "پسوند فایل باید یکی از موارد JPG, JPEG, PNG, SVG, WEBP باشد",
      "string.base": "تصویر باید یک متن (نام فایل) باشد",
    }),
});
