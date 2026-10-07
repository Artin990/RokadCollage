import Joi from "joi";

export const requestChargeValidator = Joi.object({
  amount: Joi.number()
    .integer()
    .positive()
    .min(1000)
    .required()
    .messages({
      "number.base": "مبلغ شارژ باید یک عدد معتبر باشد",
      "number.integer": "مبلغ شارژ باید یک عدد صحیح باشد",
      "number.positive": "مبلغ شارژ باید یک عدد مثبت باشد",
      "number.min": "حداقل مبلغ شارژ ۱,۰۰۰ تومان است",
      "any.required": "وارد کردن مبلغ شارژ الزامی است",
    }),
});

export const verifyChargeValidator = Joi.object({
  Authority: Joi.string()
    .trim()
    .required()
    .messages({
      "string.base": "شناسه پرداخت (Authority) باید یک رشته متنی باشد",
      "string.empty": "شناسه پرداخت (Authority) نمی‌تواند خالی باشد",
      "any.required": "ارسال شناسه پرداخت (Authority) الزامی است",
    }),
});

export const requestPayoutValidator = Joi.object({
  amount: Joi.number()
    .integer()
    .positive()
    .min(5000)
    .required()
    .messages({
      "number.base": "مبلغ تسویه باید یک عدد معتبر باشد",
      "number.integer": "مبلغ تسویه باید یک عدد صحیح باشد",
      "number.positive": "مبلغ تسویه باید یک عدد مثبت باشد",
      "number.min": "حداقل مبلغ تسویه ۵,۰۰۰ تومان است",
      "any.required": "وارد کردن مبلغ تسویه الزامی است",
    }),
  description: Joi.string().trim().max(300).allow("").messages({
    "string.max": "توضیحات تسویه نمی‌تواند بیش از ۳۰۰ کاراکتر باشد",
  }),
});
