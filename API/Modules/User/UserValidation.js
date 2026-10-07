import Joi from "joi";
import { safeTextRegex, phoneRegex } from "../../Utils/validateRequest.js";

export const createUserValidator = Joi.object({
  fullName: Joi.string()
    .pattern(safeTextRegex)
    .messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" })
    .allow("")
    .messages({
      "string.base": "نام و نام خانوادگی باید یک متن باشد",
    }),
  phoneNumber: Joi.string()
    .pattern(phoneRegex)
    .required()
    .messages({
      "string.pattern.base": "فرمت شماره موبایل نامعتبر است",
      "any.required": "وارد کردن شماره موبایل الزامی است",
    }),
  password: Joi.string().min(6).allow("").optional().messages({
    "string.min": "رمز عبور باید حداقل ۶ کاراکتر باشد",
  }),
  birthDate: Joi.string()
    .pattern(safeTextRegex)
    .messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" })
    .allow("")
    .messages({
      "string.base": "تاریخ تولد باید یک متن باشد",
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
    .messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" })
    .allow("")
    .messages({
      "string.base": "نام و نام خانوادگی باید یک متن باشد",
    }),
  phoneNumber: Joi.string()
    .pattern(phoneRegex)
    .messages({
      "string.pattern.base": "فرمت شماره موبایل نامعتبر است",
    }),
  password: Joi.string().min(6).allow("").optional().messages({
    "string.min": "رمز عبور باید حداقل ۶ کاراکتر باشد",
  }),
  birthDate: Joi.string()
    .pattern(safeTextRegex)
    .messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" })
    .allow("")
    .messages({
      "string.base": "تاریخ تولد باید یک متن باشد",
    }),
  role: Joi.string()
    .valid("user", "admin", "superAdmin")
    .messages({
      "any.only": "نقش کاربر نامعتبر است",
    }),
});
