import Joi from "joi";
import { objectIdRegex } from "../../Utils/validateRequest.js";
import { containsProfanity } from "../../Utils/profanityFilter.js";

// Custom Joi validator to prevent profanity
const profanityJoiValidator = (value, helpers) => {
  const { hasProfanity, matchedWords } = containsProfanity(value);
  if (hasProfanity) {
    return helpers.message(
      `متن ارسالی شامل کلمات نامناسب یا غیرمجاز است (${matchedWords.join("، ")})`
    );
  }
  return value;
};

export const createCommentValidator = Joi.object({
  text: Joi.string()
    .trim()
    .min(2)
    .max(3000)
    .required()
    .custom(profanityJoiValidator, "Profanity Validation")
    .messages({
      "string.base": "متن دیدگاه باید یک رشته متنی باشد",
      "string.empty": "متن دیدگاه نمی‌تواند خالی باشد",
      "string.min": "متن دیدگاه باید حداقل ۲ کاراکتر باشد",
      "string.max": "متن دیدگاه نمی‌تواند بیش از ۳۰۰۰ کاراکتر باشد",
      "any.required": "ارسال متن دیدگاه الزامی است",
    }),
  type: Joi.string()
    .valid("review", "qa")
    .default("qa")
    .messages({
      "any.only": "نوع دیدگاه باید review (نظر) یا qa (پرسش و پاسخ) باشد",
    }),
  parentId: Joi.string()
    .pattern(objectIdRegex)
    .allow(null, "")
    .messages({
      "string.pattern.base": "شناسه دیدگاه والد نامعتبر است",
    }),
});

export const replyCommentValidator = Joi.object({
  text: Joi.string()
    .trim()
    .min(2)
    .max(3000)
    .required()
    .custom(profanityJoiValidator, "Profanity Validation")
    .messages({
      "string.base": "متن پاسخ باید یک رشته متنی باشد",
      "string.empty": "متن پاسخ نمی‌تواند خالی باشد",
      "string.min": "متن پاسخ باید حداقل ۲ کاراکتر باشد",
      "string.max": "متن پاسخ نمی‌تواند بیش از ۳۰۰۰ کاراکتر باشد",
      "any.required": "ارسال متن پاسخ الزامی است",
    }),
  courseId: Joi.string()
    .pattern(objectIdRegex)
    .allow(null, "")
    .optional(),
  parentId: Joi.string()
    .pattern(objectIdRegex)
    .allow(null, "")
    .optional(),
});

export const updateCommentValidator = Joi.object({
  text: Joi.string()
    .trim()
    .min(2)
    .max(3000)
    .required()
    .custom(profanityJoiValidator, "Profanity Validation")
    .messages({
      "string.base": "متن دیدگاه باید یک رشته متنی باشد",
      "string.empty": "متن دیدگاه نمی‌تواند خالی باشد",
      "string.min": "متن دیدگاه باید حداقل ۲ کاراکتر باشد",
      "string.max": "متن دیدگاه نمی‌تواند بیش از ۳۰۰۰ کاراکتر باشد",
      "any.required": "ارسال متن دیدگاه الزامی است",
    }),
});
