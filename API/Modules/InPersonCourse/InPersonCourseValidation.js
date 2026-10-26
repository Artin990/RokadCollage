import Joi from "joi";
import {
  baseCourseCreateFields,
  baseCourseUpdateFields,
  objectIdRegex,
} from "../CourseCore/courseValidation.js";

const locationSchema = Joi.object({
  address: Joi.string().trim().allow("").optional(),
  googleMapEmbedUrl: Joi.string().trim().allow("").optional(),
  neshanEmbedUrl: Joi.string().trim().allow("").optional(),
  baladEmbedUrl: Joi.string().trim().allow("").optional(),
  mapEmbedUrl: Joi.string().trim().allow("").optional(),
});

const sessionItemSchema = Joi.object({
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

const inPersonSpecificValidation = {
  courseType: Joi.string().valid("دوره حضوری", "کارگاه حضوری").optional(),
  approximateSessions: Joi.string().trim().allow("").optional(),
  totalHours: Joi.string().trim().allow("").optional(),
  scheduleDays: Joi.string().trim().allow("").optional(),
  tuitionPerPerson: Joi.number().min(0).optional(),
  proposedTeacher: Joi.string().trim().allow("").optional(),
  approximateStartDate: Joi.string().trim().allow("").optional(),
  approximateEndDate: Joi.string().trim().allow("").optional(),
  joujmanEvent: Joi.object({
    title: Joi.string().trim().allow("").optional(),
    description: Joi.string().trim().allow("").optional(),
    isActive: Joi.boolean().optional(),
  }).optional(),
};

export const createInPersonCourseValidator = Joi.object({
  ...baseCourseCreateFields,
  ...inPersonSpecificValidation,
  location: locationSchema.optional(),
  sessions: Joi.array()
    .items(sessionItemSchema)
    .min(1)
    .required()
    .messages({
      "array.min": "برای دوره‌های حضوری، ثبت حداقل یک کد کلاس الزامی است",
      "any.required": "برای دوره‌های حضوری، ثبت حداقل یک کد کلاس الزامی است",
    }),
});

export const updateInPersonCourseValidator = Joi.object({
  ...baseCourseUpdateFields,
  ...inPersonSpecificValidation,
  location: locationSchema.optional(),
  sessions: Joi.array().items(sessionItemSchema).optional(),
});

export const purchaseInPersonCourseValidator = Joi.object({
  sessionId: Joi.string()
    .trim()
    .pattern(objectIdRegex)
    .required()
    .messages({
      "string.empty": "انتخاب کد کلاس برای دوره حضوری الزامی است",
      "string.pattern.base": "شناسه کد کلاس نامعتبر است",
      "any.required": "انتخاب کد کلاس برای دوره حضوری الزامی است",
    }),
  couponCode: Joi.string().trim().allow("", null).optional(),
});
