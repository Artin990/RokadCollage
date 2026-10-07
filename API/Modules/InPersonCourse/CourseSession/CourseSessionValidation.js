import Joi from "joi";

export const createSessionValidator = Joi.object({
    code: Joi.string().trim().required().messages({
        "string.empty": "وارد کردن کد کلاس الزامی است",
        "any.required": "وارد کردن کد کلاس الزامی است",
    }),
    scheduleDays: Joi.string().trim().required().messages({
        "string.empty": "وارد کردن روزهای برگزاری الزامی است",
        "any.required": "وارد کردن روزهای برگزاری الزامی است",
    }),
    scheduleHours: Joi.string().trim().required().messages({
        "string.empty": "وارد کردن ساعت برگزاری الزامی است",
        "any.required": "وارد کردن ساعت برگزاری الزامی است",
    }),
    capacity: Joi.number().integer().min(1).required().messages({
        "number.base": "ظرفیت باید یک عدد معتبر باشد",
        "number.min": "ظرفیت باید حداقل ۱ نفر باشد",
        "any.required": "وارد کردن ظرفیت کد کلاس الزامی است",
    }),
});

export const updateSessionValidator = Joi.object({
    code: Joi.string().trim().messages({
        "string.empty": "کد کلاس نمی‌تواند خالی باشد",
    }),
    scheduleDays: Joi.string().trim().messages({
        "string.empty": "روزهای برگزاری نمی‌تواند خالی باشد",
    }),
    scheduleHours: Joi.string().trim().messages({
        "string.empty": "ساعت برگزاری نمی‌تواند خالی باشد",
    }),
    capacity: Joi.number().integer().min(1).messages({
        "number.base": "ظرفیت باید یک عدد معتبر باشد",
        "number.min": "ظرفیت باید حداقل ۱ نفر باشد",
    }),
});
