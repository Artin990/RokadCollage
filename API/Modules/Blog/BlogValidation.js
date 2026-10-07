import Joi from "joi";
import { safeTextRegex, VALID_IMAGE_EXT_REGEX } from "../../Utils/validateRequest.js";
import { MAX_BLOG_CONTENT_LENGTH } from "../../Utils/htmlSanitizer.js";

export const blogCategoryEnum = ["گرافیک", "مسیر شغلی", "MBA", "زبان", "فرانتاند", "بکاند"];

export const createBlogValidator = Joi.object({
  category: Joi.string()
    .valid(...blogCategoryEnum)
    .required()
    .messages({
      "any.only": "دسته‌بندی باید یکی از موارد: گرافیک، مسیر شغلی، MBA، زبان، فرانتاند یا بکاند باشد",
      "string.empty": "دسته‌بندی بلاگ نمی‌تواند خالی باشد",
      "any.required": "انتخاب دسته‌بندی بلاگ الزامی است",
    }),
  title: Joi.string()
    .pattern(safeTextRegex)
    .required()
    .messages({
      "string.base": "عنوان باید یک متن باشد",
      "string.empty": "عنوان بلاگ نمی‌تواند خالی باشد",
      "string.pattern.base": "عنوان بلاگ نباید شامل کاراکترهای خاص باشد",
      "any.required": "وارد کردن عنوان بلاگ الزامی است",
    }),
  description: Joi.string()
    .min(10)
    .required()
    .messages({
      "string.base": "توضیحات باید یک متن باشد",
      "string.empty": "توضیحات بلاگ نمی‌تواند خالی باشد",
      "string.min": "توضیحات باید حداقل ۱۰ کاراکتر باشد",
      "any.required": "وارد کردن توضیحات بلاگ الزامی است",
    }),
  content: Joi.string()
    .max(MAX_BLOG_CONTENT_LENGTH)
    .required()
    .messages({
      "string.base": "محتوای مقاله باید متن معتبر باشد",
      "string.empty": "محتوای مقاله نمی‌تواند خالی باشد",
      "string.max": `حجم محتوای مقاله نمی‌تواند بیشتر از ${MAX_BLOG_CONTENT_LENGTH.toLocaleString("fa-IR")} کاراکتر باشد`,
      "any.required": "وارد کردن محتوای مقاله الزامی است",
    }),
  img: Joi.string()
    .pattern(VALID_IMAGE_EXT_REGEX)
    .required()
    .messages({
      "string.base": "تصویر باید یک آدرس معتبر باشد",
      "string.empty": "تصویر نمی‌تواند خالی باشد",
      "string.pattern.base": "پسوند فایل باید یکی از موارد JPG, JPEG, PNG, SVG, WEBP باشد",
      "any.required": "ارسال تصویر شاخص بلاگ الزامی است",
    }),
});

export const updateBlogValidator = Joi.object({
  category: Joi.string()
    .valid(...blogCategoryEnum)
    .messages({
      "any.only": "دسته‌بندی باید یکی از موارد: گرافیک، مسیر شغلی، MBA، زبان، فرانتاند یا بکاند باشد",
      "string.empty": "دسته‌بندی بلاگ نمی‌تواند خالی باشد",
    }),
  title: Joi.string()
    .pattern(safeTextRegex)
    .messages({
      "string.base": "عنوان باید یک متن باشد",
      "string.empty": "عنوان بلاگ نمی‌تواند خالی باشد",
      "string.pattern.base": "عنوان بلاگ نباید شامل کاراکترهای خاص باشد",
    }),
  description: Joi.string()
    .min(10)
    .messages({
      "string.base": "توضیحات باید یک متن باشد",
      "string.empty": "توضیحات بلاگ نمی‌تواند خالی باشد",
      "string.min": "توضیحات باید حداقل ۱۰ کاراکتر باشد",
    }),
  content: Joi.string()
    .max(MAX_BLOG_CONTENT_LENGTH)
    .messages({
      "string.base": "محتوای مقاله باید متن معتبر باشد",
      "string.empty": "محتوای مقاله نمی‌تواند خالی باشد",
      "string.max": `حجم محتوای مقاله نمی‌تواند بیشتر از ${MAX_BLOG_CONTENT_LENGTH.toLocaleString("fa-IR")} کاراکتر باشد`,
    }),
  img: Joi.string()
    .pattern(VALID_IMAGE_EXT_REGEX)
    .messages({
      "string.base": "تصویر باید یک آدرس معتبر باشد",
      "string.empty": "تصویر نمی‌تواند خالی باشد",
      "string.pattern.base": "پسوند فایل باید یکی از موارد JPG, JPEG, PNG, SVG, WEBP باشد",
    }),
});

export const previewBlogValidator = Joi.object({
  content: Joi.string()
    .max(MAX_BLOG_CONTENT_LENGTH)
    .allow("")
    .required()
    .messages({
      "string.base": "محتوای پیش‌نمایش باید یک رشته متنی باشد",
      "string.max": `حجم محتوای پیش‌نمایش نمی‌تواند بیشتر از ${MAX_BLOG_CONTENT_LENGTH.toLocaleString("fa-IR")} کاراکتر باشد`,
      "any.required": "ارسال فیلد content برای پیش‌نمایش الزامی است",
    }),
});

export const blogQueryValidator = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort: Joi.string().trim().max(100).allow(""),
  category: Joi.string().valid(...blogCategoryEnum).allow("", null),
  fields: Joi.string().trim().max(200).allow(""),
  q: Joi.string().trim().max(100).allow("").pattern(/^[^\$]+$/).messages({
    "string.pattern.base": "عبارت جستجو شامل کاراکترهای غیرمجاز است",
  }),
  populate: Joi.string().trim().max(100).allow(""),
})
  .unknown(true)
  .messages({
    "object.unknown": "پارامترهای ارسالی در کوئری نامعتبر هستند",
  });
