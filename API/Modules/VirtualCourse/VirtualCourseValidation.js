import Joi from "joi";
import {
  baseCourseCreateFields,
  baseCourseUpdateFields,
  hex24Regex,
} from "../CourseCore/courseValidation.js";

export const createVirtualCourseValidator = Joi.object({
  ...baseCourseCreateFields,
  spotplayerCourseId: Joi.string()
    .trim()
    .pattern(hex24Regex)
    .required()
    .messages({
      "string.empty": "وارد کردن شناسه دوره در اسپات‌پلییر الزامی است",
      "string.pattern.base": "شناسه دوره در اسپات‌پلییر باید یک رشته هگز ۲۴ کاراکتری باشد",
      "any.required": "وارد کردن شناسه دوره در اسپات‌پلییر الزامی است",
    }),
});

export const updateVirtualCourseValidator = Joi.object({
  ...baseCourseUpdateFields,
  spotplayerCourseId: Joi.string()
    .trim()
    .pattern(hex24Regex)
    .messages({
      "string.empty": "شناسه دوره در اسپات‌پلییر نمی‌تواند خالی باشد",
      "string.pattern.base": "شناسه دوره در اسپات‌پلییر باید یک رشته هگز ۲۴ کاراکتری باشد",
    }),
});

export const purchaseVirtualCourseValidator = Joi.object({
  couponCode: Joi.string().trim().allow("", null).optional(),
});
