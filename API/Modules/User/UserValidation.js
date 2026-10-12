import Joi from "joi";
import { safeTextRegex, phoneRegex, birthDateRegex } from "../../Utils/validateRequest.js";

export const createUserValidator = Joi.object({
  fullName: Joi.string()
    .pattern(safeTextRegex)
    .allow("", null)
    .optional()
    .messages({
      "string.base": "نام و نام خانوادگی باید یک متن باشد",
      "string.pattern.base": "نام و نام خانوادگی شامل کاراکترهای غیرمجاز است",
    }),
  phoneNumber: Joi.string()
    .pattern(phoneRegex)
    .required()
    .messages({
      "string.pattern.base": "فرمت شماره موبایل نامعتبر است",
      "any.required": "وارد کردن شماره موبایل الزامی است",
    }),
  password: Joi.string().min(6).allow("", null).optional().messages({
    "string.min": "رمز عبور باید حداقل ۶ کاراکتر باشد",
  }),
  birthDate: Joi.string()
    .pattern(birthDateRegex)
    .allow("", null)
    .optional()
    .messages({
      "string.base": "تاریخ تولد باید یک متن باشد",
      "string.pattern.base": "فرمت تاریخ تولد باید به صورت سال/ماه/روز باشد (مثال: ۱۳۸۰/۰۵/۱۲)",
    }),
  role: Joi.string()
    .valid("user", "admin", "superAdmin")
    .messages({
      "any.only": "نقش کاربر نامعتبر است",
    }),
});

export const updateUserValidator = Joi.object({
  fullName: Joi.string()
    .pattern(safeTextRegex)
    .allow("", null)
    .optional()
    .messages({
      "string.base": "نام و نام خانوادگی باید یک متن باشد",
      "string.pattern.base": "نام و نام خانوادگی شامل کاراکترهای غیرمجاز است",
    }),
  phoneNumber: Joi.string()
    .pattern(phoneRegex)
    .messages({
      "string.pattern.base": "فرمت شماره موبایل نامعتبر است",
    }),
  password: Joi.string().min(6).allow("", null).optional().messages({
    "string.min": "رمز عبور باید حداقل ۶ کاراکتر باشد",
  }),
  birthDate: Joi.string()
    .pattern(birthDateRegex)
    .allow("", null)
    .optional()
    .messages({
      "string.base": "تاریخ تولد باید یک متن باشد",
      "string.pattern.base": "فرمت تاریخ تولد باید به صورت سال/ماه/روز باشد (مثال: ۱۳۸۰/۰۵/۱۲)",
    }),
  role: Joi.string()
    .valid("user", "admin", "superAdmin")
    .messages({
      "any.only": "نقش کاربر نامعتبر است",
    }),
});
