import Joi from "joi";
import { objectIdRegex } from "../../Utils/validateRequest.js";

export const purchaseCourseValidator = Joi.object({
  courseId: Joi.string()
    .trim()
    .pattern(objectIdRegex)
    .required()
    .messages({
      "string.base": "شناسه دوره باید یک رشته متنی باشد",
      "string.empty": "شناسه دوره الزامی است",
      "string.pattern.base": "شناسه دوره ارسال‌شده نامعتبر است",
      "any.required": "شناسه دوره الزامی است",
    }),
  sessionId: Joi.string()
    .trim()
    .pattern(objectIdRegex)
    .allow("", null)
    .optional()
    .messages({
      "string.pattern.base": "شناسه کد کلاس ارسال‌شده نامعتبر است",
    }),
  couponCode: Joi.string()
    .trim()
    .allow("", null)
    .optional(),
});

export const adminManualEnrollValidator = Joi.object({
  userId: Joi.string()
    .trim()
    .pattern(objectIdRegex)
    .required()
    .messages({
      "string.base": "شناسه کاربر باید یک رشته متنی باشد",
      "string.empty": "شناسه کاربر الزامی است",
      "string.pattern.base": "شناسه کاربر ارسال‌شده نامعتبر است",
      "any.required": "شناسه کاربر الزامی است",
    }),
  courseId: Joi.string()
    .trim()
    .pattern(objectIdRegex)
    .optional()
    .allow("", null),
  sessionId: Joi.string()
    .trim()
    .pattern(objectIdRegex)
    .optional()
    .allow("", null),
});
